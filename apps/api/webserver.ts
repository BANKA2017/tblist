import { serve } from "https://deno.land/std@0.177.0/http/server.ts"
import { DB } from "https://deno.land/x/sqlite@v3.7.0/mod.ts";
import { apiTemplate, basePath } from "../../core/Core.utils.ts"

const port = 3010

const db = new DB(basePath + '/db/tblist.db', {mode: 'read'});

interface RequestInfo {
    host: string;
    hostname: string;
    port: string;
    pathname: string;
    search: {[p in string]: string[]}
}

const handler = (request: Request): Response => {
    if (request.method.toLowerCase() === 'head') {
        return new Response('pong', { status: 200 })
    } else if (request.method.toLowerCase() === 'get') {
        //get request info

        const tmpRequestUrlParse = new URL(request.url)
        let requestInfo: RequestInfo = {
            host: tmpRequestUrlParse.host,
            hostname: tmpRequestUrlParse.hostname,
            port: tmpRequestUrlParse.port,
            pathname: tmpRequestUrlParse.pathname + (!tmpRequestUrlParse.pathname.endsWith('/') ? '/' : ''),
            search: {}
        }

        const tmpKeys: string[] = []
        const tmpURLSearchParams = new URLSearchParams(tmpRequestUrlParse.search)
        for (const key of tmpURLSearchParams.keys()) {
            if (!tmpKeys.includes(key)) {
                tmpKeys.push(key)
            }
        }
        
        requestInfo.search = Object.fromEntries(tmpKeys.map(key => [key, tmpURLSearchParams.getAll(key)]))

        let responseData: any = {}
        switch (requestInfo.pathname) {
            case '/api/v1/data/list/':
                responseData = QueryTiebaList(requestInfo.search)
                break;
            
        }

        return new Response(JSON.stringify(apiTemplate(200, 'OK', responseData)), {
            status: 200,
            headers: {
                "content-type": "application/json; charset=utf-8",
            },
        })
    } else {
        return new Response(JSON.stringify(apiTemplate()), {
            status: 403,
            headers: {
                "content-type": "application/json; charset=utf-8",
            },
        })
    }
    
}

const VerifyQueryString = (value: string | number | null | string[], defaultValue: string | number | bigint | boolean | null) => {
    if (Array.isArray(value)) {
        value = value[0]
    }
    if (!value || typeof value === 'object' || ((typeof defaultValue === 'number' || typeof defaultValue === 'bigint') && isNaN(Number(value)))) {
        return defaultValue
    }

    if (typeof defaultValue === 'number' && typeof value === 'number' && (value > Number.MAX_SAFE_INTEGER || value < Number.MIN_SAFE_INTEGER)) {
        return defaultValue
    }

    if (typeof defaultValue === 'boolean') {
        return ![0, '0', 'false'].includes(value)
    }
    return value
}

const QueryTiebaList = (query: RequestInfo["search"]) => {
    const tmpQueryObject = {
        level_1_name: VerifyQueryString(query.level_1_name, ''),
        level_2_name: VerifyQueryString(query.level_2_name, ''),
        fname: VerifyQueryString(query.fname, ''),
        //sameForum: VerifyQueryString(query.sameForum[0], false),
        exist: VerifyQueryString(query.exist, null),
        
    }
    const orderBy = VerifyQueryString(query.orderBy, '')
    //const desc = VerifyQueryString(query.desc, false) ? 'DESC' : 'ASC'
    const limit = Number(VerifyQueryString(query.limit, 100))
    const pages = Number(VerifyQueryString(query.pages, 1))


    //query
    const queryArray = []
    if (tmpQueryObject.exist !== null) {
        queryArray.push(tmpQueryObject.exist ? 'fid != 0' : 'fid = 0')
    }
    if (tmpQueryObject.level_1_name) {
        queryArray.push(`level_1_name = :level_1_name`)
    }
    if (tmpQueryObject.level_2_name) {
        queryArray.push(`level_2_name = :level_2_name`)
    }
    if (tmpQueryObject.fname) {
        queryArray.push(`fname = :fname`)
    }

    let queryBindingValue = {
        level_1_name: tmpQueryObject.level_1_name ? tmpQueryObject.level_1_name : undefined,
        level_2_name: tmpQueryObject.level_2_name ? tmpQueryObject.level_2_name : undefined,
        fname: tmpQueryObject.fname ? tmpQueryObject.fname : undefined,
        order: orderBy ? orderBy : undefined,
        limit: limit,
        offset: (pages <= 0 ? 0 : (pages - 1) * limit)
    }

    //clean empty value
    Object.keys(queryBindingValue).forEach((key: string) => {
        if (queryBindingValue[key] === undefined) {
            delete queryBindingValue[key]
        }
    })

    console.log(queryBindingValue)
    const dbData = db.queryEntries<{id: number; level_1_name: string; level_2_name: string; fname: string; real_fname: string; gb2312_urlencode: string; fid: number; member_num: number; post_num: number; thread_num: number; created_at: string; updated_at: string}>(`SELECT * FROM tblite ${(queryArray.length ? 'WHERE ' : '') + queryArray.join(' AND ')} ${(orderBy ? `ORDER BY :order` : '')} LIMIT :limit OFFSET :offset`, queryBindingValue)
    return dbData
}



console.log(`HTTP webserver running. Access it at: http://localhost:${port}/`)
await serve(handler, { port })