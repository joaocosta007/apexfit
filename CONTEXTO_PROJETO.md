# Contexto completo do projeto ApexFit

> Documento vivo de referência técnica, funcional e operacional.  
> Última atualização: 26 de agosto de 2026.

## 1. Visão geral

O **ApexFit** é um sistema de gestão de treinos para academia, desenvolvido com foco principal em celulares. Ele conecta três perfis: gerente, professor e aluno.

O sistema foi vendido para uma academia e está em fase inicial de produção. A previsão informada é de aproximadamente **250 alunos**, distribuídos entre manhã, tarde e noite, com cerca de **80 pessoas presentes por período**, sem uso totalmente simultâneo.

Não existe meio de pagamento dentro do aplicativo. Cobranças e contratos da academia são tratados fora do sistema.

### Objetivos do produto

- Centralizar alunos, professores e vínculos entre eles.
- Permitir que professores criem e mantenham fichas de treino.
- Permitir que alunos executem o treino e registrem as cargas utilizadas.
- Acompanhar evolução, avaliações físicas e frequência de treino.
- Enviar lembretes e comunicações operacionais.
- Oferecer uma experiência mobile moderna, simples e institucional.

## 2. Estado atual

- Aplicação publicada em produção na Vercel.
- Banco PostgreSQL hospedado no Supabase.
- Código versionado no GitHub.
- Envio de e-mails configurado pelo Resend.
- Relatórios automáticos enviados ao Telegram às 8h e às 22h.
- Build, rota de monitoramento, integração Telegram e workflow do GitHub testados com sucesso.

### Endereços principais

- Produção: <https://apexfit-unasp.vercel.app>
- Repositório: <https://github.com/joaocosta007/apexfit>
- Workflow de monitoramento: `Relatório do ApexFit no Telegram`

## 3. Identidade visual

A interface atual segue a identidade moderna definida para o ApexFit:

- Design mobile-first.
- Fundo geral cinza muito claro (`#f5f7fb`).
- Cards brancos, bordas discretas, sombras suaves e cantos arredondados.
- Azul-marinho (`#0d2342`) como cor institucional principal.
- Azul vivo para ações, navegação e estados ativos.
- Verde para sucesso e conclusão.
- Laranja para atenção, sequência e avaliações pendentes.
- Ícones lineares da biblioteca Lucide.
- Navegação inferior fixa para o aluno.
- Marca com ícone de halter e nome **ApexFit**.
- Interface e mensagens em português do Brasil.

As telas foram reformuladas para se aproximar de um aplicativo nativo de academia, evitando aparência de dashboard financeiro ou produto gamer.

## 4. Perfis e permissões

### Gerente (`MANAGER`)

- Acessa o painel gerencial.
- Visualiza professores cadastrados.
- Cadastra professores.
- Abre os detalhes de cada professor.
- Visualiza alunos vinculados ao professor.
- Remove professores.

### Professor (`TRAINER`)

- Visualiza seus alunos e indicadores de treino.
- Cadastra ou vincula alunos.
- Gera link de convite para cadastro de aluno.
- Remove o vínculo com um aluno.
- Cria e edita o plano de treino de cada aluno.
- Define nome, tipo e dias do plano.
- Administra divisões de treino, como A, B, C e adicionais.
- Adiciona e remove exercícios.
- Seleciona exercícios do catálogo.
- Pode escrever um exercício personalizado quando ele não existe no catálogo.
- Define séries, repetições, carga e descanso.
- Envia lembretes por notificação push.
- Registra avaliações físicas.
- Consulta a anamnese preenchida pelo aluno.
- Cria, renomeia, edita, aplica e exclui modelos de treino.

### Aluno (`STUDENT`)

- Acessa o treino do dia após o login.
- Visualiza divisão, exercícios, séries, repetições, carga e descanso.
- Consulta demonstrações em vídeo quando disponíveis.
- Usa cronômetro de descanso com iniciar, pausar e reiniciar.
- Marca e registra exercícios concluídos.
- Informa a carga efetivamente utilizada.
- Consulta última carga e evolução.
- Visualiza dashboard com resumo de treino.
- Consulta histórico e gráficos de progresso.
- Consulta avaliações físicas.
- Preenche e atualiza a anamnese.
- Pode ativar notificações push em dispositivo compatível.

