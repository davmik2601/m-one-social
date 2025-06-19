-- Enable Postgres trigram extension for indexing iLIKE searches on firstName or lastName
CREATE EXTENSION IF NOT EXISTS pg_trgm;

-- GIN index on firstName using trigrams (for fast iLIKE '%...%')
CREATE INDEX idx_users_firstname_trgm
    ON users USING GIN ("firstName" gin_trgm_ops);

-- GIN index on lastName using trigrams
CREATE INDEX idx_users_lastname_trgm
    ON users USING GIN ("lastName" gin_trgm_ops);

CREATE INDEX idx_users_age ON users(age);