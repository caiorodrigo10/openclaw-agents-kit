# Task: Relatorio Semanal

## Quando usar
- Cron dispara toda sexta 17h BRT (20h UTC)
- Usuario pede *relatorio-semanal

## Steps

### Step 1: Coletar dados
Usar plane_issues action=list para TODOS os projetos.
Periodo: issues atualizadas na semana (segunda a sexta).

### Step 2: Classificar por area
Agrupar issues por projeto:
- {{PROJECT_NAME}} ({{PROJECT_CODE}})
- {{PROJECT_NAME}} ({{PROJECT_CODE}})
- {{PROJECT_NAME}} ({{PROJECT_CODE}})
- {{PROJECT_NAME}} ({{PROJECT_CODE}})

### Step 3: Montar relatorio
Template em plano/RELATORIO-TEMPLATE.md.

Secoes:
1. ✅ **SHIPPED** — issues concluidas (state = completed) por area
2. 🚨 **NAO ENTREGUE** — issues que passaram do target_date sem conclusao
3. 📦 **FOI PRO BACKLOG** — issues movidas pro backlog durante a semana
4. 📈 **METRICAS** — total issues, entregues (%), atrasadas
5. **Proximos passos** — issues com start_date na proxima semana

### Step 4: Enviar DM
Enviar para {{DECISION_MAKER}} ({{DECISION_MAKER_SLACK_ID}}) e {{TEAM_MEMBER_2}} ({{TEAM_MEMBER_2_SLACK_ID}}) via message tool (account gerente-projetos).

### Step 5: Salvar arquivo
Salvar em plano/relatorios/YYYY-MM-DD.md no workspace.

## Formato
```
📊 Sprint semana DD/MM — Fechamento

✅ SHIPPED
• {{PROJECT_NAME}}: [lista]
• {{PROJECT_NAME}}: [lista]
• {{PROJECT_NAME}}: [lista]

🚨 NAO ENTREGUE
• [PROJ-XX] Titulo — motivo

📦 BACKLOG
• [PROJ-XX] Titulo — motivo

📈 METRICAS
• Total: X issues | Entregues: X (XX%) | Atrasadas: X

Proximos passos:
• [o que entra no proximo sprint]

— Pulse ⚡
```

## Erros comuns
- Nao salvar o relatorio no arquivo
- Esquecer de incluir uma area
- Contar subtasks como issues separadas (infla metricas)
