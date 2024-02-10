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
}

interface GetForumInfoSuccessResponse {
    data: {
        activityhead?: {
            activity_title: string;
            activity_type: number;
            head_imgs: { img_url: string; pc_url: string; subtitle: string; title: string; }[];
            top_size: {height: number; width: number};
        };
        forum: {
            avatar: string;
            first_dir: string;
            id: number;
            is_exists: number;
            member_num: number;
            name: string;
            post_num: number;
            second_dir: string;
            theme_color: {[p in 'dark' | 'day' | 'night']: {[q in string]: string}}[];
            thread_num: number;
        };
        nav_tab_info: {[p in string]: {tab_id: number; tab_name: string; tab_type: number; tab_url: string;}[]};
        page: {
            current_page: number;
            has_more: number;
            offset: number;
            page_size: number;
            req_num: number;
            total_num: number;
            total_page: number;
        };
        sample_id?: number | string;
        tbs: string;
        thread_list: [];
        tokens: {[p in string]: string};
        top_query: {
            display_query: string;
            hot_icon: number;
            hot_num: number;
            query_md5: string;
        }[];
        ubs_abtest_config: null;
        ubs_sample_ids: null;
        user: {};
    };
    errmsg: string;
    errno: number | string;
    logid: number | string;
    server_time: number;
    time: string;
}
interface GetForumInfoErrorResponse {
    errmsg: string;
    errno: number | string;
    logid?: number | string;
    sample_id?: number;
    server_time?: number;
    tbs?: string;
    time?: string;
    ubs_abtest_config?: {[p in string]: string}[];
    ubs_sample_ids?: string;
}

interface GetForumInfoReturn {
    response: string | GetForumInfoSuccessResponse | GetForumInfoErrorResponse;
    fname: GetForumInfoArgs | GetForumInfoArgs[]
}

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
                'user-agent': 'Mozilla/5.0 (iPhone; CPU iPhone OS 13_2_3 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/13.0.3 Mobile/15E148 Safari/604.1',
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
const GetForumInfo = (fname: GetForumInfoArgs | GetForumInfoArgs[] = []): Promise<GetForumInfoReturn|PromiseSettledResult<GetForumInfoReturn>[]> => {
    if (Array.isArray(fname)) {
        return Promise.allSettled(fname.map(name => GetForumInfo(name)))
    }
    return (new Promise((resolve, reject) => {
        fetch(`https://tieba.baidu.com/mg/f/getFrsData?` + (new URLSearchParams({
            kw: fname.fname.replaceAll('&gt;', '>').replaceAll('&lt;', '<').replaceAll("&amp;", "&").replaceAll("&quot;", '"').replaceAll('&#039;', "'")
        }).toString()), {
            method: 'GET',
            redirect: 'follow',
            headers: {
                'user-agent': 'Mozilla/5.0 (iPhone; CPU iPhone OS 13_2_3 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/13.0.3 Mobile/15E148 Safari/604.1',
            }
        }).then((response: Response): Promise<GetForumInfoSuccessResponse | GetForumInfoErrorResponse> => response.json()).then(response => {
            resolve({response, fname})
        }).catch(e => {
            const textError = e.toString()
            reject({response: textError, fname})
        })
    }))
}

//const GetAdmin

export {GetPage, GetForumInfo}