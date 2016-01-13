
<?php

#error_reporting(E_ALL);
error_reporting(E_ALL & ~E_DEPRECATED);


header("Content-type: text/html; charset=utf-8");
$host = "localhost"; 
$user = "root"; 
$password = ""; 
$db = "site"; 
$link = mysql_connect($host, $user, $password);

mysql_query ("SET NAMES utf8");

    $select_db = mysql_select_db($db);

if(!$select_db) //Если БД  не выбрана
    echo "Ошибка выбора БД";
else //Если БД выбрана, продолжаем
{
    $sql = "SELECT * FROM `vechi`";
    $query = mysql_query($sql);
    if(!mysql_num_rows($query)) 
        echo "В таблице нет данных!";
    else
    {
        while($row = mysql_fetch_assoc($query)) 
        {  
            echo  ' Название: ' . $row['title'] . ', Описание: ' . $row['description'] . ', Фото: ' . $row['photo'] . ', Тип: ' . $row['type'] . ', Имя: ' . $row['name'] . ', Телефон: ' . $row['phone'] . ', E-mail: ' . $row['email'] . ' <br />'; 
        }
    }
}

mysql_close($link);
?>  