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
