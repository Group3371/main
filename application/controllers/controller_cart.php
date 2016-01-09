<?php

class Controller_Cart extends Controller
{

    use sendMail, validateData;

    public $cart;
    public $incart;
    public $userdata;
    public $msg;
    public $oldUser;
    public $oldUserFirstname;
    public $oldUserLastname;
    public $oldUserAddress;

    public function __construct()
    {
        parent::__construct();
        $this->model = new Model_Cart();
    }

    // Добавляем новый товар в корзину
    public function addCart()
    {
        $id = $_POST['product_id'];
        $count = (int)$_POST['count'];
        if (empty($_SESSION['cart'][$id])) {
            $items_count = $count;
        } else {
            $items_count = $count + $_SESSION['cart'][$id];
        }
        if ($items_count > $this->model->getProductQuantity($id)) {
            echo json_encode(array('msg' => 'false'));
        } else {
            if (isset($_SESSION['cart'][$id])) {
                $_SESSION['cart'][$id] += $count;
            } else {
                $_SESSION['cart'][$id] = $count;
            }
            $this->cart = $_SESSION['cart'];
            $this->countCart();
            $this->totalCount();
            header("Content-Type: application/json");
            echo json_encode(array('total_amount' => $_SESSION['total_amount'], 'total_price' => $_SESSION['total_price']));
        }
    }

    // Обновляем количество товара в корзине
    public function updateCart()
    {
        $id = $_POST['update_product_id'];
        $newcount = (int)$_POST['newcount'];
        if ($newcount <= $this->model->getProductQuantity($id) && ($_POST['update'] == 'update')) {
            $_SESSION['cart'][$id] = $newcount;
            $product_price = $this->model->getProductPrice($id);
            $this->cart = $_SESSION['cart'];
            $this->countCart();
            $this->totalCount();
            echo json_encode(array('total_amount' => $_SESSION['total_amount'], 'total_price' => $_SESSION['total_price'],
                'id_item' => $_POST['update_product_id'], 'newcount' => $newcount * $product_price));
        } else {
            echo json_encode(array('msg' => 'false'));
        }
    }

    // Удаляем товар из корзины
    public function removeCart()
    {
        $id = $_POST['remove_product_id'];
        if ($id && ($_POST['remove']) == 'remove') {
            unset($_SESSION['cart'][$id]);
        }
        $this->cart = $_SESSION['cart'];
        return $this->displayCart();
    }

    // Считаем общее кол-во и цену корзины
    public function totalCount()
    {
        $total_price = 0;
        if (!empty($this->incart)) {
            foreach ($this->incart as $key => $value) {
                $total_price += $this->incart[$key]['subtotal'];
            }
        }
        $_SESSION['total_price'] = $total_price;

        $total_amount = 0;
        if (!empty($this->incart)) {
            foreach ($this->incart as $key => $value) {
                $total_amount += $this->incart[$key]['quantity'];
            }
        }
        $_SESSION['total_amount'] = $total_amount;
    }

    // Определяем содержимое корзины
    public function countCart()
    {
        $this->cart = $_SESSION['cart'];
        foreach ($this->cart as $key => $value) {
            if (!empty($key)) {
                $product_title = $this->model->getProductTitle($key);
                $product_price = $this->model->getProductPrice($key);
                $product_image = $this->model->getProductImage($key);
                $this->incart[] = array(
                    'id' => $key,
                    'title' => $product_title,
                    'price' => $product_price,
                    'quantity' => $value,
                    'subtotal' => $value * $product_price,
                    'image' => $product_image
                );
            }
        }
        return $_SESSION['incart'] = $this->incart;
    }

    // Возвращаем содержимое корзин
    public function displayCart()
    {
        $this->countCart();
        $this->totalCount();

        return $this->view->render('orders/cart_view.twig', array(
            'incart' => $this->incart,
            'total_price' => $_SESSION['total_price'],
            'total_amount' => $_SESSION['total_amount']
        ));
    }

    // Возвращаем форму для ввода данных покупателя
    public function inputDeliveryData()
    {
        $this->countCart();
        $this->totalCount();
        $payment = $this->model->getPayment();
        $delivery_price = $this->model->getDeliveryCost(1);     // id доставки по умолчанию равно 1
        $final_price = $_SESSION['total_price'] + $delivery_price;

        if ($_SESSION['LOGIN']) {
            $this->oldUser = $this->model->getUser($_SESSION['LOGIN']);
            if (!empty($this->oldUser['name']) && $this->oldUser['lastname'] && $this->oldUser['address']) {
                $this->oldUserFirstname = $this->oldUser['name'];
                $this->oldUserLastname = $this->oldUser['lastname'];
                $this->oldUserAddress = $this->oldUser['address'];
            }
        }
        return $this->view->render('orders/purchase_view.twig', array(
            'incart' => $this->incart,
            'total_price' => $_SESSION['total_price'],
            'total_amount' => $_SESSION['total_amount'],
            'payments' => $payment,
            'delivery_price' => $delivery_price,
            'final_price' => $final_price,
            'userName' => $this->oldUserFirstname,
            'userLastname' => $this->oldUserLastname,
            'userAddress' => $this->oldUserAddress
        ));
    }


    // Пересчитываем итоговую сумму в зависимости от способа доставки
    public function idDeliveryChecked()
    {
        $id_delivery = $_POST['id_delivery'];
        $delivery_price = $this->model->getDeliveryCost($id_delivery);
        $final_price = $_SESSION['total_price'] + $delivery_price;
        echo json_encode(array('delivery_price' => $delivery_price, 'final_price' => $final_price));
    }

