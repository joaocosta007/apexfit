CREATE TABLE "workout_templates" (
  "id" TEXT NOT NULL,
  "trainer_id" TEXT NOT NULL,
  "name" TEXT NOT NULL,
  "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updated_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT "workout_templates_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "workout_template_splits" (
  "id" TEXT NOT NULL,
  "template_id" TEXT NOT NULL,
  "split_name" TEXT NOT NULL,
  "sort_order" INTEGER NOT NULL DEFAULT 0,
  "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT "workout_template_splits_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "workout_template_exercises" (
  "id" TEXT NOT NULL,
  "split_id" TEXT NOT NULL,
  "catalog_id" TEXT,
  "name" TEXT NOT NULL,
  "sets" INTEGER NOT NULL,
  "reps" INTEGER NOT NULL,
  "load_kg" DOUBLE PRECISION NOT NULL,
  "rest_time" TEXT NOT NULL,
  "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT "workout_template_exercises_pkey" PRIMARY KEY ("id")
);

CREATE INDEX "workout_templates_trainer_id_idx" ON "workout_templates"("trainer_id");
CREATE INDEX "workout_template_splits_template_id_sort_order_idx" ON "workout_template_splits"("template_id", "sort_order");
CREATE INDEX "workout_template_exercises_split_id_idx" ON "workout_template_exercises"("split_id");

ALTER TABLE "workout_templates"
  ADD CONSTRAINT "workout_templates_trainer_id_fkey"
  FOREIGN KEY ("trainer_id") REFERENCES "users"("id")
  ON DELETE CASCADE ON UPDATE CASCADE;

ALTER TABLE "workout_template_splits"
  ADD CONSTRAINT "workout_template_splits_template_id_fkey"
  FOREIGN KEY ("template_id") REFERENCES "workout_templates"("id")
  ON DELETE CASCADE ON UPDATE CASCADE;

ALTER TABLE "workout_template_exercises"
  ADD CONSTRAINT "workout_template_exercises_split_id_fkey"
  FOREIGN KEY ("split_id") REFERENCES "workout_template_splits"("id")
  ON DELETE CASCADE ON UPDATE CASCADE;
