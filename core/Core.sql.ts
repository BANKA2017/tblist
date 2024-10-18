import { DB } from "https://deno.land/x/sqlite/mod.ts";
import { basePath } from './Core.utils.ts';

const db = new DB(basePath + '/db/tblist.db');

export default db