    // Проверяем введенные покупателем данные
    public function purchaseValidate()
    {
        if (!empty($_POST['firstname']) && !empty($_POST['lastname']) && !empty($_POST['address'])
        ) {
            $firstname = $this->clean($_POST['firstname']);
            $lastname = $this->clean($_POST['lastname']);
            $address = $this->clean($_POST['address']);
            $id_delivery = (int)$_POST['id_delivery'];
            $payment = (int)$_POST['payment'];

            if (!empty($firstname) && !empty($lastname) && !empty($address) && !empty($id_delivery)
                && !empty($payment)
            ) {
                if ($this->checkLength($firstname, 2, 20) && $this->checkLength($lastname, 2, 30)
                    && $this->checkLength($address, 2, 255)
                ) {
                        $this->userdata = array(
                            'firstname' => $firstname,
                            'lastname' => $lastname,
                            'address' => $address,
                            'id_delivery' => $id_delivery,
                            'payment' => $payment
                        );
                        return $_SESSION['userdata'] = $this->userdata;
                } else {
                    $this->msg = 'Введенные данные некорректные!';
                }
            } else {
                $this->msg = 'Все поля формы должны быть заполнены!';
            }
        } else {
            $this->msg = 'Все поля формы должны быть заполнены!';
        }
    }

    // После подтверждения покупки заполняем таблицы БД
    public function purchaseSubmit()
    {
        $this->purchaseValidate();
        if (!isset($_SESSION['userdata'])) {
            echo json_encode(array('msg' => $this->msg));
        } else {
            $this->userdata = $_SESSION['userdata'];

            try {
                $this->model->beginTransaction(); // Открываем транзацию

                // Обновляем данные пользователя в таблице Users
                $newUser = $this->model->getUser($_SESSION['LOGIN']);
                $newUser->name = $this->userdata['firstname'];
                $newUser->lastname = $this->userdata['lastname'];
                $newUser->address = $this->userdata['address'];
                $newUser->last_update = (new \DateTime())->format("Y-m-d H:i:s");
                $newUser->save();

                // Создаем запись в таблице Orders
                $newOrder = $this->model->createOrder();
                $newOrder->id_user = $newUser['id'];
                $newOrder->id_status = 1;
                $newOrder->date_order = (new \DateTime())->format("Y-m-d H:i:s");
                $newOrder->date_order_update = (new \DateTime())->format("Y-m-d H:i:s");
                $newOrder->id_payment = $this->userdata['payment'];
                $newOrder->id_delivery = $this->userdata['id_delivery'];
                $newOrder->save();

                // Создаем запись в таблице Comp_Orders
                foreach ($_SESSION['incart'] as $key => $value) {
                    $newCompOrder = $this->model->createCompOrders();
                    $newCompOrder->id_order = $newOrder->id();
                    $newCompOrder->id_product = $_SESSION['incart'][$key]['id'];
                    $newCompOrder->price = $_SESSION['incart'][$key]['price'];
                    $newCompOrder->count = $_SESSION['incart'][$key]['quantity'];
                    $newCompOrder->save();
                }

                // Обновляем кол-во товара в таблице Products
                foreach ($_SESSION['incart'] as $key => $value){
                    $newCount = $this->model->get($_SESSION['incart'][$key]['id']);
                    $newCount->count = $newCount['count'] - $_SESSION['incart'][$key]['quantity'];
                    $newCount->save();
                }

                $this->model->commitTransaction();  // Закрываем транзакцию

                // Данные для отправки писем
                $config = include 'config/main.php';
                $subject = 'Заказ LoftShop';

                // Отправляем письмо покупателю об успешной покупке
                $bodyUser = 'Заказ с номером ' . $newOrder->id() . ' на сумму ' . $_SESSION['total_price'] . ' руб. от ' .
                    (new \DateTime())->format('Y/m/d') . ' принят.';

                $this->sendMail(
                    $config['email']['adminname'],
                    $config['email']['adminemail'],
                    $config['email']['adminpassword'],
                    $newUser['email'],
                    $this->userdata['firstname'],
                    $subject, $bodyUser
                );

                // Отправляем письмо админу о новом заказе
                $bodyAdmin = 'Пользователь ' . $this->userdata['firstname'] . ' сделал(а) заказ № ' . $newOrder->id() . ' на сумму '
                    . $_SESSION['total_price'] . ' руб. от ' . (new \DateTime())->format('Y/m/d');

                $this->sendMail(
                    $config['email']['adminname'],
                    $config['email']['adminemail'],
                    $config['email']['adminpassword'],
                    $config['email']['adminemail'],
                    $config['email']['adminname'],
                    $subject, $bodyAdmin
                );

                unset($_SESSION['incart'], $_SESSION['total_price'], $_SESSION['total_amount'], $_SESSION['cart'],
                    $_SESSION['userdata']);

                echo json_encode(array('msg' => 'success', 'total_amount' => $_SESSION['total_amount'] = 0,
                    'total_price' => $_SESSION['total_price'] = 0));
            } catch (Exception $e) {
                $this->model->rollbackTransaction(); // Откатываем транзацию
                echo json_encode(array('msg' => 'Что-то пошло не так=('));
            }
        }
    }
}