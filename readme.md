# 贴吧目录扫完计划 脚本

请确认已安装 `deno`

## 取得 dir.json

```javascript
(async () => {
    let response = await fetch('https://tieba.baidu.com/mo/q/common/getAllForumDir')
    console.log(JSON.stringify(Object.entries((await response.json()).data).filter(list => !isNaN(list[0])).map(list => {list[1].level_2_name = list[1].level_2_name.sort((a, b) => a.level_1_name > b.level_1_name ? 1 : -1); return list[1]}).sort((a, b) => a.level_1_name > b.level_1_name ? 1 : -1)))
})()
```

将返回的 `json` 拷贝到 `~/assets/dir.json` 覆盖

