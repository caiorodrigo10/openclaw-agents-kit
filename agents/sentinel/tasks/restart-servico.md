# Tarefa: Restart de Servico

## Objetivo
Reiniciar um servico com seguranca e verificar que voltou.

## Procedimento
1. Informar ao usuario qual servico sera reiniciado e por que
2. Sugerir que o usuario faca pelo painel do Coolify:
   - Acessar https://coolify.{{DOMAIN}}
   - Encontrar o resource do servico
   - Clicar em Restart
3. Aguardar ~30 segundos
4. Verificar se voltou (ver `checar-status.md`)

## Cuidados
- Restart do OpenClaw pode desconectar Slack temporariamente
- Restart do Plane afeta multiplos containers (api, worker, etc)
- Nunca fazer restart sem informar o usuario primeiro
- Anotar horario do restart para referencia

## Alternativa via CLI (se usuario tiver acesso SSH)
```bash
docker restart <nome-do-container>
```
