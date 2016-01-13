<!DOCTYPE html>
<html>
	<head>
		<meta http-equiv="Refresh" content="2;URL= ../index.html" />
		<title></title>
	</head>
	<body>
		<script>
// alert($_POST['thing']);
//   	</script>
  
		<?php
		#error_reporting(E_ALL);
		#error_reporting(E_ALL & ~E_DEPRECATED);
		error_reporting(E_ALL & ~E_NOTICE);
		$mysqli = @new mysqli('localhost', 'root', '' , 'site');
		if (mysqli_connect_errno()) {
			echo "Подключение невозможно: ".mysqli_connect_error();
			exit;
		}

		if (isset($_FILES["img"])) {
			if (move_uploaded_file($_FILES["img"]["tmp_name"], "../vechi/".basename($_FILES['img']['name']))) {
				$photo = $_FILES['img']['name'];
			} else {
				$photo = 'NULL';
			}
				
		} else {
			$photo = "noimage.jpg";
		}

		$mysqli->set_charset("utf8");

		  //echo "INSERT INTO `vechi` VALUES (NULL, " . $_POST['name'] . "," . $_POST['desc'] . "," . 7 . "," . '' . "," . $_POST['thing']. ")";
		  $flag = $mysqli->query("INSERT INTO `vechi` (id, title, description, photo, type, name, phone, email ) VALUES (NULL, '" . $_POST['title'] . "','" . $_POST['desc'] . "','" . $photo . "','" . $_POST['thing'] . "','" . $_POST['name'] . "','" . $_POST['phone'] . "','" . $_POST['email'] . "');");
		 if ($flag) {
			echo "<strong>Вещь добавлена. Подождите, идёт перенаправление на главную страницу...</strong>";
		  } else {
		  	echo "Вещь не добавлена.<br/>" . $mysqli->error;
		  }
		  $mysqli->close();
		?>
	</body>
</html>