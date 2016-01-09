<?php

class Controller_Users extends Controller {
    public function __construct() {
        parent::__construct();
        $this->model = new Model_Users();
    }

    // Список пользователей
    public function getUsers() {
        $users = $this->model->getUsers();

        return $this->view->render('admin/users.twig', array(
            'title' => 'Список пользователей',
            'users' => $users
        ));
    }

    // Форма редактирования пользователя
    public function userEditForm($userId) {

        $user = $this->model->getUser(intval($userId));

        $groups = $this->model->getGroups();
        $user_groups_orm = $this->model->getUserGroups($userId);

        // Формируем массив групп пользователя
        $user_groups = [];
        for ($i = 0; $i < count($user_groups_orm); $i++) {
            $user_groups[$i]['id'] = $user_groups_orm[$i]->id_group;
            $user_groups[$i]['title'] = $this->getGroupName($groups, $user_groups_orm[$i]->id_group);
        }

        // Формируем массив групп, в которых нет пользователя
        $other_groups = [];
        $temp_group = [];
        for ($i = 0; $i < count($groups); $i++) {
            $temp_group = [
                'id' => $groups[$i]->id,
                'title' => $groups[$i]->title
            ];

            if (!in_array($temp_group, $user_groups)) {
                $other_groups[] = $temp_group;
            }
        }

        return $this->view->render('admin/users_edit.twig', array(
            'title' => 'Редактирование пользователя',
            'user' => $user,
            'user_groups' => $user_groups,
            'other_groups' => $other_groups
        ));
    }

    // Обновление пользовательских данных
    public function updateUser($user) {

        $result = [
            'status' => '',
            'messages' => []
        ];

        if (!$this->model->getUser($user['id'])) {
            $result['status'] = 'error';
            $result['messages'][] = 'Пользователя с таким id не существует!';
            return $result;
        }

        if(!empty($user['password'])) {
            if($user['password'] == $user['password_two']) {
                $user["password"] = password_hash($user["password"], PASSWORD_DEFAULT);
                unset($user['password_two']);
            } else {
                $result['status'] = 'error';
                $result['messages'][] = 'Пароли не совпадают';
            }
        } else {
            unset($user['password']);
            unset($user['password_two']);
        }

        if(!empty($user['email'])) {

            if (filter_var($user["email"], FILTER_VALIDATE_EMAIL)) {
                // Если email изменился
                if ($this->model->getDataCount(array('email' => $user['email'], 'id' => $user['id'])) == 0) {
                    if ($this->model->getDataCount(array('email' => $user['email'])) != 0) {
                        $result['status'] = 'error';
                        $result['messages'][] =  "Такой E-mail уже занят!";
                    }
                }
            } else {
                $result['status'] = 'error';
                $result['messages'][] = 'Email введен некорректно!';
            }

        } else {
            $result['status'] = 'error';
            $result['messages'][] = 'Укажите Email!';
        }

        // Приводим статус активации к нормальному виду
        if ($user['is_active']) {
            $user['is_active'] = 1;
        } else {
            $user['is_active'] = 0;
        }

        // Если ошибок не было, обновляем пользовательские данные
        if ($result['status'] != 'error') {
            $updated = $this->model->updateUser($user);

            // Если данные обновленны
            if ($updated) {
                $result['status'] = 'success';
                $result['messages'][] = 'Данные успешно обновленны!';
            } else {
                $result['status'] = 'error';
                $result['messages'][] = 'По каким-то причинам не удалось обновить данные. Пожалуйста, попробуйте позднее.';
            }
        }

        return $result;
    }

    // Метод добовления пользователя в группу
    public function addGroup($id_user, $id_group) {
        $result = [
            'status' => 'success',
            'message' => 'Пользователь успешно добавлен в группу'
        ];

        if (!$this->model->addGroup(intval($id_user), intval($id_group))) {
            $result['status'] = 'error';
            $result['messages'] = 'По каким-то причинам не удалось добавить пользователя в группу!';
        }

        return json_encode($result, JSON_UNESCAPED_UNICODE);
    }

    public function removeGroup($id_user, $id_group) {
        $result = [
            'status' => 'success',
            'message' => 'Пользователь успешно удален из группы!'
        ];

        if (!$this->model->removeGroup(intval($id_user), intval($id_group))) {
            $result['status'] = 'error';
            $result['messages'] = 'По каким-то причинам не удалось удалить пользователя из этой группы!';
        }

        return json_encode($result, JSON_UNESCAPED_UNICODE);
    }

    // Удаление пользователя
    public function deleteUser($id) {
        return $this->model->deleteUser($id);
    }

    // Вспомогательная функция поиска названия группы по id
    public function getGroupName($groups, $id) {
        foreach($groups as $group) {
            if ($group->id == $id) {
                return $group->title;
            }
        }

        return false;
    }
}