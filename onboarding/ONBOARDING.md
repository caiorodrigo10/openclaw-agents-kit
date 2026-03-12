# ONBOARDING.md — Setup Inicial

_Este arquivo guia o Forge no setup inicial do seu ambiente de agentes. Apos conclusao, este arquivo deve ser deletado._

> **Instrucoes para o Forge:** Leia cada passo sequencialmente. Para cada passo, envie as perguntas ao cliente via Slack/chat, aguarde as respostas, execute as acoes descritas e so entao avance para o proximo passo. Nunca pule passos. Se o cliente nao souber responder algo, registre como "pendente" e siga em frente — retorne aos itens pendentes antes do Passo 7 (Validacao).

---

## Passo 1: Dados da empresa

Forge deve perguntar ao usuario:

- Nome da empresa → `{{COMPANY_NAME}}`
- Dominio principal (ex: empresa.com.br) → `{{DOMAIN}}`
- Dominio interno (se houver, ex: internal.empresa.local) → `{{INTERNAL_DOMAIN}}`
- Nome do decisor principal (quem aprova mudancas criticas) → `{{DECISION_MAKER}}`
- Slack ID do decisor (ex: U01ABC123) → `{{DECISION_MAKER_SLACK_ID}}`
- Membros da equipe (nome + Slack ID para cada membro)

**Formato sugerido para coletar membros da equipe:**
```
Nome: Joao Silva | Slack ID: U01XYZ789 | Papel: Dev Backend
Nome: Maria Santos | Slack ID: U02ABC456 | Papel: Dev Frontend
```

**Se o cliente nao souber o Slack ID:** Forge instrui — "Clique no perfil da pessoa no Slack > Mais opções > Copiar ID do membro."

**Apos coletar, Forge atualiza os seguintes arquivos de TODOS os agentes:**

- `USER.md` — dados do decisor e equipe (nomes, Slack IDs, papeis)
- `IDENTITY.md` — nome da empresa (`{{COMPANY_NAME}}`) e dominio (`{{DOMAIN}}`)
- `AGENTS.md` — governanca (quem aprova mudancas, cadeia de escalacao)

**Verificacao:** Forge confirma com o cliente: _"Registrei os dados da empresa. Confira: [resumo]. Esta correto?"_

---

## Passo 2: Stack tecnologica

Forge pergunta:

- Provedor de hosting (Coolify, Vercel, Railway, Fly.io, AWS, DigitalOcean, outro) → `{{HOSTING_PLATFORM}}`
- Modelo primario de IA (ex: claude-sonnet-4-20250514, gpt-4o) → `{{PRIMARY_MODEL}}`
- Modelo default/fallback (ex: claude-haiku-4-20250414, gpt-4o-mini) → `{{DEFAULT_MODEL}}`
- Versao do OpenClaw em uso → `{{OPENCLAW_VERSION}}`

**Perguntas complementares (se aplicavel):**

- Se usa Coolify: URL do painel Coolify e credenciais de acesso
- Se usa Docker diretamente: como os containers sao orquestrados (docker-compose, Swarm, Kubernetes)
- Se usa serverless (Vercel/Railway): como os deploys sao feitos (git push, CLI, CI/CD)

**Forge atualiza:**

- `CONTEXT.md` de todos os agentes — stack tecnologica, hosting, modelos de IA
- Se o cliente usa Coolify, Forge tambem atualiza `TOOLS.md` do Sentinel com endpoints do Coolify

**Verificacao:** Forge confirma: _"Stack registrada: hosting em {{HOSTING_PLATFORM}}, modelo primario {{PRIMARY_MODEL}}, fallback {{DEFAULT_MODEL}}. Correto?"_

---

## Passo 3: Task Manager

Forge pergunta: _"Qual ferramenta de gestao de tarefas voce usa?"_

### Opcao A: Plane (self-hosted)

Se o cliente usa Plane:

1. **Forge verifica** se o plugin Plane esta em `extensions/plane/` ou `extensions-plane/`
   - Se nao encontrar, Forge avisa: _"O plugin do Plane nao esta instalado. Preciso que voce o instale antes de continuar este passo."_
   - Forge fornece instrucoes de instalacao se necessario

2. **Forge pede as informacoes:**
   - URL da API do Plane (interna Docker, ex: `http://plane-api:8000`) → `{{PLANE_API_URL}}`
   - URL externa do Plane (para links, ex: `https://plane.empresa.com.br`) → `{{PLANE_EXTERNAL_URL}}`
   - Workspace slug (ex: `minha-empresa`) → `{{PLANE_WORKSPACE}}`
   - Credenciais do banco PostgreSQL do Plane:
     - Host → `{{PLANE_DB_HOST}}`
     - Port → `{{PLANE_DB_PORT}}` (default: 5432)
     - User → `{{PLANE_DB_USER}}`
     - Password → `{{PLANE_DB_PASSWORD}}`
     - Database → `{{PLANE_DB_NAME}}`

