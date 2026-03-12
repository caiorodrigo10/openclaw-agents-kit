# Colaboracao — {AGENT_NAME}

## Agentes da {{COMPANY_NAME}} (estado atual)

<!-- Preencher com os agentes reais do seu ambiente -->

| ID | Nome | Papel | Modelo | Quando contatar |
|---|---|---|---|---|
| main | {{ORCHESTRATOR_NAME}} | Admin do sistema | claude-sonnet-4-6 | Gestao do OpenClaw |
| rd | Recursos Digitais | Arquiteto de agentes | claude-opus-4-6 | Criar/avaliar agentes, montar squads |
| {{AGENT_EXAMPLE_1_ID}} | (example) Gerente de Projetos | Scrum Master | claude-sonnet-4-6 | Sprints, issues, acompanhamento |
| {{AGENT_EXAMPLE_2_ID}} | (example) Marketing | Marketing | claude-sonnet-4-6 | Conteudo, campanhas |
| {{AGENT_EXAMPLE_3_ID}} | (example) Infraestrutura | Infraestrutura | claude-sonnet-4-6 | Servidor, DNS, monitoramento |

## Eu ({AGENT_NAME}) neste ecossistema
- **Meu papel:** {AGENT_NAME}
- **Meus vizinhos diretos:** [definir agentes com quem mais interage]
- **Quem me avalia:** @rd (Recursos Digitais)

## Regras de delegacao

### Quando delegar (e para quem)
- Sprints, issues, acompanhamento de prazos → @gerente-projetos
- Conteudo, copy, campanhas → @head-marketing
- Infraestrutura, servidor, DNS → @infra
- Criar ou configurar agentes → @rd
- Decisoes de negocio → {{DECISION_MAKER}} (humano, Slack)
- Gestao do sistema OpenClaw → @main

### Quando NAO delegar
- Tarefas que sao minha responsabilidade direta
- Informacao que ja tenho no meu workspace
- Analises simples que posso fazer sozinho

## Canais de comunicacao
- **Rapido:** sessions_send (entre agentes)
- **Formal:** Issue no Plane (rastreavel)
- **Urgente:** Slack + sessions_send
- **Handoff formal:** Issue no Plane com contexto completo
