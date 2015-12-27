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
               if (isset($_SESSION['username'])) {require "pages/mainheader.php";}
               else {require "pages/headerforguest.php";}
               ?>
            </header>
            <section class="courses">
                <article>
                    <figure>
                        <img src="images/food.jpg" alt="image" class="mainImage">
                    </figure>
                    <?php
                    @ $db = new mysqli('localhost', 'root', 'root', 'dbsite');
                    if (mysqli_connect_errno()){
                    echo 'Ошибка: не удалось установить соединение с базой данных. Повторите попытку позже.';
                    exit;
                    }
                    $username=$_POST['username'];
                    $password=$_POST['password'];
                    $query = "select * from users where `username`='".$username."'";
                    $result=$db->query($query);
                    $num_results= mysqli_num_rows($result);
                    $currentID=-1;
                    for($i=0; $i<$num_results; $i++){
                    $row=$result->fetch_assoc();
                    if (sha1($password)==$row['password'])
                    {
                     $_SESSION['username']=$username;
                     
                     $_SESSION['ID']=$row['idusers'];

                     header("Location: success.php"); exit;
                    }
                    }
                    if (!isset($_SESSION['username'])) {echo '</br></br>Не удалось войти. Попробуйте еще раз -> '
                        . '<br/>Или <a href="registration.php" class="reg" >зарегистрируйтесь</a>';}
                    $result->free();
                    $db->close();
                    ?> 
                </article>
            </section>
           
            <section class="right">   
                <?php
                require "pages/rightsection.php";
                ?>
            </section>
            
            <footer> <?php require_once "pages/footer.php"?> </footer>
        </div>
    </body>
</html>
