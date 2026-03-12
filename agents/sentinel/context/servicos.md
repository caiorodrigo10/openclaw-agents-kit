# Servicos no Servidor

## Servicos monitorados pelo Uptime Kuma

| ID | Servico | URL publica | Tipo |
|---|---|---|---|
| 1 | Coolify | https://coolify.{{DOMAIN}} | Orquestrador Docker |
| 2 | Infisical | https://infiscal.{{DOMAIN}} | Gestao de segredos |
| 3 | OpenClaw | https://openclaw.{{DOMAIN}} | Agentes IA (nos) |
| 4 | Trigger.dev | https://trigger.{{DOMAIN}} | Automacao de jobs |
| 5 | Plane | https://plane.{{DOMAIN}} | Gestao de projetos |
| 6 | n8n | https://n8n.{{DOMAIN}} | Automacao de workflows |
| 7 | Mautic | https://mautic.{{DOMAIN}} | Marketing automation |
| 8 | Affine | https://affine.{{DOMAIN}} | Documentos/whiteboard |
| 9 | Dozzle | https://dozzle.{{DOMAIN}} | Visualizador de logs |

## Detalhes por servico

### OpenClaw (este servidor)
- **Funcao:** Plataforma de agentes IA com Slack
- **Imagem:** ghcr.io/openclaw/openclaw:latest
- **URL interna:** {{DOCKER_SUBNET_OPENCLAW_IP}}
- **Container:** {{OPENCLAW_CONTAINER}}
- **Agentes:** Main, RD, Gerente de Projetos, Head de Marketing, Alex Hormozi, Infra

### Uptime Kuma
- **Funcao:** Monitoramento de uptime/disponibilidade de 9 servicos
- **URL interna:** http://{{KUMA_CONTAINER}}:3001
- **API:** /metrics (Prometheus, auth via API key)
- **Acesso programatico:** SIM — ver TOOLS.md

### Dozzle
- **Funcao:** Visualizador de logs Docker em tempo real
- **URL interna:** http://{{DOZZLE_CONTAINER}}:8080
- **Healthcheck:** /healthcheck (sem auth)
- **API de logs:** requer autenticacao (Simple Auth)
- **Acesso programatico:** PARCIAL — apenas healthcheck sem auth

### Plane
- **Funcao:** Gestao de projetos (alternativa Jira/Linear)
- **URL interna:** http://{{PLANE_API_CONTAINER}}:8000
- **Healthcheck:** GET / retorna {"status": "OK"}
- **Componentes:** api, web, space, admin, live, worker, beat-worker, db, redis, mq, minio, proxy

### Coolify
- **Funcao:** Orquestrador de containers (gerencia todos os servicos)
- **URL:** https://coolify.{{DOMAIN}}
- **Versao:** v4.0.0-beta.463

### Infisical
- **Funcao:** Gestao de segredos e variaveis de ambiente

### Trigger.dev
- **Funcao:** Plataforma de automacao de background jobs

### n8n
- **Funcao:** Automacao de workflows (alternativa Zapier)

### Mautic
- **Funcao:** Marketing automation (email, campanhas, segmentacao)

### Affine
- **Funcao:** Docs + whiteboard colaborativo (alternativa Notion)
