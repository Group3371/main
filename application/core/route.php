<?php

$router = new \Klein\Klein();

// Главная страница
$router->respond('GET', '/', function() {
    $controller = new Controller_Main();
    return $controller->action_index();
});

// Страница каталога
$router->respond(array('GET', 'POST'),'/products/?', function($request, $response) {
    $controller = new Controller_Products();
    $messages = [
        'success_message' => '',
        'error_message' => ''
    ];

    $action = $request->action;
    switch ($action) {
        case 'new':
            if (!empty($_POST['title'])) {
                $messages = $controller->addCategory($request->title);
            } else {
                $messages['error_message'] = 'Укажите имя категории';
            }
            break;
        case 'edit':
            if (!empty($_POST['title'])) {
                $messages = $controller->editCategory($request->id, $request->title);
            } else {
                $messages['error_message'] = 'Укажите имя категории';
            }
            break;
        case 'delete':
                $messages = $controller->deleteCategory($request->id);
            break;
    }

    return $controller->getCatalogs($messages);
});

// Страница О нас
$router->respond('GET', '/about/?', function() {
    $controller = new Controller_About();
    return $controller->action_index();
});

// Контакты
$router->respond('GET', '/contacts/?', function() {
    $controller = new Controller_Contacts();
    return $controller->action_index();
});

// Контакты обратная форма
$router->respond('POST', '/contacts/?', function() {
    $controller = new Controller_Contacts();
    $controller->feedbackSend();
});

// Добавление товара
$router->respond('GET', '/admin/add_product/?', function($request, $response) {

    if (!$_SESSION['admin'])
        $response->redirect('/404')->send();

    $controller = new Controller_Products();
    return $controller->addProductView();
});

$router->respond('POST', '/admin/add_product/?', function($request, $response) {

    if (!$_SESSION['admin'])
        $response->redirect('/404')->send();

    $controller = new Controller_Products();

    if (!$_SESSION['admin'])
        $response->redirect('/404')->send();

    $data = [
        'title' => $_POST['title'],
        'id_category' => $_POST['category'],
        'id_producer' => $_POST['producer'],
        'count' => $_POST['count'],
        'price' => $_POST['price'],
        'color' => $_POST['color'],
        'os' => $_POST['os'],
        'img' => $_POST['imagename'],
        'screen_size' => $_POST['screen_size'],
        'description' => $_POST['description']
    ];

    echo json_encode($controller->addProduct($data), JSON_UNESCAPED_UNICODE);
});

// Удаление товара
$router->respond('POST', '/admin/delete_products/?', function($request, $response) {

    if (!$_SESSION['admin'])
        $response->redirect('/404')->send();

    $controller = new Controller_Products();
    echo json_encode($controller->deleteProducts($_POST['data']));
    exit;
});

// Редактирование товара
$router->respond('GET', '/admin/update_product/[:id]/?', function($request, $response) {

    if (!$_SESSION['admin'])
        $response->redirect('/404')->send();

    $controller = new Controller_Products();
    return $controller->editProductView($request->id);
});

// Обновление продукта (сохранение после редактирования)
$router->respond('POST', '/admin/update_product/?', function($request, $response) {

    if (!$_SESSION['admin'])
        $response->redirect('/404')->send();

    $controller = new Controller_Products();

    $product = [
        'id' => $_POST['id'],
        'title' => $_POST['title'],
        'id_category' => $_POST['category'],
        'id_producer' => $_POST['producer'],
        'count' => $_POST['count'],
        'price' => $_POST['price'],
        'color' => $_POST['color'],
        'os' => $_POST['os'],
        'img' => $_POST['imagename'],
        'screen_size' => $_POST['screen_size'],
        'description' => $_POST['description']
    ];

    $controller->updateProduct($product);
    exit;
});


// Загрузка изображения товара
$router->respond('post', '/admin/product_image_upload/?', function($request, $response) {

    if (!$_SESSION['admin'])
        $response->redirect('/404')->send();

    $controller = new Controller_Products();
    $result = $controller->uploadImage($_FILES['image']);
    echo $result;
    exit;
});

// Продукты
$router->respond('GET', '/products/[:id_catalog]/?', function($request) {
    $controller = new Controller_Products();
    return $controller->getProducts($request->id_catalog);
});

// Навигация по каталогу продуктов
$router->respond('GET', '/products/[:id_catalog]/[:page]/?', function($request) {
    $controller = new Controller_Products();
    return $controller->getProducts($request->id_catalog, $request->page);
});

// Один продукт
$router->respond('GET', '/product/[:id]/?', function($request) {
    $controller = new Controller_Products();
    return $controller->getProduct($request->id);
});

