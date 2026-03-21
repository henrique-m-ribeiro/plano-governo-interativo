---
name: validacao-dados
description: Executar validacao automatizada de artefatos de dados (JSON, CSV) com checklist quantitativo e comparacao contra fontes oficiais. Use sempre que um artefato de dados for gerado ou modificado pelo Claude Code e precisar ser validado no Cowork. Trigger quando o usuario mencionar "validar", "Bloco C", "checar dados", "verificar saida", "conferir JSON/CSV", ou quando uma etapa de execucao retornar do Claude Code.
---

# Validacao de Dados (Bloco C)

Skill para executar validacao automatizada de artefatos de dados no ambiente Cowork, como parte do Bloco C (Validacao) do ciclo de governanca ADR-010. A validacao garante que os dados gerados pelo Claude Code atendem aos criterios de qualidade antes de serem integrados (merge) ou usados em producao.

## Principio

Nenhuma conclusao sem evidencia de verificacao. Cada validacao produz um relatorio com resultado binario (APROVADO/REPROVADO) e detalhamento de cada criterio.

## Tipos de Validacao

### 1. Validacao Estrutural
Verifica integridade basica do artefato:
- Formato valido (JSON parseia, CSV abre sem erro)
- Encoding correto (UTF-8 BOM para CSVs, UTF-8 para JSONs)
- Contagem de registros (bate com o esperado)
- Campos obrigatorios nao-nulos
- Tipos de dados corretos (numeros sao numeros, strings sao strings)
- Ausencia de duplicatas na chave primaria

### 2. Validacao de Dominio
Verifica regras de negocio especificas do Tocantins:
- cod_ibge: 7 digitos, inicia com 17 (1700000–1799999)
- Total de municipios: 139 (nem mais, nem menos)
- Regionais SEPLAN: exatamente 8 (bico-do-papagaio, norte, meio-norte, vale-do-araguaia, central, jalapao, sul, sudeste)
- Macrorregionais: exatamente 3 (norte=65, centro=38, sul=36)
- Populacao > 0 para todos os municipios
- Centroides dentro do bounding box do Tocantins (lon: -51 a -45, lat: -14 a -5)

### 3. Validacao Cruzada
Compara o artefato gerado contra uma fonte oficial:
- Fonte: `regioes_planejamento_seplan_2024.json` para regionais
- Fonte: Censo 2022 para populacao
- Fonte: inventario-csvs-pipeline.json para cobertura de eixos
- Compara nome a nome, campo a campo
- Identifica divergencias de grafia (normalizar para comparacao)

## Processo de Validacao

### Passo 1 — Identificar o artefato e seus criterios
Ler o handoff original para entender:
- Qual arquivo validar (caminho exato)
- Quais criterios de sucesso foram definidos na checklist de entrega
- Qual fonte oficial usar para validacao cruzada

### Passo 2 — Escrever script de validacao
Criar um script Python que:
- Carrega o artefato gerado
- Carrega a fonte oficial (quando aplicavel)
- Executa cada criterio de validacao
- Imprime resultado com emoji (check/x) para cada criterio
- Imprime resultado final: APROVADO ou REPROVADO

Template de script:
```python
import json
from collections import Counter

# Carregar dados
with open("[caminho_artefato]", "r", encoding="utf-8") as f:
    data = json.load(f)

# Carregar fonte oficial (quando aplicavel)
with open("[caminho_fonte]", "r", encoding="utf-8") as f:
    oficial = json.load(f)

registros = data["[chave_lista]"]
total = len(registros)

print(f"=== VALIDACAO BLOCO C — [Nome do Artefato] ===\n")

# 1. Total de registros
print(f"1. Total: {total} {'ok' if total == [ESPERADO] else 'FALHA'}")

# 2. Duplicatas
chaves = [r["[chave_primaria]"] for r in registros]
dups = [c for c in chaves if chaves.count(c) > 1]
print(f"2. Duplicatas: {len(set(dups))} {'ok' if len(dups) == 0 else 'FALHA'}")

# ... demais criterios ...

# Comparacao cruzada (quando aplicavel)
# Construir mapas nome→atributos e comparar

print(f"\n=== RESULTADO FINAL ===")
print(f"{'APROVADO' if todas_ok else 'REPROVADO'}")
```

### Passo 3 — Executar e interpretar
Rodar o script no Bash do Cowork. Interpretar resultados:
- Se APROVADO: registrar em today.md, recomendar merge
- Se REPROVADO: identificar causa raiz, preparar instrucoes de correcao para Claude Code

### Passo 4 — Registrar resultado
Atualizar `memory/today.md` com:
- Numero do item de validacao (Bloco C)
- Resultado por criterio
- Ressalvas (se houver — ex: grafias divergentes)
- Recomendacao (merge, correcao, reexecucao)

## Classificacao de Severidade

| Severidade | Descricao | Acao |
|---|---|---|
| Critica | Contagem errada, duplicatas, dados faltantes | REPROVADO — reexecutar |
| Alta | Distribuicao regional errada, cod_ibge invalido | REPROVADO — corrigir |
| Media | Grafias divergentes, campo bonus ausente | APROVADO COM RESSALVA — corrigir antes do merge |
| Baixa | Ordem de campos, formatacao | APROVADO — corrigir quando conveniente |

## Licoes Aprendidas (Ciclo 4)

1. **Validacao cruzada e indispensavel:** A I-2 v1 passou na validacao estrutural mas falhou na cruzada (distribuicao regional errada). Sem a cruzada, teriamos integrado dados incorretos.
2. **Script > verificacao manual:** Scripts Python sao reprodutiveis e documentam os criterios. Verificacao manual e propensa a erro.
3. **Grafias importam:** 3 municipios com grafias diferentes entre Censo e SEPLAN causaram falsos negativos na comparacao. Normalizar (unicodedata) antes de comparar.
4. **Numeros concretos:** "25+15+25+15+14+9+17+19=139" e mais util que "distribuicao correta".

## Valor Academico (Pesquisa-Acao)

Cada validacao e um dado de pesquisa sobre:
- **PS1 (PA viabiliza IT-IA):** Qualidade dos dados fundacionais determina viabilidade do sistema
- **OE3 (transformacoes gestao):** O padrao de validacao sistematica pode ser transferido para gestao publica
- Registrar: criterios usados, taxa de aprovacao, tempo de validacao, causa raiz de falhas
