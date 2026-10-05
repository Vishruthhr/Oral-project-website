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
