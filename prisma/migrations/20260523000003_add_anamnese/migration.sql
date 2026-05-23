CREATE TABLE "anamneses" (
  "id" TEXT NOT NULL,
  "student_id" TEXT NOT NULL,
  "age" INTEGER,
  "height_cm" DOUBLE PRECISION,
  "goal" TEXT,
  "activity_level" TEXT,
  "health_conditions" TEXT,
  "injuries" TEXT,
  "medications" TEXT,
  "observations" TEXT,
  "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updated_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT "anamneses_pkey" PRIMARY KEY ("id")
);

CREATE UNIQUE INDEX "anamneses_student_id_key" ON "anamneses"("student_id");

ALTER TABLE "anamneses"
  ADD CONSTRAINT "anamneses_student_id_fkey"
  FOREIGN KEY ("student_id") REFERENCES "users"("id")
  ON DELETE CASCADE ON UPDATE CASCADE;
