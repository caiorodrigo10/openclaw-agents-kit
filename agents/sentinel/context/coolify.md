# Coolify - Guia de Referencia

## O que e
Coolify e o orquestrador de containers do servidor. Funciona como uma alternativa self-hosted ao Heroku/Vercel.

## Acesso
- Painel: https://coolify.{{DOMAIN}}
- Gerencia: deploy, variaveis de ambiente, dominios, SSL, logs

## Conceitos importantes
- **Resource:** cada aplicacao/servico no Coolify
- **Environment Variables:** configuradas por resource, injetadas no container
- **Predefined Network:** rede `coolify` compartilhada entre todos os recursos
- **Connect To Predefined Network:** habilitar em Settings de cada resource para comunicacao interna

## Operacoes comuns
- **Restart:** no painel, clicar em Restart no resource
- **Redeploy:** Deployments > Rebuild
- **Logs:** no painel ou via Dozzle
- **Variaveis:** Environment Variables no painel do resource

## Cuidados
- Redeploy pode mudar o nome/IP do container
- Variaveis hardcoded no compose NAO aparecem no painel
- Variaveis com ${VAR} aparecem no painel
