<?php

class Model_authorization extends Model
{

    protected $table = 'users';

    protected $login;
    protected $password;
    protected $name;
    protected $email;
    protected $is_active;
    protected $lastname;
    protected $birthday;
    protected $reg_date;
    protected $_dataTime;
    protected $_ip;

    public function __construct() {

        parent::__construct();

        $this->_dataTime = (new DateTime())->format("Y-m-d H:i:s");
        $this->_ip = $_SERVER["REMOTE_ADDR"];

    }

    public function getUser($login) {
        return ORM::for_table($this->table)->where(array('email' => $login))->find_one();
    }

    public function createUser($data) {
        $user = ORM::for_table($this->table)->create();

        $user->set(array(
            'email' => $data['email'],
            'password' => $data['password'],
            'reg_date' => $this->_dataTime,
            'is_active' => 1
        ));

        $user->save();

        return $user->id();
    }

    public function setUserGroup($idUser, $idGroup) {
        $link = ORM::for_table('user_group')->create();
        $link->id_user = $idUser;
        $link->id_group = $idGroup;

        return $link->save();
    }

    public function getUserGroup($id) {
        return ORM::for_table('user_group')->where('id_user', $id)->find_one()->id_group;
    }

    public function getDataCount($array){
        return count(ORM::for_table($this->table)->where($array)->find_many());
    }

    public function getData($array){
        return ORM::for_table($this->table)->where($array)->find_many();
    }

    public function getDataUsersList(){
        return ORM::for_table($this->table)->find_many();
    }

    public function getDataUser($id){
        return ORM::for_table($this->table)->find_one($id);
    }

    public function updateUser($array)
    {
        $msg = array();

        $person = ORM::for_table($this->table)->find_one($array['id']);
        foreach($array as $k => $v)
        {
            $person->$k = $v;
        }
        if($person->save())
        {
            $msg[] = 'Данные сохранены';
        }
        else
        {
            $msg[] = 'Ошибка';
        }

        return $msg;
    }

    public function userDelete($id){
        return ORM::for_table($this->table)->find_one($id)->delete();
    }

}