3. **Forge cria API keys no Plane para cada agente** (Forge, Sentinel, Flare)
   - Cada agente deve ter sua propria API key para rastreabilidade
   - Forge registra qual key pertence a qual agente

4. **Forge atualiza `openclaw.json`** com as API keys de cada agente
   - Formato: `"plane_api_key": "{{KEY}}"` dentro do bloco de cada agente

5. **Forge cria os estados customizados no projeto principal:**

   | Estado | Tipo | Emoji |
   |--------|------|-------|
   | Ideia | backlog | :bulb: |
   | Planejamento | unstarted | :triangular_ruler: |
   | Construcao | started | :wrench: |
   | Validacao | started | :test_tube: |
   | Ativo | completed | :white_check_mark: |
   | Pausado | cancelled | :pause_button: |
   | Descontinuado | cancelled | :wastebasket: |

   - Se o projeto ja tiver estados customizados, Forge pergunta se deve substituir ou manter os existentes

6. **Forge atualiza `TOOLS.md` de todos os agentes** com identidade Plane:
   - Endpoints da API
   - Workspace e projeto default
   - Mapeamento de estados

7. **Forge verifica** que consegue listar projetos via API
   - Se falhar, Forge reporta o erro e pede ao cliente para verificar credenciais/rede

### Opcao B: ClickUp

Se o cliente usa ClickUp:

1. **Forge instrui o cliente a instalar o MCP server do ClickUp:**
   - Repositorio: `mcp-clickup` (npm)
   - Comando: `npm install -g mcp-clickup` ou adicionar ao `package.json`
   - Configurar `CLICKUP_API_TOKEN` no `.env`
   - Forge pergunta: _"Voce ja tem uma API key do ClickUp? Se nao, va em Settings > Apps > Generate API Token."_

2. **Forge atualiza `openclaw.json`** para usar MCP tools em vez de plugin Plane:
   - Remove configuracao do Plane (se existir)
   - Adiciona bloco MCP para ClickUp com o token

3. **Forge atualiza `TOOLS.md` de todos os agentes:**
   - Remove secao "Plane" (se existir) e substitui por secao "ClickUp via MCP"
   - Documenta as tools MCP disponiveis:
     - `create_task` — criar tarefa
     - `list_tasks` — listar tarefas
     - `update_task` — atualizar tarefa
     - `get_task` — obter detalhes de tarefa
     - `delete_task` — deletar tarefa
     - `create_list` — criar lista
     - `get_spaces` — listar espacos
   - Inclui exemplos de uso para cada tool

4. **Forge atualiza `CONTEXT.md`** — "Task Manager: ClickUp (via MCP)"

5. **Forge verifica** que o MCP server esta respondendo:
   - Tenta listar espacos/tarefas como teste
   - Se falhar, Forge orienta o cliente a verificar o token e a instalacao

### Opcao C: Trello

Se o cliente usa Trello:

1. **Forge instrui o cliente a instalar o MCP server do Trello:**
   - Repositorio: `mcp-trello` (npm) ou equivalente
   - Configurar `TRELLO_API_KEY` e `TRELLO_TOKEN` no `.env`
   - Forge instrui: _"Va em https://trello.com/power-ups/admin para gerar suas chaves."_

2. **Forge atualiza `openclaw.json`** para usar MCP tools do Trello

3. **Forge atualiza `TOOLS.md` de todos os agentes:**
   - Remove secao de outro task manager (se existir)
   - Adiciona secao "Trello via MCP"
   - Documenta tools MCP disponiveis (create_card, list_cards, move_card, etc.)

4. **Forge atualiza `CONTEXT.md`** — "Task Manager: Trello (via MCP)"

5. **Forge verifica** que consegue listar boards como teste

### Opcao D: Linear

Se o cliente usa Linear:

1. **Forge instrui o cliente a instalar o MCP server do Linear:**
   - Repositorio: `mcp-linear` (npm) ou equivalente
   - Configurar `LINEAR_API_KEY` no `.env`

2. **Forge atualiza `openclaw.json`** e todos os agentes (mesma logica das opcoes anteriores)

3. **Forge verifica** que consegue listar projetos/issues como teste

### Opcao E: Jira

Se o cliente usa Jira:

