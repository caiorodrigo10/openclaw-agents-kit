# Arquitetura do Servidor

## Hardware/VPS
- **Provedor:** Hetzner (VPS)
- **SO:** Ubuntu 22.04 (Ubuntu-2204-jammy-amd64-base)
- **Kernel:** Linux 5.15.0-164-generic

## Dominios
- `coolify.{{DOMAIN}}` — painel Coolify
- `openclaw2.{{DOMAIN}}` — OpenClaw gateway/UI
- Outros dominios configurados no Coolify para cada servico

## Orquestrador
- **Coolify** v4.0.0-beta.463
- Gerencia todos os containers via Docker Compose
- Proxy reverso integrado (Traefik/Caddy)
- SSL automatico via Coolify

## Stack
- Docker como runtime de containers
- Rede predefinida `coolify` para comunicacao inter-servicos
- Volumes Docker para persistencia de dados
