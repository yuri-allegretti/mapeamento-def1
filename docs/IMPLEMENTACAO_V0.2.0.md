# Implementação v0.2.0 — dados consolidados, operação sem mapa e identidade Aroeira

Versão documentada em 12 de agosto de 2026.

## Resumo executivo

A versão `v0.2.0` transforma o protótipo estrutural do Guia Aroeira em uma aplicação alimentada pelo levantamento consolidado, operável sem Google Maps e visualmente alinhada ao Aroeira Office Park.

A arquitetura principal foi preservada: Next.js com App Router, React, TypeScript e Tailwind. Não foram adicionados banco de dados, API própria, autenticação ou serviço cartográfico. A interface continua mobile-first e utiliza os mesmos fluxos públicos, agora com uma identidade institucional consistente e ativos hospedados no próprio projeto.

Resultados principais:

- 124 linhas brutas conciliadas em 110 estabelecimentos;
- 33 estabelecimentos disponíveis em “Onde comer”;
- 21 registros de alimentação com faixa de ticket;
- dados simulados de estabelecimentos substituídos pelo XLSX consolidado;
- Google Maps e geocodificação removidos da execução da aplicação;
- endereço disponível para cópia e uso no navegador escolhido pelo usuário;
- logo, fotografias, paleta e tipografia institucional incorporadas;
- Montserrat auto-hospedada, sem dependência do Google Fonts;
- 122 páginas geradas no build;
- lint, TypeScript, testes, integridade dos dados e build aprovados.

## Escopo da entrega

Esta versão reúne três frentes que devem ser tratadas como uma única entrega:

1. importação e publicação da base consolidada de estabelecimentos;
2. retirada da dependência funcional do Google Maps;
3. repaginação completa de UX/UI baseada na identidade Aroeira.

Ficaram fora do escopo:

- mapa interativo ou estático de estabelecimentos;
- cálculo automático de rotas, caminhada ou distância;
- geocodificação em produção;
- cadastro administrativo;
- banco de dados e API própria;
- autenticação;
- envio real do formulário de parceria;
- publicação de benefícios sem validação formal;
- substituição dos dados demonstrativos de transporte.

## Arquitetura preservada

O fluxo de dados da versão permanece estático e rastreável:

```text
import/estabelecimentos consolidado.xlsx
                ↓
scripts/import-establishments.mjs
                ↓ valida, classifica, concilia e deduplica
src/data/generated/establishments.json
                ↓
src/data/index.ts
                ↓
páginas e componentes do App Router
```

O build começa com `npm run import:data:check`. Dessa forma, uma alteração no XLSX que não tenha sido importada impede a geração de uma versão inconsistente.

Não houve mudança nas rotas públicas:

- `/guia`;
- `/guia/onde-comer`;
- `/guia/regiao`;
- `/guia/parceiros`;
- `/guia/transporte`;
- `/guia/seja-parceiro`;
- `/guia/estabelecimento/[slug]`;
- `/guia/termos`;
- `/guia/privacidade`.

## Dados consolidados

A fonte canônica dos estabelecimentos é `import/estabelecimentos consolidado.xlsx`.

O importador:

- exige as três abas previstas no levantamento;
- valida os cabeçalhos e os campos estruturais;
- normaliza nomes, endereços, telefones, URLs e categorias;
- concilia registros por nome e endereço normalizados;
- preserva as referências de aba e linha em `sourceRecords`;
- gera IDs estáveis e slugs públicos;
- mantém slugs legados relevantes;
- calcula o hash SHA-256 do arquivo de origem;
- registra merges, cobertura e pendências no relatório de importação.

Artefatos versionados:

- `src/data/generated/establishments.json`;
- `src/data/generated/import-report.json`;
- arquivos de apoio e origem existentes em `import/`.

Os dados apresentados ao usuário podem incluir, quando informados pela fonte:

- nome e tipo;
- categoria primária e categorias adicionais;
- endereço, cidade e estado;
- telefone e site;
- avaliação, quantidade de avaliações, provedor e data de verificação;
- distância informada no levantamento;
- grupo de alimentação;
- faixa de ticket;
- fontes e data da última verificação.

Campos ausentes não são inventados ou estimados pela interface.

## Operação sem mapa

A aplicação não carrega Google Maps, tiles, SDK cartográfico ou serviço de geocodificação.

Mudanças implementadas:

- remoção do componente de mapa dos fluxos de alimentação, região e detalhe;
- remoção do comando público `import:data:geocode`;
- remoção das variáveis Google do `.env.example`;
- substituição da ação “Como chegar” por “Copiar endereço”;
- reorganização das telas para dedicar o espaço do mapa ao catálogo;
- busca por nome, tipo e endereço na página Região;
- atualização de termos, privacidade e documentação operacional.

O componente `CopyAddressButton` usa a API de clipboard do navegador e possui fallback local. O feedback informa sucesso ou falha e retorna ao estado inicial após 2,5 segundos.

Place IDs, URLs e coordenadas eventualmente preservados nos artefatos de origem não são consumidos pela interface atual.

## Identidade visual

A direção de arte combina arquitetura corporativa, natureza, produtividade e sustentabilidade.

### Ativos

Os ativos são mantidos em `public/brand`:

- `aroeira-logo.jpeg`;
- `aroeira-fachada-angulo.png`;
- `aroeira-fachada-principal.png`;
- `aroeira-equipe.png`.

A logo fornecida na raiz foi copiada para a pasta pública. As imagens institucionais foram armazenadas localmente para evitar hotlink e permitir otimização responsiva pelo `next/image`.

A logo atual é um JPEG com fundo branco. Ela funciona nos headers e footer brancos, mas uma versão futura deverá preferencialmente usar SVG ou PNG transparente oficial.

### Tipografia

A interface utiliza Montserrat em pesos variáveis de 100 a 900. O arquivo WOFF2 está em `src/app/fonts/montserrat-latin.woff2` e é carregado com `next/font/local`.

Consequências:

- nenhuma requisição ao Google Fonts no navegador;
- build funcional sem acesso à rede;
- melhor consistência tipográfica entre plataformas;
- prevenção de troca visual tardia da fonte.

### Paleta

| Token | Valor | Aplicação |
|---|---|---|
| `--forest` | `#243e1e` | botões, títulos e elementos principais |
| `--forest-strong` | `#172b13` | fundos escuros e hover |
| `--forest-soft` | `#487d3b` | bordas e elementos secundários |
| `--brand-green` | `#6cbb59` | indicadores e destaques |
| `--leaf-strong` | `#a5d29b` | bordas suaves e estados |
| `--brand-green-pale` | `#c8e8c0` | seleção e superfícies claras |
| `--leaf` | `#e8f4e5` | fundos institucionais claros |
| `--sun` | `#ffc354` | foco e destaques sobre fundos escuros |
| `--gold` | `#9a6710` | textos de apoio e eyebrows |
| `--ink` | `#2a2a2a` | texto principal |
| `--muted` | `#626960` | texto secundário |
| `--soft` | `#f5f7f4` | superfícies neutras |
| `--line` | `#dfe5dc` | divisores e bordas |

O verde escuro é utilizado em botões com texto branco. O verde vivo fica reservado a indicadores, superfícies e detalhes, preservando contraste de leitura.

### Componentes visuais

Foram criados ou consolidados padrões para:

- botões primário, secundário, claro e transparente;
- campos de formulário;
- cards estáticos e interativos;
- títulos auxiliares em caixa alta;
- fundos orgânicos derivados das camadas verdes da logo;
- sombras discretas;
- raios de borda entre 12 e 16 pixels;
- ícones vetoriais consistentes;
- estados de foco visíveis;
- avisos de dados reais e demonstrativos.

Os componentes `BrandLogo` e `GuideIcon` centralizam o uso da marca e dos ícones.

## Navegação

### Desktop

O header desktop passou a ser fixo durante a rolagem, com:

- logo horizontal;
- fundo branco translúcido;
- sombra discreta;
- indicação da rota ativa;
- CTA “Seja parceiro”.

### Mobile

O header mobile mantém a prioridade de tela pequena e apresenta:

- logo completa em proporção preservada;
- botão de retorno quando aplicável;
- identificação compacta da página atual.

A barra inferior foi mantida com os mesmos quatro destinos, substituindo símbolos por ícones vetoriais. O estado ativo usa indicador verde e mantém área mínima de toque adequada.

## Páginas repaginadas

### Início

- hero com fotografia da fachada e gradiente para legibilidade;
- hierarquia tipográfica institucional;
- painel de públicos em superfície translúcida;
- atalhos com ícones;
- bloco empresarial com padrão orgânico;
- CTA real para `https://www.aroeiraofficepark.com/`.

### Onde comer