// Способы оплаты
$router->respond('GET', '/payments/?', function() {
    $controller = new Controller_Payments();
    return $controller->action_index();
});

// Перейти в корзину
$router->respond('GET', '/cart/?', function() {
    $controller = new Controller_Cart();
    return $controller->displayCart();
});

// Добавить товар в корзину
$router->respond('POST', '/cart/?', function() {
    $controller = new Controller_Cart();
    $controller->addCart();
});

// Обновить количество товара в корзине
$router->respond('POST', '/cart/update/?', function() {
    $controller = new Controller_Cart();
    $controller->updateCart();
});

// Удалить товар из корзины
$router->respond('POST', '/cart/remove/?', function() {
    $controller = new Controller_Cart();
    return $controller->removeCart();
});

// Перейти к оформлению заказа
$router->respond('GET', '/order/?', function($request, $response) {
    if (!$_SESSION['LOGIN'])
        $response->redirect('/register')->send();

    $controller = new Controller_Cart();
    return $controller->inputDeliveryData();
});

// Пересчитываем итоговую сумму в зависимости от доставки
$router->respond('POST', '/delivery/?', function() {
    $controller = new Controller_Cart();
    $controller->idDeliveryChecked();
});

// Подтверждение покупки и запись в базу данных
$router->respond('POST', '/purchase/?', function() {
    $controller = new Controller_Cart();
    $controller->purchaseSubmit();
});

// Поиск продуктов
$router->respond('GET', '/search/?', function() {
    $controller = new Controller_Search();
    return $controller->action_index();
});

// Поиск продуктов (отправка формы)
$router->respond('POST', '/search/?', function() {
    $controller = new Controller_Search();
    // Использовал @, потому что не нашел другого решения
    return $controller->getSearchResults($_POST['name'], @$_POST['price'], @$_POST['producer'], @$_POST['category']);
});

// Ошибки
$router->onHttpError(function ($code) {
    switch ($code) {
        case 404:
            $controller = new Controller_404();
            $controller->action_index();
            break;

    }
});

// Страница 404
$router->respond('404/?', function() {
    $controller = new Controller_404();
    $controller->action_index();
});

// Страница авторизации
$router->respond('GET', '/login/?', function($request) {
    $controller = new Controler_authorization();
    return $controller->getLogin();
});

// Авторизация
$router->respond('POST', '/login/?', function($request) {
    $controller = new Controler_authorization();
    return json_encode($controller->setLogin($request->login, $request->password));
});

// Выход
$router->respond('POST', '/logout/?', function($request) {

    $controller = new Controler_authorization();
    return json_encode($controller->logout());
});

// Страница регистрации
$router->respond('GET', '/register/?', function($request) {
    $controller = new Controler_authorization();
    return $controller->registerForm();
});

// Регистрация
$router->respond('POST', '/register/?', function($request) {
    $controller = new Controler_authorization();

    $inputData = array(
        "password" => $request->password,
        "password_two" => $request->password_two,
        "email" =>  $request->email
    );

    return json_encode($controller->setRegister($inputData, $_POST["g-recaptcha-response"]));
});

// Личный кабинет пользователя
$router->respond('GET', '/account/?', function($request, $response) {
    if (!$_SESSION['LOGIN'])
        $response->redirect('/register')->send();

    $controller = new Controller_Account();
    return $controller->action_index();
});

// Обновление данных пользователя в личном кабинете
$router->respond('POST', '/account/?', function($request, $response) {
    if (!$_SESSION['LOGIN'])
        $response->redirect('/register')->send();

    $controller = new Controller_Account();
    $controller->updateUser();
});

// Главная страница администрирования
$router->respond('GET', '/admin/?', function($request, $response) {

    if (!$_SESSION['admin'])
        $response->redirect('/404')->send();

    $controller = new Controller_Admin();
    return $controller->action_index();
});

// Список пользователей
$router->respond('GET', '/admin/users/?', function($request, $response) {

    if (!$_SESSION['admin'])
        $response->redirect('/404')->send();

    $controller = new Controller_Users();
    return $controller->getUsers();
});

// Форма редактирования пользователя
$router->respond('GET', '/admin/user_update/[:id]/?', function($request, $response) {

    if (!$_SESSION['admin'])
        $response->redirect('/404')->send();

    $controller = new Controller_Users();
    return $controller->userEditForm($request->id);
});

// Обновление пользовательских данных
$router->respond('POST', '/admin/user_update/?', function($request, $response) {

    if (!$_SESSION['admin'])
        $response->redirect('/404')->send();

    $userData = array(
        'id' => $request->id,
        'name' => $request->name,
        'email' => $request->email,
        'password' => $request->password,
        'password_two' => $request->password_two,
        'lastname' => $request->lastname,
        'birthday' => $request->birthday,
        'is_active' => $request->is_active,
        'address' => $request->address
    );

    $controller = new Controller_Users();
    echo json_encode($controller->updateUser($userData));
    exit;
});

