import { htmlspecialchars } from './Core.utils.ts'

interface GetPageResponse {
    response: string | ArrayBuffer;
    level1Name: string;
    level2Name: string;
    pn: number;
    encode: string;
}

interface GetForumInfoArgs {
    id: number;
    fname: string;
    gb2312_urlencode: string
    level_1_name?: string
    level_2_name?: string
}

interface GetForumInfoResponse {
    forum: {
        id: number
        post_num: number
        member_num: number
        first_class: string
        second_class: string
        thread_num: number
        name: string
        avatar: string
    }
    time: number
    error_code: number | string
    error_msg: string
}

interface GetForumInfoReturn {
    response: string | GetForumInfoResponse
    fname: GetForumInfoArgs | GetForumInfoArgs[]
}

const userAgent = 'Mozilla/5.0 (iPad; CPU OS 18_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) CriOS/130.0.6723.37 Mobile/15E148 Safari/604.1'

const GetPage = (level1Name = '', level2Name: string | string[] = '', pn: number | number[] = 1, encode = 'utf8'): Promise<GetPageResponse|PromiseSettledResult<GetPageResponse>[]> => {
    if (Array.isArray(level2Name)) {
        return Promise.allSettled(level2Name.map(name => GetPage(level1Name, name, pn, encode)))
    } else if (Array.isArray(pn)) {
        return Promise.allSettled(pn.map(_pn => GetPage(level1Name, level2Name, _pn, encode)))
    }
    return (new Promise((resolve, reject) => {
        //https://tieba.baidu.com/f/fdir?fd=%B8%F6%C8%CB%CC%F9%B0%C9&sd=%B8%F6%C8%CB%CC%F9%B0%C9&pn=1500
        fetch(`https://tieba.baidu.com/f/fdir?` + (new URLSearchParams({
            ie: 'utf-8',
            fd: level1Name,
            sd: level2Name,
            pn: String(pn)
        }).toString()), {
            method: 'GET',
            redirect: 'follow',
            headers: {
                'user-agent': userAgent,
            }
        }).then((response: Response): Promise<string | ArrayBuffer> => encode === 'binary' ? response.arrayBuffer() : response.text()).then((response: string | ArrayBuffer) => {
            resolve({response, level1Name, level2Name, pn, encode})
        }).catch(e => {
            const textError = e.toString()
            reject({response: textError, level1Name, level2Name, pn, encode})
        })
    }))
}

//get forum info
const getForumInfoLink = atob('aHR0cHM6Ly90aWViYS5iYWlkdS5jb20vYy9mL2Zycy9mcnNCb3R0b20')
const GetForumInfo = (fname: GetForumInfoArgs | GetForumInfoArgs[] = []): Promise<GetForumInfoReturn|PromiseSettledResult<GetForumInfoReturn>[]> => {
    if (Array.isArray(fname)) {
        return Promise.allSettled(fname.map(name => GetForumInfo(name)))
    }

    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 10000);

    return (new Promise((resolve, reject) => {
        fetch(getForumInfoLink + '?' + (new URLSearchParams({
            kw: htmlspecialchars(fname.fname)
        }).toString()), {
            method: 'GET',
            redirect: 'follow',
            headers: {
                'Subapp-Type': 'hybrid',
                'user-agent': 'tieba/12.71.1.0',
            },
            signal: controller.signal
        }).then(response => response.json()).then(response => {
            resolve({response, fname})
        }).catch(e => {
            const textError = e.toString()
            reject({response: textError, fname})
        }).finally(() => {
            clearTimeout(timeout)
        })
    }))
}

//const GetAdmin

export {GetPage, GetForumInfo}