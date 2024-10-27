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

let safeError = 0

while (tiebaList = db.query<[number, string, string]>("SELECT id, fname, gb2312_urlencode, level_1_name, level_2_name FROM tblite WHERE fid = 0 AND real_fname IS NULL LIMIT " + limit + ";").map(data => ({id: data[0], fname: data[1], gb2312_urlencode: data[2]}))) {
    if (tiebaList.length < 1) {
        console.log('tblist: ended')
        break
    }
    if (safeError > 5000) {
        console.log('tblist: safe error break')
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
                if (tiebaInfo.status === 'fulfilled' && tiebaInfo.value?.response && !tiebaInfo.value?.response?.error_code) {
                    const updateFdirOrSdir = !((tiebaInfo?.value?.fname?.level_1_name || tiebaInfo?.reason?.fname?.level_1_name) && (tiebaInfo?.value?.fname?.level_2_name || tiebaInfo?.reason?.fname?.level_2_name))
                    db.query("UPDATE tblite SET real_fname = :real_fname, fid = :fid, member_num = :member_num, post_num = :post_num, thread_num = :thread_num, updated_at = datetime('now')" + (updateFdirOrSdir ? ", level_1_name = :level_1_name, level_2_name = :level_2_name" : '') + " WHERE id = :id", {
                        id: tiebaInfo?.value?.fname?.id || tiebaInfo?.reason?.fname?.id || 0,
                        real_fname: tiebaInfo.value.response?.forum?.name || '',
                        fid: tiebaInfo.value.response?.forum?.id || 0,
                        member_num: tiebaInfo.value.response?.forum?.member_num || 0,
                        post_num: tiebaInfo.value.response?.forum?.post_num || 0,
                        thread_num: tiebaInfo.value.response?.forum?.thread_num || 0,
                        level_1_name: tiebaInfo.value.response?.forum?.first_class || '',
                        level_2_name: tiebaInfo.value.response?.forum?.second_class || ''
                    })
                } else if (tiebaInfo.status === 'fulfilled' && tiebaInfo.value?.response && [3].includes(tiebaInfo.value?.response?.error_code)) {
                    // 3 -> 该吧还未建立，去看看其他贴吧吧
                    db.query("UPDATE tblite SET real_fname = :real_fname, fid = :fid, member_num = :member_num, post_num = :post_num, thread_num = :thread_num, updated_at = datetime('now') WHERE id = :id", {
                        id: tiebaInfo?.value?.fname?.id || tiebaInfo?.reason?.fname?.id || 0,
                        real_fname: tiebaInfo.value?.response?.error_msg,//tiebaInfo.value.response?.forum?.name || '',
                        fid: tiebaInfo.value.response?.forum?.id || 0,
                        member_num: tiebaInfo.value.response?.forum?.member_num || 0,
                        post_num: tiebaInfo.value.response?.forum?.post_num || 0,
                        thread_num: tiebaInfo.value.response?.forum?.thread_num || 0
                    })
                } else if (tiebaInfo.status === 'rejected') {
                    tmpCount.error++
                    safeError++
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
        if (tmpCount.error > 10 && limit >= 10) {
            limit -= 5
        } else if (tmpCount.error <= 5 && limit <= 60) {
            limit += 5
        }

        if (tmpCount.error === 0) {
            safeError = 0
        }

        console.log(Number(new Date()) - Number(tmpNow))
        console.log(tmpCount, safeError)
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
