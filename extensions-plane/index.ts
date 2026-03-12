// OpenClaw Plugin: Plane Integration
// 7 tools, 31 operations — per-agent API key via tool factory pattern
// Member management (add/update/remove) uses direct PostgreSQL since Plane API v1.0.0 doesn't support POST/PATCH /members/

import { Client } from "pg";

interface PlaneAgentConfig {
  apiKey: string;
  workspace: string;
}

interface PlaneDbConfig {
  host: string;
  port: number;
  user: string;
  password: string;
  database: string;
}

interface PlanePluginConfig {
  baseUrl: string;
  db: PlaneDbConfig;
  agents: Record<string, PlaneAgentConfig>;
}

interface ToolContext {
  agentId?: string;
  config?: any;
}

interface PluginApi {
  pluginConfig?: PlanePluginConfig;
  registerTool: (factory: any, options?: any) => void;
}

// ── HTTP helper ──────────────────────────────────────────────────────────

async function planeRequest(
  baseUrl: string,
  apiKey: string,
  method: string,
  path: string,
  body?: Record<string, unknown>
): Promise<{ ok: boolean; status: number; data: any }> {
  try {
    const opts: RequestInit = {
      method,
      headers: {
        "X-API-Key": apiKey,
        "Content-Type": "application/json",
      },
    };
    if (body && (method === "POST" || method === "PATCH" || method === "PUT")) {
      opts.body = JSON.stringify(body);
    }
    const res = await fetch(`${baseUrl}${path}`, opts);

    if (res.status === 204) {
      return { ok: true, status: 204, data: null };
    }

    let data: any;
    const text = await res.text();
    try {
      data = JSON.parse(text);
    } catch {
      data = text;
    }

    if (!res.ok) {
      if (res.status === 403) {
        return {
          ok: false,
          status: 403,
          data: `Sem permissao (403). Seu role nao permite esta acao. Detalhes: ${JSON.stringify(data)}`,
        };
      }
      if (res.status === 404) {
        return { ok: false, status: 404, data: `Recurso nao encontrado (404). Path: ${path}` };
      }
      return {
        ok: false,
        status: res.status,
        data: `Erro ${res.status}: ${JSON.stringify(data)}`,
      };
    }

    return { ok: true, status: res.status, data };
  } catch (err: any) {
    return {
      ok: false,
      status: 0,
      data: `Erro de conexao com o Plane: ${err?.message || err}`,
    };
  }
}

function textResult(data: any) {
  const text = typeof data === "string" ? data : JSON.stringify(data, null, 2);
  return { content: [{ type: "text" as const, text }] };
}

// ── PostgreSQL helpers for member management ─────────────────────────────

const ROLE_NAMES: Record<number, string> = { 5: "Guest", 10: "Member", 15: "Admin", 20: "Owner" };

async function withPgClient<T>(dbCfg: PlaneDbConfig, fn: (client: Client) => Promise<T>): Promise<T> {
  const client = new Client({
    host: dbCfg.host,
    port: dbCfg.port,
    user: dbCfg.user,
    password: dbCfg.password,
    database: dbCfg.database,
  });
  try {
    await client.connect();
    return await fn(client);
  } finally {
    await client.end().catch(() => {});
  }
}

async function addProjectMemberViaPg(
  dbCfg: PlaneDbConfig,
  projectId: string,
  workspaceId: string,
  memberId: string,
  memberRole: number,
  createdById: string
): Promise<{ ok: boolean; message: string }> {
  return withPgClient(dbCfg, async (client) => {
    const check = await client.query(
      "SELECT id FROM project_members WHERE project_id = $1 AND member_id = $2",
      [projectId, memberId]
    );
    if (check.rows.length > 0) {
      return { ok: true, message: "Usuario ja e membro deste projeto. Use update_member para alterar o role." };
    }
    await client.query(
      `INSERT INTO project_members (id, project_id, workspace_id, member_id, role, is_active,
        sort_order, created_at, updated_at, created_by_id, view_props, default_props, preferences)
       VALUES (gen_random_uuid(), $1, $2, $3, $4, true, 65535, NOW(), NOW(), $5, '{}', '{}', '{}')`,
      [projectId, workspaceId, memberId, memberRole, createdById]
    );
    return { ok: true, message: `Membro adicionado com sucesso (role: ${ROLE_NAMES[memberRole] || memberRole}).` };
  }).catch((err: any) => ({ ok: false, message: `Erro ao adicionar membro via DB: ${err?.message || err}` }));
}

