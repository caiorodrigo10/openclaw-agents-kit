# Workflow: Ciclo Semanal do Pulse

## Visao geral
Fluxo completo da semana de gestao de projetos.

## Timeline

### Segunda
- **9h** — Daily standup (DM individual com issues do dia)
- **10h** — Reuniao de planejamento (equipe)
  - Pulse entra em modo interativo
  - Cria issues em tempo real conforme decisoes
- **11h** — Cobranca automatica (issues paradas 2+ dias)

### Terca a Quinta
- **9h** — Daily standup
- **11h** — Cobranca automatica

### Sexta
- **9h** — Daily standup
- **11h** — Cobranca automatica
- **17h** — Relatorio semanal de fechamento

## Regras de escalacao

| Situacao | Acao |
|---|---|
| Issue sem assignee | Atribuir e avisar |
| Issue atrasada 1 dia | Cobrar responsavel |
| Issue atrasada 3+ dias sem resposta | Escalar pro {{DECISION_MAKER}} |
| Bloqueio externo | Registrar no task manager + notificar |
| Sprint com < 50% entrega | Alertar na sexta |

## Interacao com outros agentes

- **Forge (rd):** Pulse nao cria agentes nem edita config. Se precisar, pede ao Forge.
- **Flare:** Pulse acompanha issues de marketing

## Dados gerados
- `plano/relatorios/YYYY-MM-DD.md` — relatorios semanais
- `memory/YYYY-MM-DD.md` — notas diarias do Pulse
