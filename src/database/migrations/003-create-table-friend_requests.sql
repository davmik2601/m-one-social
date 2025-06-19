CREATE TYPE friend_requests_status AS ENUM ('PENDING', 'ACCEPTED', 'DECLINED');

CREATE TABLE IF NOT EXISTS friend_requests (
    id              SERIAL          PRIMARY KEY,
    "createdAt"     TIMESTAMP       DEFAULT NOW(),
    "updatedAt"     TIMESTAMP       DEFAULT NOW(),
    "senderId"      INTEGER         REFERENCES users(id) ON DELETE CASCADE,
    "receiverId"    INTEGER         REFERENCES users(id) ON DELETE CASCADE,
    "status"        friend_requests_status NOT NULL DEFAULT 'PENDING'
);