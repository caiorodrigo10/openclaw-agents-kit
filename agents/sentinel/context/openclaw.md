# OpenClaw - Contexto para Infraestrutura

## Container
- **Nome:** {{OPENCLAW_CONTAINER}}
- **Path no container:** /app/
- **Config:** /root/.openclaw/openclaw.json

## Patches aplicados

### Patch: Comandos com prefixo : (colon)

O OpenClaw por padrao so aceita /comando no Slack. Este patch permite tambem :comando.

- **Script:** scripts/patch-colon-commands.py
- **Quando aplicar:** Apos CADA atualizacao do OpenClaw (os arquivos compilados sao substituidos)
- **Como rodar:** python3 /root/.openclaw/workspace-infra/scripts/patch-colon-commands.py
- **Verificar:** grep -c 'startsWith(":")' /app/dist/commands-registry-*.js (deve retornar >= 1)

### Pos-update checklist

Apos atualizar o OpenClaw:

1. Reaplicar patch colon commands: python3 scripts/patch-colon-commands.py
2. Verificar se Python3 esta instalado (entrypoint do docker-compose instala automaticamente)
3. Verificar se session.resetTriggers inclui :new e :reset no openclaw.json
4. Testar :new no Slack para confirmar