async function updateProjectMemberViaPg(
  dbCfg: PlaneDbConfig,
  projectId: string,
  memberId: string,
  newRole: number
): Promise<{ ok: boolean; message: string }> {
  return withPgClient(dbCfg, async (client) => {
    const check = await client.query(
      "SELECT id, role FROM project_members WHERE project_id = $1 AND member_id = $2",
      [projectId, memberId]
    );
    if (check.rows.length === 0) {
      return { ok: false, message: "Usuario nao e membro deste projeto. Use add_member primeiro." };
    }
    const oldRole = check.rows[0].role;
    if (oldRole === newRole) {
      return { ok: true, message: `Role ja e ${ROLE_NAMES[newRole] || newRole}. Nenhuma alteracao necessaria.` };
    }
    await client.query(
      "UPDATE project_members SET role = $1, updated_at = NOW() WHERE project_id = $2 AND member_id = $3",
      [newRole, projectId, memberId]
    );
    return { ok: true, message: `Role alterado de ${ROLE_NAMES[oldRole] || oldRole} para ${ROLE_NAMES[newRole] || newRole}.` };
  }).catch((err: any) => ({ ok: false, message: `Erro ao atualizar membro via DB: ${err?.message || err}` }));
}

async function removeProjectMemberViaPg(
  dbCfg: PlaneDbConfig,
  projectId: string,
  memberId: string
): Promise<{ ok: boolean; message: string }> {
  return withPgClient(dbCfg, async (client) => {
    const check = await client.query(
      "SELECT id FROM project_members WHERE project_id = $1 AND member_id = $2",
      [projectId, memberId]
    );
    if (check.rows.length === 0) {
      return { ok: false, message: "Usuario nao e membro deste projeto." };
    }
    await client.query(
      "DELETE FROM project_members WHERE project_id = $1 AND member_id = $2",
      [projectId, memberId]
    );
    return { ok: true, message: "Membro removido do projeto com sucesso." };
  }).catch((err: any) => ({ ok: false, message: `Erro ao remover membro via DB: ${err?.message || err}` }));
}

async function updateWorkspaceMemberViaPg(
  dbCfg: PlaneDbConfig,
  workspaceId: string,
  memberId: string,
  newRole: number
): Promise<{ ok: boolean; message: string }> {
  return withPgClient(dbCfg, async (client) => {
    const check = await client.query(
      "SELECT id, role FROM workspace_members WHERE workspace_id = $1 AND member_id = $2",
      [workspaceId, memberId]
    );
    if (check.rows.length === 0) {
      return { ok: false, message: "Usuario nao e membro deste workspace." };
    }
    const oldRole = check.rows[0].role;
    if (oldRole === newRole) {
      return { ok: true, message: `Role no workspace ja e ${ROLE_NAMES[newRole] || newRole}. Nenhuma alteracao necessaria.` };
    }
    await client.query(
      "UPDATE workspace_members SET role = $1, updated_at = NOW() WHERE workspace_id = $2 AND member_id = $3",
      [newRole, workspaceId, memberId]
    );
    return { ok: true, message: `Role no workspace alterado de ${ROLE_NAMES[oldRole] || oldRole} para ${ROLE_NAMES[newRole] || newRole}.` };
  }).catch((err: any) => ({ ok: false, message: `Erro ao atualizar membro no workspace via DB: ${err?.message || err}` }));
}

// ── Tool factories ───────────────────────────────────────────────────────

