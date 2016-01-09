<?php

class Model_Account extends Model
{
    protected $table = 'users';

    public function getUser($login) {
        return ORM::for_table($this->table)->where(array('email' => $login))->find_one();
    }

    public function getOrder($id) {
        return ORM::for_table('orders')->where('id_user', $id)->find_array();
    }
    public function getCompOrder($id_order) {
        return ORM::for_table('comp_orders')->where('id_order', $id_order)->find_array();
    }
    public function getProduct($id) {
        return ORM::for_table('products')->where('id', $id)->find_one();
    }

}