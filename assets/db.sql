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
DROP INDEX IF EXISTS "id";
CREATE UNIQUE INDEX IF NOT EXISTS "id" ON "tblite" (
	"id"
);
DROP INDEX IF EXISTS "fid";
CREATE INDEX IF NOT EXISTS "fid" ON "tblite" (
	"fid"
);
COMMIT;
