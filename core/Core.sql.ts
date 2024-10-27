import { DB } from "https://deno.land/x/sqlite@v3.9.1/mod.ts";
import { basePath } from './Core.utils.ts';

const db = new DB(basePath + '/db/tblist.db');
// WAL mode is not yet supported
// db.execute('PRAGMA busy_timeout = 5000;PRAGMA synchronous = NORMAL;PRAGMA cache_size = 100000;PRAGMA foreign_keys = true;PRAGMA temp_store = memory;');

export default db