1. **Forge instrui o cliente a instalar o MCP server do Jira:**
   - Repositorio: `mcp-jira` ou Atlassian MCP server
   - Configurar `JIRA_URL`, `JIRA_EMAIL`, `JIRA_API_TOKEN` no `.env`

2. **Forge atualiza `openclaw.json`** e todos os agentes

3. **Forge verifica** que consegue listar projetos como teste

### Opcao F: GitHub Projects

Se o cliente usa GitHub Projects:

1. **Forge verifica** se o MCP server do GitHub ja esta configurado
2. Configura acesso ao GitHub Projects via GraphQL API
3. Atualiza todos os agentes

### Opcao G: Outro / Nenhum

1. Forge pergunta qual ferramenta especifica
2. Forge pesquisa se existe MCP server para ela (busca no npm, GitHub, registros de MCP servers)
3. **Se existe MCP server:**
   - Forge fornece instrucoes de instalacao
   - Configura `openclaw.json` com o MCP server
   - Atualiza todos os agentes
4. **Se nao existe MCP server:**
   - Forge documenta que o cliente precisara criar integracao manual
   - Forge cria um placeholder em `TOOLS.md` com a estrutura esperada
   - Forge sugere alternativas que tem integracao pronta
5. **Se o cliente nao usa nenhuma ferramenta:**
   - Forge sugere adotar Plane (self-hosted, gratuito, integrado ao kit)
   - Se o cliente recusar, Forge desabilita as funcionalidades de task management nos agentes
   - Forge registra em `CONTEXT.md`: "Task Manager: Nenhum (gestao manual)"
6. Atualiza todos os agentes conforme a decisao

---

## Passo 4: Monitoramento (Sentinel)

Forge pergunta: _"Voce usa Dozzle e Uptime Kuma para monitoramento?"_

### Se sim (ambos):

1. **Forge pede:**
   - Container name do Dozzle → `{{DOZZLE_CONTAINER}}` (ex: `dozzle`)
   - Container name do Uptime Kuma → `{{KUMA_CONTAINER}}` (ex: `uptime-kuma`)
   - API key do Kuma (em base64) → `{{KUMA_API_KEY_BASE64}}`
     - Forge instrui: _"Va em Settings > API Keys no Uptime Kuma. Copie a key e converta para base64."_
     - Forge pode oferecer: _"Me passe a key em texto e eu converto para base64."_
   - Credenciais do Dozzle:
     - Usuario → `{{DOZZLE_USER}}`
     - Senha → `{{DOZZLE_PASSWORD}}`
   - URL interna do Dozzle (ex: `http://dozzle:8080`) → `{{DOZZLE_URL}}`
   - URL interna do Kuma (ex: `http://uptime-kuma:3001`) → `{{KUMA_URL}}`
   - Lista de servicos monitorados:
     ```
     Nome: API Principal | URL: https://api.empresa.com.br | Container: api-prod
     Nome: Frontend | URL: https://app.empresa.com.br | Container: frontend-prod
     Nome: Banco de Dados | Container: postgres-prod
     ```

2. **Forge atualiza:**
   - `agents/sentinel/TOOLS.md` com endpoints corretos do Dozzle e Kuma
   - `agents/sentinel/tasks/` com os containers corretos para monitorar
   - `agents/sentinel/scripts/` com credenciais corretas
   - `agents/sentinel/context/` com arquitetura real (servicos, URLs, containers)

3. **Forge verifica:**
   - Sentinel consegue acessar a API do Kuma (listar monitores)
   - Sentinel consegue acessar o Dozzle (listar containers)
   - Se algum falhar, Forge reporta e pede ao cliente para verificar

### Se parcial (apenas um dos dois):

1. **Se tem apenas Dozzle:**
   - Forge coleta credenciais do Dozzle
   - Forge sugere instalar Uptime Kuma: _"Recomendo instalar o Uptime Kuma para monitoramento de uptime. Posso fornecer o docker-compose."_
   - Se o cliente aceitar, Forge fornece o docker-compose e instrui a instalacao
   - Forge adapta o Sentinel para operar apenas com Dozzle ate o Kuma ser instalado

2. **Se tem apenas Uptime Kuma:**
   - Forge coleta credenciais do Kuma
   - Forge sugere instalar Dozzle: _"Recomendo instalar o Dozzle para visualizacao de logs. Posso fornecer o docker-compose."_
   - Forge adapta o Sentinel para operar apenas com Kuma ate o Dozzle ser instalado

### Se nao (nenhum dos dois):

1. Forge pergunta: _"Quais ferramentas de monitoramento voce usa?"_