function createProjectsTool(baseUrl: string, apiKey: string, workspace: string, dbCfg: PlaneDbConfig, workspaceId: string, agentUserId: string) {
  return {
    name: "plane_projects",
    description:
      "Manage Plane projects. Actions: list (list all projects), create (create project), update (rename/edit project), delete (delete project), members (list project members), add_member (add user to project), update_member (change member role in project), remove_member (remove user from project), update_workspace_member (change member role in workspace), me (get current user info).",
    parameters: {
      type: "object",
      properties: {
        action: {
          type: "string",
          enum: ["list", "create", "update", "delete", "members", "add_member", "update_member", "remove_member", "update_workspace_member", "me"],
          description: "The action to perform",
        },
        project_id: { type: "string", description: "Project ID (required for update, delete, members, add_member, update_member, remove_member)" },
        name: { type: "string", description: "Project name (required for create, optional for update)" },
        member_id: { type: "string", description: "User ID (required for add_member, update_member, remove_member, update_workspace_member)" },
        role: {
          type: "number",
          enum: [5, 10, 15, 20],
          description: "Role: 5=Guest, 10=Member, 15=Admin, 20=Owner (required for add_member, update_member, update_workspace_member)",
        },
        identifier: {
          type: "string",
          description: "Project identifier, max 5 chars uppercase (required for create, e.g. INFRA)",
        },
        description: { type: "string", description: "Project description (optional for create/update)" },
      },
      required: ["action"],
    },
    async execute(_id: string, params: any) {
      const { action, project_id, name, identifier, description, member_id, role } = params;
      switch (action) {
        case "list": {
          const r = await planeRequest(baseUrl, apiKey, "GET", `/workspaces/${workspace}/projects/`);
          return textResult(r.data);
        }
        case "create": {
          if (!name || !identifier) return textResult("Erro: 'name' e 'identifier' sao obrigatorios para criar projeto.");
          const body: any = { name, identifier, network: 2 };
          if (description) body.description = description;
          const r = await planeRequest(baseUrl, apiKey, "POST", `/workspaces/${workspace}/projects/`, body);
          return textResult(r.data);
        }
        case "update": {
          if (!project_id) return textResult("Erro: 'project_id' e obrigatorio para atualizar projeto.");
          const body: any = {};
          if (name) body.name = name;
          if (description) body.description = description;
          if (Object.keys(body).length === 0) return textResult("Erro: informe 'name' e/ou 'description' para atualizar.");
          const r = await planeRequest(baseUrl, apiKey, "PATCH", `/workspaces/${workspace}/projects/${project_id}/`, body);
          return textResult(r.ok ? `Projeto atualizado com sucesso.` : r.data);
        }
        case "delete": {
          if (!project_id) return textResult("Erro: 'project_id' e obrigatorio para deletar projeto.");
          const r = await planeRequest(baseUrl, apiKey, "DELETE", `/workspaces/${workspace}/projects/${project_id}/`);
          return textResult(r.ok ? "Projeto deletado com sucesso." : r.data);
        }
        case "members": {
          if (!project_id) return textResult("Erro: 'project_id' e obrigatorio para listar membros.");
          const r = await planeRequest(baseUrl, apiKey, "GET", `/workspaces/${workspace}/projects/${project_id}/members/`);
          return textResult(r.data);
        }
        case "add_member": {
          if (!project_id || !member_id) return textResult("Erro: 'project_id' e 'member_id' sao obrigatorios.");
          const memberRole = role || 10;
          const r = await addProjectMemberViaPg(dbCfg, project_id, workspaceId, member_id, memberRole, agentUserId);
          return textResult(r.message);
        }
        case "update_member": {
          if (!project_id || !member_id || !role) return textResult("Erro: 'project_id', 'member_id' e 'role' sao obrigatorios.");
          const r = await updateProjectMemberViaPg(dbCfg, project_id, member_id, role);
          return textResult(r.message);
        }
        case "remove_member": {
          if (!project_id || !member_id) return textResult("Erro: 'project_id' e 'member_id' sao obrigatorios.");
          const r = await removeProjectMemberViaPg(dbCfg, project_id, member_id);
          return textResult(r.message);
        }
        case "update_workspace_member": {
          if (!member_id || !role) return textResult("Erro: 'member_id' e 'role' sao obrigatorios.");
          const r = await updateWorkspaceMemberViaPg(dbCfg, workspaceId, member_id, role);
          return textResult(r.message);
        }
        case "me": {
          const r = await planeRequest(baseUrl, apiKey, "GET", `/users/me/`);
          return textResult(r.data);
        }
        default:
          return textResult(`Acao desconhecida: ${action}. Use: list, create, update, delete, members, add_member, update_member, remove_member, update_workspace_member, me`);
      }
    },
  };
}

