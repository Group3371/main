<?php

$id = $_POST['id'];

$link = mysqli_connect('localhost', 'root', '', 'site');
mysqli_query($link, "SET NAMES utf8");
echo "DELETE FROM `vechi` WHERE id='" . $id . "'";

mysqli_query($link, "DELETE FROM `vechi` WHERE id='" . $id . "'") or die(mysqli_error($link));

?>

<!DOCTYPE html>
<html>
	<head>
		<meta charset="UTF-8" http-equiv="Refresh" content="2;URL= ../pages.php" />
		<title>Удаление</title>
	</head>
	<body>
		<h3>Вещь успешно удалена. Подождите, идет перенаправление на предыдущую страницу...</h3>
	</body>
</html>