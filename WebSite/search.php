<?php session_start();?>
<!DOCTYPE html>

<html>
    <head>
        <?php require_once "pages/head.php"?>
        <style type="text/css">
            nav li a.currentAll{
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
                <article class="allrecipes">
                    
                    <h2 class="titleall" style="margin-left:40px">All recipes</h2>
                
                <?php
                @ $db = new mysqli('localhost', 'root', 'root', 'dbsite');
                if (mysqli_connect_errno()){
                echo 'Ошибка: не удалось установить соединение с базой данных. Повторите попытку позже.';
                exit;}
                if(isset($_POST['search'])){
                    $check=false;
                    $search=$_POST['search'];
                    echo '<h2>Поиск по слову '.$search.'</h2>'; 
                    $query1 = "select * from recipes where `idusers`=".$_SESSION['ID']."";
                    $result=$db->query($query1);
                    $num_results= mysqli_num_rows($result);
                    for($i=0; $i<$num_results; $i++){
                    $row=$result->fetch_assoc();
                    $idrecipes=$row['idrecipes'];
                    $title=$row['title'];
                    if ((mb_strtolower($search, 'utf-8'))==(mb_strtolower($title, 'utf-8'))) {
                        $check=true;
                    echo 'Найдено совпадение по названию рецепта: ';    
                    echo '<a href="onerecipes.php?idrec='.$idrecipes.'" style="text-decoration: underline">'.$title.'</a><br/>';}
                    $query2 = "select * from ingredients where `idrecipes`=".$idrecipes."";
                    $result2=$db->query($query2);
                    $row2=$result2->fetch_assoc();
                    if ((mb_strtolower($search, 'utf-8'))==(mb_strtolower($row2['ingredient'], 'utf-8'))) {
                        $check=true;
                        echo 'Найдено совпадение по ингредиенту в рецепте: '; 
                        echo '<a href="onerecipes.php?idrec='.$idrecipes.'" style="text-decoration: underline">'.$title.'</a><br/>';}}
                }
                if (!$check) {echo 'Совпадений не найдено';}
                $db->close();
                ?>
                </article>
            </section>
           
            <section class="right">   
                    <?php echo '<div class="autorization"><h2 style="margin-left:70px">'.$_SESSION['username'].'</h2>'
                            .'<p style="margin-left:30px">Добро пожаловать!<p/>'
                            .'<form action="index.php" method="POST" style="margin-left:60px">'
                            .'<input type="submit" value="Sign out" name="exit">'
                            .'</form><br/><br/><form method="post" action="search.php"><input type="text" name="search" placeholder="search"/>'
                            . '<input type="submit" name="search "value="search" style="margin-left:65px"></form></div>';
                    ?>
            </section>
            
            <footer> <?php require_once "pages/footer.php"?> </footer>
        </div>
    </body>
</html>
