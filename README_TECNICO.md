## OBJETIVO

Este projeto implementa o sistema ApexFit. Nesta alteração, o objetivo foi substituir a marca textual exibida como "UNASP" no logo principal por "CENAPE", mantendo o mesmo papel visual no layout.

## STACK TECNOLÓGICA

- Next.js (App Router)
- React
- TypeScript
- Tailwind CSS

## INTEGRAÇÕES & APIs

- Autenticação via NextAuth em rotas `src/app/api/auth/[...nextauth]`.
- Não houve alteração em integrações externas, endpoints ou contratos de API.

## CONFIGURAÇÕES (ENV/BUILD)

- Variáveis de ambiente permanecem sem alteração.
- Build e execução seguem os mesmos comandos já usados no projeto.
- Não houve inclusão de dependências.

## SEGURANÇA & PRIVACIDADE (DLP)

- Sem exposição de credenciais.
- Sem mudanças em fluxo de dados sensíveis.
- Alteração restrita à camada de apresentação do logo.

## ARQUITETURA & LÓGICA

### Frontend

- Arquivo alterado: `src/components/unasp-logo.tsx`.
- O componente `UnaspLogo` deixou de renderizar imagem estática e passou a renderizar marca textual `CENAPE` com classes utilitárias Tailwind.
- Interface do componente foi simplificada com remoção da propriedade `priority`, que era específica da tag `Image`.
- O consumo em `src/components/brand-mark.tsx` permanece compatível, pois a propriedade `className` foi preservada.

### Backend

- Sem alterações.

## INTERFACE & UX

- O texto principal de marca visual passa a ser `CENAPE`.
- O destaque permanece em estilo de alta hierarquia visual (peso forte, caixa alta, tracking ajustado).
- Acessibilidade: o elemento contém `aria-label="Logo CENAPE"`.
