# Dozzle API - Referencia

## Autenticacao

### Obter JWT (renovar quando expirar)
```bash
wget -q -O /dev/null -S --post-data="username=admin&password={{DOZZLE_PASSWORD}}" http://{{DOZZLE_CONTAINER}}:8080/api/token 2>&1 | grep "Set-Cookie" | sed "s/.*jwt=//;s/;.*//"
```
Salvar o JWT e usar em todas as requests como: `--header="Cookie: jwt=<TOKEN>"`

### JWT atual
```
{{DOZZLE_JWT_TOKEN}}
```
Se receber 401, renovar com o comando acima.

## Config

- **Dozzle URL:** http://{{DOZZLE_CONTAINER}}:8080
- **Host ID:** {{DOZZLE_HOST_ID}}
- **Versao:** v10.0.7

## Containers (short ID para usar na API)

| Container | Short ID |
|---|---|
| openclaw | {{OPENCLAW_SHORT_ID}} |
| uptime-kuma | {{KUMA_SHORT_ID}} |
| dozzle | {{DOZZLE_SHORT_ID}} |
| plane-api | {{PLANE_API_SHORT_ID}} |
| plane-web | {{PLANE_WEB_SHORT_ID}} |
| plane-worker | {{PLANE_WORKER_SHORT_ID}} |
| coolify-proxy | (verificar) |

Nota: IDs mudam apos redeploy. Atualizar com `docker ps --format "{{.ID}} {{.Names}}"` se necessario.

## Endpoints

### GET /healthcheck (sem auth)
Verifica se Dozzle esta vivo. Retorna 200 OK.

### POST /api/token (sem auth)
Gera JWT. Body: `username=admin&password={{DOZZLE_PASSWORD}}` (form-encoded).

### GET /api/hosts/{host}/containers/{id}/logs?stdout&stderr
Buscar logs historicos de um container.

Parametros obrigatorios:
- `stdout` — incluir stdout (flag, sem valor)
- `stderr` — incluir stderr (flag, sem valor)

Parametros opcionais:
- `from` — inicio (RFC3339Nano, ex: `2026-03-08T00:00:00Z`)
- `to` — fim (RFC3339Nano)
- `everything` — ignorar from/to, buscar tudo
- `maxStart` — limitar numero de linhas retornadas
- `filter` — regex para filtrar logs
- `levels` — filtrar por nivel (ex: `levels=error&levels=warn`)

Exemplo — ultimas 10 linhas do OpenClaw:
```bash
wget -q --timeout=10 -O- --header="Cookie: jwt=<JWT>" "http://{{DOZZLE_CONTAINER}}:8080/api/hosts/{{DOZZLE_HOST_ID}}/containers/{{OPENCLAW_SHORT_ID}}/logs?stdout&stderr&maxStart=10"
```

Exemplo — logs com erros do Uptime Kuma:
```bash
wget -q --timeout=10 -O- --header="Cookie: jwt=<JWT>" "http://{{DOZZLE_CONTAINER}}:8080/api/hosts/{{DOZZLE_HOST_ID}}/containers/{{KUMA_SHORT_ID}}/logs?stdout&stderr&everything&filter=ERROR"
```

### GET /api/hosts/{host}/containers/{id}/logs/stream?stdout&stderr
Stream SSE de logs em tempo real. Mesmos parametros que acima.

### GET /api/events/stream
Stream SSE de eventos de containers (start, stop, die, etc).

## Formato de resposta
Cada linha eh um JSON:
```json
{
  "t": "single",
  "m": "mensagem do log (com ANSI codes)",
  "rm": "mensagem raw",
  "ts": 1772936261828,
  "id": 1254869195,
  "l": "unknown",
  "s": "stdout",
  "c": "{{OPENCLAW_SHORT_ID}}"
}
```
- `m` / `rm` — conteudo do log
- `ts` — timestamp em milliseconds
- `s` — "stdout" ou "stderr"
- `c` — short ID do container
