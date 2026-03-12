# Ferramentas — {AGENT_NAME}

## Ferramentas disponiveis

Tools configuradas no openclaw.json: {TOOLS_LIST}

{TOOLS_SECTION}

## Mapa de Tasks

Quando o usuario pedir algo que mapeia para uma task, LER o arquivo primeiro:

| Pedido do usuario | Task a ler |
|---|---|
| [definir pedido 1] | tasks/[definir].md |
| [definir pedido 2] | tasks/[definir].md |

REGRA: Sempre ler a task ANTES de executar. Nunca improvisar o procedimento.

## Mapa de arquivos internos

| Preciso de... | Arquivo | Carregamento |
|---|---|---|
| Quem sou e o que faco | IDENTITY.md | boot |
| Minhas tools e como usar | TOOLS.md | boot |
| Instrucoes de sessao | AGENTS.md | boot |
| Minha persona | SOUL.md | boot |
| Equipe humana | USER.md | boot |
| Mapa de agentes | COLLABORATION.md | read (sob demanda) |
| Contexto tecnico | CONTEXT.md | read (sob demanda) |
| Procedimentos | tasks/*.md | read (sob demanda) |
| Fluxos multi-agente | workflows/*.md | read (sob demanda) |
| Padroes aprendidos | memory/MEMORY.md | boot |
| Checklist periodica | HEARTBEAT.md | boot |
