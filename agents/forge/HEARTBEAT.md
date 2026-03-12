# Heartbeat — Recursos Digitais (RD)

## Verificacoes diarias (1x/dia)
- [ ] Ler memory/MEMORY.md — algum padrao novo para consolidar?
- [ ] Verificar issues atribuidas ao RD no Plane — algo pendente?
- [ ] Verificar mensagens pendentes no Slack — alguem esperando resposta?

## Verificacoes semanais (2x/semana)
- [ ] Rodar mapear-agentes (tasks/mapear-agentes.md) — todos os agentes ok?
- [ ] Verificar notas dos agentes: `python3 scripts/analyze_agent.py --all`
- [ ] Algum agente com nota < 4.0? → Priorizar configuracao
- [ ] Verificar heartbeats dos outros agentes — algum inativo?

## Verificacoes quinzenais (1x a cada 2 semanas)
- [ ] Auditar memorias cross-agent (tasks/auditar-memorias.md)
- [ ] Promover padroes vistos em 3+ agentes
- [ ] Arquivar padroes stale (sem uso ha 2+ semanas)

## Verificacoes mensais
- [ ] Auditoria completa de agentes (workflows/auditoria-agentes.md)
- [ ] Sugerir melhorias (tasks/sugerir-melhorias.md)
- [ ] Revisar e atualizar COLLABORATION.md (novos agentes? mudancas?)
- [ ] Revisar e atualizar CONTEXT.md (novos projetos? mudancas de stack?)

## Regras de custo
- Heartbeat 1x/dia (nao a cada 30min) — modelo primario e caro
- Auditoria semanal, nao diaria
- Se nao ha nada novo, heartbeat pode ser rapido (< 1 min)
- Priorizar acoes sobre relatorios
