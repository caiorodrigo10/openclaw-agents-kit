# TOOLS.md - Ferramentas e Procedimentos do RD

> Boot file carregado automaticamente. Referencia completa de tools e mapa de tasks.

---

## Ferramentas Disponiveis

### group:openclaw — Gestao do Sistema OpenClaw

Acesso completo ao sistema OpenClaw: listar agentes, aplicar config, gateway.

| Tool | O que faz |
|---|---|
| `agents_list` | Lista todos os agentes configurados |
| `gateway` | Controle do gateway (config.apply, config.patch, restart) |
| `browser` | Controle de navegador web |
| `canvas` | Controle de canvases |
| `message` | Envio de mensagens |
| `nodes` | Gestao de nodes e devices |
| `image` | Compreensao de imagens |
| `tts` | Text-to-speech |

**Quando usar:** Aplicar mudancas de config apos editar openclaw.json. Listar agentes. Hot-reload sem restart.
**Quando NAO usar:** Criar/editar arquivos (usar group:fs). Rodar scripts (usar group:runtime).

**IMPORTANTE:** Apos editar openclaw.json via group:fs, usar `gateway config.apply` para aplicar sem restart.

---

### group:fs — Sistema de Arquivos

Leitura, escrita e edicao de arquivos locais.

| Tool | O que faz |
|---|---|
| `read` | Le o conteudo de um arquivo |
| `write` | Cria ou sobrescreve um arquivo |
| `edit` | Edicao cirurgica (busca e substitui trecho) |
| `apply_patch` | Aplica patch estruturado a um arquivo |

**Quando usar:** Ler boot files, tasks, schemas, templates. Criar/atualizar workspaces.
**Quando NAO usar:** Rodar scripts (aguardar group:runtime). Ler URLs (usar web_fetch).

---

### group:sessions — Comunicacao Inter-Agente

| Tool | O que faz |
|---|---|
| `sessions_list` | Lista sessoes ativas de todos os agentes |
| `sessions_history` | Historico de uma sessao especifica |
| `sessions_send` | Envia mensagem para agente em sessao existente |
| `sessions_spawn` | Cria nova sessao com um agente |
| `session_status` | Status atual de uma sessao |

**Quando usar:** Delegar tarefas, verificar se agente responde, coordenar fluxos.
**Quando NAO usar:** Comunicacao formal (usar Plane). Comunicacao com humanos (Slack).

**NOTA:** sessions_send e assincrono — sem garantia de resposta imediata.
Para handoffs formais: criar issue no Plane + notificar via sessions_send.

---

### web_search — Busca na Web

**Quando usar:** Documentacao de APIs, solucoes tecnicas, informacoes atualizadas.
**Quando NAO usar:** URL conhecida (usar web_fetch). Info nos arquivos internos.

---

### web_fetch — Fetch de URL

**Quando usar:** Ler documentacao de URL especifica, verificar endpoints.
**Quando NAO usar:** Sem URL exata (usar web_search). Arquivos locais (usar read).

---

### plane — Gestao de Projetos

7 tools com 27 operacoes no Plane.

| Tool | O que faz |
|---|---|
| `plane_projects` | CRUD de projetos |
| `plane_issues` | CRUD de issues |
| `plane_cycles` | Gerenciar ciclos/sprints |
| `plane_modules` | Gerenciar modulos |
| `plane_labels` | CRUD de labels |
| `plane_states` | Gerenciar estados de workflow |
| `plane_members` | Listar membros |

**Quando usar:** Documentar decisoes, consultar projetos, registrar trabalho.
**Quando NAO usar:** Adicionar membros (API retorna 405). Comunicacao rapida (sessions_send).

---

### cron — Tarefas Periodicas

Agendar execucoes recorrentes com expressoes cron.

**Quando usar:** Revisoes periodicas, auditorias, heartbeats automaticos.
**Quando NAO usar:** Tarefas unicas. Agendamentos que dependem de evento externo.

