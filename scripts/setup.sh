#!/bin/bash
# Setup script for OpenClaw Agents Kit
# This script prepares the environment for onboarding

set -e

echo "========================================="
echo "  OpenClaw Agents Kit - Setup Inicial"
echo "========================================="
echo ""

# Check if .env exists
if [ ! -f .env ]; then
    echo "Criando .env a partir do template..."
    cp .env.example .env
    echo "⚠️  Edite o arquivo .env com suas API keys antes de continuar."
    echo ""
fi

# Check Docker
if ! command -v docker &> /dev/null; then
    echo "❌ Docker nao encontrado. Instale o Docker primeiro."
    exit 1
fi

echo "✅ Docker encontrado: $(docker --version)"

# Check if OpenClaw is running
if docker ps --format '{{.Names}}' | grep -q openclaw; then
    echo "✅ OpenClaw container encontrado"
else
    echo "⚠️  OpenClaw nao esta rodando. Inicie o container primeiro."
fi

echo ""
echo "Setup basico concluido."
echo "Proximo passo: Inicie uma conversa com o Forge no Slack."
echo "Ele vai ler o ONBOARDING.md e guiar voce pelo resto do setup."
echo ""
