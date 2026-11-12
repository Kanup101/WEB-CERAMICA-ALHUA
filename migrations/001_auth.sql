CREATE TABLE "user" (
 id TEXT PRIMARY KEY, name TEXT NOT NULL, email TEXT NOT NULL UNIQUE COLLATE NOCASE,
 emailVerified INTEGER NOT NULL DEFAULT 0, image TEXT,
 createdAt DATETIME NOT NULL, updatedAt DATETIME NOT NULL
);
CREATE TABLE "session" (
 id TEXT PRIMARY KEY, expiresAt DATETIME NOT NULL, token TEXT NOT NULL UNIQUE,
 createdAt DATETIME NOT NULL, updatedAt DATETIME NOT NULL, ipAddress TEXT, userAgent TEXT,
 userId TEXT NOT NULL REFERENCES "user"(id) ON DELETE CASCADE
);
CREATE INDEX session_user ON "session"(userId);
CREATE TABLE account (
 id TEXT PRIMARY KEY, accountId TEXT NOT NULL, providerId TEXT NOT NULL,
 userId TEXT NOT NULL REFERENCES "user"(id) ON DELETE CASCADE,
 accessToken TEXT, refreshToken TEXT, idToken TEXT, accessTokenExpiresAt DATETIME,
 refreshTokenExpiresAt DATETIME, scope TEXT, password TEXT,
 createdAt DATETIME NOT NULL, updatedAt DATETIME NOT NULL,
 UNIQUE(providerId, accountId)
);
CREATE TABLE verification (
 id TEXT PRIMARY KEY, identifier TEXT NOT NULL, value TEXT NOT NULL, expiresAt DATETIME NOT NULL,
 createdAt DATETIME NOT NULL, updatedAt DATETIME NOT NULL
);
CREATE TABLE "rateLimit" (id TEXT PRIMARY KEY, "key" TEXT NOT NULL UNIQUE, count INTEGER NOT NULL, lastRequest BIGINT NOT NULL);
CREATE TABLE admin_users (user_id TEXT PRIMARY KEY REFERENCES "user"(id) ON DELETE CASCADE);
