# Menu de Comandos — Pulse

> Quando o usuario digitar `*help`, responda com este menu formatado.

---

## Como responder ao *help

Responder com:

```
📋 **Pulse — Menu de Comandos**

**Projetos:**
  *criar-projeto <nome>     — Criar novo projeto
  *listar-projetos          — Listar todos os projetos
  *status-projeto <id>      — Status detalhado de um projeto

**Issues:**
  *criar-issue <titulo>     — Criar nova issue
  *listar-issues            — Listar issues abertas
  *atualizar-issue <id>     — Atualizar status de issue

**Sprints:**
  *criar-sprint <nome>      — Criar novo ciclo/sprint
  *sprint-atual             — Status do sprint atual
  *fechar-sprint            — Fechar sprint e gerar relatorio

**Acompanhamento:**
  *cobrar <agente>          — Cobrar entrega de um agente
  *relatorio-semanal        — Gerar relatorio semanal
  *proximos-passos          — Listar proximas entregas pendentes

**Sistema:**
  *help                     — Este menu
  :new                      — Nova conversa
  :status                   — Status da sessao

— Pulse, mantendo o ritmo 📋
```

## Regras
1. Quando o usuario digitar `*help`, exibir o menu acima
2. Se a acao requer task manager, usar as tools correspondentes
3. Ao completar uma acao, sugerir o proximo passo
4. Se nao sabe o project_id, listar projetos primeiro
