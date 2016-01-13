<?php 

  $link = mysqli_connect('localhost', 'root', '', 'site');
  mysqli_query($link, "SET NAMES utf8");
    $search=$_POST['search'];
    $thing=$_POST['thing'];
    $str="SELECT * FROM `vechi` WHERE (title LIKE '%" . $search . "%') AND (type='".$thing."')"; 
  $mysql_items = mysqli_query($link, $str);
?>

<!DOCTYPE html>
<html>
  <head>
    <link rel="stylesheet" type="text/css" href="/css/popup.css">
    <link rel="stylesheet" type="text/css" href="/css/prsonal_account_style.css">
    <title>Старницы</title>
    <meta charset="UTF-8">
  </head>
  <body>
    <div class="wrapper">
      <div class="maincontent">
        <header class="header"> 
          <div class="logo">
            <a href="/"><img class="test" src="/img/logo.gif" alt="Логотип"></a>
          </div>
          <div class="menu">
            <ul class="menu__list" >
              <li class="menu__item">
                <a href="pravila.html">Правила</a>
              </li>
              <li class="menu__item">
                <a href="svyaz.php">Связь с нами</a>
              </li>
              <li class="menu__item">
                <a href="blagodar.html">Благодарность</a>
              </li>
              <li class="menu__item">
                <a href="blagotvor.html">Благотворительность</a>
              </li>
              <li class="menu__item">
                <a href="partners.html">Партнеры</a>
              </li>
            </ul> 
          </div>
        </header> 
        <div class="line"></div>
        <section class="content">
          <div class="content__title">
            <form name="search" method="post" action="search.php">
              <center>
                <table>
                  <tr>
                    <td valign="top">
                      <input type="text" name="search" placeholder="Поиск">
                      <button type="submit">Найти</button> 
                      <div class="content__text">
                        Вывод всех вещей
                      </div>
                    </td>
                    <td valign="top">
                      <div><input name="thing" type="radio" value="Находка"> Находка</div>
                      <div><input name="thing" type="radio" value="Потеря" checked> Потеря</div>
                    </td>
                  </tr>
                </table>
              </center>
            </form>
          </div>
        </section>   
        <div class="line"></div>
        <div class="vechi">
                <?php
                  while($row = mysqli_fetch_assoc($mysql_items)) {  ?>
                  <table>
                    <tr>
                      <td>
                        <img class="vechi__img" src="vechi/<?=$row['photo']?>" alt="Картинка"/><br/>
                      </td>
                      <td>
                        <strong>Название:</strong> <?=$row['title']?><br/>
                        <strong>Описание:</strong><?=$row['description']?><br>
                        <strong>Тип:</strong><?=$row['type']?><br>
                        <strong>Имя:</strong><?=$row['name']?><br>
                        <strong>Телефон:</strong><?=$row['phone']?><br>
                        <strong> E-mail: </strong><?=$row['email']?><br>
                        <?php if ($_SERVER["REMOTE_ADDR"] == '127.0.0.1') {?>
                        <form method="post" action="/php/delete.php">
                          <input type="hidden" name="id" value="<?=$row['id']?>">
                          <button type="submit" class="vechi__delete">Удалить</button>
                        </form>
                      <?php } ?>
                      </td>
                    </tr>
                  </table>
                  <hr/>
                    <?php }?>
        </div>
      </div>
    </div>
  </body>
</html>