# Guia Aroeira — MVP estrutural

Aplicação Next.js com App Router, TypeScript e Tailwind para validar os fluxos do Guia Aroeira Office Park.

## Executar localmente

```bash
npm install
npm run dev
```

Acesse `http://localhost:3000/guia`.

## Verificações

```bash
npm run lint
npm run typecheck
npm test
npm run build
npm start
```

## Dados

- `src/data/establishments.ts`: nomes e endereços de referência das abas lidas, enriquecidos com campos demonstrativos.
- `src/data/partners.ts`: parcerias e benefícios totalmente simulados.
- `src/data/transit.ts`: pontos e linhas evidentemente demonstrativos.
- `src/data/index.ts`: camada pequena de acesso substituível futuramente.

Todos os registros enriquecidos possuem `isSimulated: true`. Caminhada, VR, posições cartográficas, transporte, benefícios e parte dos tickets são identificados como simulados na interface.

## Limites do MVP

- Sem integração com planilha, My Maps, mapas, rotas ou transporte oficial.
- O mapa é uma representação estrutural local e não exibe distância em linha reta.
- O formulário usa um adaptador demonstrativo e não envia dados externamente.
- Fotografias usam placeholders.
- O CTA institucional aguarda o destino fornecido pela agência responsável.
