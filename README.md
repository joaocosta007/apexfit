# ApexFit

Sistema mobile-first de gestão de academia com tema escuro, acentos neon e interface 100% em pt-BR.

## Stack

- Next.js App Router + React + TypeScript
- Tailwind CSS + componentes no padrão Shadcn UI
- PostgreSQL + Prisma ORM
- NextAuth com credenciais, JWT e controle de permissões por papel
- Estrutura pronta para deploy gratuito na Vercel com banco Supabase/Neon

## Como rodar localmente

```bash
npm install
docker compose up -d
npm run db:push
npm run db:seed
npm run dev
```

Abra `http://localhost:3000`.

## Usuários de demonstração

Todas as senhas são `123456`.

- Gerente: `gerente@apexfit.com`
- Professor: `professor.bruno@apexfit.com`
- Professora: `professora.larissa@apexfit.com`
- Aluna: `aluna.ana@apexfit.com`
- Aluno: `aluno.rafael@apexfit.com`

## Deploy na Vercel

1. Crie um banco PostgreSQL gratuito na Supabase ou Neon.
2. Configure as variáveis `DATABASE_URL`, `NEXTAUTH_SECRET` e `NEXTAUTH_URL` no painel da Vercel.
3. Rode localmente ou em um workflow seguro: `npm run db:migrate` ou `npm run db:push`.
4. Faça push do repositório para GitHub e conecte na Vercel.

> Observação: o build executa `prisma generate`. Migrações de produção devem ser executadas conscientemente antes/depois do deploy, conforme seu fluxo.

## Relatório diário no Telegram

O sistema possui uma rota protegida que envia um relatório de saúde e utilização às 8h e às 22h (horário de São Paulo). O agendamento fica no GitHub Actions porque o plano Hobby da Vercel permite apenas uma execução agendada por dia.

Configure na Vercel:

- `TELEGRAM_BOT_TOKEN`
- `TELEGRAM_CHAT_ID`
- `REPORT_CRON_SECRET`

Configure nos segredos do repositório GitHub os mesmos três valores. Em **Settings → Secrets and variables → Actions → Variables**, crie também:

- `REPORT_URL`: URL completa da rota em produção, por exemplo `https://seu-dominio.vercel.app/api/cron/telegram-report`

O `REPORT_CRON_SECRET` deve ser idêntico na Vercel e no GitHub. Depois de configurar, execute manualmente o workflow **Relatório do ApexFit no Telegram** para validar a entrega antes de aguardar o próximo horário.
