<?php session_start();?>
<!DOCTYPE html>

<html>
    <head>
        <?php require_once "pages/head.php"?>
        
    </head>

    <body>
         
        <div class="wrapper">
            <header>
               <?php 
               if (isset($_SESSION['username'])) {require "pages/mainheader.php";}
               else {require "pages/headerforguest.php";}
               ?>
            </header>
            
            <section class="courses">
                <?php
                    include 'smtp-func.php';
                    
                    if (isset($_POST['sendfeedback'])){
                    $name=$_POST['name'];
                    $email=$_POST['email'];
                    $comment=$_POST['comment'];
                    $toaddress="leraivanovskaya@yandex.ru";
                    $subject="Отзыв с веб-сайта";
                    $replyto="My recipes";
                    $fromaddress="From: webserver@example.com";
                    $type = 'plain'; 
                    $charset = 'windows-1251';
                    $headers = "To: \"Administrator\" <$toaddress>\r\n".
                    "From: \"$replyto\" <$fromaddress>\r\n".
                    "Reply-To: $replyto\r\n".
                    "Content-Type: text/$type; charset=\"$charset\"\r\n";
                    
                    $mailcontent="Имя: ".$name."\n".
                            "E-mail: ".$email."\n".
                            "Комментарии: \n".$comment."\n";
                    
                    $sended = smtpmail($toaddress, $subject, $mailcontent, $headers);
                    if (!$sended) echo 'Письмо не удалось отправить. Пожалуйста свяжитесь с администратором сайта';
                    else echo 'Письмо было успешно отправлено. В ближайшее Вы получите ответ на него.';
                    }
                else require "pages/sectionfeedback.php";
                ?>
            </section>
           
            <section class="right">   
                    <?php
                    if (isset($_SESSION['username'])) {
                        echo '<div class="autorization"><h2>'.$_SESSION['username'].'</h2>'
                        .'<br/>Добро пожаловать! <br/>'
                        .'<form action="index.php" method="POST">'
                        .'<input type="submit" value="Sign out" name="exit">'
                        .'</form></div>';}
                        
                    else {require "pages/rightsection.php";} 
                    ?>
            </section>
            
            <footer><?php require_once "pages/footer.php"?></footer>
        </div>
    </body>
</html>