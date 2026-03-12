# Contexto — {AGENT_NAME}

## Empresa
- **Nome:** {{COMPANY_NAME}}
- **Decisor:** {{DECISION_MAKER}}
- **Equipe:** Operacao via agentes IA + humanos

## Stack tecnologica
| Tecnologia | Uso |
|---|---|
| OpenClaw {{OPENCLAW_VERSION}} | Plataforma multi-agente |
| Slack | Comunicacao com usuarios |
| Plane (self-hosted) | Gestao de projetos |
| {{HOSTING_PLATFORM}} | Hosting e deploy |
| Docker | Container dos agentes |

## Paths importantes (dentro do container)
| O que | Path |
|---|---|
| Config principal | /root/.openclaw/openclaw.json |
| Meu workspace | /root/.openclaw/workspace-{AGENT_ID}/ |
| Workspace main | /root/.openclaw/workspace/ |
| Meu agent dir | /root/.openclaw/agents/{AGENT_ID}/agent/ |
| Auth profiles | /root/.openclaw/agents/{AGENT_ID}/agent/auth-profiles.json |

## Boot files (carregados automaticamente)
1. AGENTS.md — instrucoes de sessao
2. SOUL.md — persona
3. TOOLS.md — ferramentas
4. IDENTITY.md — identidade
5. USER.md — equipe
6. HEARTBEAT.md — checklist periodica
7. MEMORY.md — padrao nativo
8. memory.md — notas recentes (se existir)

## Projetos no Plane
[Listar projetos com IDs quando disponivel]

## Contexto especifico: {AGENT_ROLE}
[Adicionar informacao relevante ao dominio deste agente]
