import { GetForumInfo } from "../../core/Core.fetch.ts";
import db from "../../core/Core.sql.ts";


let tiebaList: {id: number; fname: string; gb2312_urlencode: string}[]
const now = new Date()

//get count
const sqlExist = db.query<[number]>("SELECT COUNT('id') as exist FROM tblite WHERE real_fname IS NOT NULL;")[0][0]
const sqlTotal = db.query<[number]>("SELECT COUNT('id') as total FROM tblite;")[0][0]

let exist = sqlExist
const total = sqlTotal

let limit = 60

while (tiebaList = db.query<[number, string, string]>("SELECT id, fname, gb2312_urlencode FROM tblite WHERE fid = 0 AND real_fname IS NULL LIMIT " + limit + ";").map(data => ({id: data[0], fname: data[1], gb2312_urlencode: data[2]}))) {
    if (tiebaList.length < 1) {
        console.log('tblist: ended')
        break
    }
    const tmpTiebaInfo = await GetForumInfo(tiebaList)

    if (exist > total) {
        break
    }
    try {
        const tmpCount = {success: 0, error: 0}
        const tmpNow = new Date()
        db.transaction(() => {
            for (const tiebaInfo of tmpTiebaInfo) {
                if (tiebaInfo.status === 'fulfilled' && tiebaInfo.value?.response && !tiebaInfo.value?.response?.errno) {
                    db.query("UPDATE tblite SET real_fname = :real_fname, fid = :fid, member_num = :member_num, post_num = :post_num, thread_num = :thread_num, updated_at = datetime('now') WHERE id = :id", {
                        id: tiebaInfo?.value?.fname?.id || tiebaInfo?.reason?.fname?.id,
                        real_fname: tiebaInfo.value.response?.data?.forum?.name || '',
                        fid: tiebaInfo.value.response?.data?.forum?.id || 0,
                        member_num: tiebaInfo.value.response?.data?.forum?.member_num || 0,
                        post_num: tiebaInfo.value.response?.data?.forum?.post_num || 0,
                        thread_num: tiebaInfo.value.response?.data?.forum?.thread_num || 0
                    })
                } else if (tiebaInfo.status === 'fulfilled' && tiebaInfo.value?.response && [340000, 340001].includes(tiebaInfo.value?.response?.errno)) {
                    db.query("UPDATE tblite SET real_fname = :real_fname, fid = :fid, member_num = :member_num, post_num = :post_num, thread_num = :thread_num, updated_at = datetime('now') WHERE id = :id", {
                        id: tiebaInfo?.value?.fname?.id || tiebaInfo?.reason?.fname?.id,
                        real_fname: tiebaInfo.value?.response?.errmsg,//tiebaInfo.value.response?.data?.forum?.name || '',
                        fid: tiebaInfo.value.response?.data?.forum?.id || 0,
                        member_num: tiebaInfo.value.response?.data?.forum?.member_num || 0,
                        post_num: tiebaInfo.value.response?.data?.forum?.post_num || 0,
                        thread_num: tiebaInfo.value.response?.data?.forum?.thread_num || 0
                    })
                } else if (tiebaInfo.status === 'rejected') {
                    tmpCount.error++
                    //console.log(tiebaInfo.reason.response)
                    continue
                }
                tmpCount.success++
                exist++
                if (!tiebaInfo.value?.fname?.fname) {
                    console.log(tiebaInfo)
                }
            }
        })

        // dynamic limit
        if (tmpCount.error > 10 && limit >= 20) {
            limit -= 5
        } else if (tmpCount.error <= 5 && limit <= 60) {
            limit += 5
        }
        console.log(Number(new Date()) - Number(tmpNow))
        console.log(tmpCount)
        console.log(tiebaList.map(tieba => tieba.fname).join(', ') + '')
        console.log(`tblist: total ${exist}/${total}`, (Math.floor(exist/total * 10000) / 100) + '%')
        //Deno.exit()
    } catch (e) {
        console.log(e)
    }
    
}

//await sssql.query("VACUUM;")
console.log(`tblist: time cost ` + (Number(new Date()) - Number(now)) / 1000)

Deno.exit()