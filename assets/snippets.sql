-- 从友情吧查找主表不存在的贴吧
INSERT INTO tblite (fid, fname)
-- 只查询就不要上一行
SELECT DISTINCT t.target_fid, t.target_fname
FROM tbfriendforum t
LEFT JOIN tblite l
    ON l.fname = t.target_fname
WHERE NOT EXISTS (
    SELECT 1
    FROM tbfriendforum x
    WHERE x.fid = t.target_fid
)
AND l.id IS NULL;
-- 上一条插入成功后清除fid，上一条必须带fid避免重复问题
UPDATE tblite SET fid=0 WHERE real_fname ISNULL

-- 从主表找到合并吧的主吧
INSERT INTO tblite (fid, fname)
-- 只查询就不要上一行
SELECT t.fid, t.real_fname
FROM tblite t
WHERE level_1_name = ''
  AND level_2_name = ''
  AND fname IS NOT NULL
  AND real_fname IS NOT NULL
  AND fname != real_fname
  AND NOT EXISTS (
        SELECT 1
        FROM tblite x
        WHERE x.fid = t.fid
          AND x.fname = t.real_fname
);

-- 查找插入失败的
SELECT * from tblite WHERE real_fname='';
-- SELECT * from tblite WHERE real_fname IS NULL
UPDATE tblite SET real_fname=NULL WHERE real_fname='';

-- 合并表
--- 挂载
ATTACH DATABASE 'old.db' AS old;
--- 移除
DETACH DATABASE old;
--- 旧表插入新表
INSERT INTO tblite (fid, fname)
SELECT o.fid, o.fname
FROM old.tblite o
WHERE NOT EXISTS (
    SELECT 1
    FROM tblite n
    WHERE n.fid = o.fid
      AND n.fname = o.fname
);
