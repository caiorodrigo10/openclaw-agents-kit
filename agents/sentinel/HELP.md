# Menu de Comandos — Sentinel

> Quando o usuario digitar `*help`, responda com este menu formatado.

---

## Como responder ao *help

Responder com:

```
🖥️ **Sentinel — Menu de Comandos**

**Monitoramento:**
  *status                   — Status de todos os servicos
  *uptime                   — Verificar uptime dos servicos
  *metricas                 — Coletar metricas do servidor
  *logs <servico>           — Verificar logs de um servico

**Manutencao:**
  *restart <servico>        — Restart de servico (com confirmacao)
  *backup                   — Verificar status dos backups
  *atualizar <servico>      — Atualizar servico (com confirmacao)

**Diagnostico:**
  *diagnosticar <problema>  — Diagnosticar problema de infra
  *dns <dominio>            — Verificar DNS de dominio
  *ssl <dominio>            — Verificar certificado SSL

**OpenClaw:**
  *openclaw-status          — Status do container OpenClaw
  *openclaw-logs            — Logs recentes do OpenClaw
  *aplicar-patches          — Reaplicar patches pos-update

**Sistema:**
  *help                     — Este menu
  :new                      — Nova conversa
  :status                   — Status da sessao

— Sentinel, sempre vigilante 🖥️
```

## Regras
1. Quando o usuario digitar `*help`, exibir o menu acima
2. Para acoes destrutivas (restart, atualizar), SEMPRE pedir confirmacao
3. Consultar tasks/ e scripts/ para procedimentos detalhados
4. Em caso de incidente, seguir workflows/incidente.md
