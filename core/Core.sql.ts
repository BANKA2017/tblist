import { DB } from "https://deno.land/x/sqlite@v3.7.0/mod.ts";
import { basePath } from './Core.utils.ts';

const db = new DB(basePath + '/db/tblist.db');

export default db