2. **Se o cliente usa outras ferramentas** (Grafana, Prometheus, Datadog, New Relic, etc.):
   - Forge pesquisa se existe MCP server ou API acessivel
   - Forge adapta o Sentinel:
     - Remove secoes de Dozzle/Kuma do `TOOLS.md`
     - Adiciona secoes para as ferramentas do cliente
     - Atualiza tasks e scripts conforme necessario
     - Documenta endpoints, credenciais e formatos de resposta

3. **Se o cliente nao tem monitoramento:**
   - Forge sugere instalar Dozzle + Uptime Kuma:
     _"Para que o Sentinel funcione corretamente, recomendo instalar o Dozzle (logs) e o Uptime Kuma (uptime). Ambos sao gratuitos e leves. Posso fornecer os docker-compose files."_
   - Se o cliente aceitar, Forge fornece os docker-compose files e instrui a instalacao
   - Se o cliente recusar, Forge desabilita as tasks de monitoramento do Sentinel e registra:
     - `CONTEXT.md`: "Monitoramento: Nenhum (Sentinel operando em modo limitado)"
     - `TOOLS.md` do Sentinel: remove ferramentas de monitoramento

---

## Passo 5: Comunicacao (Slack)

Forge pergunta:

- Workspace do Slack (ex: `minha-empresa.slack.com`) → `{{SLACK_WORKSPACE}}`
- Canais onde os agentes vao operar (ex: `#ops-agents`, `#alerts`, `#general`) → `{{SLACK_CHANNELS}}`
- Se ja tem Slack Apps criados para cada agente (Forge, Sentinel, Flare)

### Se ja tem apps criados:

1. Forge coleta para cada agente:
   - Bot Token (`xoxb-...`) → `{{AGENT_BOT_TOKEN}}`
   - App Token (`xapp-...`) → `{{AGENT_APP_TOKEN}}`
   - Bot User ID → `{{AGENT_BOT_USER_ID}}`

2. Forge atualiza `openclaw.json` com as accounts Slack de cada agente

3. Forge verifica que cada bot consegue enviar mensagem de teste no canal principal

### Se nao tem apps criados:

1. **Forge fornece o template de manifest YAML para cada agente:**

   Forge gera um manifest personalizado para cada agente contendo:
   - Nome do bot (ex: `Forge - {{COMPANY_NAME}}`)
   - Descricao
   - Escopos OAuth necessarios:
     - `chat:write` — enviar mensagens
     - `channels:read` — ler canais
     - `channels:history` — ler historico
     - `reactions:read` — ler reacoes
     - `reactions:write` — adicionar reacoes
     - `users:read` — ler usuarios
     - `files:read` — ler arquivos
     - `files:write` — enviar arquivos
   - Socket Mode habilitado
   - Event subscriptions configuradas

2. **Forge instrui o cliente passo a passo:**
   - _"Va em https://api.slack.com/apps e clique em 'Create New App'"_
   - _"Selecione 'From an app manifest' e cole o YAML que enviei"_
   - _"Instale o app no workspace"_
   - _"Va em 'OAuth & Permissions' e copie o Bot User OAuth Token"_
   - _"Va em 'Basic Information' > 'App-Level Tokens' e gere um token com scope 'connections:write'"_
   - _"Me envie os tokens aqui"_

3. **Forge repete para cada agente** (Forge, Sentinel, Flare)

4. **Forge coleta os tokens e atualiza `openclaw.json`**

5. **Forge instrui o cliente a adicionar os bots aos canais:**
   - _"Va em cada canal e digite /invite @NomeDoBot"_

6. **Forge verifica** que cada bot responde no canal

### Canais recomendados:

Forge sugere a seguinte estrutura de canais (se o cliente ainda nao tiver):
- `#ops-agents` — canal principal dos agentes (operacoes, comunicacao inter-agente)
- `#ops-alerts` — alertas do Sentinel (incidentes, degradacao)
- `#ops-deploys` — notificacoes de deploy
- `#ops-logs` — logs relevantes

---

## Passo 6: Autenticacao de modelos

Forge pede:

- API key do Anthropic → `ANTHROPIC_API_KEY`
  - _"Esta key sera usada pelo modelo primario (Claude). Va em https://console.anthropic.com/settings/keys para gerar."_
  - **Obrigatoria** se o modelo primario for Claude

- (Opcional) API key do Google AI / Gemini → `GEMINI_API_KEY`
  - _"Se voce usa Gemini como fallback. Va em https://aistudio.google.com/apikey para gerar."_

- (Opcional) API key do OpenRouter → `OPENROUTER_API_KEY`
  - _"O OpenRouter permite acessar multiplos modelos com uma unica key. Va em https://openrouter.ai/keys para gerar."_

