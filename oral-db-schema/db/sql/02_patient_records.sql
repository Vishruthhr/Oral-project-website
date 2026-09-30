-- PK: id | FK: examiner_id -> users(id) ON DELETE SET NULL
CREATE TABLE patient_records (
  id                 uuid          PRIMARY KEY DEFAULT gen_random_uuid(),

  -- Section 01: General Information
  participant_id     varchar(50)   NOT NULL,
  patient_name       varchar(150)  NOT NULL,
  exam_date          date          NOT NULL,
  examiner_id        uuid          REFERENCES users(id) ON DELETE SET NULL,
  village            varchar(150),
  phone_number       varchar(10),
  sex                sex           NOT NULL,
  dob                date,
  education          smallint,
  ethnic_group       varchar(50),
  ethnic_group_other varchar(150),
  occupation         varchar(5),
  occupation_other   varchar(150),
  habits             text,

  -- Section 04: Other Findings
  fluorosis          varchar(2),
  tdi                varchar(2),
  oml_present        boolean       NOT NULL DEFAULT false,
  oml_site           varchar(2),
  oml_condition      varchar(2),
  oml_other_details  text,
  pros_upper         varchar(2),
  pros_lower         varchar(2),
  treatment          varchar(2),
  notes              text,

  created_at         timestamptz   NOT NULL DEFAULT now(),
  updated_at         timestamptz   NOT NULL DEFAULT now(),

  CONSTRAINT chk_occupation  CHECK (occupation IS NULL OR occupation IN ('0','1','2','3')),
  CONSTRAINT chk_fluorosis   CHECK (fluorosis  IS NULL OR fluorosis  IN ('0','1','2','3','4','5','9')),
  CONSTRAINT chk_tdi         CHECK (tdi        IS NULL OR tdi        IN ('0','1','2','3','4','5','6','9')),
  CONSTRAINT chk_pros_upper  CHECK (pros_upper IS NULL OR pros_upper IN ('0','1','2','3','4','9')),
  CONSTRAINT chk_pros_lower  CHECK (pros_lower IS NULL OR pros_lower IN ('0','1','2','3','4','9')),
  CONSTRAINT chk_treatment   CHECK (treatment  IS NULL OR treatment  IN ('0','1','2','3','4','5','6','7','8','9'))
);

CREATE INDEX patient_records_examiner_idx     ON patient_records (examiner_id);
CREATE INDEX patient_records_participant_idx  ON patient_records (participant_id);
CREATE INDEX patient_records_exam_date_idx    ON patient_records (exam_date);

-- Auto-update updated_at on every UPDATE
CREATE OR REPLACE FUNCTION set_updated_at() RETURNS trigger AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trg_patient_records_updated_at
  BEFORE UPDATE ON patient_records
  FOR EACH ROW EXECUTE FUNCTION set_updated_at();
