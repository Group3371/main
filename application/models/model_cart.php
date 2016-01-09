<?php

class Model_Cart extends Model {
    protected $table = 'products';

    public function getProductTitle($id) {
        return ORM::for_table($this->table)->find_one($id)->title;
    }

    public function getProductPrice($id) {
        return ORM::for_table($this->table)->find_one($id)->price;
    }

    public function getProductQuantity($id) {
        return ORM::for_table($this->table)->find_one($id)->count;
    }

    public function getProductImage($id) {
        return ORM::for_table($this->table)->find_one($id)->img;
    }

    public function getDeliveryCost($id){
        return ORM::for_table('delivery')->find_one($id)->price;
    }

    public function getPayment(){
        return ORM::for_table('payments')->find_many();
    }

    public function getUser($login) {
        return ORM::for_table('users')->where(array('email' => $login))->find_one();
    }

    public function getDataCount($array){
        return count(ORM::for_table('users')->where($array)->find_many());
    }

    public function createOrder(){
        return ORM::for_table('orders')->create();
    }

    public function createCompOrders(){
        return ORM::for_table('comp_orders')->create();
    }
}
