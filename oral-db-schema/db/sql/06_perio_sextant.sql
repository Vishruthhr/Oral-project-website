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
