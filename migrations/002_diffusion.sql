CREATE TABLE lodgings (
 id TEXT PRIMARY KEY, name TEXT NOT NULL, type TEXT NOT NULL CHECK(type IN ('hotel','hostal','hostel','apart_hotel','agencia','otro')),
 city TEXT NOT NULL, address TEXT NOT NULL DEFAULT '', website TEXT NOT NULL DEFAULT '',
 email TEXT NOT NULL UNIQUE COLLATE NOCASE, phone TEXT NOT NULL DEFAULT '', whatsapp TEXT NOT NULL DEFAULT '',
 contact_person TEXT NOT NULL DEFAULT '', contact_reason TEXT NOT NULL DEFAULT '',
 language TEXT NOT NULL CHECK(language IN ('es','en','de','fr','ko','zh-CN')),
 source TEXT NOT NULL, source_url TEXT NOT NULL DEFAULT '', verified_at TEXT NOT NULL DEFAULT '',
 email_verification TEXT NOT NULL CHECK(email_verification IN ('pendiente','verificado','invalido')),
 status TEXT NOT NULL CHECK(status IN ('sin_contactar','preparado','contactado','respuesta','interesado','acuerdo','sin_interes','no_contactar')),
 notes TEXT NOT NULL DEFAULT '', next_action TEXT NOT NULL DEFAULT '', follow_up TEXT NOT NULL DEFAULT '',
 created_at TEXT NOT NULL, updated_at TEXT NOT NULL, version INTEGER NOT NULL DEFAULT 1
);
CREATE INDEX lodging_status ON lodgings(status);
CREATE INDEX lodging_followup ON lodgings(follow_up);
CREATE TABLE lodging_history (
 id TEXT PRIMARY KEY, lodging_id TEXT NOT NULL REFERENCES lodgings(id) ON DELETE CASCADE,
 actor_id TEXT NOT NULL REFERENCES "user"(id), kind TEXT NOT NULL,
 summary TEXT NOT NULL, created_at TEXT NOT NULL
);
CREATE TABLE communications (
 id TEXT PRIMARY KEY, lodging_id TEXT NOT NULL REFERENCES lodgings(id) ON DELETE CASCADE,
 actor_id TEXT NOT NULL REFERENCES "user"(id), date TEXT NOT NULL,
 channel TEXT NOT NULL CHECK(channel IN ('email','whatsapp','telefono','presencial','otro')),
 type TEXT NOT NULL, summary TEXT NOT NULL, result TEXT NOT NULL DEFAULT '',
 follow_up TEXT NOT NULL DEFAULT '', created_at TEXT NOT NULL
);
CREATE TABLE campaigns (
 id TEXT PRIMARY KEY, name TEXT NOT NULL, objective TEXT NOT NULL,
 language TEXT NOT NULL CHECK(language IN ('es','en','de','fr','ko','zh-CN')),
 subject TEXT NOT NULL, body TEXT NOT NULL, experience_slug TEXT NOT NULL,
 status TEXT NOT NULL CHECK(status IN ('borrador','revision','archivada')),
 created_at TEXT NOT NULL, updated_at TEXT NOT NULL, version INTEGER NOT NULL DEFAULT 1,
 UNIQUE(experience_slug, language)
);
