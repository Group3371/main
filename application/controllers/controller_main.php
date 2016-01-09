<?php

class Controller_Main extends Controller {

    public function __construct() {
        parent::__construct();
        $this->model = new Model_Products();
    }

    public function action_index() {

        // Получение товаров для слайдера
        $slider_products = $this->model->getSlides(3);

        // Получение товаров для карусели
        $carousel_products = $this->model->getLimit(10);

        return $this->view->render('main_view.twig', array(
            'title' => 'Главная',
            'slider_products' => $slider_products,
            'carousel_products' => $carousel_products
        ));

    }

}

?>