<?php session_start();?>
<!DOCTYPE html>

<html>
    <head>
        <?php require_once "pages/head.php"?>
        <style type="text/css">
            nav li a.currentAdd{
            color: #ff3300;
            } 
        </style>
    </head>

    <body>
         
        <div class="wrapper">
            <header>
               <?php 
               require "pages/mainheader.php";
               ?>
            </header>
            
            <section class="courses">  
                <?php
             @ $db = new mysqli('localhost', 'root', 'root', 'dbsite');
            if (mysqli_connect_errno()){
            echo 'Ошибка: не удалось установить соединение с базой данных. Повторите попытку позже.';
            exit;
            }
            
            if(isset($_POST['add'])){
            $title=$_POST['title'];
            $info=$_POST['instruction'];
            $user=$_SESSION['ID'];
            $count=$_POST['count'];
            $ingredient=$_POST['ingredient'];
            $measure=$_POST['measure'];
            
            $query = "select * from recipes";
            $result=$db->query($query);
            $num_recipes= mysqli_num_rows($result);
            $result->free();
           
            $query1 = "insert into recipes values('$num_recipes', '$title', '$info', '$user')";
            $result1=$db->query($query1);
            
            if($result1){
                $query2 = "insert into ingredients values('$ingredient', '$count', '$measure', '$num_recipes')";
                $result2=$db->query($query2);
                if($result2){
                echo '<div style="margin: 40px">Рецепт успешно добавлен в книгу!<br/><ul><li> <a href="allrecipes.php" style="text-decoration: underline">Открыть книгу рецептов</a></li>'
                    . '<li><a href="addRecipes.php" style="text-decoration: underline">Добавить еще рецепт</a></li><ul></div> ';}
            }
            else {echo '<p style="margin: 40px">Произошла ошибка</p>';}
            }
            else {echo '<h2 style="margin-left:125px; padding-top:2px; padding-bottom:6px;">Add recipe</h2>';
                require "pages/add.php";}
            $db->close();
            ?>
            </section>
           
            <section class="right">   
                    <?php echo '<div class="autorization"><h2>'.$_SESSION['username'].'</h2>'
                            .'<br/>Добро пожаловать! <br/>'
                    .'<form action="index.php" method="POST">'
                    .'<input type="submit" value="Sign out" name="exit">'
                    .'</form></div>';
                    ?>
            </section>
   
            <footer><?php require_once "pages/footer.php"?></footer>
        </div>
    </body>
</html>