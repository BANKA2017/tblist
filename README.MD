# 贴吧目录扫完计划 脚本

请确认已安装 `php8.0`, `php-json`, `php-sqlite`, `php-curl`

## tblist

暂无开源计划

---

## tblite

tblite只包含一、二级目录、贴吧名称、gb2312编码的urlencode编码

- 执行 ```php tbilte_run.php```

---

## tbpages

tblite只包含一、二级目录、二级目录页数

- 执行 ```php tbpages_run.php```

---

## 数据库

使用 sqlite，开箱即用

## 取得 dir.json

使用大吧主账号登录后打开吧务后台，打开开发者控制台（F12），运行

```javascript
(async () => {
    let response = await fetch('http://tieba.baidu.com/bawu2/platform/getAllDir?word='+ [...(document.getElementsByClassName("forum-name")[0].innerText)].slice(0, -1).join('') +'&ie=utf-8')
    console.log(JSON.encode((await response.json()).all_dir))
})()
```

将返回的内容拷贝到 `dir.json` 覆盖

## 授权

- 脚本本体 WTFPL
- **dir.json** 文件内容为[**百度贴吧**](https://tieba.baidu.com)所有，
