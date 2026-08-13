# Guia Aroeira Office Park

Aplicação Next.js (App Router), TypeScript e Tailwind que publica o levantamento consolidado de estabelecimentos do entorno do Aroeira Office Park.

## Executar localmente

```bash
npm install
npm run dev
```

Acesse `http://localhost:3000/guia`. A versão atual funciona sem mapa, chave de API ou variável de ambiente. Endereços podem ser copiados para o aplicativo de navegação escolhido pelo usuário.

## Fonte e importação

A fonte exclusiva dos estabelecimentos é `import/estabelecimentos consolidado.xlsx`. As três abas obrigatórias são importadas, validadas e conciliadas por nome + endereço normalizados.

```bash
npm run import:data          # regenera JSON e relatório versionados
npm run import:data:check    # falha se XLSX e artefatos divergirem
```

Artefatos gerados:

- `src/data/generated/establishments.json`: modelo consumido pela interface;
- `src/data/generated/import-report.json`: contagens, merges, hash da fonte e pendências;
O build executa a verificação de sincronia antes do Next.js. Place IDs e coordenadas eventualmente presentes nos artefatos são mantidos apenas como dados de origem e não são consumidos pela interface atual.

## Verificações

```bash
npm run lint
npm run typecheck
npm test
npm run build
```

## Escopo atual

- 124 linhas brutas conciliadas em 110 estabelecimentos;
- 33 estabelecimentos no fluxo “Onde comer”, dos quais 21 têm ticket informado;
- 0 parcerias ativas: a página correspondente apresenta estado vazio;
- transporte e formulário de candidatura continuam explicitamente demonstrativos;
- catálogo sem mapa, com busca, filtros, endereços e ação para copiar o endereço.

## Identidade visual

A interface usa a identidade do Aroeira Office Park com Montserrat auto-hospedada, paleta institucional e ativos locais em `public/brand`. A logo e as imagens não dependem do Wix ou do Google Fonts em tempo de execução. O CTA institucional direciona para `https://www.aroeiraofficepark.com/`.

Veja [docs/ARQUITETURA_ATUAL_GUIA_AROEIRA.md](docs/ARQUITETURA_ATUAL_GUIA_AROEIRA.md) para o contrato de dados e as decisões da versão.
