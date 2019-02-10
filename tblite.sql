SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
SET AUTOCOMMIT = 0;
START TRANSACTION;
SET time_zone = "+00:00";
CREATE TABLE `tblite` (
  `id` int(11) NOT NULL,
  `level_1_name` text NOT NULL,
  `level_2_name` text NOT NULL,
  `fname` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `gb2312_urlencode` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL
) ENGINE=MyISAM DEFAULT CHARSET=utf8mb4;
ALTER TABLE `tblite`
  ADD PRIMARY KEY (`id`);
ALTER TABLE `tblite`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;
COMMIT;
