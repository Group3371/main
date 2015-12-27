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
                    echo '<br/><br/>Добро пожаловать, '.$_SESSION['username'].', на сайт рецептов! <br/><br/> Посмотреть свою книгу: <a href="allrecipes.php" class="currentAll" style="text-decoration: underline">All recipes</a>';
                    ?> 
                </article>
            </section>
           
            <section class="right">   
                <?php
                echo '<div class="autorization"><h2>'.$_SESSION['username'].'</h2>'
                .'<br/>Добро пожаловать! <br/>'
                .'<form action="index.php" method="POST">'
                .'<input type="submit" value="Sign out" name="exit">'
                .'</form></div>'; 
               ?>
            </section>
            
            <footer> <?php require_once "pages/footer.php"?> </footer>
        </div>
    </body>
</html>