## 5. Funcionalidades gerais

- Login com e-mail e senha.
- Sessão JWT e redirecionamento baseado no perfil.
- Proteção de rotas por perfil.
- Cadastro de aluno por convite com validade.
- Verificação de e-mail.
- Reenvio de verificação de e-mail.
- Recuperação e redefinição de senha por link com validade.
- Senhas armazenadas com hash bcrypt.
- Validação de formulários com Zod.
- Mensagens de erro amigáveis para o usuário.
- Revalidação das páginas após alterações no servidor.
- Notificações push por Web Push/VAPID.
- E-mails transacionais pelo Resend.
- Catálogo interno de exercícios por grupo muscular.
- Exercícios personalizados fora do catálogo.
- Links de vídeo do YouTube associados a determinados exercícios.
- Relatório operacional pelo Telegram.

## 6. Rotas do sistema

### Públicas e autenticação

| Rota | Finalidade |
|---|---|
| `/` | Identifica a sessão e redireciona para o perfil correto. |
| `/login` | Login no sistema. |
| `/forgot-password` | Solicitação de recuperação de senha. |
| `/reset-password` | Redefinição por token recebido por e-mail. |
| `/cadastro/[token]` | Cadastro de aluno por convite. |
| `/api/auth/[...nextauth]` | API do NextAuth. |
| `/api/verify-email` | Confirma o e-mail por token. |
| `/api/resend-verification` | Reenvia o e-mail de verificação. |

### Gerente

| Rota | Finalidade |
|---|---|
| `/manager` | Painel e lista de professores. |
| `/manager/trainers/new` | Cadastro de professor. |
| `/manager/[trainerId]` | Detalhes do professor e seus alunos. |

### Professor

| Rota | Finalidade |
|---|---|
| `/trainer` | Painel principal e lista de alunos. |
| `/trainer/students/new` | Cadastro ou vínculo de aluno. |
| `/trainer/workouts/[studentId]` | Plano, exercícios, anamnese e avaliações do aluno. |
| `/trainer/templates` | Lista de modelos de treino. |
| `/trainer/templates/new` | Criação de modelo. |
| `/trainer/templates/[templateId]` | Edição de um modelo. |

### Aluno

| Rota | Finalidade |
|---|---|
| `/student/dashboard` | Resumo geral do aluno. |
| `/student/workouts/today` | Execução do treino do dia. |
| `/student/progress` | Histórico e evolução de cargas. |
| `/student/assessments` | Avaliações físicas. |
| `/student/anamnese` | Cadastro e edição da anamnese. |

### APIs internas

| Rota | Finalidade |
|---|---|
| `/api/push/subscribe` | Cadastra ou remove assinatura de notificação push. |
| `/api/cron/telegram-report` | Gera e envia o relatório protegido ao Telegram. |

## 7. Fluxos importantes

### Login e redirecionamento

1. Usuário informa e-mail e senha.
2. O NextAuth busca o usuário no PostgreSQL.
3. A senha é comparada com o hash bcrypt.
4. O perfil é gravado no JWT.
5. O sistema direciona:
   - gerente para `/manager`;
   - professor para `/trainer`;
   - aluno para `/student/workouts/today`.

### Cadastro por convite

1. O professor gera um link de cadastro.
2. O sistema cria um `InviteToken` com prazo de expiração.
3. O aluno abre `/cadastro/[token]`.
4. O cadastro cria ou valida o usuário e estabelece o vínculo com o professor.
5. O token é marcado como usado.

### Recuperação de senha

1. O usuário informa seu e-mail.
2. O sistema sempre apresenta uma resposta neutra, sem revelar se a conta existe.
3. Para contas existentes, tokens antigos são removidos.
4. Um novo `PasswordResetToken` é criado com validade de uma hora.
5. O Resend envia o link de redefinição.
6. Após a alteração, o token é invalidado.

### Registro de treino

