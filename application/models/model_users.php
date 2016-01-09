<?php

class Model_Users extends Model {
    protected $table = 'users';

    public function getUsers($conditions = null) {
        if ($conditions) {
            return ORM::for_table($this->table)->where($conditions)->find_many();
        } else {
            return ORM::for_table($this->table)->find_many();
        }
    }

    public function getUser($id) {
        return ORM::for_table($this->table)->find_one($id);
    }

    public function updateUser($user) {
        $newUser = ORM::for_table($this->table)->find_one($user['id']);

        // Удаляем id, чтобы не перезаписать его
        unset($user['id']);

        foreach($user as $key => $value) {
            $newUser->$key = $user[$key];
        }
        $newUser->last_update = (new DateTime())->format('Y-m-d H:i:s');

        return $newUser->save();
    }

    public function deleteUser($id) {
        return ORM::for_table($this->table)->find_one($id)->delete();
    }

    public function getDataCount($conditions) {
        return ORM::for_table($this->table)->where($conditions)->count();
    }

    public function getUsersMailing($id_group) {
        if ($id_group) {
            $sql = "SELECT * FROM `users` JOIN (SELECT * FROM user_group WHERE user_group.id_group = ". $id_group .") `user_group` ON `users`.`id` = `user_group`.`id_user`";
            return ORM::for_table($this->table)->select_many('name', 'email')->raw_query($sql)->find_many();
        } else {
            return ORM::for_table($this->table)->find_many();
        }
    }

    public function addGroup($id_user, $id_group) {
        $link = ORM::for_table('user_group')->create();
        $link->id_user = $id_user;
        $link->id_group = $id_group;
        return $link->save();
    }

    public function removeGroup($id_user, $id_group) {
        $link = ORM::for_table('user_group')->where('id_user', $id_user)->where('id_group', $id_group)->find_one();
        return $link->delete();
    }

    public function getGroups() {
        return ORM::for_table('groups')->find_many();
    }

    public function getUserGroups($id_user) {
        return ORM::for_table('user_group')->where('id_user', $id_user)->find_many();
    }
}