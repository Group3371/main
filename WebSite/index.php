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
       if(isset($_POST['exit'])){
                session_destroy();
                unset($_SESSION['username']);
                unset($_SESSION['ID']);
            }
       ?>
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
                    <h2>This is а book of all your recipes</h2>
                
                    <p>You can add new recipes, browse all your recipes and also make menu for the day. </p>
                          
                </article>
            </section>
           
            <section class="right">  
                <?php
                    if (isset($_SESSION['username'])) {
                        echo '<div class="autorization"><h2>'.$_SESSION['username'].'</h2>'
                        .'<br/>Добро пожаловать! <br/>'
                        .'<form action="index.php" method="POST">'
                        .'<input type="submit" value="Sign out" name="exit">'
                        .'</form></div>';}
                    else {require "pages/rightsection.php";} ?>
            </section>
            
            <footer><?php require_once "pages/footer.php"?></footer>
        </div>
    </body>
</html>
