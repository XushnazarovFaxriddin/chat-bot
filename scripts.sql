CREATE TABLE "Users" (
	"id"	INTEGER NOT NULL,
	"firstname"	TEXT,
	"lastname"	TEXT,
	"username"	TEXT,
	"chat_id"	INTEGER UNIQUE,
	"role"	TEXT,
	"phone_number"	TEXT,
	"step"	INTEGER,
	"is_private"	BOOLEAN DEFAULT 0 CHECK("is_Private" IN (0, 1)),
	PRIMARY KEY("id" AUTOINCREMENT)
);

CREATE TABLE "Messages" (
	"id"	INTEGER NOT NULL,
	"message_id"	INTEGER NOT NULL,
	"user_id"	INTEGER NOT NULL,
	"reply_message_id"	INTEGER,
	"text"	TEXT,
	"is_text"	BOOLEAN NOT NULL DEFAULT 1 CHECK("is_text" IN (0, 1)),
    "date"  TEXT,
	PRIMARY KEY("id" AUTOINCREMENT)
);
