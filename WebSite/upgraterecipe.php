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
                                
                <?php
                @ $db = new mysqli('localhost', 'root', 'root', 'dbsite');
                if (mysqli_connect_errno()){
                echo 'Ошибка: не удалось установить соединение с базой данных. Повторите попытку позже.';
                exit;}
                
                
                if(!isset($_POST['upgrate'])) {
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
                
                echo '<div style="margin-left:40px;"><form action="upgraterecipe.php" method="POST">
                        <input type="text" name="title" value="'.$title.'"></input>
                        <input type="text" name="idrecipes" readonly value="'.$idrecipes.'"></input>
                    <p>Ингредиенты:</p>
                    <table>
                    <tr>
                        <td style="text-align: center">название</td>
                        <td style="text-align: center">кол-во</td>
                        <td style="text-align: center">мера</td>
                    </tr>
                    <tr>
                        <td><input type="text" name="ingredient" value="'.$ingredient.'"></input></td>
                        <td><input type="text" name="count" value="'.$count.'" style="text-align: right"></input></td>
                        <td><input type="text" name="measure" readonly value="'.$measure.'"></input>
                        </td>
                    </tr>
                    </table>
                
                    <p>Приготовление:</p>
                    <textarea name="instruction">'.$info.'</textarea>
                    <input type="submit" value="редактировать рецепт" name="upgrate"/>
                    </form>
                <br/><br/>
                <a href="allrecipes.php" style="text-decoration: underline">Вернуться ко всем рецептам</a></div>';
                } 
                if(isset($_POST['upgrate'])) {
                    
                    $title=addslashes($_POST['title']);
                    $info=addslashes($_POST['instruction']);
                    $user=$_SESSION['ID'];
                    $count=$_POST['count'];
                    $ingredient=addslashes($_POST['ingredient']);
                    $measure=addslashes($_POST['measure']);
                    $idrecipes=$_POST['idrecipes'];
                    
                    $query1 = "UPDATE recipes SET title='".$title."', info='".$info."', idusers=".$user." where idrecipes=".$idrecipes."";
                    $result1=$db->query($query1);
                    
                    if($result1){
                        
                    $query2 = "UPDATE ingredients SET count=".$count.", measure='".$measure."', ingredient='".$ingredient."' where idrecipes=".$idrecipes."";
                    $result2=$db->query($query2);
                    if($result2){
                    echo '<div style="margin: 40px">Рецепт успешно обновлен!<br/><ul><li> <a href="allrecipes.php" style="text-decoration: underline">Открыть книгу рецептов</a></li>'
                    . '<li><a href="addRecipes.php" style="text-decoration: underline">Добавить новый рецепт</a></li><ul></div> ';}
                    }
                    else {echo '<p style="margin: 40px">Произошла ошибка</p>';}
                    }
                    $db->close();
                ?>
                                   
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