**Frequencia configurada (moderada):**
- Heartbeat: 2x/dia (manha e tarde)
- Auditoria de agentes: 2x/semana (seg e qui)
- Relatorio geral: 1x/mes

---

## Mapa de Tasks (Lazy-Loading)

> **REGRA ABSOLUTA:** Sempre ler a task com `read` ANTES de executar. Nunca improvisar.

| Pedido do usuario | Task a ler |
|---|---|
| "quais agentes temos?" / "listar agentes" | `tasks/mapear-agentes.md` |
| "como esta o [agente]?" / "avaliar" | `tasks/avaliar-agente.md` |
| "configurar [agente]" / "arrumar" | `tasks/configurar-agente.md` |
| "delegar [tarefa] para [agente]" | `tasks/delegar-tarefa.md` |
| "criar novo agente" / "onboard" | `tasks/criar-agente.md` |
| "status geral" / "revisar" | `tasks/revisar-status.md` |
| "escalar problema" / "nao consigo" | `tasks/escalar-problema.md` |
| "registrar decisao" / "documentar" | `tasks/registrar-decisao.md` |
| "auditar memorias" / "padroes" | `tasks/auditar-memorias.md` |
| "melhorias" / "o que falta?" | `tasks/sugerir-melhorias.md` |
| "otimizar" / "melhorar processo" | `tasks/otimizar-processo.md` |
| "montar squad" / "quem participa" | `tasks/montar-squad.md` |

### Fluxo de execucao

```
1. Usuario faz pedido
2. RD identifica a task correspondente na tabela acima
3. RD le a task com read("tasks/nome-da-task.md")
4. RD segue o procedimento descrito na task (step by step)
5. Se a task referencia script -> rodar via exec (quando disponivel)
6. Se a task referencia workflow -> read("workflows/nome.md")
7. Apresentar resultado ao usuario
```

Se o pedido nao encaixa em nenhuma task, compor com tasks existentes ou informar a lacuna.

---

## Mapa de Arquivos Internos

| Preciso de... | Arquivo | Carregamento |
|---|---|---|
| Quem sou e o que faco | `IDENTITY.md` | boot (automatico) |
| Minha persona e filosofia | `SOUL.md` | boot (automatico) |
| Minhas tools e procedimentos | `TOOLS.md` (este arquivo) | boot (automatico) |
| Instrucoes de sessao e Red Lines | `AGENTS.md` | boot (automatico) |
| Equipe humana | `USER.md` | boot (automatico) |
| Padroes aprendidos | `memory/MEMORY.md` | boot (automatico) |
| Mapa de agentes e delegacao | `COLLABORATION.md` | ler via read |
| Arquitetura tecnica OpenClaw | `CONTEXT.md` | ler via read |
| Procedimentos operacionais | `tasks/*.md` | ler via read |
| Fluxos multi-agente | `workflows/*.md` | ler via read |
| Validar estruturas | `schemas/*.json` | ler via read |
| Scripts deterministicos | `scripts/*.py` | exec (quando disponivel) |
| Templates para novos agentes | `templates/*.md` | ler via read |

---

## Referencias Plane

IDs de workspace e projetos: obter via `plane_projects` e `plane_members`.
Nao hardcodar IDs.

---

## Notas de versao

- **Tools ativas:** group:fs, group:sessions, group:runtime, web_search, web_fetch, plane, cron
- **group:runtime** inclui `exec` (rodar scripts Python, comandos shell)
- **Ultima atualizacao:** 2026-03-09

---

## Identidade no Plane

- **Nome:** Forge
- **User ID:** `{{AGENT_PLANE_USER_ID}}`
- **Email:** {{AGENT_EMAIL}}
- **Role:** Admin
- **Workspace:** {{PLANE_WORKSPACE}}

> A API key e resolvida automaticamente pelo plugin Plane via openclaw.json.
> Voce NAO precisa informar a chave — basta usar as tools plane_* normalmente.
