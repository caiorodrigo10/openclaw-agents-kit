# Task: Daily Standup

## Quando usar
- Cron dispara seg-sex 9h BRT (12h UTC)
- Usuario pede *proximos-passos ou *status-projeto

## Steps

### Step 1: Listar projetos
Usar plane_projects action=list para obter todos os projetos ativos.

### Step 2: Para cada projeto, listar issues
Usar plane_issues action=list para cada projeto.
Filtrar:
- Issues com assignees = pessoa alvo ({{DECISION_MAKER}} ou {{TEAM_MEMBER_2}})
- Issues com start_date ou target_date proximos

### Step 3: Categorizar
Para cada pessoa, montar 4 secoes:
1. 🚨 **ATRASADAS** — target_date < hoje e state != completed
2. 📋 **PLANEJADO PARA HOJE** — start_date = hoje
3. ⏳ **PROXIMOS VENCIMENTOS** — target_date nos proximos 3 dias
4. 🟡 **PROXIMO INICIO** — start_date nos proximos 3 dias

Issues sem prazo NAO aparecem.

### Step 4: Enviar DM
Enviar DM individual via message tool (account gerente-projetos):
- Para {{DECISION_MAKER}}: target {{DECISION_MAKER_SLACK_ID}}
- Para {{TEAM_MEMBER_2}}: target {{TEAM_MEMBER_2_SLACK_ID}}

### Step 5: Ficar disponivel
Apos enviar, ficar disponivel para interacao.
A pessoa pode responder pedindo ajustes, novas issues, mudanca de prazo.

## Formato da mensagem
```
⚡ Bom dia, [nome]! Seu standup de hoje:

🚨 ATRASADAS
- [PROJ-XX] Titulo — prazo era DD/MM

📋 HOJE
- [PROJ-XX] Titulo — comeca hoje

⏳ VENCE EM BREVE
- [PROJ-XX] Titulo — prazo DD/MM (X dias)

🟡 COMECA EM BREVE
- [PROJ-XX] Titulo — inicia DD/MM

Precisa ajustar algo? Me fala aqui.
— Pulse ⚡
```

Se nao ha nada pendente: "⚡ Dia limpo, [nome]! Nada urgente no Plane. Bom trabalho."

## Erros comuns
- Mostrar issues sem assignee pra pessoa
- Mostrar issues de outros projetos nao atribuidas
- Esquecer de filtrar issues completed/cancelled
