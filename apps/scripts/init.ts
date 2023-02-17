import { copyFileSync, renameSync, existsSync } from 'node:fs'
import { basePath } from "../../core/Core.utils.ts"

if (existsSync(basePath + '/db/tblist.db')) {
    console.log(existsSync(basePath + '/db/tblist.db'))
    const tmpName = `backup_${Number(new Date()).toString()}_tblist.db`
    renameSync(basePath + '/db/tblist.db', basePath + `/db/${tmpName}`)
    console.log(`tblist: rename existed tblist.db to ${tmpName}`)
}

copyFileSync(basePath + '/assets/_tblist.db', basePath + '/db/tblist.db')

console.log('tblist: init done')

Deno.exit()