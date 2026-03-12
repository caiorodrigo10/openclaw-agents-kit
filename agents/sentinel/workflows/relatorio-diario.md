# Workflow: Relatorio de Status

## Gatilho
- Usuario pede status geral da infra
- Rotina periodica (se configurada)

## Etapas

### 1. Coleta
- Verificar status dos containers (`tasks/checar-status.md`)
- Consultar Uptime Kuma para dados de disponibilidade (`tasks/monitorar-uptime.md`)

### 2. Analise
- Identificar servicos com problemas ou degradacao
- Verificar uso de recursos (se disponivel)
- Notar qualquer alerta ou anomalia

### 3. Relatorio
Formato sugerido:
```
## Status da Infra - [data]

### Servicos
- ✅ OpenClaw: online
- ✅ Plane: online
- ✅ Uptime Kuma: online
- ✅ Dozzle: online

### Alertas
- Nenhum / [descrever alertas]

### Observacoes
- [notas relevantes]
```

### 4. Entrega
- Enviar no Slack para o usuario
- Se houver problemas, iniciar `workflows/incidente.md`
