// tblist_25071401_all - Copy.db

import { DB } from "https://deno.land/x/sqlite@v3.9.1/mod.ts";
import { convertURIToUTF8 } from "../../core/Core.utils.ts";

const db = new DB();

const batchSize = 10000; // 可改 10000
let lastId = 0;

const total = db.query<[number]>(`
    SELECT COUNT(id)
    FROM tblite
    WHERE gb2312_urlencode IS NOT NULL
      AND gb2312_urlencode != ''
`)[0][0];

let processed = 0;
let updated = 0;

while (true) {

    const rows = db.query<[number, string, string]>(`
        SELECT id, fname, gb2312_urlencode
        FROM tblite
        WHERE id > ?
          AND gb2312_urlencode IS NOT NULL
          AND gb2312_urlencode != ''
        ORDER BY id
        LIMIT ?
    `, [lastId, batchSize]);

    if (rows.length === 0) break;

    db.transaction(() => {

        for (const [id, fname, encoded] of rows) {
            try {
                const decoded = convertURIToUTF8(encoded);

                if (decoded !== fname) {
                    db.query(
                        "UPDATE tblite SET fname=?, updated_at=datetime('now') WHERE id=?",
                        [decoded, id]
                    );
                    updated++;
                }

                lastId = id;
                processed++;

            } catch (e) {
                console.log("decode failed:", id, encoded);
            }
        }

    });

    console.log(
        `progress: ${processed}/${total} (${(processed/total*100).toFixed(2)}%), updated=${updated}`
    );
}

console.log("done, updated:", updated);
db.close();