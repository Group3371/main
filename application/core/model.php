<?php

abstract class Model {

    protected $table = '';

    public function __construct() {
        ORM::configure('mysql:host=localhost;dbname=loft_shop');
        ORM::configure('username', 'root');
        ORM::configure('password', '');
        ORM::configure('driver_options', array(PDO::MYSQL_ATTR_INIT_COMMAND => 'SET NAMES utf8'));
        ORM::configure('id_column_overrides', array(
            'user_group' => array('id_user', 'id_group')
        ));
    }

    public function beginTransaction() {               // Открываем транзакцию
        return ORM::get_db()->beginTransaction();
    }

    public function commitTransaction() {              // Закрываем транзакцию
        return ORM::get_db()->commit();
    }

    public function rollbackTransaction() {            // Откатываем транзакцию
        return ORM::get_db()->rollBack();
    }

    public function get($id) {
        return ORM::for_table($this->table)->find_one($id);
    }

    public function getAll() {
        return ORM::for_table($this->table)->find_many();
    }

    public function getDataCount($array){
        return count(ORM::for_table($this->table)->where($array)->find_many());
    }
}

?>