- (Opcional) Ollama configurado localmente? → `OLLAMA_URL`
  - Se sim, Forge pede a URL (ex: `http://ollama:11434` ou `http://localhost:11434`)
  - Forge verifica quais modelos estao disponiveis via `GET /api/tags`

**Forge atualiza:**

- `.env` com as API keys (usando nomes de variaveis padronizados)
- `auth-profiles.json` de cada agente — perfis de autenticacao por provedor
- `models.json` de cada agente — mapeamento de qual modelo usar para qual tarefa

**Regras de seguranca:**
- Forge NUNCA exibe API keys em canais publicos do Slack
- Forge solicita que o cliente envie as keys via DM ou canal privado
- Forge confirma: _"Recebi as keys. Vou configura-las nos arquivos .env. Nunca vou exibi-las em texto."_

**Verificacao:**
- Forge faz uma chamada de teste para cada provedor configurado
- Forge confirma: _"Modelo {{PRIMARY_MODEL}} respondendo corretamente. Fallback {{DEFAULT_MODEL}} tambem OK."_
- Se algum falhar, Forge reporta o erro especifico (key invalida, modelo nao encontrado, rate limit, etc.)

---

## Passo 7: Validacao

Forge executa o checklist de validacao completo. Para cada item, Forge reporta o resultado ao cliente em tempo real.

### Checklist:

- [ ] **Forge responde no Slack** — Forge envia mensagem de teste no canal principal
- [ ] **Sentinel consegue consultar metricas do monitoramento** — Sentinel lista monitores/containers
- [ ] **Flare responde no Slack** — Flare envia mensagem de teste
- [ ] **Task manager esta conectado** — Forge cria uma issue de teste, verifica que aparece, e deleta
- [ ] **Modelos de IA estao respondendo** — Forge faz chamada de teste ao modelo primario e fallback
- [ ] **Comunicacao inter-agente funciona** — Forge envia mensagem via `sessions_send` para Sentinel e Flare, ambos respondem

### Se algum item falhar:

1. Forge identifica o problema especifico
2. Forge tenta resolver automaticamente (ex: corrigir URL, reconectar)
3. Se nao conseguir resolver, Forge reporta ao cliente com instrucoes claras:
   _"O item X falhou porque [motivo]. Para resolver: [passos]."_
4. Forge aguarda o cliente resolver e retesta

### Se todos os itens passarem:

Forge envia mensagem de confirmacao:
_"Todos os checks passaram! O ambiente esta pronto para uso."_

---

## Passo 8: Limpeza

Apos tudo validado:

1. **Forge confirma com o decisor:**
   _"Setup completo. Todos os agentes estao operacionais. Posso deletar o arquivo ONBOARDING.md?"_

2. **Se sim:**
   - Forge deleta este arquivo (`onboarding/ONBOARDING.md`)
   - Forge remove o diretorio `onboarding/` se estiver vazio

3. **Se nao:**
   - Forge mantém o arquivo e pergunta: _"Quer que eu mantenha como referencia? Posso move-lo para um diretorio de docs."_

4. **Forge registra na memoria:**
   - `"Onboarding concluido em DD/MM/YYYY"`
   - Resumo do setup: empresa, stack, task manager, monitoramento, agentes ativos

5. **Forge envia mensagem final no canal principal:**
   _"Onboarding concluido com sucesso. Todos os agentes estao operacionais. Bom trabalho, equipe!"_

---

## Apendice: Troubleshooting rapido

### Problemas comuns durante o onboarding:

| Problema | Causa provavel | Solucao |
|----------|---------------|---------|
| Bot nao responde no Slack | Token invalido ou bot nao adicionado ao canal | Verificar token, usar /invite @bot |
| API do Plane retorna 401 | API key invalida ou expirada | Gerar nova key no painel do Plane |
| Modelo retorna erro 429 | Rate limit atingido | Aguardar ou usar modelo fallback |
| Sentinel nao acessa Dozzle | URL interna incorreta ou container parado | Verificar docker network e status do container |
| MCP server nao conecta | Pacote nao instalado ou configuracao incorreta | Reinstalar pacote e verificar .env |
| Comunicacao inter-agente falha | Sessions nao configuradas em openclaw.json | Verificar bloco "sessions" no openclaw.json |

### Ordem de prioridade se houver problemas:

1. Slack (comunicacao basica)
2. Modelos de IA (capacidade de raciocinio)
3. Task manager (gestao de trabalho)
4. Monitoramento (observabilidade)
5. Comunicacao inter-agente (coordenacao)

---

_Fim do onboarding. Bom trabalho._
