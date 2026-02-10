BEGIN TRANSACTION;
DROP TABLE IF EXISTS "tbpages";
CREATE TABLE IF NOT EXISTS "tbpages" (
	"id"	integer NOT NULL PRIMARY KEY AUTOINCREMENT,
	"level_1_name"	text DEFAULT null,
	"level_2_name"	text DEFAULT null,
	"pages"	integer NOT NULL DEFAULT '0',
	"created_at"	datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
	"updated_at"	datetime NOT NULL DEFAULT CURRENT_TIMESTAMP
);
DROP TABLE IF EXISTS "tblite";
CREATE TABLE IF NOT EXISTS "tblite" (
	"id"	integer NOT NULL PRIMARY KEY AUTOINCREMENT,
	"level_1_name"	text DEFAULT null,
	"level_2_name"	text DEFAULT null,
	"fname"	text DEFAULT null,
	"real_fname"	text DEFAULT null,
	"gb2312_urlencode"	text DEFAULT null,
	"fid"	integer NOT NULL DEFAULT '0',
	"member_num"	integer NOT NULL DEFAULT '0',
	"post_num"	integer NOT NULL DEFAULT '0',
	"thread_num"	integer NOT NULL DEFAULT '0',
	"created_at"	datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
	"updated_at"	datetime NOT NULL DEFAULT CURRENT_TIMESTAMP
);
DROP TABLE IF EXISTS "tbfriendforum";
CREATE TABLE IF NOT EXISTS "tbfriendforum" (
	"id"	INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
	"fid"	INTEGER NOT NULL,
	"target_fid"	INTEGER NOT NULL,
	"target_fname"	TEXT NOT NULL
);
DROP TABLE IF EXISTS "tbmanager";
CREATE TABLE IF NOT EXISTS "tbmanager" (
	"id"	INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
	"fid"	INTEGER NOT NULL,
	"uid"	INTEGER NOT NULL,
	"name"	TEXT NOT NULL,
	"show_name"	TEXT NOT NULL,
	"portrait"	TEXT NOT NULL
);
CREATE INDEX IF NOT EXISTS "idx_tbfriendforum_fid" ON "tbfriendforum" (
	"fid"
);
CREATE INDEX IF NOT EXISTS "idx_tbfriendforum_target_fid" ON "tbfriendforum" (
	"target_fid"
);
CREATE UNIQUE INDEX IF NOT EXISTS "idx_tbfriendforum_unique" ON "tbfriendforum" (
	"fid",
	"target_fid"
);
CREATE INDEX IF NOT EXISTS "idx_tblite_fid" ON "tblite" (
	"fid"
);
CREATE UNIQUE INDEX IF NOT EXISTS "idx_tblite_fid_fname_unique" ON "tblite" (
	"fid",
	"fname"
);
CREATE UNIQUE INDEX IF NOT EXISTS "idx_tblite_id" ON "tblite" (
	"id"
);
CREATE INDEX IF NOT EXISTS "idx_tbmanager_fid" ON "tbmanager" (
	"fid"
);
CREATE INDEX IF NOT EXISTS "idx_tbmanager_uid" ON "tbmanager" (
	"uid"
);
CREATE UNIQUE INDEX IF NOT EXISTS "idx_tbmanager_unique" ON "tbmanager" (
	"fid",
	"uid"
);
COMMIT;
