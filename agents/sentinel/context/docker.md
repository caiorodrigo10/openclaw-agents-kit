# Docker - Rede e Containers

## Rede coolify
- Subnet: {{DOCKER_SUBNET}}
- Todos os servicos conectados via "Connect To Predefined Network" no Coolify
- DNS: usar nome COMPLETO do container (ex: `{{KUMA_CONTAINER}}`)
- Nomes curtos NAO resolvem no DNS

## Containers ativos (referencia)
```
{{OPENCLAW_CONTAINER}}   -> {{DOCKER_SUBNET_OPENCLAW_IP}}
{{KUMA_CONTAINER}} -> {{DOCKER_SUBNET_KUMA_IP}}
{{DOZZLE_CONTAINER}}      -> {{DOCKER_SUBNET_DOZZLE_IP}}
{{PLANE_API_CONTAINER}}         -> {{DOCKER_SUBNET_PLANE_API_IP}} (Plane API)
{{PLANE_WEB_CONTAINER}}         -> {{DOCKER_SUBNET_PLANE_WEB_IP}} (Plane Web)
```
Nota: IPs podem mudar apos redeploy. Verificar com:
`docker network inspect coolify`

## Volumes
- `openclaw-data` — dados do OpenClaw (/root/.openclaw)
- Cada servico tem seu proprio volume gerenciado pelo Coolify

## Comandos uteis
- `docker ps` — listar containers rodando
- `docker logs <container>` — ver logs
- `docker exec -it <container> sh` — acessar shell do container
- `docker stats` — uso de CPU/memoria em tempo real
