CREATE TABLE "invite_tokens" (
  "id"         TEXT         NOT NULL,
  "token"      TEXT         NOT NULL,
  "trainer_id" TEXT         NOT NULL,
  "used"       BOOLEAN      NOT NULL DEFAULT false,
  "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "expires_at" TIMESTAMP(3) NOT NULL,
  CONSTRAINT "invite_tokens_pkey" PRIMARY KEY ("id")
);

CREATE UNIQUE INDEX "invite_tokens_token_key" ON "invite_tokens"("token");
CREATE INDEX "invite_tokens_token_idx"        ON "invite_tokens"("token");

ALTER TABLE "invite_tokens"
  ADD CONSTRAINT "invite_tokens_trainer_id_fkey"
  FOREIGN KEY ("trainer_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;
