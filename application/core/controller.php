<?php

abstract class Controller {
    protected $view;
    protected $model;

    public function __construct() {
        $this->view = View::getInstance();
    }
}

?>