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
               require "pages/mainheader.php";
               ?>
            </header>
            
            <section class="courses">
                <article>
                    <figure>
                        <img src="images/recipe11.jpg" alt="image" class="recipeImage">
                    </figure>    
                
                <?php
                @ $db = new mysqli('localhost', 'root', 'root', 'dbsite');
                if (mysqli_connect_errno()){
                echo 'Ошибка: не удалось установить соединение с базой данных. Повторите попытку позже.';
                exit;}
                
                $idrecipes=$_GET['idrec'];        
                $query = "select * from recipes where `idrecipes`=".$idrecipes."";
                $result=$db->query($query);
                
                $row=$result->fetch_assoc();
                $info=$row['info'];
                $title=$row['title'];
                
                $query2 = "select * from ingredients where `idrecipes`=".$idrecipes."";
                $result2=$db->query($query2);
                $row2=$result2->fetch_assoc();
                
                $count=$row2['count'];
                $ingredient=$row2['ingredient'];
                $measure=$row2['measure'];     

                $db->close();
                ?>
                
                <h2 class="titlerec"><?php echo $title; ?></h2>
                <p>Ингредиенты:</p>
                <table>
                    <tr>
                        <td><?php echo $ingredient; ?></td>
                        <td style="text-align: right"><?php echo $count; ?></td>
                        <td style="text-align: left"><?php echo $measure; ?></td>
                    </tr>
                </table>
                
                <p>Приготовление:</p>
                <?php echo $info; ?>
                
                <br/><br/>
                <a href="allrecipes.php" style="text-decoration: underline">Вернуться ко всем рецептам</a>
                </article>
            </section>
           
            <section class="right">   
                    <?php echo '<div class="autorization"><h2>'.$_SESSION['username'].'</h2>'
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