function createIssuesTool(baseUrl: string, apiKey: string, workspace: string) {
  return {
    name: "plane_issues",
    description:
      "Manage Plane issues/tasks. Actions: list (list issues, optional filters), get (get issue details), create (create issue, supports sub-tasks via parent field), update (update issue fields like state, priority, assignees, labels, dates), delete (delete issue), activities (get issue change history), add_link (add URL link to issue).",
    parameters: {
      type: "object",
      properties: {
        action: {
          type: "string",
          enum: ["list", "get", "create", "update", "delete", "activities", "add_link"],
          description: "The action to perform",
        },
        project_id: { type: "string", description: "Project ID (required for all actions)" },
        issue_id: {
          type: "string",
          description: "Issue ID (required for get, update, delete, activities, add_link)",
        },
        name: { type: "string", description: "Issue title (required for create)" },
        description_html: { type: "string", description: "HTML description (optional)" },
        priority: {
          type: "string",
          enum: ["urgent", "high", "medium", "low", "none"],
          description: "Priority level",
        },
        state: { type: "string", description: "State ID to set" },
        assignees: {
          type: "array",
          items: { type: "string" },
          description: "Array of user IDs to assign",
        },
        labels: {
          type: "array",
          items: { type: "string" },
          description: "Array of label IDs",
        },
        start_date: { type: "string", description: "Start date (YYYY-MM-DD)" },
        target_date: { type: "string", description: "Target date (YYYY-MM-DD)" },
        parent: { type: "string", description: "Parent issue ID (creates sub-task)" },
        url: { type: "string", description: "URL for add_link action" },
        title: { type: "string", description: "Link title for add_link action" },
      },
      required: ["action", "project_id"],
    },
    async execute(_id: string, params: any) {
      const {
        action, project_id, issue_id, name, description_html, priority, state,
        assignees, labels, start_date, target_date, parent, url, title,
      } = params;
      const base = `/workspaces/${workspace}/projects/${project_id}`;

      switch (action) {
        case "list": {
          const r = await planeRequest(baseUrl, apiKey, "GET", `${base}/issues/`);
          return textResult(r.data);
        }
        case "get": {
          if (!issue_id) return textResult("Erro: 'issue_id' e obrigatorio.");
          const r = await planeRequest(baseUrl, apiKey, "GET", `${base}/issues/${issue_id}/`);
          return textResult(r.data);
        }
        case "create": {
          if (!name) return textResult("Erro: 'name' e obrigatorio para criar issue.");
          const body: any = { name };
          if (description_html) body.description_html = description_html;
          if (priority) body.priority = priority;
          if (state) body.state = state;
          if (assignees) body.assignees = assignees;
          if (labels) body.labels = labels;
          if (start_date) body.start_date = start_date;
          if (target_date) body.target_date = target_date;
          if (parent) body.parent = parent;
          const r = await planeRequest(baseUrl, apiKey, "POST", `${base}/issues/`, body);
          return textResult(r.data);
        }
        case "update": {
          if (!issue_id) return textResult("Erro: 'issue_id' e obrigatorio para atualizar.");
          const body: any = {};
          if (name) body.name = name;
          if (description_html) body.description_html = description_html;
          if (priority) body.priority = priority;
          if (state) body.state = state;
          if (assignees) body.assignees = assignees;
          if (labels) body.labels = labels;
          if (start_date) body.start_date = start_date;
          if (target_date) body.target_date = target_date;
          if (Object.keys(body).length === 0) return textResult("Erro: nenhum campo para atualizar.");
          const r = await planeRequest(baseUrl, apiKey, "PATCH", `${base}/issues/${issue_id}/`, body);
          return textResult(r.data);
        }
        case "delete": {
          if (!issue_id) return textResult("Erro: 'issue_id' e obrigatorio para deletar.");
          const r = await planeRequest(baseUrl, apiKey, "DELETE", `${base}/issues/${issue_id}/`);
          return textResult(r.ok ? "Issue deletada com sucesso." : r.data);
        }
        case "activities": {
          if (!issue_id) return textResult("Erro: 'issue_id' e obrigatorio.");
          const r = await planeRequest(baseUrl, apiKey, "GET", `${base}/issues/${issue_id}/activities/`);
          return textResult(r.data);
        }
        case "add_link": {
          if (!issue_id || !url) return textResult("Erro: 'issue_id' e 'url' sao obrigatorios.");
          const body: any = { url };
          if (title) body.title = title;
          const r = await planeRequest(baseUrl, apiKey, "POST", `${base}/issues/${issue_id}/links/`, body);
          return textResult(r.data);
        }
        default:
          return textResult(`Acao desconhecida: ${action}. Use: list, get, create, update, delete, activities, add_link`);
      }
    },
  };
}

