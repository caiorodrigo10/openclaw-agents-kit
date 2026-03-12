# TOOLS.md - Conexoes e Endpoints

## Ferramentas disponiveis
Voce tem acesso a:
- `web_fetch` — fazer HTTP GET em URLs (use para consultar APIs)
- `exec` — executar comandos shell dentro deste container
- `cron` — agendar tarefas periodicas
- `web_search` — pesquisar na web

## Rede Interna (Coolify Predefined Network)
Todos os servicos estao na rede Docker `coolify` (subnet {{DOCKER_SUBNET}}).
IMPORTANTE: usar nomes completos dos containers para DNS.

---

## Uptime Kuma (monitoramento)

### Acesso
- URL: http://{{KUMA_CONTAINER}}:3001
- Auth: API Key via HTTP Basic Auth (usuario vazio, senha = API key)
- Header: `Authorization: Basic {{KUMA_API_KEY_BASE64}}`

### Endpoints

#### GET /metrics (Prometheus format)
Retorna metricas de todos os monitores:
- `monitor_status` — 1 = UP, 0 = DOWN
- `monitor_response_time_seconds` — tempo de resposta (janelas 1d, 30d, 365d)
- `monitor_uptime_ratio` — % uptime (janelas 1d, 30d, 365d)
- `monitor_cert_days_remaining` — dias ate expirar o certificado SSL
- `monitor_cert_is_valid` — 1 = valido, 0 = invalido

Para consultar via exec:
```bash
wget -q -O- --header="Authorization: Basic {{KUMA_API_KEY_BASE64}}" http://{{KUMA_CONTAINER}}:3001/metrics
```

#### GET /api/status-page/<slug> (JSON, sem auth)
Retorna dados de status pages publicas.

### Monitores configurados
| ID | Nome | URL monitorada |
|---|---|---|
| 1 | Coolify | https://coolify.{{DOMAIN}} |
| 2 | Infisical | https://infiscal.{{DOMAIN}} |
| 3 | OpenClaw | https://openclaw.{{DOMAIN}}/healthz |
| 4 | Trigger.dev | https://trigger.{{DOMAIN}} |
| 5 | Plane | https://plane.{{DOMAIN}} |
| 6 | n8n | https://n8n.{{DOMAIN}} |
| 7 | Mautic | https://mautic.{{DOMAIN}} |
| 8 | Affine | https://affine.{{DOMAIN}} |
| 9 | Dozzle | https://dozzle.{{DOMAIN}} |

---

## Dozzle (logs de containers)

### Acesso
- URL: http://{{DOZZLE_CONTAINER}}:8080
- Auth: requer login (Simple Auth habilitado)
- Healthcheck (sem auth): GET /healthcheck — retorna 200 se vivo

### Endpoints (requerem autenticacao)
- `GET /api/hosts/{host}/containers/{id}/logs/stream` — stream de logs (SSE)
- `GET /api/hosts/{host}/containers/{id}/logs` — logs por periodo
- `GET /api/containers/{hostIds}/download` — download de logs
- `GET /api/events/stream` — eventos de containers (start/stop/die)

### Nota
Credenciais configuradas. Ver `tasks/dozzle-api.md` para referencia completa da API.
O agente pode consultar logs de qualquer container via API. Ver `tasks/dozzle-api.md`.
O healthcheck funciona sem auth — use para verificar se Dozzle esta vivo.

---

## Plane (gestao de projetos)

### Acesso
- API: http://{{PLANE_API_CONTAINER}}:8000
- Healthcheck: GET / — retorna {"status": "OK"}

### Nota
API key ainda nao configurada. Use o healthcheck para verificar se esta vivo.

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

**Quando usar:** Coordenar com outros agentes, reportar problemas de infra, pedir contexto.
**Nota:** `sessions_send` e assincrono — sem garantia de resposta imediata.

### Agentes conhecidos
- **Forge (RD):** Arquiteto de agentes — criar/configurar/avaliar agentes
- **Pulse (GP):** Gestao de projetos — sprints, issues, acompanhamento
- **Flare (Head Marketing):** Marketing — campanhas, conteudo
- **Alex Hormozi:** Consultoria de negocios — estrategia, ofertas

---

## Plane (Gerenciamento de Projetos)

Voce tem acesso ao Plane via tools `plane_*` para registrar e consultar issues.

### Tools disponiveis
- `plane_projects` — CRUD de projetos (list, create, delete, members, add_member, me)
- `plane_issues` — CRUD de issues (list, get, create, update, delete, activities, add_link)
- `plane_comments` — Comentarios em issues (list, create)
- `plane_states` — Estados de workflow (list, create, delete)
- `plane_labels` — Labels/tags (list, create, delete)
- `plane_cycles` — Ciclos/sprints (list, create, delete)
- `plane_modules` — Modulos (list, create, delete)

**Quando usar:** Registrar incidentes, documentar mudancas de infra, consultar tarefas atribuidas.
**Prioridades:** `urgent`, `high`, `medium`, `low`, `none`

---

## Outros servicos (via Kuma)
Os servicos abaixo sao monitorados pelo Uptime Kuma. Use /metrics para checar status:
- Coolify: https://coolify.{{DOMAIN}}
- Infisical: https://infiscal.{{DOMAIN}}
- Trigger.dev: https://trigger.{{DOMAIN}}
- n8n: https://n8n.{{DOMAIN}}
- Mautic: https://mautic.{{DOMAIN}}
- Affine: https://affine.{{DOMAIN}}

## Comando para atualizar IPs dos containers
Se os IPs mudarem apos redeploy:
```bash
docker network inspect coolify --format "{{range .Containers}}{{.Name}} -> {{.IPv4Address}}\n{{end}}"
```

---

## Identidade no Plane

- **Nome:** Sentinel
- **User ID:** `{{AGENT_PLANE_USER_ID}}`
- **Email:** {{AGENT_EMAIL}}
- **Role:** Member
- **Workspace:** {{PLANE_WORKSPACE}}

> A API key e resolvida automaticamente pelo plugin Plane via openclaw.json.
> Voce NAO precisa informar a chave — basta usar as tools plane_* normalmente.
