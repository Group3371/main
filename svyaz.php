<!DOCTYPE html>
<html>
  <head>
      <title>Связь с нами</title>
      <meta charset="UTF-8">
      <link rel="shortcut icon" href="favicon.ico" />
      <link rel="stylesheet" type="text/css" href="css/popup.css">
      <link rel="stylesheet" type="text/css" href="css/style.css">
  </head>
  <body>
    <div class="wrapper">
      <div class="maincontent">
        <header class="header"> 
          <div class="logo">
            <a href="/"><img class="test" src="img/logo.gif" alt="Логотип"></a>
          </div>
          <div class="menu">
            <ul class="menu__list" >
              <li class="menu__item">
                <a href="pravila.html">Правила</a>
              </li>
              <li class="menu__item">
                <h3>Связь с нами</h3>
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
          <h1 class="content__title">
            Связь с нами:
          </h1>
          <div class="content__text">
            <strong>Короткова Ирина Андреевна</strong><br/>
            СПбГЭТУ ЛЭТИ Факультет компьютерных технологий<br/>
            Специальность "Информационные системы и технологии" группа 3371<br/>
            <strong>Тел.: +79817959375 E-mail: iri.95@inbox.ru</strong><br/>
          </div>    
        </section>   
      </div>        
    </div>
    <?php if ($_SERVER["REMOTE_ADDR"] != '127.0.0.1') {?>
        <form name="form_svyaz" method="post" action="php/svyaz_messages.php" enctype="multipart/form-data" >
            <center>
                <strong>Вы можете отправить мне сообщение:</strong>
                <table>
                    <tr>
                        <td>
                            <textarea name="message" cols="40" rows="8"  placeholder="Введите здесь текст сообщения..."></textarea>
                        </td>
                        <td>
                            <div class="person">
                                <p>Имя<br><input placeholder="" name="name" type="text" value=""></p>
                                <p>E-mail<br><input placeholder="" name="email" type="text" value=""></p>
                            </div>
                        </td>
                    </tr>
                </table>
                <button class="button"  type="submit">Отправить</button>
            </center>
        </form>
    <?php } else {

        error_reporting(E_ALL & ~E_DEPRECATED);
        $host = "localhost";
        $user = "root";
        $password = "";
        $db = "site";
        $link = mysql_connect($host, $user, $password);

        mysql_query("SET NAMES utf8");

        if($link) //идентично if($link === true), т.е. подключение прошло
            $select_db = mysql_select_db($db);

        if(!$select_db) //Если БД  не выбрана
            echo "Ошибка выбора БД";

        else
        {

            $sql = "SELECT * FROM `messages`";
            $query = mysql_query($sql);
            if(!mysql_num_rows($query))
                echo "В таблице нет данных!";
            else
            {
                while($row = mysql_fetch_assoc($query))
                {
                    ?><div class="line"></div><?php
                    echo  ' E-mail: ' . $row['email'] . ' </br>Имя: ' . $row['name'] . '</br> Сообщение: ' . $row['message'] . ' <br />';
                    ?>
                    <form method="post" action="/php/delete_message.php">
                        <input type="hidden" name="id" value="<?=$row['id']?>">
                        <button type="submit" class="vechi__delete">Удалить</button>
                    </form>
                <?php
                }
            }
        }

        //Закрыли соединение
        mysql_close($link);
    }
    ?>
  </body>
</html>


           
      