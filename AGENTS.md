# ApexFit — regras de design system

## Estrutura e componentes

- O projeto usa Next.js App Router, React, TypeScript e Tailwind CSS.
- Componentes básicos reutilizáveis ficam em `src/components/ui/`; componentes compartilhados do produto ficam em `src/components/`.
- Use nomes de componentes em PascalCase, exportações nomeadas e o alias `@/` para imports internos.
- IMPORTANTE: reutilize componentes de `src/components/ui/` antes de criar controles equivalentes em páginas ou features.
- Preserve Server Components por padrão; adicione `"use client"` somente quando houver interação ou API exclusiva do navegador.

## Identidade ApexFit

- Os tokens de marca estão em `src/app/globals.css` e são expostos no Tailwind como `apex.*` por `tailwind.config.ts`.
- Cores oficiais: fundo `apex-background`, azul-marinho `apex-navy`, azul de ação `apex-blue`, sucesso `apex-green` e atenção `apex-orange`.
- IMPORTANTE: não escreva novos valores hexadecimais de marca nos componentes. Use tokens semânticos ou classes `apex-*`.
- Cards usam `rounded-card`, `bg-apex-surface` e `shadow-card`; controles usam `rounded-control`.
- Prefira bordas suaves, superfícies brancas, contraste alto e hierarquia visual limpa para uso em ambiente de academia.
- A tipografia deve permanecer legível em telas pequenas, com peso forte apenas em títulos, métricas e ações prioritárias.

## Interação e acessibilidade

- Toda ação de toque deve usar `tap-feedback`; controles personalizados também devem usar `focus-app`.
- Painéis inferiores devem reutilizar `src/components/ui/drawer.tsx`; mensagens transitórias devem usar `sonner` com o `Toaster` global.
- Alvos de toque prioritários devem ter pelo menos 44 × 44 px.
- Respeite `prefers-reduced-motion`, navegação por teclado e contraste WCAG AA.
- Ícones decorativos devem usar `aria-hidden`; botões somente com ícone precisam de `aria-label`.

## Fluxo Figma → código

1. Obtenha o contexto estruturado do nó exato no Figma.
2. Obtenha uma captura visual da mesma variante.
3. Trate o código retornado pelo Figma como referência de design, não como padrão arquitetural final.
4. Traduza cores, raios, espaçamento e sombras para os tokens do ApexFit.
5. Reutilize componentes existentes e preserve os padrões de dados, autenticação e rotas.
6. Valide a implementação em 390 × 844 e em desktop, comparando-a com a referência antes de concluir.

## Qualidade

- Mudanças visuais não podem alterar regras de negócio, ações do servidor nem acesso ao banco sem solicitação explícita.
- Execute `npm run lint` e `npm run build` antes de entregar uma fase.
- Para fluxos interativos, valide estados padrão, carregando, vazio, sucesso, erro, foco e desabilitado.
