#!/usr/bin/env python3
"""
patch-colon-commands.py
Aplica patch para suportar comandos com prefixo : (alem de /) no OpenClaw.

QUANDO USAR: Apos cada atualizacao do OpenClaw, os arquivos compilados sao substituidos
e o patch se perde. Rode este script para reaplicar.

O QUE FAZ: Em todos os arquivos commands-registry-*.js, adiciona uma linha que converte
:comando para /comando antes do processamento. Isso permite que usuarios usem :new, :model,
:status etc. no Slack (alem do padrao /new, /model, /status).

COMO RODAR:
  python3 /root/.openclaw/workspace-infra/scripts/patch-colon-commands.py

VERIFICAR SE JA ESTA APLICADO:
  grep -c 'startsWith(":")' /app/dist/commands-registry-*.js
  (deve retornar 1 ou mais para cada arquivo)
"""

import os
import glob

PATCH_LINE = 'if (trimmed.startsWith(":") && /^:[a-zA-Z]/.test(trimmed)) return normalizeCommandBody("/" + raw.trim().slice(1), options); '
OLD = 'if (!trimmed.startsWith("/")) return trimmed;'
NEW = PATCH_LINE + OLD

files = glob.glob("/app/dist/commands-registry-*.js")

if not files:
    print("ERRO: Nenhum arquivo commands-registry-*.js encontrado em /app/dist/")
    print("Verifique se o container OpenClaw esta rodando e o path esta correto.")
    exit(1)

patched = 0
already = 0
failed = 0

for f in sorted(files):
    name = os.path.basename(f)
    with open(f, "r") as fh:
        content = fh.read()

    if PATCH_LINE in content:
        print(f"  {name}: ja aplicado ✓")
        already += 1
        continue

    if OLD not in content:
        print(f"  {name}: string alvo nao encontrada ✗")
        failed += 1
        continue

    content = content.replace(OLD, NEW, 1)

    with open(f, "w") as fh:
        fh.write(content)

    print(f"  {name}: patch aplicado ✓")
    patched += 1

print(f"\nResultado: {patched} aplicados, {already} ja tinham, {failed} falharam")
print(f"Total de arquivos: {len(files)}")

if failed > 0:
    print("\nATENCAO: Alguns arquivos falharam. Pode ser que a versao do OpenClaw mudou o formato.")
    print("Verifique manualmente se a funcao normalizeCommandBody ainda existe nesses arquivos.")
