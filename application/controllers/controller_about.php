<?php

class Controller_About extends Controller {

    public function action_index() {

        // Получение товаров для карусели
        $carousel_products = (new Model_Products())->getLimit(10);

        return $this->view->render('about_view.twig', array(
            'title' => 'О нас',
            'carousel_products' => $carousel_products
        ));

    }

}



