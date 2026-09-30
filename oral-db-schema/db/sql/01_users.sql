-- PK: id
CREATE TABLE users (
  id            uuid         PRIMARY KEY DEFAULT gen_random_uuid(),
  username      varchar(50)  NOT NULL UNIQUE,
  password_hash text         NOT NULL,
  created_at    timestamptz  NOT NULL DEFAULT now()
);
