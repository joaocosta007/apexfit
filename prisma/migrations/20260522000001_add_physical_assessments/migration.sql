CREATE TABLE "physical_assessments" (
  "id"           TEXT             NOT NULL,
  "student_id"   TEXT             NOT NULL,
  "trainer_id"   TEXT             NOT NULL,
  "date"         TIMESTAMP(3)     NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "weight"       DOUBLE PRECISION,
  "body_fat"     DOUBLE PRECISION,
  "chest"        DOUBLE PRECISION,
  "waist"        DOUBLE PRECISION,
  "abdomen"      DOUBLE PRECISION,
  "hip"          DOUBLE PRECISION,
  "right_arm"    DOUBLE PRECISION,
  "left_arm"     DOUBLE PRECISION,
  "right_thigh"  DOUBLE PRECISION,
  "left_thigh"   DOUBLE PRECISION,
  "right_calf"   DOUBLE PRECISION,
  "left_calf"    DOUBLE PRECISION,
  "notes"        TEXT,
  "created_at"   TIMESTAMP(3)     NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT "physical_assessments_pkey" PRIMARY KEY ("id")
);

CREATE INDEX "physical_assessments_student_id_date_idx"
  ON "physical_assessments"("student_id", "date");

ALTER TABLE "physical_assessments"
  ADD CONSTRAINT "physical_assessments_student_id_fkey"
  FOREIGN KEY ("student_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

ALTER TABLE "physical_assessments"
  ADD CONSTRAINT "physical_assessments_trainer_id_fkey"
  FOREIGN KEY ("trainer_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;
