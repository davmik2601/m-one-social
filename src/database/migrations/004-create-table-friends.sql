CREATE TABLE IF NOT EXISTS friends (
    id              SERIAL          PRIMARY KEY,
    "createdAt"     TIMESTAMP       DEFAULT NOW(),
    "updatedAt"     TIMESTAMP       DEFAULT NOW(),
    "userId1"       INTEGER         REFERENCES users(id) ON DELETE CASCADE,
    "userId2"       INTEGER         REFERENCES users(id) ON DELETE CASCADE,

    UNIQUE ("userId1", "userId2"),
    CHECK ("userId1" < "userId2") -- at inserting need to be sure that userId1 is always less than userId2
);