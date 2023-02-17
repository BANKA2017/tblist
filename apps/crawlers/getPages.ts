import { readFileSync } from 'node:fs'
import { GetPage } from '../../core/Core.fetch.ts'
import db from '../../core/Core.sql.ts';
import { basePath } from '../../core/Core.utils.ts'

const dirList: {level_1_name: string; level_2_name: string[]}[] = JSON.parse(readFileSync(basePath + '/assets/dir.json').toString())

const now = new Date()
for (const dir of dirList) {
    const fdir = dir.level_1_name
    const pages = await GetPage(fdir, dir.level_2_name, 1)
    for (const data of pages) {
        if (data.status !== 'fulfilled' || !data.value?.response) {
            console.log(`tblist: No page [${data.reason.level1Name}/${data.reason.level2Name}]`)
            continue
        }
        const regex = /<a href=\"\/f\/fdir\?fd=.*&sd=.*&pn=([0-9]+)\">/gm
        try {
            const tmpPageList = []
            let m
            while ((m = regex.exec(data.value.response)) !== null) {
                if (m.index === regex.lastIndex) {
                    regex.lastIndex++;
                }
                tmpPageList.push(m[1])
            }
            let pn = '1'
            //console.log(tmpPageList)
            if (tmpPageList.length) {
                const tmpPn = tmpPageList.pop()
                if (tmpPn) {
                    pn = tmpPn
                }
            }
            console.log(`tblist: ${data.value.level1Name} / ${data.value.level2Name}: ${pn}`)
            db.query('INSERT INTO `tbpages` (level_1_name, level_2_name, pages) VALUES (:level_1_name, :level_2_name, :pages)', {level_1_name: data.value.level1Name, level_2_name: data.value.level2Name, pages: pn})
        } catch (e) {
            console.log(e)
        }
    }
}

console.log(`tblist: time cost ` + (Number(new Date()) - Number(now)) / 1000)

Deno.exit()