1. O aluno abre o treino correspondente ao dia da semana.
2. Cada exercício pode ser concluído individualmente.
3. A carga utilizada é informada.
4. É criado um `WorkoutLog` por exercício concluído, e não por série.
5. Os registros alimentam histórico, frequência e evolução.

### Exercício personalizado

Ao adicionar um exercício, o professor pode selecionar um item do catálogo ou escolher a opção de exercício personalizado e escrever um nome que não esteja na lista. Nesse caso, `catalogId` fica vazio e o nome informado é preservado.

## 8. Arquitetura técnica

### Stack

- Next.js 16 com App Router.
- React 18.
- TypeScript em modo estrito.
- Tailwind CSS.
- Componentes baseados no padrão Shadcn/Radix.
- Lucide React para ícones.
- Recharts para gráficos.
- PostgreSQL.
- Prisma ORM 5.
- NextAuth com provedor de credenciais.
- Zod para validações.
- bcryptjs para senhas.
- Resend para e-mails.
- Web Push para notificações.

### Organização principal

| Caminho | Responsabilidade |
|---|---|
| `src/app` | Páginas, layouts, rotas de API e Server Actions. |
| `src/components` | Componentes visuais e interativos. |
| `src/lib` | Autenticação, banco, e-mail, catálogo, treino, Telegram e utilidades. |
| `prisma/schema.prisma` | Modelo principal do banco. |
| `prisma/migrations` | Histórico de migrações. |
| `prisma/seed.ts` | Dados de demonstração/desenvolvimento. |
| `.github/workflows` | Automações externas do GitHub Actions. |
| `scripts` | Verificações de banco e segurança do deploy. |

### Renderização e ações

- As páginas usam o App Router e Server Components sempre que possível.
- Alterações de dados são centralizadas principalmente em `src/app/actions.ts`.
- Componentes interativos utilizam Client Components somente quando necessário.
- O Prisma Client é reutilizado em desenvolvimento para evitar excesso de conexões.

## 9. Modelo de dados

| Modelo | Responsabilidade |
|---|---|
| `User` | Conta, perfil, e-mail, senha e relacionamentos. |
| `StudentTrainer` | Relação muitos-para-muitos entre alunos e professores. |
| `WorkoutPlan` | Plano de treino do aluno, dias, tipo e estado ativo. |
| `WorkoutSplit` | Divisões A, B, C e divisões adicionais. |
| `Exercise` | Exercícios definidos em uma divisão. |
| `WorkoutLog` | Exercício concluído, carga utilizada e data. |
| `PhysicalAssessment` | Peso, gordura e medidas corporais. |
| `Anamnese` | Objetivo, nível de atividade e informações de saúde. |
| `InviteToken` | Convite temporário de cadastro. |
| `EmailVerificationToken` | Confirmação temporária de e-mail. |
| `PasswordResetToken` | Recuperação temporária de senha. |
| `WorkoutTemplate` | Modelo reutilizável pertencente a um professor. |
| `WorkoutTemplateSplit` | Divisão de um modelo. |
| `WorkoutTemplateExercise` | Exercício de um modelo. |
| `PushSubscription` | Assinatura Web Push de um dispositivo. |

### Tipos de plano

- `NORMAL`
- `LOW_VOLUME`
- `STRENGTH`

### Exclusões em cascata

O banco utiliza exclusões em cascata em diversos relacionamentos. Isso simplifica a remoção completa de entidades, mas exige atenção: ao excluir um exercício, os `WorkoutLog` associados também são excluídos. Atualmente isso pode apagar parte do histórico de evolução do aluno.

## 10. Segurança

- Senhas protegidas por bcrypt.
- Sessões baseadas em JWT.
- Autorização por papel no middleware e novamente nas operações sensíveis.
- Consultas do professor filtradas pelo vínculo com o aluno.
- Tokens temporários e únicos para convite, verificação e senha.
- Recuperação de senha não revela a existência do e-mail.
- Rota do relatório protegida por `REPORT_CRON_SECRET` e comparação segura.
- Tokens e credenciais ficam em variáveis de ambiente.
- Arquivos `.env` são ignorados pelo Git.
- Nenhum segredo deve ser documentado, enviado em captura de tela ou colocado no repositório.

