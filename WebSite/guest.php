<?php session_start();?>
<!DOCTYPE html>

<html>
    <head>
        <?php require_once "pages/head.php"?>
         <style type="text/css">
            nav li a.currentMain{
            color: #ff3300;
            } 
        </style>
    </head>

    <body>
        <div class="wrapper">
            <header>
               <?php 
                require "pages/headerforguest.php";
               ?>
            </header>
            <section class="courses">
                <article>
                    <figure>
                        <img src="images/food.jpg" alt="image" class="mainImage">
                    </figure>
                    <h2>Добро пожаловать!</h2>
                
                    <p>Для работы на сайте, пожалуйста, войдите <br/> в свою учетную запись или зарегистрируйтесь -> </p>
                    
                        <?php
                    @ $db = new mysqli('localhost', 'root', 'root', 'dbsite');
                    if (mysqli_connect_errno()){
                    echo 'Ошибка: не удалось установить соединение с базой данных. Повторите попытку позже.';
                    exit;
                    }
                    $query = "select * from users";
                    $result=$db->query($query);
                    $num_results= mysqli_num_rows($result);
                    $row=$result->fetch_assoc();
                    echo "<br/>";
                    $result->free();
                    $db->close();
                    ?> 
                    
                </article>
            </section>
           
            <section class="right">   
                <?php require "pages/rightsection.php"?>
            </section>
            
            <footer><?php require_once "pages/footer.php"?></footer>
        </div>
    </body>
</html>