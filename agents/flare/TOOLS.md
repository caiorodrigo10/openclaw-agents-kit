# TOOLS.md - Ferramentas do Flare

## Cron (Agendamento de tarefas)

Voce tem acesso ao cron do OpenClaw para agendar tarefas recorrentes ou one-shot.

### Conceitos basicos
- **Isolated job:** roda uma sessao dedicada (nao interfere na conversa principal)
- **Main session job:** enfileira um system event no heartbeat
- **Delivery:** pode anunciar resultado em um canal (Slack, etc.)

### Como criar via tool call (cron.add)

**Job recorrente isolado:**
```json
{
  "name": "Post semanal",
  "schedule": { "kind": "cron", "expr": "0 10 * * 1", "tz": "America/Sao_Paulo" },
  "sessionTarget": "isolated",
  "wakeMode": "next-heartbeat",
  "payload": {
    "kind": "agentTurn",
    "message": "Preparar rascunho do post semanal."
  },
  "delivery": {
    "mode": "announce",
    "channel": "slack",
    "to": "channel:{{SLACK_CHANNEL_ID}}",
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
  "payload": { "kind": "systemEvent", "text": "Lembrete: revisar campanha." },
  "deleteAfterRun": true
}
```

### Campos importantes
- `schedule.kind`: `at` (one-shot), `every` (intervalo em ms), `cron` (expressao cron)
- `schedule.tz`: timezone IANA (ex: "America/Sao_Paulo")
- `sessionTarget`: `main` ou `isolated`
- `payload.kind`: `systemEvent` (main) ou `agentTurn` (isolated)
- `delivery.mode`: `announce`, `webhook`, ou `none`

### Outras operacoes
- `cron.list` — listar jobs existentes
- `cron.update` — atualizar job (`jobId` + `patch`)
- `cron.remove` — remover job (`jobId`)
- `cron.run` — executar job manualmente (`jobId`)
- `cron.runs` — historico de execucoes

---

## Web Search (Pesquisa na web)

Voce tem acesso a `web_search` para buscar informacoes na internet.

- Use para: pesquisar tendencias, benchmarks, documentacao, informacoes atualizadas
- Nao use para: URLs conhecidas (use web_fetch)

---

## Web Fetch (Buscar conteudo de URL)

Voce tem acesso a `web_fetch` para extrair conteudo de URLs especificas.

- Use para: ler paginas web, artigos, documentacao de URL conhecida
- Nao use para: pesquisa generica (use web_search)

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
- **Forge (RD):** Arquiteto de agentes — criar/configurar/avaliar agentes
- **Pulse (GP):** Gestao de projetos — sprints, issues, acompanhamento
- **Sentinel (Infra):** Infraestrutura — monitoramento, DNS, SSL
- **Alex Hormozi:** Consultoria de negocios — estrategia, ofertas

---

## Plane (Gerenciamento de Projetos)

Voce tem acesso ao Plane via 7 tools dedicadas.

### plane_projects
| action | O que faz |
|---|---|
| `list` | Lista todos os projetos |
| `create` | Cria novo projeto (`name`, `identifier`) |
| `delete` | Deleta projeto (`project_id`) |
| `members` | Lista membros (`project_id`) |
| `add_member` | Adiciona membro (`project_id`, `member_id`, `role`) |
| `me` | Dados do seu usuario |

### plane_issues
| action | O que faz |
|---|---|
| `list` | Lista issues (`project_id`) |
| `get` | Detalha issue (`project_id`, `issue_id`) |
| `create` | Cria issue (`project_id`, `name`) |
| `update` | Atualiza issue (`project_id`, `issue_id`, + campos) |
| `delete` | Deleta issue (`project_id`, `issue_id`) |
| `activities` | Historico (`project_id`, `issue_id`) |
| `add_link` | Adiciona URL (`project_id`, `issue_id`, `url`) |

### plane_comments
| action | O que faz |
|---|---|
| `list` | Lista comentarios (`project_id`, `issue_id`) |
| `create` | Cria comentario (`project_id`, `issue_id`, `comment_html`) |

### plane_states / plane_labels / plane_cycles / plane_modules
- `list`, `create`, `delete` — gerenciar estados, labels, ciclos e modulos

### Prioridades validas
`urgent`, `high`, `medium`, `low`, `none`

---

## Identidade no Plane

- **Nome:** Flare
- **User ID:** `{{AGENT_PLANE_USER_ID}}`
- **Email:** {{AGENT_EMAIL}}
- **Role:** Member
- **Workspace:** {{PLANE_WORKSPACE}}

> A API key e resolvida automaticamente pelo plugin Plane via openclaw.json.
> Voce NAO precisa informar a chave — basta usar as tools plane_* normalmente.