## 11. Integrações externas

### Vercel

- Hospeda o frontend e as funções do Next.js.
- Deploy de produção conectado ao branch `main` do GitHub.
- URL principal: <https://apexfit-unasp.vercel.app>.
- O comando de build executa `prisma generate` e verifica a conexão do banco.

### Supabase

- Fornece o PostgreSQL de produção.
- O plano gratuito possui limite operacional de 500 MB para o banco.
- O projeto gratuito pode ser pausado por inatividade.
- O plano gratuito não deve ser considerado substituto de uma estratégia própria de backup.

### Resend

- Envia confirmação de e-mail.
- Envia recuperação de senha.
- O remetente é definido por `EMAIL_FROM`.

### Telegram

- Recebe relatórios de saúde e atividade do ApexFit.
- O bot só envia mensagens; não existe atendimento conversacional implementado.
- A rota utiliza a Bot API oficial com `sendMessage`.

### GitHub Actions

- Atua como agendador externo gratuito.
- Foi escolhido porque o plano gratuito da Vercel permite execução agendada nativa apenas uma vez ao dia.
- O workflow também envia diretamente um alerta de contingência se não conseguir acessar a aplicação.

## 12. Relatório automático do Telegram

Arquivo: `.github/workflows/telegram-report.yml`.

### Horários

- `0 11 * * *` em UTC: aproximadamente 8h em São Paulo.
- `0 1 * * *` em UTC: aproximadamente 22h em São Paulo no dia anterior em UTC.

Execuções gratuitas do GitHub podem sofrer alguns minutos de atraso.

### Relatório da manhã

- Identificado como `period=morning`.
- Resume as últimas 24 horas.

### Relatório da noite

- Identificado como `period=evening`.
- Resume o dia atual desde 00h no horário de São Paulo.

### Informações enviadas

- Aplicação online.
- Banco conectado.
- Espaço utilizado e percentual dos 500 MB.
- Tempo da consulta de saúde.
- Total de alunos.
- Total de professores.
- Planos ativos.
- Novos alunos no período.
- Alunos que treinaram.
- Exercícios registrados.
- Avaliações registradas.

### Contingência

Se o GitHub não conseguir acessar a rota após as tentativas configuradas, ele usa suas próprias credenciais do Telegram para enviar um alerta de aplicação inacessível. Isso permite avisar mesmo quando a Vercel estiver indisponível.

### Testes realizados

- Rota protegida retornando `401` sem autorização.
- Consulta real ao PostgreSQL concluída.
- Envio direto pela rota de produção concluído.
- Execução manual completa pelo GitHub Actions concluída com sucesso.

## 13. Variáveis de ambiente

Somente os nomes devem ser versionados. Os valores reais são secretos.

### Aplicação/Vercel

```text
DATABASE_URL
NEXTAUTH_SECRET
NEXTAUTH_URL
RESEND_API_KEY
EMAIL_FROM
NEXT_PUBLIC_VAPID_PUBLIC_KEY
VAPID_PRIVATE_KEY
VAPID_SUBJECT
TELEGRAM_BOT_TOKEN
TELEGRAM_CHAT_ID
REPORT_CRON_SECRET
```

### GitHub Actions — Secrets

```text
TELEGRAM_BOT_TOKEN
TELEGRAM_CHAT_ID
REPORT_CRON_SECRET
```

### GitHub Actions — Variable

```text
REPORT_URL=https://apexfit-unasp.vercel.app/api/cron/telegram-report
```

O `REPORT_CRON_SECRET` deve ser idêntico na Vercel e no GitHub.

## 14. Desenvolvimento local

### Requisitos

- Node.js compatível com a versão definida em `package.json`.
- npm.
- PostgreSQL local ou uma conexão de desenvolvimento.

### Instalação e execução

```bash
npm install
docker compose up -d
npm run db:push
npm run db:seed
npm run dev
```

A aplicação local fica disponível em <http://localhost:3000>.

### Comandos principais

