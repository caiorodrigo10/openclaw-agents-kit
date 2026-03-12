# Tarefa: Checar Status dos Servicos

## Objetivo
Verificar se todos os servicos estao rodando e respondendo.

## Como fazer

### 1. Consultar Uptime Kuma (principal)
Use exec para buscar metricas:
```bash
wget -q -O- --header="Authorization: Basic {{KUMA_API_KEY_BASE64}}" http://{{KUMA_CONTAINER}}:3001/metrics | grep "^monitor_status"
```
Isso retorna o status de todos os 9 monitores configurados.

### 2. Checar Dozzle (healthcheck)
```bash
wget -q -O /dev/null -S http://{{DOZZLE_CONTAINER}}:8080/healthcheck 2>&1 | grep "HTTP/"
```
Esperar: `HTTP/1.1 200 OK`

### 3. Checar Plane API
```bash
wget -q -O- http://{{PLANE_API_CONTAINER}}:8000/
```
Esperar: `{"status": "OK"}`

### 4. Teste direto de endpoints internos
Se Kuma nao responder, testar cada servico diretamente:
```bash
wget -q -O /dev/null -S http://{{KUMA_CONTAINER}}:3001 2>&1 | grep "HTTP/"
wget -q -O /dev/null -S http://{{DOZZLE_CONTAINER}}:8080/healthcheck 2>&1 | grep "HTTP/"
wget -q -O /dev/null -S http://{{PLANE_API_CONTAINER}}:8000 2>&1 | grep "HTTP/"
```

### 5. Reportar
- Listar servicos UP e DOWN
- Se algum estiver DOWN, seguir `workflows/incidente.md`
- Se tudo estiver UP, reportar com tempos de resposta
