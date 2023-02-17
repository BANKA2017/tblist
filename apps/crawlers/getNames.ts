import { existsSync, readFileSync, writeFileSync } from 'node:fs'
import { ArrayFill, basePath } from '../../core/Core.utils.ts';
import { GetPage } from '../../core/Core.fetch.ts';
import db from '../../core/Core.sql.ts';

//const dirList = JSON.parse(readFileSync(basePath + '/assets/dir.json'))
const dirInfo: {level_1_name: string; level_2_name: string; pages: number;}[] = db.query<[string, string, number]>("SELECT level_1_name, level_2_name, pages FROM tbpages ").map(data => ({level_1_name: data[0], level_2_name: data[1], pages: data[2]})).filter(x => x.pages)

//const existCount = await TbLite.findOne({
//    attributes: [[sssql.fn('COUNT', 'id'), 'count']],
//    raw: true
//})
const totalCount = dirInfo.map(dir => dir.pages).reduce((a, b) => a + (b > 1500 ? 1500 : b), 0)// - (existCount?.count || 0)
let requestCount = 0

console.log(`tblist: total pages -->${totalCount}<--`)

const now = new Date()

let skip = false
let autoSkip: [string, string, number] | [] = []

//await db.query("PRAGMA journal_mode = wal;")
//await db.query("PRAGMA synchronous = NORMAL;")


if (existsSync(basePath + '/db/cursor.json')) {
    skip = true
    autoSkip = JSON.parse(readFileSync(basePath + '/db/cursor.json').toString())
}

for (const dir of dirInfo) {
    let pn = 1
    if ((skip && (((autoSkip?.[0] || '') === dir.level_1_name) && ((autoSkip?.[1] || '') === dir.level_2_name)))) {
        pn = (autoSkip?.[2] || 0) + 1
        skip = false
    } else if (skip) {
        continue
    }
    const basePn = dir.pages > 1500 ? 1500 : dir.pages
    for (; pn <= basePn; pn += 100 ) {
        const pageInfo = await GetPage(dir.level_1_name, dir.level_2_name, ArrayFill(pn, (pn + 100 > basePn ? basePn - pn : 100)), 'binary')
        for (const tmpPageData of pageInfo) {
            if (tmpPageData.status !== 'fulfilled' || !tmpPageData.value?.response) {
                console.log(tmpPageData)
                console.log(`tblist: no such page [${dir.level_1_name}/${dir.level_1_name}/${tmpPageData.value.pn}]`)
                continue
            }
            const pagePn = tmpPageData.value.pn
            
            const page = (new TextDecoder('gbk')).decode(tmpPageData.value.response)
            const regex = /<a href=\'http:\/\/tieba.baidu.com\/f\?kw=(.+?)\' target=\'_blank\'>(.+?)<\/a>/gm
            const tmpList: {gb2312_urlencode: string; fname: string}[] = []
            let m
            while ((m = regex.exec(page)) !== null) {
                if (m.index === regex.lastIndex) {
                    regex.lastIndex++;
                }
                tmpList.push({gb2312_urlencode: m[1], fname: m[2]})
            }

            requestCount++

            try {
                db.transaction(() => {
                    for (const finfo of tmpList) {
                        db.query('INSERT INTO `tblite` (level_1_name, level_2_name, fname, gb2312_urlencode) VALUES (:level_1_name, :level_2_name, :fname, :gb2312_urlencode)', {level_1_name: dir.level_1_name, level_2_name: dir.level_2_name, fname: finfo.fname.replaceAll('&gt;', '>').replaceAll('&lt;', '<').replaceAll("&amp;", "&").replaceAll("&quot;", '"'), gb2312_urlencode: finfo.gb2312_urlencode})
                    }
                })
                //console.log(`tblist: ` + tmpList.map(info => info.fname).join(', '))
                writeFileSync(basePath + '/db/cursor.json', JSON.stringify([dir.level_1_name, dir.level_2_name, pagePn]))
                console.log(`tblist: ${dir.level_1_name}/${dir.level_2_name}\t${pagePn}/${basePn} ${requestCount}/${totalCount}`, Math.floor(pagePn / basePn * 100) + '%', Math.floor(requestCount / totalCount * 100) + '%')
            } catch (e) {
                console.log(e.toString(), `${dir.level_1_name}/${dir.level_2_name}\t${pagePn}/${basePn} ${requestCount}/${totalCount}`, Math.floor(pagePn / basePn * 100) + '%', Math.floor(requestCount / totalCount * 100) + '%')
                Deno.exit()
            }
        }
        
        //console.log('tblist: wait for vacuum...')
        //await sssql.query("VACUUM;")
    }
}


console.log(`tblist: time cost ` + (Number(new Date()) - Number(now)) / 1000)

Deno.exit()