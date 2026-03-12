# Tarefa: Verificar Backups

## Objetivo
Checar se os backups estao funcionando e atualizados.

## Status atual
- Backups ainda nao estao configurados automaticamente
- Volumes Docker contem os dados persistentes de cada servico

## Volumes criticos
- `openclaw-data` — configuracoes e sessoes do OpenClaw
- Volumes do Plane (db, minio) — dados de projetos
- Volume do Uptime Kuma — configuracoes de monitoramento

## Recomendacoes
- Configurar backup automatico dos volumes Docker
- Priorizar: banco de dados do Plane, config do OpenClaw
- Sugerir ao usuario implementar backup via Coolify ou script cron

## TODO
- [ ] Definir estrategia de backup com o usuario
- [ ] Configurar backup automatico
- [ ] Testar restauracao
