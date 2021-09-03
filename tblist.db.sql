BEGIN TRANSACTION;
CREATE TABLE IF NOT EXISTS "tbpages" (
	"id"	integer NOT NULL PRIMARY KEY AUTOINCREMENT,
	"level_1_name"	text NOT NULL,
	"level_2_name"	text NOT NULL,
	"pages"	integer NOT NULL
);
CREATE TABLE IF NOT EXISTS "tblite" (
	"id"	integer NOT NULL PRIMARY KEY AUTOINCREMENT,
	"level_1_name"	text NOT NULL,
	"level_2_name"	text NOT NULL,
	"fname"	text,
	"gb2312_urlencode"	text
);
COMMIT;
