CREATE TABLE IF NOT EXISTS users (
    id              SERIAL          PRIMARY KEY,
    "createdAt"     TIMESTAMP       DEFAULT NOW(),
    "updatedAt"     TIMESTAMP       DEFAULT NOW(),
    "firstName"     VARCHAR(100)    NOT NULL,
    "lastName"      VARCHAR(100)    NOT NULL,
    "age"           INTEGER         NOT NULL CHECK ("age" >= 18 AND "age" <= 99),
    "email"         VARCHAR(100)    UNIQUE NOT NULL,
    "password"      VARCHAR         NOT NULL
);