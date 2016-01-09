<?php

class Controller_Payments extends Controller {
    function action_index() {
        return $this->view->render('payment_methods.twig', array(
            'title', 'Способы оплаты'
        ));
    }
}