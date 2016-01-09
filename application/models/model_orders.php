<?php

class Model_Orders extends Model {
    protected $table = 'orders';

    public function getOrders() {
        return ORM::for_table($this->table)->find_array();
    }

    public function getOrder($id) {
        return ORM::for_table($this->table)->find_one($id);
    }

    public function getUser($id) {
        return ORM::for_table('users')->find_one($id);
    }

    public function getCompOrder($id_order) {
        return ORM::for_table('comp_orders')->where('id_order', $id_order)->find_array();
    }

    public function getProduct($id) {
        return ORM::for_table('products')->where('id', $id)->find_one();
    }

    public function getOrderStatus() {
        return ORM::for_table('statuses')->find_array();
    }

    public function getPayment($id) {
        return ORM::for_table('payments')->where('id', $id)->find_one();
    }

    public function getDelivery($id) {
        return ORM::for_table('delivery')->where('id', $id)->find_one();
    }

    public function getOneOrderStatus($id) {
        return ORM::for_table('statuses')->find_one($id);
    }

    public function deleteOrder($id) {
        return ORM::for_table($this->table)->find_one($id)->delete();
    }

    public function getDataCount($conditions) {
        return ORM::for_table($this->table)->where($conditions)->count();
    }


}