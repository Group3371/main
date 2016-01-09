<?php

class Controller_Orders extends Controller
{
    use sendMail;

    public $orderRow;
    public $order_sum;
    public $comp_order;
    public $total_order;

    public function __construct()
    {
        parent::__construct();
        $this->model = new Model_Orders();
    }

    // Список заказов
    public function getOrders()
    {
        $this->orderRow = $this->model->getOrders();

        foreach ($this->orderRow as $key => $value) {
            $this->orderRow[$key]['user'] = $this->model->getUser($this->orderRow[$key]['id_user']);
            $this->orderRow[$key]['status_name'] = $this->model->getOneOrderStatus($this->orderRow[$key]['id_status']);
            $this->orderRow[$key]['sum'] = 0;
            foreach ($comp_part = $this->model->getCompOrder($this->orderRow[$key]['id']) as $k => $v) {
                $comp_order_sum = $comp_part[$k]['price'] * $comp_part[$k]['count'];
                $this->orderRow[$key]['sum'] += $comp_order_sum;
            }
        }

        return $this->view->render('admin/orders.twig', array(
            'title' => 'Список заказов',
            'orders' => $this->orderRow
        ));
    }

    // Форма редактирования заказа
    public function orderEditForm($order_id)
    {

        $order = $this->model->getOrder(intval($order_id));
        $id_status = $this->model->getOrderStatus();
        $id_payment = $this->model->getPayment($order['id_payment']);
        $id_delivery = $this->model->getDelivery($order['id_delivery']);
        $comp_order = $this->model->getCompOrder($order['id']);
        $this->total_order['total_count'] = 0;
        $this->total_order['total_sum'] = 0;
        foreach ($comp_order as $key => $value) {
            $comp_order[$key]['product'] = $this->model->getProduct($comp_order[$key]['id_product']);
            $comp_order[$key]['sum'] = $comp_order[$key]['price'] * $comp_order[$key]['count'];
            $this->total_order['total_sum'] += $comp_order[$key]['sum'];
            $this->total_order['total_count'] += $comp_order[$key]['count'];
        }
        $user = $this->model->getUser($order['id_user']);

        return $this->view->render('admin/order_edit.twig', array(
            'title' => 'Редактирование заказа',
            'order' => $order,
            'id_statuses' => $id_status,
            'id_payment' => $id_payment,
            'id_delivery' => $id_delivery,
            'comp_orders' => $comp_order,
            'total' => $this->total_order,
            'user' => $user
        ));
    }

    // Обновление заказа
    public function updateOrder($order)
    {
        $order_update = $this->model->getOrder($order['order_id']);
        $old_order_status = $order_update['id_status'];
        $new_order_status = $order['id_status'];
        if ($old_order_status != $new_order_status) {
            $new_date = $order_update->date_order_update = (new \DateTime())->format("Y-m-d H:i:s");
            $order_update->id_status = $order['id_status'];
            $save = $order_update->save();
            if($save){
                // Данные для отправки письма покупателю
                $config = include 'config/main.php';
                $user_data = $this->model->getUser($order['id_user']);
                $subject = 'Заказ LoftShop';
                $status = $this->model->getOneOrderStatus($order['id_status']);
                $body = 'Статус Вашего заказа с номером ' . $order['order_id'] . ' изменен на ' . '"' . $status['title'] . '"';

                // Отправляем письмо покупателю о изменении статуса заказа
                $sendStatus = $this->sendMail(
                    $config['email']['adminname'],
                    $config['email']['adminemail'],
                    $config['email']['adminpassword'],
                    $user_data['email'],
                    $user_data['name'],
                    $subject, $body
                );

                if ($sendStatus) {
                    echo json_encode(array('msg' => 'success', 'new_date' => $new_date));
                } else {
                    echo json_decode(array('msg' => 'По каким-то причинам не удалось отправить письмо пользователю!'));
                }

            } else {
                echo json_encode(array('msg' => 'По каким-то причинам не удалось обновить данные. Пожалуйста, попробуйте позднее.'));
            }
        } else {
            echo json_encode(array('msg' => 'Статус заказа не был изменен!'));
        }
    }

    // Удаление заказа
    public function deleteOrder($id)
    {
        return $this->model->deleteOrder($id);
    }
}