| Comando | Finalidade |
|---|---|
| `npm run dev` | Inicia o desenvolvimento. |
| `npm run lint` | Verifica padrões e possíveis erros. |
| `npm run build` | Gera Prisma Client e build de produção. |
| `npm run verify` | Executa lint e build. |
| `npm run check:database` | Confere a conexão com o banco. |
| `npm run db:generate` | Gera Prisma Client. |
| `npm run db:push` | Sincroniza o schema sem criar migração. |
| `npm run db:migrate` | Cria/aplica migração de desenvolvimento. |
| `npm run db:seed` | Insere dados de demonstração. |
| `npm run deploy:production` | Verifica e publica na Vercel. |

## 15. Deploy

1. Alterações são implementadas e verificadas localmente.
2. Executar `npm run lint` e `npm run build`.
3. Confirmar que migrações necessárias foram aplicadas conscientemente.
4. Fazer commit e push para `main`.
5. A Vercel inicia um deploy automático.
6. Conferir se o deploy está como `Ready`.
7. Testar login, páginas principais e uma gravação real controlada.

O projeto contém verificações específicas para reduzir o risco de publicar com configuração de banco local ou incorreta.

## 16. Operação e monitoramento

### Verificação diária recomendada

- Confirmar recebimento dos relatórios das 8h e 22h.
- Confirmar aplicação e banco como online.
- Conferir aumento anormal de erros na Vercel.
- Conferir tamanho do banco.
- Conferir atividade de treino compatível com o horário da academia.
- Confirmar o último backup disponível.

### Limites de atenção para o banco

- Até 350 MB: operação normal.
- De 350 a 400 MB: acompanhar crescimento com mais frequência.
- De 400 a 450 MB: preparar upgrade ou migração.
- Acima de 450 MB: agir antes de alcançar o limite de 500 MB.

### Estimativa para 250 alunos

O maior crescimento vem de `WorkoutLog`. Como é gravado um registro por exercício concluído, uma utilização típica pode gerar aproximadamente 300 mil a 650 mil registros por ano. O banco gratuito deve atender o início da operação, mas não deve ser tratado como capacidade permanente. A projeção discutida foi de aproximadamente 1,5 a 4 anos, variando conforme frequência, exercícios por treino, índices e crescimento do sistema.

Na verificação de 26/08/2026, o relatório encontrou aproximadamente **11,2 MB usados de 500 MB**, mas esse valor é uma fotografia e deve ser acompanhado pelos relatórios futuros.

## 17. Backup e continuidade

### O que precisa de backup

- Banco PostgreSQL: item mais importante.
- Arquivos do Supabase Storage, caso sejam adicionados futuramente.
- Código: protegido pelo GitHub, desde que os commits sejam enviados.
- Relação das variáveis de ambiente e configurações, sem publicar os valores.

### Recomendação

- Backup automático diário do PostgreSQL.
- Cópia externa, como Google Drive, com retenção definida.
- Teste periódico de restauração; possuir um arquivo não garante que ele restaura corretamente.
- Nunca armazenar token do Telegram, senha de banco ou outras credenciais dentro do repositório.

## 18. Escalabilidade e hospedagem

### Situação escolhida para o momento

- Continuar temporariamente com Vercel + Supabase.
- Acompanhar uso real antes de contratar VPS.
- Planejar migração quando limites, custo ou exigências operacionais justificarem.

### VPS futura

Uma VPS pode hospedar aplicação, PostgreSQL, proxy HTTPS, tarefas agendadas e outros sistemas. Em contrapartida, exige manutenção de sistema operacional, atualizações, firewall, monitoramento, backups e reinício automático dos serviços.

Uma configuração discutida de 1 vCPU, 4 GB de RAM, 50 GB NVMe e 4 TB de tráfego tende a ser suficiente para a fase inicial do ApexFit, desde que configurada e monitorada corretamente.

### Aplicativo Android/APK

O frontend pode futuramente ser transformado em PWA instalável ou empacotado como aplicativo Android. O APK continuaria utilizando os mesmos servidores e o mesmo banco pela internet. Essa decisão não exige reescrever imediatamente o backend.

## 19. Pontos de atenção e dívida técnica

