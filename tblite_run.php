<?php
/* tblist tblite
 * @banka2017 & KD·NETWORK
 */
set_time_limit(0);
ignore_user_abort(true);
require __DIR__ . '/scurl.php';
$forum_count = 1;
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
$skip = false;
$dirs = json_decode(file_get_contents(dirname(__FILE__).'/dir.json'), true);
if(file_exists(dirname(__FILE__).'/cursor.json')){
    $skip = true;
    $auto_skip = json_decode(file_get_contents(dirname(__FILE__).'/cursor.json'), true);
}
foreach ($dirs as $dir) {
    $fdir = $dir["level_1_name"];
    if($skip && ($auto_skip[0]??"") != $fdir){
        continue;
    }
    foreach ($dir["level_2_name"] as $sdir) {
        if($skip && ($auto_skip[1]??"") != $sdir){
            continue;
        }
        //计算页数
        $a = new sscurl("http://tieba.baidu.com/f/fdir?" . http_build_query(["ie" => "utf-8", "fd" => $fdir, "sd" => $sdir]));
        if ($a != "") {
            preg_match_all('/<a href=\"\/f\/fdir\?fd=(.*)&sd=(.*)&pn=([0-9]+)\">/', $a, $b) ? $pn = $b[3][count($b[3])-1] : $pn = 1;
            if ($pn > 1500) {
                $pn = 1500;
            }
            echo $dir["level_1_name"].'/'.$sdir.':'." {$pn} 页\n";
            $origin_pn = 1;
            if($skip){
                $origin_pn = ++$auto_skip[2];
                $skip = false;
            }
            for ($x = $origin_pn; $x <= $pn; $x++) {
                $a = mb_convert_encoding(new sscurl("http://tieba.baidu.com/f/fdir?" . http_build_query(["ie" => "utf-8", "fd" => $fdir, "sd" => $sdir, "pn" => $x])), "UTF-8", "GBK");
                preg_match_all('/<a href=\'http:\/\/tieba.baidu.com\/f\?kw=(.*)\' target=\'_blank\'>(.*)<\/a>/', $a, $c);
                $sql = '';
                for($xxx=0;$xxx<count($c[2]);$xxx++){
                    if($c[2][$xxx] != null){
                        $ffname = $conn->escapeString($c[2][$xxx]);
                        $gb2312_urlencode = $conn->escapeString($c[1][$xxx]);
                        $sql .= 'INSERT INTO tblite (level_1_name, level_2_name, fname, gb2312_urlencode) VALUES ("' . $fdir . '", "' . $sdir . '", "' . $ffname . '", "' . $gb2312_urlencode . '");';
                    }
                }
                file_put_contents(dirname(__FILE__).'/cursor.json',json_encode([$dir["level_1_name"],$sdir,$x]));

                if ($conn->exec('PRAGMA journal_mode = wal; BEGIN; ' . $sql . ' COMMIT;') === TRUE) {
                    echo "{$forum_count}.".$dir["level_1_name"].'/'.$sdir.': '.$x." 页成功\n";
                } else {
                    echo "Error: " . $sql . $conn->lastErrorMsg() . "\n";
                }
                $forum_count++;
            }}
    }
}
$conn->exec('VACUUM;');
$conn->close();
unlink(dirname(__FILE__).'/cursor.json');
echo "完成\n";