function createCommentsTool(baseUrl: string, apiKey: string, workspace: string) {
  return {
    name: "plane_comments",
    description:
      "Manage comments on Plane issues. Actions: list (list all comments), create (add a comment with HTML content).",
    parameters: {
      type: "object",
      properties: {
        action: {
          type: "string",
          enum: ["list", "create"],
          description: "The action to perform",
        },
        project_id: { type: "string", description: "Project ID" },
        issue_id: { type: "string", description: "Issue ID" },
        comment_html: {
          type: "string",
          description: "Comment content in HTML (required for create, e.g. '<p>My comment</p>')",
        },
      },
      required: ["action", "project_id", "issue_id"],
    },
    async execute(_id: string, params: any) {
      const { action, project_id, issue_id, comment_html } = params;
      const base = `/workspaces/${workspace}/projects/${project_id}/issues/${issue_id}`;

      switch (action) {
        case "list": {
          const r = await planeRequest(baseUrl, apiKey, "GET", `${base}/comments/`);
          return textResult(r.data);
        }
        case "create": {
          if (!comment_html) return textResult("Erro: 'comment_html' e obrigatorio.");
          const r = await planeRequest(baseUrl, apiKey, "POST", `${base}/comments/`, { comment_html });
          return textResult(r.data);
        }
        default:
          return textResult(`Acao desconhecida: ${action}. Use: list, create`);
      }
    },
  };
}

function createStatesTool(baseUrl: string, apiKey: string, workspace: string) {
  return {
    name: "plane_states",
    description:
      "Manage project workflow states/stages. Actions: list (list all states), create (create state with name, color hex, and group), delete (remove state).",
    parameters: {
      type: "object",
      properties: {
        action: {
          type: "string",
          enum: ["list", "create", "delete"],
          description: "The action to perform",
        },
        project_id: { type: "string", description: "Project ID" },
        state_id: { type: "string", description: "State ID (required for delete)" },
        name: { type: "string", description: "State name (required for create)" },
        color: { type: "string", description: "Hex color (required for create, e.g. '#3B82F6')" },
        group: {
          type: "string",
          enum: ["backlog", "unstarted", "started", "completed", "cancelled"],
          description: "State group (required for create)",
        },
      },
      required: ["action", "project_id"],
    },
    async execute(_id: string, params: any) {
      const { action, project_id, state_id, name, color, group } = params;
      const base = `/workspaces/${workspace}/projects/${project_id}`;

      switch (action) {
        case "list": {
          const r = await planeRequest(baseUrl, apiKey, "GET", `${base}/states/`);
          return textResult(r.data);
        }
        case "create": {
          if (!name || !color || !group)
            return textResult("Erro: 'name', 'color' e 'group' sao obrigatorios.");
          const r = await planeRequest(baseUrl, apiKey, "POST", `${base}/states/`, { name, color, group });
          return textResult(r.data);
        }
        case "delete": {
          if (!state_id) return textResult("Erro: 'state_id' e obrigatorio para deletar.");
          const r = await planeRequest(baseUrl, apiKey, "DELETE", `${base}/states/${state_id}/`);
          return textResult(r.ok ? "State deletado com sucesso." : r.data);
        }
        default:
          return textResult(`Acao desconhecida: ${action}. Use: list, create, delete`);
      }
    },
  };
}

