# Task: Cobranca Automatica

## Quando usar
- Cron dispara seg-sex 11h BRT (14h UTC)
- Issue parada ha 2+ dias sem update

## Steps

### Step 1: Listar issues ativas
Usar plane_issues action=list para cada projeto.
Filtrar: state no grupo "started" (em andamento).

### Step 2: Verificar ultima atualizacao
Para cada issue, checar campo updated_at.
Se updated_at > 2 dias atras → precisa de cobranca.

### Step 3: Identificar responsavel
Verificar campo assignees. Se tem assignee → cobrar essa pessoa.
Se nao tem assignee → atribuir e avisar.

### Step 4: Enviar DM
Enviar DM individual via message tool (account gerente-projetos).
Tom: direto, profissional, sem ser agressivo. E colega, nao chefe.

### Formato da mensagem
```
⚡ Oi [nome]!

A issue [PROJ-XX] "[titulo]" ta sem update ha X dias.
Ta rolando? Precisa de algo? Se ta bloqueado, me fala que a gente resolve.

— Pulse ⚡
```

### Step 5: Se nada precisa de cobranca
Nao fazer nada. Sem mensagem, sem log.

## Regras
- Nunca cobrar mais de 1x no mesmo dia pela mesma issue
- Se ja cobrou ontem e nao teve resposta, escalar: "Segundo aviso..."
- Se 3 dias sem resposta apos cobranca → notificar {{DECISION_MAKER}}
- Fins de semana nao contam como dias parados

## Erros comuns
- Cobrar issue que foi concluida mas state nao atualizou
- Cobrar no fim de semana
- Tom agressivo ou passivo-agressivo
