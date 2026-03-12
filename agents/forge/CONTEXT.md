# CONTEXT.md - Arquitetura Tecnica do OpenClaw

> Este arquivo NAO e carregado automaticamente (nao e boot file).
> O RD le sob demanda quando precisa criar agentes, editar configs ou entender o sistema.

---

## A {{COMPANY_NAME}}

A {{COMPANY_NAME}} e uma empresa construindo sua infraestrutura de agentes IA.
Estamos no inicio — configurando ferramentas, criando agentes e definindo processos.
O sistema roda em OpenClaw, um framework multi-agente com Slack como interface.

---

## Paths importantes (dentro do container)

| O que | Path |
|---|---|
| Config principal | `/root/.openclaw/openclaw.json` |
| Workspace main | `/root/.openclaw/workspace/` |
| Workspace de agente | `/root/.openclaw/workspace-{id}/` |
| Agent state dir | `/root/.openclaw/agents/{id}/agent/` |
| Auth profiles | `/root/.openclaw/agents/{id}/agent/auth-profiles.json` |
| Models config | `/root/.openclaw/agents/{id}/agent/models.json` |
| Sessions dir | `/root/.openclaw/agents/{id}/sessions/` |
| Media dir | `/root/.openclaw/media/` |
| Extensions | `/root/.openclaw/extensions/` |
| Plugin Plane | `/root/.openclaw/extensions/plane/` |

---

## Boot files do OpenClaw (9 arquivos carregados automaticamente)

| Arquivo | Proposito |
|---|---|
| AGENTS.md | Instrucoes criticas por sessao (Session Startup, Red Lines) |
| SOUL.md | Persona, tom, filosofia |
| TOOLS.md | Notas sobre tools |
| IDENTITY.md | Nome, vibe, emoji, avatar |
| USER.md | Info do usuario/owner |
| HEARTBEAT.md | Padrao para heartbeat polls |
| BOOTSTRAP.md | Onboarding inicial (deletar apos configurar) |
| MEMORY.md | Memoria persistente |
| memory.md | Alternativa ao MEMORY.md |

**Subagentes recebem apenas:** AGENTS.md, TOOLS.md, SOUL.md, IDENTITY.md, USER.md

Qualquer outro .md (ex: COLLABORATION.md, CONTEXT.md) NAO e carregado automaticamente.

---

## Estrutura de um agente no openclaw.json

### agents.list[]
```json
{
  "id": "AGENT_ID",
  "name": "AGENT_ID",
  "workspace": "/root/.openclaw/workspace-AGENT_ID",
  "agentDir": "/root/.openclaw/agents/AGENT_ID/agent",
  "tools": {
    "allow": ["group:fs", "group:sessions", "web_search"]
  },
  "model": "anthropic/claude-sonnet-4-6"
}
```

Campos obrigatorios:
- `id`: kebab-case, unico, sem espacos (ex: "head-vendas")
- `name`: igual ao id
- `workspace`: path completo do workspace
- `agentDir`: path do agent state
- `tools.allow`: array de tools permitidas (SEMPRE definir — sem isso = acesso TOTAL)
- `model`: opcional (usa default se omitido). Default: `anthropic/claude-sonnet-4-6`

### channels.slack.accounts
```json
{
  "ACCOUNT_ID": {
    "botToken": "{{SLACK_BOT_TOKEN}}",
    "appToken": "{{SLACK_APP_TOKEN}}",
    "userTokenReadOnly": true
  }
}
```

### bindings[]
```json
{
  "agentId": "AGENT_ID",
  "match": {
    "channel": "slack",
    "accountId": "ACCOUNT_ID"
  }
}
```

O binding conecta: mensagens do Slack App (accountId) -> agente (agentId).

---

## Auth profiles (por agente)

Path: `/root/.openclaw/agents/{id}/agent/auth-profiles.json`

Gerenciado pelo OpenClaw. Voce NAO precisa mexer neste arquivo diretamente — ele e configurado durante o onboarding ou via `openclaw doctor`.

---

## Manifest YAML para criar Slack App

Criar em https://api.slack.com/apps -> Create New App -> From an app manifest

```yaml
display_information:
  name: NOME_DO_AGENTE
  description: DESCRICAO_CURTA
settings:
  socket_mode_enabled: true
  org_deploy_enabled: false
  token_rotation_enabled: false
  event_subscriptions:
    bot_events:
      - app_mention
      - message.channels
      - message.groups
      - message.im
      - message.mpim
      - reaction_added
      - reaction_removed
      - member_joined_channel
      - member_left_channel
      - channel_rename
      - pin_added
      - pin_removed
features:
  app_home:
    home_tab_enabled: false
    messages_tab_enabled: true
    messages_tab_read_only_enabled: false
  bot_user:
    display_name: NOME_DO_AGENTE
    always_online: true
oauth_config:
  scopes:
    bot:
      - chat:write
      - channels:history
      - channels:read
      - groups:history
      - im:history
      - im:read
      - im:write
      - mpim:history
      - mpim:read
      - mpim:write
      - users:read
      - app_mentions:read
      - assistant:write
      - reactions:read
      - reactions:write
      - pins:read
      - pins:write
      - emoji:read
      - commands
      - files:read
      - files:write
```

Apos criar o app:
1. Socket Mode -> gerar App-Level Token (scope: connections:write) = `appToken`
2. Install App -> copiar Bot User OAuth Token = `botToken`

---

## Procedimento para criar agente (resumo)

O procedimento completo esta em `tasks/criar-agente.md`.
Resumo das 7 camadas:

```
Camada 1: Slack App (manual — {{DECISION_MAKER}} cria, RD instrui com manifest)
Camada 2: openclaw.json — agents.list (RD edita via group:fs)
Camada 3: openclaw.json — channels.slack.accounts (RD edita via group:fs)
Camada 4: openclaw.json — bindings (RD edita via group:fs)
Camada 5: Workspace files (RD cria via group:fs)
Camada 6: Auth profile (RD copia do main via group:fs)
Camada 7: Restart container + verificacao (com aprovacao do {{DECISION_MAKER}})
```

---

## Tecnologias

- **OpenClaw:** Framework multi-agente ({{OPENCLAW_VERSION}})
- **Slack:** Interface de comunicacao (Socket Mode)
- **Plane:** Gestao de projetos (self-hosted, plugin custom)
- **Anthropic:** Provider de LLM ({{PRIMARY_MODEL}} para RD, {{DEFAULT_MODEL}} para demais)
- **Python 3.11:** Runtime para scripts deterministicos (jsonschema, pyyaml)
- **Coolify:** PaaS para deploy do container (Dockerfile customizado)
- **Docker:** Container runtime
