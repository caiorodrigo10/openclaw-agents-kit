# TOOLS.md - Ferramentas do Pulse

## Cron (Agendamento de tarefas)

Voce tem acesso ao cron do OpenClaw para agendar tarefas recorrentes ou one-shot.

### Conceitos basicos
- **Isolated job:** roda uma sessao dedicada (nao interfere na conversa principal)
- **Main session job:** enfileira um system event no heartbeat
- **Delivery:** pode anunciar resultado em um canal (chat configurado)

### Como criar via tool call (cron.add)

**Job recorrente isolado com entrega no canal:**
```json
{
  "name": "Status diario",
  "schedule": { "kind": "cron", "expr": "0 9 * * *", "tz": "America/Sao_Paulo" },
  "sessionTarget": "isolated",
  "wakeMode": "next-heartbeat",
  "payload": {
    "kind": "agentTurn",
    "message": "Gerar status diario dos projetos."
  },
  "delivery": {
    "mode": "announce",
    "channel": "{{CHAT_PLATFORM}}",
    "to": "channel:{{CHANNEL_ID}}",
    "bestEffort": true
  }
}
```

**Job one-shot (lembrete):**
```json
{
  "name": "Lembrete",
  "schedule": { "kind": "at", "at": "2026-03-10T14:00:00Z" },
  "sessionTarget": "main",
  "wakeMode": "now",
  "payload": { "kind": "systemEvent", "text": "Lembrete: revisar sprint." },
  "deleteAfterRun": true
}
```

### Campos importantes
- `schedule.kind`: `at` (one-shot), `every` (intervalo em ms), `cron` (expressao cron)
- `schedule.tz`: timezone IANA (ex: "America/Sao_Paulo")
- `sessionTarget`: `main` ou `isolated`
- `payload.kind`: `systemEvent` (main) ou `agentTurn` (isolated)
- `delivery.mode`: `announce` (envia no canal), `webhook`, ou `none`

### Outras operacoes
- `cron.list` — listar jobs existentes
- `cron.update` — atualizar job (`jobId` + `patch`)
- `cron.remove` — remover job (`jobId`)
- `cron.run` — executar job manualmente (`jobId`)
- `cron.runs` — historico de execucoes

---

## Web Search (Pesquisa na web)

Voce tem acesso a `web_search` para buscar informacoes na internet.

- Use para: pesquisar documentacao, boas praticas, informacoes atualizadas
- Nao use para: URLs conhecidas (use `web_fetch` se tiver)

---

## Sessions (Comunicacao inter-agente)

Voce tem acesso a comunicacao com outros agentes via `group:sessions`.

| Tool | O que faz |
|---|---|
| `sessions_list` | Lista sessoes ativas de todos os agentes |
| `sessions_history` | Historico de uma sessao especifica |
| `sessions_send` | Envia mensagem para agente em sessao existente |
| `sessions_spawn` | Cria nova sessao com um agente |
| `session_status` | Status atual de uma sessao |

**Quando usar:** Coordenar com outros agentes, pedir informacao, delegar sub-tarefas.
**Nota:** `sessions_send` e assincrono — sem garantia de resposta imediata.

### Agentes conhecidos
Preenchido durante o onboarding. Exemplo:
- **Forge (RD):** Arquiteto de agentes — criar/configurar/avaliar agentes
- **Sentinel (Infra):** Infraestrutura — monitoramento, DNS, SSL
- **Flare (Head Marketing):** Marketing — campanhas, conteudo

---

## Task Manager

As ferramentas de task manager sao configuradas durante o onboarding do Forge.

### Se Plane (plugin dedicado):
Voce tera 7 tools dedicadas: plane_projects, plane_issues, plane_comments, plane_states, plane_labels, plane_cycles, plane_modules.

Documentacao completa de cada tool:

