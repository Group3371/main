<!DOCTYPE html>
<html>
	<head>
		<meta http-equiv="Refresh" content="2;URL= ../index.html" />
		<title></title>
	</head>
	<body>
        <?php
            error_reporting(E_ALL & ~E_NOTICE);
            $mysqli = @new mysqli('localhost', 'root', '' , 'site');

            if (mysqli_connect_errno()) {
                echo "Подключение невозможно: ".mysqli_connect_error();
                exit;
            }

            $mysqli->set_charset("utf8");

            $flag = $mysqli->query("INSERT INTO `messages` (email, `name`, message ) VALUES ( '" . $_POST['email'] . "','" . $_POST['name'] . "','" . $_POST['message'] . "');");
            if ($flag) {
            echo "<strong>Сообщение отправлено. Подождите, идёт перенаправление на главную страницу...</strong>";
            } else {
            echo "Сообщение не отправлено<br/>" . $mysqli->error;
            }
            $mysqli->close();
        ?>
	</body>
</html>