<?php
/* tblist
 * @banka2017 & KD·NETWORK
 */
set_time_limit(0);
ignore_user_abort(true);
require(dirname(__FILE__) . '/config.php');
// 创建连接
$conn = new mysqli($servername, $username, $password, $dbname);
// 检测连接
if ($conn->connect_error) {
    die("连接失败: " . $conn->connect_error);
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
        $conn -> query($sql);
    }
}
$conn->close();
echo "完成\n";