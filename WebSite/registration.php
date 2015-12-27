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
         <?php
            $check=0;
             @ $db = new mysqli('localhost', 'root', 'root', 'dbsite');
            if (mysqli_connect_errno()){
            echo 'Ошибка: не удалось установить соединение с базой данных. Повторите попытку позже.';
            exit;
            }
            
            if(isset($_POST['add'])){
            $username=addslashes($_POST['username']);
            $password=addslashes($_POST['password']);
            $newpassword=sha1($password);
            $email=  addslashes($_POST['email']);
            $query = "select * from users";
            $result=$db->query($query);
            $num_results= mysqli_num_rows($result);
            $result->free();
            $query2 = "insert into users values('".$num_results."', '".$username."', '".$newpassword."', '".$email."')";
            $result2=$db->query($query2);
            if($result2){
                $check=1;
            }
            else { $check=2;
            echo "Произошла ошибка";}
            }
            $db->close();
            ?>
        
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
                    <h2>This is а book of all your recipes</h2>
                
                    <p>You can add new recipes, browse all your recipes and also make menu for the day. </p>
                   <?php
                   if ($check==1){echo "Поздравляем! Вы успешно зарегистрировались! Чтобы начать работу войдите ->";} 
                   ?>
                </article>
            </section>
                        
            <section>
                  <?php 
                  if ($check==1){require "pages/rightsection.php";} 
                  else if ($check==2) { echo "Регистрация не прошла. Попробуйте еще раз. У Вас все получится!";
                  require_once "pages/newaccount.php";
                  $check=0;
                  } else if($check==0) {require_once "pages/newaccount.php";}
                  ?>
            </section>
            
            <footer><?php require_once "pages/footer.php"?></footer>
        </div>
    </body>
</html>

