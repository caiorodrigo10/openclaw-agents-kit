# Tarefa: Verificar Logs

## Objetivo
Investigar logs de um container para diagnosticar problemas.

## Como fazer

### Via Dozzle (interface web)
O Dozzle requer autenticacao. Oriente o usuario a:
1. Acessar https://dozzle.{{DOMAIN}}
2. Fazer login
3. Selecionar o container desejado
4. Filtrar por termos como ERROR, FATAL, OOM

### Via Healthcheck (verificar se Dozzle esta vivo)
```bash
wget -q -O /dev/null -S http://{{DOZZLE_CONTAINER}}:8080/healthcheck 2>&1 | grep "HTTP/"
```

### O que procurar nos logs
- `ERROR`, `FATAL`, `PANIC` — erros criticos
- `OOM` — falta de memoria
- `connection refused` — servico nao acessivel
- `permission denied` — problema de permissao
- `crash loop` — container reiniciando repetidamente
- `ENOSPC` — disco cheio

### Alternativa: monitorar via Kuma
Se o servico esta DOWN no Kuma mas nao temos acesso aos logs, reportar ao usuario:
- Qual servico esta DOWN
- Desde quando (baseado no Kuma)
- Sugerir verificar logs via Dozzle web ou SSH
