<?php

class Controller_404 extends Controller {

    public function action_index() {

        echo $this->view->render('404_view.twig',  array(
            'title' => 'Ошибка 404'
        ));

    }

}

