-- Adminer 4.8.1 SQLite 3 3.37.2 dump

-- DROP TABLE IF EXISTS "sqlite_sequence";
-- CREATE TABLE sqlite_sequence(name,seq);


DROP TABLE IF EXISTS "tblite";
CREATE TABLE `tblite` (`id` integer not null primary key autoincrement, `level_1_name` text default null, `level_2_name` text default null, `fname` text default null, `real_fname` text default null, `gb2312_urlencode` text default null, `fid` integer not null default '0', `member_num` integer not null default '0', `post_num` integer not null default '0', `thread_num` integer not null default '0', `created_at` datetime not null default CURRENT_TIMESTAMP, `updated_at` datetime not null default CURRENT_TIMESTAMP);


DROP TABLE IF EXISTS "tbpages";
CREATE TABLE `tbpages` (`id` integer not null primary key autoincrement, `level_1_name` text default null, `level_2_name` text default null, `pages` integer not null default '0', `created_at` datetime not null default CURRENT_TIMESTAMP, `updated_at` datetime not null default CURRENT_TIMESTAMP);


-- 