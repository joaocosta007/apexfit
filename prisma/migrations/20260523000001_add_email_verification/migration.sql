-- AlterTable: adiciona campo email_verified no User
ALTER TABLE "users" ADD COLUMN "email_verified" TIMESTAMP(3);

-- CreateTable: tokens de verificação de e-mail
CREATE TABLE "email_verification_tokens" (
  "id" TEXT NOT NULL,
  "user_id" TEXT NOT NULL,
  "token" TEXT NOT NULL,
  "expires_at" TIMESTAMP(3) NOT NULL,
  "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT "email_verification_tokens_pkey" PRIMARY KEY ("id")
);

CREATE UNIQUE INDEX "email_verification_tokens_token_key"
  ON "email_verification_tokens"("token");

CREATE INDEX "email_verification_tokens_token_idx"
  ON "email_verification_tokens"("token");

ALTER TABLE "email_verification_tokens"
  ADD CONSTRAINT "email_verification_tokens_user_id_fkey"
  FOREIGN KEY ("user_id") REFERENCES "users"("id")
  ON DELETE CASCADE ON UPDATE CASCADE;
