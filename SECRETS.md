# Secrets Necessarios

Lista de todas as chaves e credenciais que voce precisa para operar o kit de agentes.

---

## Obrigatorios

| Secret | Onde obter | Onde configurar |
|---|---|---|
| `ANTHROPIC_API_KEY` | [console.anthropic.com](https://console.anthropic.com) | `.env` + `auth-profiles.json` de cada agente |
| Slack Bot Token (por agente) | [api.slack.com/apps](https://api.slack.com/apps) | `openclaw.json` → channels.slack.accounts |
| Slack App Token (por agente) | Mesmo app Slack | `openclaw.json` → channels.slack.accounts |

## Opcionais — Modelos

| Secret | Onde obter | Para que serve |
|---|---|---|
| `GEMINI_API_KEY` | [aistudio.google.com](https://aistudio.google.com) | Web search (Gemini como provedor) |
| `OPENROUTER_API_KEY` | [openrouter.ai](https://openrouter.ai) | Fallback de modelos |
| `PERPLEXITY_API_KEY` | [perplexity.ai](https://perplexity.ai) | Pesquisa avancada |
| `ELEVENLABS_API_KEY` | [elevenlabs.io](https://elevenlabs.io) | Text-to-speech |

## Opcionais — Task Manager (Plane)

| Secret | Onde obter | Para que serve |
|---|---|---|
| Plane API Key (por agente) | Plane → Settings → API Tokens | Plugin Plane no OpenClaw |
| Plane DB credentials | Docker compose do Plane | Operacoes de member management |

## Opcionais — Monitoramento

| Secret | Onde obter | Para que serve |
|---|---|---|
| Kuma API Key | Uptime Kuma → Settings → API Keys | Sentinel consulta metricas |
| Dozzle credentials | Docker compose do Dozzle | Sentinel consulta logs |

## Opcionais — Task Manager (MCP)

| Secret | Onde obter | Para que serve |
|---|---|---|
| `CLICKUP_API_TOKEN` | ClickUp → Settings → Apps | MCP ClickUp |
| Trello API Key + Token | [trello.com/power-ups/admin](https://trello.com/power-ups/admin) | MCP Trello |

---

## Notas de seguranca

- **NUNCA** commite o `.env` com valores reais (esta no `.gitignore`)
- **NUNCA** exponha tokens em canais publicos do Slack
- Rotacione API keys periodicamente
- Cada agente deve ter sua propria API key no Plane (nao compartilhar)
