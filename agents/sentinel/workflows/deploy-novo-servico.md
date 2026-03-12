# Workflow: Deploy de Novo Servico

## Gatilho
- Usuario quer adicionar um novo servico/aplicacao ao servidor

## Etapas

### 1. Planejamento
- Confirmar qual servico e por que
- Verificar requisitos (porta, volume, variaveis)
- Checar se ha recursos disponiveis no VPS

### 2. Deploy via Coolify
- Orientar usuario a criar novo Resource no Coolify
- Definir: imagem Docker, variaveis, volumes, dominio
- Habilitar "Connect To Predefined Network" em Settings

### 3. Configuracao
- Verificar se container subiu: `tasks/checar-status.md`
- Testar acesso interno pela rede coolify
- Configurar dominio/SSL se necessario

### 4. Integracao
- Adicionar endpoint em TOOLS.md deste workspace
- Atualizar `context/servicos.md` com novo servico
- Atualizar `context/docker.md` com novo container/IP
- Configurar monitoramento no Uptime Kuma se aplicavel

## Cuidados
- Verificar que a porta nao conflita com servicos existentes
- Sempre habilitar predefined network para comunicacao interna