function createLabelsTool(baseUrl: string, apiKey: string, workspace: string) {
  return {
    name: "plane_labels",
    description:
      "Manage project labels/tags. Actions: list (list all labels), create (create label with name and hex color), delete (remove label).",
    parameters: {
      type: "object",
      properties: {
        action: {
          type: "string",
          enum: ["list", "create", "delete"],
          description: "The action to perform",
        },
        project_id: { type: "string", description: "Project ID" },
        label_id: { type: "string", description: "Label ID (required for delete)" },
        name: { type: "string", description: "Label name (required for create)" },
        color: { type: "string", description: "Hex color (required for create, e.g. '#8B5CF6')" },
      },
      required: ["action", "project_id"],
    },
    async execute(_id: string, params: any) {
      const { action, project_id, label_id, name, color } = params;
      const base = `/workspaces/${workspace}/projects/${project_id}`;

      switch (action) {
        case "list": {
          const r = await planeRequest(baseUrl, apiKey, "GET", `${base}/labels/`);
          return textResult(r.data);
        }
        case "create": {
          if (!name || !color) return textResult("Erro: 'name' e 'color' sao obrigatorios.");
          const r = await planeRequest(baseUrl, apiKey, "POST", `${base}/labels/`, { name, color });
          return textResult(r.data);
        }
        case "delete": {
          if (!label_id) return textResult("Erro: 'label_id' e obrigatorio para deletar.");
          const r = await planeRequest(baseUrl, apiKey, "DELETE", `${base}/labels/${label_id}/`);
          return textResult(r.ok ? "Label deletada com sucesso." : r.data);
        }
        default:
          return textResult(`Acao desconhecida: ${action}. Use: list, create, delete`);
      }
    },
  };
}

function createCyclesTool(baseUrl: string, apiKey: string, workspace: string) {
  return {
    name: "plane_cycles",
    description:
      "Manage project cycles/sprints. Actions: list (list all cycles), create (create cycle with name, dates, owner), delete (remove cycle). Note: associating issues to cycles is not supported in API v1.0.0.",
    parameters: {
      type: "object",
      properties: {
        action: {
          type: "string",
          enum: ["list", "create", "delete"],
          description: "The action to perform",
        },
        project_id: { type: "string", description: "Project ID" },
        cycle_id: { type: "string", description: "Cycle ID (required for delete)" },
        name: { type: "string", description: "Cycle name (required for create)" },
        start_date: { type: "string", description: "Start date YYYY-MM-DD (required for create)" },
        end_date: { type: "string", description: "End date YYYY-MM-DD (required for create)" },
        owned_by: { type: "string", description: "Owner user ID (required for create)" },
      },
      required: ["action", "project_id"],
    },
    async execute(_id: string, params: any) {
      const { action, project_id, cycle_id, name, start_date, end_date, owned_by } = params;
      const base = `/workspaces/${workspace}/projects/${project_id}`;

      switch (action) {
        case "list": {
          const r = await planeRequest(baseUrl, apiKey, "GET", `${base}/cycles/`);
          return textResult(r.data);
        }
        case "create": {
          if (!name || !start_date || !end_date || !owned_by)
            return textResult("Erro: 'name', 'start_date', 'end_date' e 'owned_by' sao obrigatorios.");
          const r = await planeRequest(baseUrl, apiKey, "POST", `${base}/cycles/`, {
            name,
            start_date,
            end_date,
            owned_by,
            project_id,
          });
          return textResult(r.data);
        }
        case "delete": {
          if (!cycle_id) return textResult("Erro: 'cycle_id' e obrigatorio para deletar.");
          const r = await planeRequest(baseUrl, apiKey, "DELETE", `${base}/cycles/${cycle_id}/`);
          return textResult(r.ok ? "Cycle deletado com sucesso." : r.data);
        }
        default:
          return textResult(`Acao desconhecida: ${action}. Use: list, create, delete`);
      }
    },
  };
}

