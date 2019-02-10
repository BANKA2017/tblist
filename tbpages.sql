SET NAMES utf8;
SET time_zone = '+00:00';
SET foreign_key_checks = 0;
SET sql_mode = 'NO_AUTO_VALUE_ON_ZERO';
SET NAMES utf8mb4;
DROP TABLE IF EXISTS `tbpages`;
CREATE TABLE `tbpages` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `level_1_name` text NOT NULL,
  `level_2_name` text NOT NULL,
  `pages` int(11) NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=MyISAM DEFAULT CHARSET=utf8mb4;