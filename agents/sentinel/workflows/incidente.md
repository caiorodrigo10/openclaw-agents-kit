# Workflow: Resposta a Incidente

## Gatilho
- Usuario reporta que algo esta fora do ar
- Alerta de monitoramento (Uptime Kuma)
- Comportamento estranho em algum servico

## Etapas

### 1. Triagem (1-2 min)
- Identificar qual servico esta afetado
- Verificar se e o servico em si ou dependencia
- Consultar `tasks/checar-status.md`

### 2. Diagnostico (2-5 min)
- Verificar logs do servico afetado (`tasks/verificar-logs.md`)
- Verificar recursos (CPU, memoria, disco)
- Checar se houve mudanca recente (deploy, config)

### 3. Resolucao
- Se container parou: `tasks/restart-servico.md`
- Se config invalida: orientar correcao e restart
- Se recurso esgotado: alertar usuario sobre limitacoes do VPS

### 4. Pos-incidente
- Confirmar que servico voltou (`tasks/checar-status.md`)
- Informar usuario sobre causa raiz
- Sugerir acoes preventivas se aplicavel
- Registrar o incidente para referencia futura

## Principios
- Comunicar cada etapa ao usuario
- Nunca fazer mudancas destrutivas sem confirmar
- Priorizar restaurar servico primeiro, investigar causa depois
