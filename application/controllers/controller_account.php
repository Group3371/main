<?php

class Controller_Account extends Controller
{
    use validateData;

    public $user;
    public $orders;

    public function __construct()
    {
        parent::__construct();
        $this->model = new Model_Account();
    }

    // Возвращает страницу аккаунта
    public function action_index()
    {
        if ($_SESSION['LOGIN']) {
            $this->user = $this->model->getUser($_SESSION['LOGIN']);
            $this->orders = $this->model->getOrder($this->user['id']);
            foreach ($this->orders as $key => $value) {
                $this->orders[$key]['comp_order'] = $this->model->getCompOrder($this->orders[$key]['id']);
                $this->orders[$key]['total_sum'] = 0;
                foreach ($this->orders[$key]['comp_order'] as $k => $v) {
                    $this->orders[$key]['comp_order'][$k]['product'] = $this->model->getProduct($this->orders[$key]['comp_order'][$k]['id_product']);
                    $this->orders[$key]['comp_order'][$k]['sum'] = $this->orders[$key]['comp_order'][$k]['price'] * $this->orders[$key]['comp_order'][$k]['count'];
                    $this->orders[$key]['total_sum'] += $this->orders[$key]['comp_order'][$k]['sum'];
                }
            }
        }


        return $this->view->render('account/account_page.twig', array(
            'title' => 'Личный кабинет',
            'user' => $this->user,
            'orders' => $this->orders
        ));
    }

    // Обновление данных пользователя
    public function updateUser()
    {
        if (!empty($_POST['firstname']) && !empty($_POST['lastname']) && !empty($_POST['address'])
        ) {
            $firstname = $this->clean($_POST['firstname']);
            $lastname = $this->clean($_POST['lastname']);
            $address = $this->clean($_POST['address']);

            if (!empty($firstname) && !empty($lastname) && !empty($address)
            ) {
                if ($this->checkLength($firstname, 2, 20) && $this->checkLength($lastname, 2, 30)
                    && $this->checkLength($address, 2, 255)
                ) {
                    // Обновляем данные пользователя в таблице Users
                    $newData = $this->model->getUser($_SESSION['LOGIN']);
                    $newData->name = $firstname;
                    $newData->lastname = $lastname;
                    $newData->address = $address;
                    $newData->last_update = (new \DateTime())->format("Y-m-d H:i:s");
                    $result = $newData->save();
                   if($result){
                       echo json_encode(array('msg' => 'success', 'new_date' => array('name'=>$firstname,
                           'lastname' => $lastname, 'address' => $address)));
                   } else {
                       echo json_encode(array('msg' => 'Данные не были обновлены!'));
                   }
                } else {
                    echo json_encode(array('msg' => 'Введенные данные некорректные!'));
                }
            } else {
                echo json_encode(array('msg' => 'Все поля формы должны быть заполнены!'));
            }
        } else {
            echo json_encode(array('msg' => 'Все поля формы должны быть заполнены!'));
        }
    }
}