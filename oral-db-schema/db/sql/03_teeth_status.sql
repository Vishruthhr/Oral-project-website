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