// Добавление пользователя в новую группу
$router->respond('POST', '/admin/user_update/add_group/?', function($request, $response) {

    if (!$_SESSION['admin'])
        $response->redirect('/404')->send();

    $controller = new Controller_Users();
    return $controller->addGroup($request->id_user, $request->id_group);
});

// Удаление пользователя из группы
$router->respond('POST', '/admin/user_update/remove_group/?', function($request, $response) {

    if (!$_SESSION['admin'])
        $response->redirect('/404')->send();

    $controller = new Controller_Users();
    return $controller->removeGroup($request->id_user, $request->id_group);
});

// Удаление пользователя
$router->respond('POST', '/admin/user_delete/?', function($request, $response) {

    if (!$_SESSION['admin'])
        $response->redirect('/404')->send();

    $controller = new Controller_Users();
    return json_encode($controller->deleteUser($_POST['id']));
});

// Страница управления товарами (админ)
$router->respond('GET', '/admin/products/?', function($request, $response) {

    if (!$_SESSION['admin'])
        $response->redirect('/404')->send();

    $controller = new Controller_Admin();
    return $controller->getProductsPage();
});

// Создание файла товаров
$router->respond('POST', '/admin/create_file/?', function($request, $response) {

    if (!$_SESSION['admin'])
        $response->redirect('/404')->send();

    $data = [
        'format' => $_POST['format'],
        'category' => $_POST['category'],
        'producer' => $_POST['producer'],
        'count' => $_POST['count']
    ];

    $controller = new Controller_Admin();
    $result = json_encode($controller->createProductsFile($data), JSON_UNESCAPED_UNICODE);

    return $result;
});

// Скачивание файла товаров
$router->respond('GET', '/download/files/[:filename]', function($request, $response) {

    if (!$_SESSION['admin'])
        $response->redirect('/404')->send();

    $controller = new Controller_Admin();
    $controller->downloadFile('files/'.$request->filename);
});

// Загрузка товаров
$router->respond('POST', '/admin/upload_products/?', function($request, $response) {

    if (!$_SESSION['admin'])
        $response->redirect('/404')->send();

    $controller = new Controller_Admin();
    $result = $controller->uploadProductsFile($_FILES['file']);

    if ($result['status'] == 'success') {
        $result = $controller->uploadProducts($result['filename']);
        return json_encode($result, JSON_UNESCAPED_UNICODE);
    } else {
        return json_encode($result, JSON_UNESCAPED_UNICODE);
    }
});

// Админка заказы
$router->respond('GET', '/admin/orders/?', function($request, $response) {

    if (!$_SESSION['admin'])
        $response->redirect('/404')->send();

    $controller = new Controller_Orders();
    return $controller->getOrders();
});

// Форма редактирования заказа
$router->respond('GET', '/admin/order_update/[:id]/?', function($request, $response) {

    if (!$_SESSION['admin'])
        $response->redirect('/404')->send();

    $controller = new Controller_Orders();
    return $controller->orderEditForm($request->id);
});

// Обновление статуса заказа, отправка письма покупателю о новом статусе заказа
$router->respond('POST', '/admin/order_update/?', function($request, $response) {

    if (!$_SESSION['admin'])
        $response->redirect('/404')->send();

    $order = array(
        'order_id' => $request->order_id,
        'id_status' => $request->id_status,
        'id_user' => $request->id_user
    );

    $controller = new Controller_Orders();
    $controller->updateOrder($order);
});

// Удаление заказа
$router->respond('POST', '/admin/order_delete/?', function($request, $response) {

    if (!$_SESSION['admin'])
        $response->redirect('/404')->send();

    $controller = new Controller_Orders();
    return json_encode($controller->deleteOrder($_POST['id']));
});

// Страница рассылки
$router->respond('GET', '/admin/mailing/?', function($request, $response) {

    if (!$_SESSION['admin'])
        $response->redirect('/404')->send();

    $controller = new Controller_Mailing();
    return $controller->action_index();
});

// Страница рассылки
$router->respond('POST', '/admin/mailing/?', function($request, $response) {

    if (!$_SESSION['admin'])
        $response->redirect('/404')->send();

    $data = [
        'subject' => $_POST['subject'],
        'title' => $_POST['title'],
        'body' => $_POST['body'],
        'id_group' => $_POST['group']
    ];

    $controller = new Controller_Mailing();
    $result = $controller->sendMails($data);

    // TODO: почему-то в этом методе возникает исключение во время возврата значения
    //return json_encode($result, JSON_UNESCAPED_UNICODE);
});


$router->dispatch();



