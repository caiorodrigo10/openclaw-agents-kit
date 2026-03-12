# Comandos — {AGENT_NAME}

Todos os comandos usam prefixo * (ex: *help).
NAO listar comandos CLI do OpenClaw quando o usuario pedir *help.

```yaml
# Comandos do {AGENT_NAME} — All commands require * prefix
commands:

  # [Categoria Principal]
  - name: help
    visibility: [full, quick, key]
    description: 'Mostrar todos os comandos disponiveis'

  - name: comando-1
    visibility: [full, quick, key]
    description: 'Descricao da acao principal'
    args: '<arg-obrigatorio> [--flag-opcional]'
    task: task-correspondente.md

  - name: comando-2
    visibility: [full, quick, key]
    description: 'Descricao de outra acao importante'
    args: '<arg>'

  # [Categoria Secundaria]
  - name: comando-3
    visibility: [full, quick]
    description: 'Descricao da acao'
    task: task-correspondente.md

  - name: comando-4
    visibility: [full]
    description: 'Acao menos frequente'

  # Utilidades
  - name: guide
    visibility: [full]
    description: 'Guia completo de uso do {AGENT_NAME}'

  - name: status
    visibility: [full, quick]
    description: 'Status resumido'

  # Sistema (comandos nativos — sem *)
  # :new — Nova conversa
  # :model — Trocar modelo
  # :status — Status da sessao
```

## Guidelines para definir comandos

### Visibility tiers:
- `key` — Aparece no greeting (3-5 comandos essenciais)
- `quick` — Aparece no menu rapido
- `full` — Aparece no *help completo

### Regras:
1. Minimo 8, maximo 20 comandos
2. 3-5 categorias logicas
3. Nomes em kebab-case: *criar-projeto, *analisar-dados
4. Cada comando mapeia para UMA acao clara
5. Se tem task file, linkar com `task: nome-do-arquivo.md`
6. Args: <obrigatorio> [--opcional]
7. Categoria "Utilidades" com *guide e *status sempre presente
8. Assinatura com nome + emoji do agente

### Como exibir *help:
Exibir TODOS os comandos agrupados por categoria:
```
{AGENT_EMOJI} **{AGENT_NAME} — Menu de Comandos**

**[Categoria]:**
  *comando <args>     — Descricao

Digite *guide para instrucoes detalhadas.
— {AGENT_NAME} {AGENT_EMOJI}
```

### Como exibir no greeting:
Exibir apenas comandos com visibility `key`:
```
{AGENT_EMOJI} {AGENT_NAME} pronto. {AGENT_ROLE}.

**Comandos principais:** *cmd1  *cmd2  *cmd3

Digite *help para ver todos os comandos.
```

### Como executar *comandos:
1. Recebeu *<comando> → verificar se tem task: no YAML
2. Se tem task → ler tasks/<arquivo>.md e executar
3. Se nao tem task → executar diretamente com tools
4. Ao completar → sugerir proximo passo
5. Comando nao existe → sugerir o mais proximo
