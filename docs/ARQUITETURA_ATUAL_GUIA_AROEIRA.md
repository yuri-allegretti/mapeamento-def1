# Arquitetura atual do Guia Aroeira

Versão documentada em 12 de agosto de 2026.

## Resumo

O projeto é uma aplicação web Next.js com App Router, React, TypeScript e Tailwind. O frontend é estático e consome um JSON gerado no build a partir da planilha consolidada. Não há banco de dados nem API própria nesta versão.

```text
import/estabelecimentos consolidado.xlsx
                ↓
scripts/import-establishments.mjs
                ↓ valida, classifica, deduplica e rastreia
src/data/generated/establishments.json
                ↓
src/data/index.ts → páginas e componentes
```

O build começa com `npm run import:data:check`; assim, uma alteração no XLSX que não tenha sido importada impede a publicação.

## Fonte consolidada

As três abas são obrigatórias e participam da publicação:

| Aba | Linhas brutas |
|---|---:|
| Estabelecimentos - Yuri | 40 |
| Estabelecimentos - Maia | 36 |
| Estabelecimentos - Ian | 48 |
| Total | 124 |

A identidade canônica é `nome normalizado + endereço normalizado`. A consolidação atual produz 110 estabelecimentos e 14 merges. Unidades de uma rede com endereços distintos permanecem separadas.

Em campos escalares, a precedência é Yuri, depois Maia e Ian. Categorias, fontes e referências de origem são unidas. Cada registro preserva aba e linha de todas as origens em `sourceRecords`. O relatório também grava o SHA-256 do XLSX.

## Dados publicados

O usuário pode visualizar, quando o campo existe na planilha:

- nome, tipo e categorias;
- endereço, cidade e estado;
- telefone e site;
- nota e quantidade de avaliações do Google Maps, acompanhadas da data de verificação;
- distância informada no levantamento;
- grupo de alimentação e faixa de ticket;
- endereço com ação para copiar e usar no aplicativo de navegação escolhido pelo usuário;
- fonte e data da última verificação.

Ausência é tratada como desconhecida: a interface não fabrica tempo de caminhada, preço, VR, modalidade de atendimento, fotografia, avaliação, telefone ou site.

Cobertura atual: 94 registros com avaliação, 78 com distância, 90 com telefone, 79 com site e 40 com Place ID. Todos os registros têm data de verificação `12/08/2026`.

## Categorias públicas

| Categoria primária | Registros |
|---|---:|
| Alimentação | 30 |
| Serviços | 19 |
| Educação | 11 |
| Academias e esportes | 8 |
| Supermercados | 7 |
| Praças e parques | 7 |
| Saúde | 6 |
| Farmácias | 6 |
| Bancos, correios e lotéricas | 6 |
| Postos | 4 |
| Shopping centers | 3 |
| Cultura | 2 |
| Hotéis | 1 |

O fluxo “Onde comer” usa a presença do perfil `food`, não somente a categoria primária. Por isso inclui 33 estabelecimentos: três registros também classificados como supermercado têm alimentação como categoria adicional. Desses 33, 21 possuem ticket.

## Contrato `Establishment`

O modelo público contém:

| Grupo | Campos principais |
|---|---|
| Identidade | `id`, `slug`, `legacySlugs`, `name` |
| Classificação | `type`, `primaryCategoryId`, `primaryCategoryLabel`, `categoryIds`, `categoryTags` |
| Local | `address`, `distanceMeters` |
| Contato | `phone`, `phoneUrl`, `websiteUrl` |
| Reputação | `rating.value`, `rating.reviewCount`, `rating.provider`, `rating.verifiedAt` |
| Alimentação | `food.group`, `food.ticket.min`, `food.ticket.max`, moeda BRL |
| Governança | `verifiedAt`, `sources`, `sourceRecords` |

IDs são hashes estáveis da identidade normalizada. Slugs legados relevantes são preservados como rota alternativa.

## Regras de importação

O importador bloqueia publicação quando falta uma aba, o cabeçalho muda, um campo estrutural obrigatório está vazio, uma URL é inválida, uma nota fica fora de 0–5 ou uma coordenada manual é inválida. Dados editoriais incompletos permanecem publicados como ausentes e geram pendências quando aplicável.

As categorias de alimentação são as linhas cuja `CATEGORIA 2` começa com `Alimentação`. A taxonomia das demais linhas é normalizada em treze categorias públicas. O valor original continua disponível em `type` e `categoryTags`.

Place IDs, coordenadas e URLs cartográficas eventualmente preservados no artefato gerado são metadados da importação e não são consumidos pela interface atual.

## Operação sem mapa

O guia não carrega biblioteca, tiles, geocodificação ou scripts de mapas. Por isso, não depende de chave de API, billing ou variável de ambiente para apresentar os estabelecimentos.

A localização é apresentada como endereço textual. A ação “Copiar endereço” usa a API de clipboard do navegador, com fallback local, para que o usuário escolha seu aplicativo de navegação. Busca, filtros, páginas de detalhe e distâncias informadas pela fonte continuam disponíveis.

## Páginas e estado atual

- `/guia`: entrada e destaques do levantamento;
- `/guia/onde-comer`: busca, filtros por grupo/ticket/distância, ordenação e catálogo responsivo;
- `/guia/regiao`: 110 registros com busca por nome/tipo/endereço e filtro por categoria;
- `/guia/estabelecimento/[slug]`: detalhe rastreável;
- `/guia/parceiros`: estado vazio honesto; não há parceiros cadastrados;
- `/guia/transporte`: conteúdo demonstrativo preservado até existir fonte real;
- `/guia/seja-parceiro`: formulário local demonstrativo, sem envio externo;
- `/guia/termos` e `/guia/privacidade`: condições públicas e transparência sobre a operação sem mapa.

## Atualização operacional

1. Substitua `import/estabelecimentos consolidado.xlsx` mantendo as três abas e o contrato de cabeçalhos.
2. Execute `npm run import:data`.
3. Revise `src/data/generated/import-report.json`, especialmente `merges` e `warnings`.
4. Execute lint, typecheck, testes e build.
5. Versione juntos o XLSX e os dois artefatos gerados.

## Limites conhecidos

- A versão atual não oferece mapa, cálculo de rota nem geocodificação.
- A distância é a fornecida no XLSX; não é recalculada como rota ou caminhada.
- Inconsistências editoriais presentes no XLSX são publicadas como recebidas, preservando rastreabilidade para correção na fonte.
- Não existe workflow editorial, banco de dados, autenticação ou atualização em tempo real.
- Transporte, candidatura e futuros benefícios ainda são demonstrações claramente separadas dos dados consolidados.
