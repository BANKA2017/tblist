import { DB } from "https://deno.land/x/sqlite@v3.9.1/mod.ts";

const db = new DB();
const db_new = new DB();

const batchSize = 1000;
let lastId = 0;

const total = db.query<[number]>(`SELECT COUNT(*) FROM tblite`)[0][0];
let processed = 0;

let xxx = [0, 0, 0]

while (true) {

    const rows = db.query<[number, number, string]>(`
        SELECT id, fid, fname, gb2312_urlencode
        FROM tblite
        WHERE id > ?
        ORDER BY id
        LIMIT ?
    `, [lastId, batchSize]);

    if (rows.length === 0) break;

    db_new.transaction(() => {

        for (const [id, fid, fname, gb2312_urlencode] of rows) {
            // console.log([id, fid, fname, gb2312_urlencode])
            if (fid > 0) {

                const exist = db_new.query(
                    "SELECT * FROM tblite WHERE fid=?",
                    [fid]
                );

                if (exist.length === 0) {
                    db_new.query(`
                        INSERT OR IGNORE INTO tblite (fid, fname, created_at, updated_at)
                        VALUES (?, ?, datetime('now'), datetime('now'))
                    `, [fid, fname]);

                    xxx[0]++
                } else {
                    db_new.query(`
                        INSERT OR IGNORE INTO tblite (level_1_name, level_2_name, fname, real_fname, fid, member_num, post_num, thread_num, created_at, updated_at)
                        VALUES (:level_1_name, :level_2_name, :fname, :real_fname,  :fid, :member_num, :post_num, :thread_num, datetime('now'), datetime('now'))
                    `, {
                            level_1_name: exist[0][1],
                            level_2_name: exist[0][2],
                            fname: fname,
                            real_fname: exist[0][4],
                            // gb2312_urlencode: gb2312_urlencode,

                            "fid": exist[0][6],
                            "member_num": exist[0][7],
                            "post_num"  : exist[0][8],
                            "thread_num": exist[0][9],
                        });
                    xxx[1]++
                }

            } else {

                const exist = db_new.query(
                    "SELECT id FROM tblite WHERE fname=? LIMIT 1",
                    [fname]
                );

                if (exist.length === 0) {
                    db_new.query(`
                        INSERT OR IGNORE INTO tblite (fid, fname, created_at, updated_at)
                        VALUES (0, ?, datetime('now'), datetime('now'))
                    `, [fname]);
                    xxx[2]++
                }
            }

            lastId = id;
            processed++;
        }

    });

    console.log(`progress: ${processed}/${total} ${(processed/total*100).toFixed(2)}%`, xxx);
}

console.log("done");