#### plane_projects
| action | O que faz | Parametros |
|---|---|---|
| `list` | Lista todos os projetos | — |
| `create` | Cria novo projeto | `name` (obrig), `identifier` (obrig, max 5 chars), `description` (opcional) |
| `delete` | Deleta projeto | `project_id` |
| `members` | Lista membros | `project_id` |
| `add_member` | Adiciona usuario | `project_id`, `member_id`, `role` (5=Guest, 10=Member, 15=Admin, 20=Owner) |
| `me` | Dados do seu usuario | — |

**IMPORTANTE:** Ao criar projeto, sempre adicione o {{DECISION_MAKER}} como Owner (role 20).

#### plane_issues
| action | O que faz | Parametros |
|---|---|---|
| `list` | Lista issues | `project_id`. Filtros: `state`, `priority`, `assignee` |
| `get` | Detalha issue | `project_id`, `issue_id` |
| `create` | Cria issue | `project_id`, `name`. Opcionais: `description_html`, `priority`, `state`, `assignees`, `labels`, `start_date`, `target_date`, `parent` |
| `update` | Atualiza campos | `project_id`, `issue_id`, + campos |
| `delete` | Deleta issue | `project_id`, `issue_id` |
| `activities` | Historico | `project_id`, `issue_id` |
| `add_link` | Adiciona URL | `project_id`, `issue_id`, `url`, `title` |

**Campos editaveis:** `name`, `description_html`, `state`, `priority`, `assignees`, `labels`, `start_date`, `target_date`
**Subtasks:** `create` com `parent: "issue_id_pai"`

#### plane_comments
| action | O que faz | Parametros |
|---|---|---|
| `list` | Lista comentarios | `project_id`, `issue_id` |
| `create` | Adiciona comentario | `project_id`, `issue_id`, `comment_html` |

#### plane_states
| action | O que faz | Parametros |
|---|---|---|
| `list` | Lista estados | `project_id` |
| `create` | Cria estado | `project_id`, `name`, `color`, `group` |
| `delete` | Remove estado | `project_id`, `state_id` |

**Grupos:** backlog, unstarted, started, completed, cancelled

#### plane_labels
| action | O que faz | Parametros |
|---|---|---|
| `list` | Lista labels | `project_id` |
| `create` | Cria label | `project_id`, `name`, `color` |
| `delete` | Remove label | `project_id`, `label_id` |

#### plane_cycles
| action | O que faz | Parametros |
|---|---|---|
| `list` | Lista cycles | `project_id` |
| `create` | Cria cycle | `project_id`, `name`, `start_date`, `end_date`, `owned_by` |
| `delete` | Remove cycle | `project_id`, `cycle_id` |

#### plane_modules
| action | O que faz | Parametros |
|---|---|---|
| `list` | Lista modules | `project_id` |
| `create` | Cria module | `project_id`, `name`, `start_date`, `target_date` |
| `delete` | Remove module | `project_id`, `module_id` |

### Se ClickUp/Trello/Linear/outro (via MCP):
Tools disponiveis via MCP server configurado durante onboarding.

### Prioridades validas
`urgent`, `high`, `medium`, `low`, `none`

### Limitacoes conhecidas (Plane API v1.0.0)
- Nao e possivel associar issues a cycles ou modules
- Nao existe endpoint para editar states, cycles ou modules (so criar e deletar)
- Pages, Epics, Initiatives nao disponiveis

### Boas praticas
1. Antes de criar issues, faca `plane_states action=list` para pegar os IDs
2. Ao criar projeto, sempre adicione o {{DECISION_MAKER}} como Owner
3. Use `description_html` com tags HTML para formatacao
4. Para mover issues entre estados, use update com campo `state`
5. Para ver historico, use activities

---

## Identidade no Task Manager

Preenchido durante o onboarding:
- **Nome:** Pulse
- **User ID:** {{PULSE_USER_ID}}
- **Email:** {{PULSE_EMAIL}}
- **Role:** Admin
- **Workspace:** {{WORKSPACE_SLUG}}

> A API key e resolvida automaticamente pelo plugin/MCP via openclaw.json.
> Voce NAO precisa informar a chave — basta usar as tools normalmente.
