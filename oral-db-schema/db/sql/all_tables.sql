CREATE TYPE sex AS ENUM ('male', 'female');
-- PK: id
CREATE TABLE users (
  id            uuid         PRIMARY KEY DEFAULT gen_random_uuid(),
  username      varchar(50)  NOT NULL UNIQUE,
  password_hash text         NOT NULL,
  created_at    timestamptz  NOT NULL DEFAULT now()
);
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
-- PK: id | FK: record_id -> patient_records(id) ON DELETE CASCADE
-- UNIQUE (record_id, tooth_num)
CREATE TABLE teeth_status (
  id         uuid        PRIMARY KEY DEFAULT gen_random_uuid(),
  record_id  uuid        NOT NULL REFERENCES patient_records(id) ON DELETE CASCADE,
  tooth_num  smallint    NOT NULL,
  crown_code varchar(2),
  root_code  varchar(2),

  CONSTRAINT teeth_status_record_tooth_uq UNIQUE (record_id, tooth_num),
  CONSTRAINT chk_teeth_tooth_num CHECK (
    tooth_num BETWEEN 11 AND 18 OR tooth_num BETWEEN 21 AND 28 OR
    tooth_num BETWEEN 31 AND 38 OR tooth_num BETWEEN 41 AND 48),
  CONSTRAINT chk_crown_code CHECK (crown_code IS NULL OR crown_code IN ('0','1','2','3','4','5','6','7','8','9','T')),
  CONSTRAINT chk_root_code  CHECK (root_code  IS NULL OR root_code  IN ('0','1','2','3','7','8','9'))
);

CREATE INDEX teeth_status_record_idx ON teeth_status (record_id);
-- PK: id | FK: record_id -> patient_records(id) ON DELETE CASCADE
-- UNIQUE (record_id, tooth_num)
CREATE TABLE perio_tooth (
  id           uuid      PRIMARY KEY DEFAULT gen_random_uuid(),
  record_id    uuid      NOT NULL REFERENCES patient_records(id) ON DELETE CASCADE,
  tooth_num    smallint  NOT NULL,
  present      boolean   NOT NULL DEFAULT true,
  implant      boolean   NOT NULL DEFAULT false,
  mobility     smallint  NOT NULL DEFAULT 0,
  furcation_b  smallint  NOT NULL DEFAULT 0,
  furcation_dp smallint  NOT NULL DEFAULT 0,
  furcation_mp smallint  NOT NULL DEFAULT 0,
  furcation_l  smallint  NOT NULL DEFAULT 0,
  note         text,

  CONSTRAINT perio_tooth_record_tooth_uq UNIQUE (record_id, tooth_num),
  CONSTRAINT chk_perio_tooth_num CHECK (
    tooth_num BETWEEN 11 AND 18 OR tooth_num BETWEEN 21 AND 28 OR
    tooth_num BETWEEN 31 AND 38 OR tooth_num BETWEEN 41 AND 48),
  CONSTRAINT chk_mobility  CHECK (mobility BETWEEN 0 AND 3),
  CONSTRAINT chk_furcation CHECK (
    furcation_b BETWEEN 0 AND 3 AND furcation_dp BETWEEN 0 AND 3 AND
    furcation_mp BETWEEN 0 AND 3 AND furcation_l BETWEEN 0 AND 3)
);

CREATE INDEX perio_tooth_record_idx ON perio_tooth (record_id);
-- PK: id | FK: perio_tooth_id -> perio_tooth(id) ON DELETE CASCADE
-- UNIQUE (perio_tooth_id, site)
CREATE TABLE perio_site (
  id             uuid        PRIMARY KEY DEFAULT gen_random_uuid(),
  perio_tooth_id uuid        NOT NULL REFERENCES perio_tooth(id) ON DELETE CASCADE,
  site           varchar(3)  NOT NULL,
  bop            boolean     NOT NULL DEFAULT false,
  plaque         boolean     NOT NULL DEFAULT false,
  gm             smallint    NOT NULL DEFAULT 0,
  pd             smallint    NOT NULL DEFAULT 2,

  CONSTRAINT perio_site_tooth_site_uq UNIQUE (perio_tooth_id, site),
  CONSTRAINT chk_site CHECK (site IN ('db','b','mb','dp','p','mp','dl','l','ml'))
);

CREATE INDEX perio_site_tooth_idx ON perio_site (perio_tooth_id);
-- PK: id | FK: record_id -> patient_records(id) ON DELETE CASCADE
-- UNIQUE (record_id, sextant)
CREATE TABLE perio_sextant (
  id        uuid        PRIMARY KEY DEFAULT gen_random_uuid(),
  record_id uuid        NOT NULL REFERENCES patient_records(id) ON DELETE CASCADE,
  sextant   smallint    NOT NULL,
  cpi       varchar(2),
  loa       varchar(2),

  CONSTRAINT perio_sextant_record_sextant_uq UNIQUE (record_id, sextant),
  CONSTRAINT chk_sextant CHECK (sextant BETWEEN 0 AND 5),
  CONSTRAINT chk_cpi CHECK (cpi IS NULL OR cpi IN ('0','1','2','3','4','9','X')),
  CONSTRAINT chk_loa CHECK (loa IS NULL OR loa IN ('0','1','2','3','4','9','X'))
);

CREATE INDEX perio_sextant_record_idx ON perio_sextant (record_id);
