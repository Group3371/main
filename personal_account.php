<!DOCTYPE html>
<html>
    <head>
        <link rel="stylesheet" type="text/css" href="css/popup.css">
        <link rel="stylesheet" type="text/css" href="css/prsonal_account_style.css">
        <title>Старницы</title>
       
    </head>


    <body>
        <div class="wrapper">
        <div class="maincontent">
          
          <header class="header"> 
            <div class="logo">
              <a href="#"><img class="test" src="img/logo.gif" alt="Логотип"></a>
            </div>
            <div class="menu">
              <ul class="menu__list" >
                <li class="menu__item">
                  <a href="#">Правила</a>
                </li>
                <li class="menu__item">
                  <a href="#">Связь с нами</a>
                </li>
                <li class="menu__item">
                  <a href="#">Благодарность</a>
                </li>
                <li class="menu__item">
                  <a href="#">Благотворительность</a>
                </li>
                <li class="menu__item">
                  <a href="#">Партнеры</a>
                </li>
              </ul> 
            </div>
          </header> 
                
         <div class="line"></div>
        <section class="content">
          <h1 class="content__title">
            <form name="search" method="post" action="search.php">
              <input type="search" name="query" placeholder="Поиск по названию">
              <button type="submit">Найти</button> 
            </form>

          
          </h1>

          <div class="content__text">
            ///
          </div>
        </section>   

        <div class="line"></div>
        </div>
          
      </div> 
    <fieldset>
    
<!--<form method="post" action="php/output.php">
<input id="submit" type="submit" value="Вывести все вещи"><br/>
</form>
</fieldset>-->

<?php
//error_reporting(E_ALL & ~E_DEPRECATED);
//Чтоб не пропустить нотисы и ошибки
//error_reporting(E_ALL);
error_reporting(E_ALL & ~E_DEPRECATED);
//Укажем кодировку страницы
header("Content-type: text/html; charset=utf-8");


$host = "localhost"; //Сервер БД
$user = "root"; //Имя пользователя, он по умолчанию "root"
$password = ""; //Пароль для пользователя, по умолчанию он пустой
$db = "site"; // Имя БД, с которой мы будем работать


$link = mysql_connect($host, $user, $password);


mysql_query ("SET NAMES utf8");


if($link) 
    $select_db = mysql_select_db($db);


if(!$select_db) //Если БД  не выбрана
    echo "Ошибка выбора БД";
else 
{
   
    $sql = "SELECT * FROM `vechi`";

   
    $query = mysql_query($sql);


    if(!mysql_num_rows($query)) 
        echo "В таблице нет данных!";
    else
    {

        while($row = mysql_fetch_assoc($query)) 
        {  
            
    
            
            echo  ' <strong>Название:</strong> ' .  $row['title'] . '<br>' . '<strong>Описание:</strong>' . $row['description'] . '<br>' . '<strong>Фото:</strong>' . $row['photo'] . '<br>' . '<strong>Тип:</strong>' . $row['type'] . '<br>' . ' <strong>Имя:</strong> ' . $row['name'] . '<br>' . ' <strong>Телефон:</strong> ' . $row['phone'] . '<br> ' .'<strong> E-mail: </strong>' . $row['email'] . '<br>' . '<hr/>';

        }
    
      }

    
  
mysql_close($link);
?>  


 
  
    </body>
</html>