1. **Histórico associado ao exercício:** `WorkoutLog` possui exclusão em cascata a partir de `Exercise`. Excluir um exercício pode apagar o histórico relacionado. O ideal é preservar um retrato do exercício no registro ou usar exclusão lógica.
2. **Backup automático:** ainda deve ser implantado e validado fora do plano gratuito do Supabase.
3. **Monitoramento parcial:** o relatório atual não inclui volume total de requisições nem taxa geral de erros da Vercel. Essas métricas continuam disponíveis no painel de Observability e podem ser integradas no futuro com acesso adicional.
4. **Disponibilidade gratuita:** Supabase gratuito pode pausar por inatividade e serviços gratuitos não oferecem o mesmo compromisso de disponibilidade de planos empresariais.
5. **Uso comercial da Vercel:** revisar periodicamente se o plano contratado continua adequado aos termos e ao uso comercial real.
6. **Agendamento do GitHub:** horários não têm precisão absoluta e podem atrasar alguns minutos.
7. **Aviso do Next.js:** o build indica que a convenção `middleware.ts` está depreciada em favor de `proxy`; ainda funciona, mas deve ser migrada futuramente.
8. **Imagens e vídeos:** não armazenar arquivos pesados diretamente no PostgreSQL. Usar Storage e manter apenas referências no banco.
9. **Teste de restauração:** deve fazer parte da rotina; backup sem teste não garante continuidade.

## 20. Próximas melhorias recomendadas

### Prioridade alta

- Implantar backup automático diário e restauração testada.
- Preservar histórico de treino quando exercícios ou planos forem removidos.
- Criar alerta automático de crescimento do banco antes de 350 MB.
- Documentar procedimento de incidente e recuperação.

### Prioridade média

- Integrar requisições, erros 5xx e latência da Vercel ao Telegram.
- Criar monitor externo com verificações mais frequentes que duas vezes ao dia.
- Criar painel gerencial de saúde do sistema.
- Migrar `middleware.ts` para a convenção atual do Next.js.
- Aumentar cobertura de testes automatizados.

### Evolução do produto

- PWA/APK.
- Novos vídeos demonstrativos.
- Histórico preservado por versão de ficha.
- Exportação de relatórios de evolução.
- Controle mais detalhado de presença e frequência.
- Notificações configuráveis por aluno/professor.

## 21. Regras para futuras alterações

- Preservar a identidade visual atual.
- Priorizar experiência em celular.
- Manter textos e erros em português claro.
- Nunca exibir detalhes técnicos ou segredos ao usuário final.
- Verificar permissões em toda operação de gerente, professor ou aluno.
- Validar entradas no servidor, mesmo quando já validadas na interface.
- Não remover histórico sem decisão explícita.
- Executar lint e build antes de publicar.
- Aplicar migrações de banco conscientemente.
- Atualizar este documento após mudanças relevantes de arquitetura, integração ou operação.

## 22. Arquivos essenciais

- `src/app/actions.ts`: principais operações de negócio.
- `src/lib/auth.ts`: configuração do NextAuth e destinos por perfil.
- `src/lib/session.ts`: proteção por papel.
- `middleware.ts`: controle de acesso às áreas protegidas.
- `src/lib/prisma.ts`: conexão com o PostgreSQL.
- `src/lib/exercise-catalog.ts`: catálogo e vídeos de exercícios.
- `src/lib/workout.ts`: escolha da divisão conforme os dias de treino.
- `src/lib/email.ts`: e-mails de verificação e recuperação.
- `src/lib/monitoring-report.ts`: coleta e formatação das métricas.
- `src/lib/telegram.ts`: envio pela Bot API.
- `src/app/api/cron/telegram-report/route.ts`: endpoint protegido do relatório.
- `.github/workflows/telegram-report.yml`: horários e contingência externa.
- `prisma/schema.prisma`: fonte principal do modelo de dados.
- `vercel.json`: configuração do build de produção.
- `.env.example`: nomes e exemplos seguros das variáveis.

---

Este documento não contém tokens, senhas, chaves de API ou credenciais reais. Consulte os painéis autorizados da Vercel, GitHub, Supabase, Resend e Telegram para administrar esses valores.
