<?php

$id = $_POST['id'];

$link = mysqli_connect('localhost', 'root', '', 'site');
mysqli_query($link, "SET NAMES utf8");
mysqli_query($link, "DELETE FROM `messages` WHERE id = $id");

?>

<!DOCTYPE html>
<html>
	<head>
	    <meta charset='utf-8'/>
		<title>Удаление</title>
	</head>
	<body>
		<h3>Сообщение успешно удалено.</h3>
	</body>
</html>