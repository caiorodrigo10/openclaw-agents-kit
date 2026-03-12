#\!/bin/bash
# Healthcheck rapido de todos os servicos
# Executar no host via SSH

echo "=== Healthcheck $(date) ==="
echo ""

# Containers rodando
echo "--- Containers ---"
docker ps --format "table {{.Names}}\t{{.Status}}" | grep -E "(openclaw|uptime-kuma|dozzle|plane|coolify)" | sort

echo ""
echo "--- Uso de recursos ---"
docker stats --no-stream --format "table {{.Name}}\t{{.CPUPerc}}\t{{.MemUsage}}" | grep -E "(openclaw|uptime-kuma|dozzle|plane)" | sort

echo ""
echo "--- Disco ---"
df -h / | tail -1

echo ""
echo "=== Fim ==="
