# 贴吧目录扫完计划 脚本

请确认已安装 `deno`

## 取得 dir.json

使用大吧主账号登录后打开吧务后台，打开开发者控制台（F12），运行

```javascript
(async () => {
    let response = await fetch('http://tieba.baidu.com/bawu2/platform/getAllDir?word='+ [...(document.getElementsByClassName("forum-name")[0].innerText)].slice(0, -1).join('') +'&ie=utf-8')
    console.log(JSON.encode((await response.json()).all_dir))
})()
```

将返回的内容拷贝到 `~/assets/dir.json` 覆盖

## 授权

- **dir.json** 文件内容为[**百度贴吧**](https://tieba.baidu.com)所有，
