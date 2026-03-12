# OpenClaw Agents Kit

Kit de onboarding para configuracao e deploy de agentes de IA com o OpenClaw.

## O que e este kit

Este repositorio contem a estrutura base para operar tres agentes de IA integrados ao Slack:

- **Forge** (R&D) — Agente de desenvolvimento e engenharia de software. Escreve codigo, gerencia repositorios, executa comandos e resolve issues.
- **Sentinel** (Infra) — Agente de infraestrutura e DevOps. Monitora containers, gerencia deploys, verifica saude dos servicos e responde a incidentes.
- **Flare** (Head de Marketing) — Agente de marketing e conteudo. Pesquisa tendencias, gera textos, cria roteiros de audio e gerencia campanhas.

## Quick Start

```bash
# 1. Clone o repositorio
git clone <repo-url> && cd openclaw-agents-kit

# 2. Execute o setup inicial
chmod +x scripts/setup.sh
./scripts/setup.sh

# 3. Edite o .env com suas API keys
nano .env

# 4. Configure o openclaw.json a partir do template
cp openclaw.template.json openclaw.json
# Substitua todos os {{PLACEHOLDER}} pelos valores reais

# 5. Inicie o OpenClaw e converse com o Forge no Slack
# Ele vai guiar voce pelo resto do onboarding
```

## Estrutura de Diretorios

```
openclaw-agents-kit/
├── .env.example              # Template de variaveis de ambiente
├── .gitignore
├── openclaw.template.json    # Template de configuracao do OpenClaw
├── README.md
├── scripts/
│   └── setup.sh              # Script de setup inicial
└── agents/
    ├── forge/
    │   ├── system.md          # System prompt do Forge
    │   └── memory/            # Memoria persistente (gitignored)
    ├── sentinel/
    │   ├── system.md          # System prompt do Sentinel
    │   └── memory/
    └── flare/
        ├── system.md          # System prompt do Flare
        └── memory/
```

## Processo de Onboarding

1. Execute o `scripts/setup.sh` para preparar o ambiente
2. Configure as variaveis de ambiente no `.env`
3. Gere o `openclaw.json` a partir do template, preenchendo os placeholders
4. Inicie o container do OpenClaw
5. Envie uma mensagem para o Forge no Slack — ele ira ler o `ONBOARDING.md` e guiar voce pelos proximos passos, incluindo configuracao dos demais agentes

## Requisitos

- **Docker** (com Docker Compose)
- **OpenClaw** container configurado e rodando
- **Workspace no Slack** com apps/bots criados para cada agente
- **API Key** de pelo menos um provedor de IA (Anthropic recomendado)

## Licenca

Uso interno. Distribuicao restrita aos clientes da operacao OpenClaw.
