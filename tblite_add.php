<?php
/* tblist
 * @banka2017 & KD·NETWORK
 */
set_time_limit(0);
ignore_user_abort(true);
require(dirname(__FILE__) . '/config.php');
$sdsdsfdfefddvddfdf = 1;
$argvv = getopt("",["fdir:", "sdir:", "page:"]);
// 创建连接
$conn = new mysqli($servername, $username, $password, $dbname);
// 检测连接
if ($conn->connect_error) {
    die("连接失败: " . $conn->connect_error);
}
$fdir = $argvv["fdir"];
$sdir = $argvv["sdir"];
$x = $argvv["page"];
$a = mb_convert_encoding(file_get_contents("http://tieba.baidu.com/f/fdir?ie=utf-8&fd=" . urlencode($fdir) . "&sd=" . urlencode($sdir) . "&pn={$x}"), "UTF-8", "GBK");
preg_match_all('/<a href=\'http:\/\/tieba.baidu.com\/f\?kw=(.*)\' target=\'_blank\'>(.*)<\/a>/', $a, $c);
$sql = '';
for ($xxx = 0;$xxx < count($c[2]);
    $xxx++) {
    if ($c[2][$xxx] != null) {
        $ffname = mysqli_real_escape_string($conn, $c[2][$xxx]);
        $gb2312_urlencode = mysqli_real_escape_string($conn, $c[1][$xxx]);
        $sql .= 'INSERT INTO tblite (level_1_name, level_2_name, fname, gb2312_urlencode) VALUES ("' . $fdir . '", "' . $sdir . '", "' . $ffname . '", "' . $gb2312_urlencode . '");';
    }
}
if ($conn->multi_query($sql) === TRUE) {
    echo "{$sdsdsfdfefddvddfdf}.".$fdir.'/'.$sdir.': '.$x." 页成功\n";
} else {
    echo "Error: " . $sql . $conn->error . "\n";
}

do {
    if ($res = $conn->store_result()) {
        $res->free();
    }
}
while ($conn->more_results() && $conn->next_result());
$sdsdsfdfefddvddfdf++;
$conn->close();
echo "完成\n";