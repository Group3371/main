<?php
session_start();

if(!isset($_SESSION['total_amount'])){
    $_SESSION['total_amount'] = 0;
}

if(!isset($_SESSION['total_price'])){
    $_SESSION['total_price'] = 0;
}

if (!isset($_SESSION['cart'])) {
    $_SESSION['cart'] = array();
}

if(!isset($_SESSION["LOGIN"])) {
    $_SESSION["LOGIN"] = 0;
}

if(!isset($_SESSION['admin'])) {
    $_SESSION['admin'] = false;
}

ini_set('display_errors', 1);

require_once 'core/view.php';
require_once 'core/model.php';
require_once 'core/route.php';
require_once 'core/controller.php';

?>