function createModulesTool(baseUrl: string, apiKey: string, workspace: string) {
  return {
    name: "plane_modules",
    description:
      "Manage project modules (theme/feature grouping). Actions: list (list all modules), create (create module with name and optional dates), delete (remove module). Note: associating issues to modules is not supported in API v1.0.0.",
    parameters: {
      type: "object",
      properties: {
        action: {
          type: "string",
          enum: ["list", "create", "delete"],
          description: "The action to perform",
        },
        project_id: { type: "string", description: "Project ID" },
        module_id: { type: "string", description: "Module ID (required for delete)" },
        name: { type: "string", description: "Module name (required for create)" },
        start_date: { type: "string", description: "Start date YYYY-MM-DD (optional for create)" },
        target_date: { type: "string", description: "Target date YYYY-MM-DD (optional for create)" },
      },
      required: ["action", "project_id"],
    },
    async execute(_id: string, params: any) {
      const { action, project_id, module_id, name, start_date, target_date } = params;
      const base = `/workspaces/${workspace}/projects/${project_id}`;

      switch (action) {
        case "list": {
          const r = await planeRequest(baseUrl, apiKey, "GET", `${base}/modules/`);
          return textResult(r.data);
        }
        case "create": {
          if (!name) return textResult("Erro: 'name' e obrigatorio.");
          const body: any = { name };
          if (start_date) body.start_date = start_date;
          if (target_date) body.target_date = target_date;
          const r = await planeRequest(baseUrl, apiKey, "POST", `${base}/modules/`, body);
          return textResult(r.data);
        }
        case "delete": {
          if (!module_id) return textResult("Erro: 'module_id' e obrigatorio para deletar.");
          const r = await planeRequest(baseUrl, apiKey, "DELETE", `${base}/modules/${module_id}/`);
          return textResult(r.ok ? "Module deletado com sucesso." : r.data);
        }
        default:
          return textResult(`Acao desconhecida: ${action}. Use: list, create, delete`);
      }
    },
  };
}

// ── Plugin entry point ───────────────────────────────────────────────────

const TOOL_NAMES = [
  "plane_projects",
  "plane_issues",
  "plane_comments",
  "plane_states",
  "plane_labels",
  "plane_cycles",
  "plane_modules",
];

// Workspace slug → UUID mapping. Populated during onboarding.
// To find your workspace UUID: SELECT id, slug FROM workspaces;
const WORKSPACE_IDS: Record<string, string> = {};

// Agent ID → Plane user UUID mapping. Populated during onboarding.
// To find agent user UUIDs: SELECT id, email FROM users WHERE email LIKE '%-bot@%';
const AGENT_USER_IDS: Record<string, string> = {};

const TOOL_FACTORIES: Record<
  string,
  (baseUrl: string, apiKey: string, workspace: string, dbCfg: PlaneDbConfig, workspaceId: string, agentUserId: string) => any
> = {
  plane_projects: createProjectsTool,
  plane_issues: (baseUrl, apiKey, workspace) => createIssuesTool(baseUrl, apiKey, workspace),
  plane_comments: (baseUrl, apiKey, workspace) => createCommentsTool(baseUrl, apiKey, workspace),
  plane_states: (baseUrl, apiKey, workspace) => createStatesTool(baseUrl, apiKey, workspace),
  plane_labels: (baseUrl, apiKey, workspace) => createLabelsTool(baseUrl, apiKey, workspace),
  plane_cycles: (baseUrl, apiKey, workspace) => createCyclesTool(baseUrl, apiKey, workspace),
  plane_modules: (baseUrl, apiKey, workspace) => createModulesTool(baseUrl, apiKey, workspace),
};

export default function register(api: PluginApi) {
  const cfg = (api.pluginConfig ?? {}) as PlanePluginConfig;

  for (const toolName of TOOL_NAMES) {
    api.registerTool(
      (ctx: ToolContext) => {
        const agentId = ctx.agentId;
        if (!agentId || !cfg.agents?.[agentId]) return null;

        const agentCfg = cfg.agents[agentId];
        const workspaceId = WORKSPACE_IDS[agentCfg.workspace] || "";
        const agentUserId = AGENT_USER_IDS[agentId] || "";
        return TOOL_FACTORIES[toolName](cfg.baseUrl, agentCfg.apiKey, agentCfg.workspace, cfg.db, workspaceId, agentUserId);
      },
      { names: [toolName], optional: true }
    );
  }
}