- abertura com fundo institucional orgânico;
- pesquisa com ícone;
- filtros rápidos em chips;
- filtros avançados em painel arredondado;
- grid ampliado após a remoção do mapa;
- cards com ticket, distância, endereço e ações mais legíveis.

### Região

- hero arquitetônico;
- indicadores numéricos em cards;
- busca por nome, tipo ou endereço;
- categorias com contadores e estado ativo;
- grid responsivo de estabelecimentos;
- CTA institucional externo.

### Detalhe do estabelecimento

- capa abstrata baseada na identidade, sem simular fotografia do local;
- informações verificadas em blocos escaneáveis;
- localização textual em superfície orgânica;
- ação de copiar endereço em destaque;
- estabelecimentos relacionados com navegação preservada.

### Parceiros

- estado vazio institucional e honesto;
- ícone, explicação e CTA para candidatura;
- nenhum benefício demonstrativo apresentado como real.

### Seja parceiro

- fotografia corporativa no hero;
- fluxo de três etapas;
- contrapartidas e exemplos em fundo institucional;
- formulário demonstrativo visualmente integrado;
- FAQs mantidas em elementos nativos `details`.

### Transporte

- conteúdo demonstrativo preservado;
- cards e linhas modernizados;
- representação estrutural arredondada;
- avisos continuam deixando claro que os dados não são oficiais.

### Páginas legais e estados

Termos, privacidade, erro 404, estado vazio e estado de erro receberam a mesma tipografia, paleta, cards, botões e padrões de foco.

## Mobile-first e acessibilidade

A estrutura mobile-first foi preservada. Os estilos para telas maiores continuam sendo extensões progressivas por breakpoint.

Cuidados implementados:

- áreas interativas com altura mínima entre 44 e 48 pixels;
- contraste reforçado em botões principais;
- foco visível em links, botões e campos;
- navegação sem mapa ou localização do dispositivo;
- labels e nomes acessíveis nos campos;
- `aria-current` na navegação ativa;
- feedback com `aria-live` na cópia de endereço;
- avisos com papéis semânticos adequados;
- respeito a `prefers-reduced-motion`;
- imagens institucionais com texto alternativo;
- ausência de fotografias falsas nos estabelecimentos.

## Dependências externas

A interface não depende, durante sua execução, de:

- Google Maps;
- Google Geocoding;
- Google Fonts;
- arquivos hospedados no Wix.

O site institucional é utilizado apenas como destino de links explicitamente acionados pelo usuário.

O `.env` local permanece ignorado pelo Git. Nenhuma credencial é necessária para executar esta versão e nenhuma credencial faz parte da entrega versionada.

## Verificações executadas

```bash
npm run import:data:check
npm run lint
npm run typecheck
npm test
npm run build
```

Resultados registrados:

- importação verificada: 110 estabelecimentos e 33 em “Onde comer”;
- ESLint sem erros;
- TypeScript sem erros;
- 5 arquivos de teste aprovados;
- 15 testes aprovados;
- build de produção aprovado;
- 122 páginas geradas;
- rotas principais e uma rota de estabelecimento responderam HTTP 200;
- logo e imagens institucionais responderam HTTP 200;
- HTML final sem referências a Google Maps, Google Fonts ou Wix.

## Execução local

Desenvolvimento:

```bash
npm install
npm run dev
```

A aplicação estará disponível em `http://localhost:3000/guia`.

Produção local em porta alternativa:

```bash
npm run build
npm start -- -p 3001
```

A aplicação estará disponível em `http://localhost:3001/guia`.

## Atualização dos estabelecimentos

```bash
npm run import:data
npm run import:data:check
npm test
npm run build
```

Após `import:data`, revise `src/data/generated/import-report.json`, especialmente os merges, avisos, contagens e cobertura dos campos.

## Limitações conhecidas

- a versão atual não possui mapa ou cálculo de rota;
- distâncias são as fornecidas no XLSX;
- avaliações e contagens preservam o provedor informado na fonte;
- a logo disponível é JPEG, não vetor transparente;
- as imagens institucionais de origem são otimizadas pelo Next.js durante a entrega, mas os arquivos-fonte permanecem no repositório;
- transporte e candidatura continuam demonstrativos;
- não há parceiros ou benefícios ativos;
- não existe workflow editorial ou atualização em tempo real.

## Nota de release

`v0.2.0` é a primeira versão do Guia Aroeira que combina a base consolidada real, operação independente de mapas e identidade visual institucional. Ela estabelece a fundação para futuras integrações de parcerias, transporte oficial e manutenção editorial sem comprometer a experiência atual.
