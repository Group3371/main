<?php

class View {
    private static $_instance = null;
    private static $_templater;
    private static $_loader;

    private function __construct() {
        self::$_loader = new Twig_Loader_Filesystem('application/views');
        self::$_templater = new Twig_Environment(self::$_loader, array());
        self::$_templater->addGlobal('total_price', $_SESSION['total_price']);  //Глобальная переменная для отображения общей стоимости корзины в header
        self::$_templater->addGlobal('total_amount', $_SESSION['total_amount']);  //Глобальная переменная для отображения общего количества товара в header

        self::$_templater->addGlobal('login', $_SESSION["LOGIN"]);
        self::$_templater->addGlobal('admin', $_SESSION['admin']);
    }

    public static function getInstance() {
        if (!self::$_instance) {
            self::$_instance = new self();
        }

        return self::$_templater;
    }
}

?>