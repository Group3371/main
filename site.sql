-- phpMyAdmin SQL Dump
-- version 4.1.14
-- http://www.phpmyadmin.net
--
-- Хост: 127.0.0.1
-- Время создания: Янв 11 2016 г., 11:00
-- Версия сервера: 5.6.17
-- Версия PHP: 5.5.12

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8 */;

--
-- База данных: `site`
--

-- --------------------------------------------------------

--
-- Структура таблицы `messages`
--

CREATE TABLE IF NOT EXISTS `messages` (
  `id` int(11) unsigned NOT NULL AUTO_INCREMENT,
  `email` varchar(50) NOT NULL,
  `name` varchar(50) NOT NULL,
  `message` text NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB  DEFAULT CHARSET=utf8 AUTO_INCREMENT=9 ;

--
-- Дамп данных таблицы `messages`
--

INSERT INTO `messages` (`id`, `email`, `name`, `message`) VALUES
(1, 'iri.95@inbox.ru', 'Ирина', 'Вчера нашла свою сумку дома. Можете удалить её из БД. Спасибо.'),
(2, 'africa777@yandex.ru', 'Михаил', 'Спасибо вам за ваш ресурс. Благодаря ему я нашла своего слона. Спасибо!'),
(3, 'taina@mail.ru', 'Аноним', 'Буду советовать друзьям');

-- --------------------------------------------------------

--
-- Структура таблицы `vechi`
--

CREATE TABLE IF NOT EXISTS `vechi` (
  `id` int(11) unsigned NOT NULL AUTO_INCREMENT,
  `title` varchar(30) NOT NULL,
  `description` text NOT NULL,
  `photo` varchar(255) DEFAULT NULL,
  `type` text NOT NULL,
  `name` varchar(50) NOT NULL,
  `phone` varchar(20) NOT NULL,
  `email` varchar(50) NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `photo` (`photo`),
  KEY `title` (`title`),
  FULLTEXT KEY `description` (`description`)
) ENGINE=InnoDB  DEFAULT CHARSET=utf8 AUTO_INCREMENT=51 ;

--
-- Дамп данных таблицы `vechi`
--

INSERT INTO `vechi` (`id`, `title`, `description`, `photo`, `type`, `name`, `phone`, `email`) VALUES
(39, 'Слон', 'Потеряли слона. Серый такой. Откликается на кличку "Перышко"', 'elefant.jpg', 'Потеря', 'Ирина', '+79817959375', 'iri.95@inbox.ru'),
(40, 'Козел', 'Нашли козла или козу, пока не поняли, мы не разбираемся. ', 'koza.jpg', 'Находка', 'Кристина', '+79218229001', 'dachnica0@yandex.ru'),
(42, 'Котэ', 'Просто котэ. Нашли серого, может, чей-то.', '569257_4010e0d528347067009cd381a352131e_mdsq.jpg', 'Находка', 'Веня', '+78005553535', 'dachnica0@yandex.ru'),
(43, 'Шляпа', 'Потеряна шляпа бежевая с широкими полями.', 'photo.jpg', 'Потеря', 'Петр Вячеславович', '+98179593747', 'irin.korotkova@gmail.com'),
(44, 'Ключ', 'Потерян ключ от всех дверей. Нашедшему лучше ничего им не открывать.', '9.jpg', 'Потеря', 'Вася', '85758987676', 'komn667@yandex.ru'),
(46, 'Кошелек', 'Потерян кошелек с 10000000000000$ внутри. Очень хотелось бы вернуть. Дорог как память.', '54fd75dd324ee_009747big060701235.JPG', 'Потеря', 'Я', '+9850848675', 'vrh@mail.ru'),
(49, 'Чайник', 'Чайник найден. Хорошенький такой. На улице пр. Металлургов возле Пятерочки', 'GN7-PEvb40o.jpg', 'Находка', 'Карина', '+78948673654', 'chainik@mail.ru'),
(50, '', '', 'noimage.jpg', '', '', '', '');

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
