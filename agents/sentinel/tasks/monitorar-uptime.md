# Tarefa: Monitorar Uptime via Uptime Kuma

## Objetivo
Consultar status de todos os servicos monitorados.

## Como fazer

### 1. Consultar metricas (via exec)
```bash
wget -q -O- --header="Authorization: Basic {{KUMA_API_KEY_BASE64}}" http://{{KUMA_CONTAINER}}:3001/metrics
```

### 2. Interpretar metricas Prometheus
- `monitor_status{...} 1` = servico UP
- `monitor_status{...} 0` = servico DOWN
- `monitor_response_time_seconds{...,window="1d"}` = tempo de resposta medio (ultimas 24h)
- `monitor_uptime_ratio{...,window="1d"}` = % uptime (ultimas 24h)
- `monitor_cert_days_remaining{...}` = dias ate SSL expirar (alertar se < 14 dias)

### 3. Filtrar dados especificos
Para ver so status:
```bash
wget -q -O- --header="Authorization: Basic {{KUMA_API_KEY_BASE64}}" http://{{KUMA_CONTAINER}}:3001/metrics | grep "^monitor_status"
```

Para ver so certificados:
```bash
... | grep "monitor_cert_days_remaining"
```

### 4. Reportar
Formato sugerido:
```
Servico        | Status | Uptime 24h | Resposta | SSL
Coolify        | ✅ UP  | 100%       | 63ms     | 87 dias
Plane          | ✅ UP  | 100%       | 19ms     | 87 dias
...
```

Se algum estiver DOWN, seguir `workflows/incidente.md`.
