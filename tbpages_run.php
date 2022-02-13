<?php
/* tblist tbpages
 * @banka2017 & KD·NETWORK
 */
set_time_limit(0);
ignore_user_abort(true);
require __DIR__ . '/scurl.php';
// 创建连接

class SSQlite extends SQLite3 {
    function __construct () {
        $this->open(__DIR__ . '/tblist.db');
    }
}

$conn = new SSQlite();

// 检测连接
if (!$conn) {
    die("连接失败: " . $conn->lastReeorMsg());
}
$dirs = json_decode(file_get_contents(dirname(__FILE__).'/dir.json'), true);
foreach ($dirs as $dir) {
    $fdir = $dir["level_1_name"];
    foreach ($dir["level_2_name"] as $sdir) {
        //计算页数
        $a = file_get_contents("http://tieba.baidu.com/f/fdir?ie=utf-8&fd=" . urlencode($fdir) . "&sd=" . urlencode($sdir));
        if ($a != "") {
            preg_match_all('/<a href=\"\/f\/fdir\?fd=(.*)&sd=(.*)&pn=([0-9]+)\">/', $a, $b) ? $pn = $b[3][count($b[3])-1] : $pn = 1;
            echo $dir["level_1_name"].'/'.$sdir.':'." {$pn} 页\n";
            $sql = 'INSERT INTO tbpages (level_1_name, level_2_name, pages) VALUES ("' . $fdir . '", "' . $sdir . '", "' . $pn . '");';
        }else{
            throw new Exception('网页访问出错！');
        }
        $conn -> exec('PRAGMA journal_mode = wal; BEGIN; ' . $sql . ' COMMIT;');
    }
}
$conn->exec('VACUUM;');
$conn->close();
echo "完成\n";
