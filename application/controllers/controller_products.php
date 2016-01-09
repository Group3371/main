<?php

class Controller_Products extends Controller {

    private $count_on_page = 16;

    public function __construct() {
        parent::__construct();
        $this->model = new Model_Products();
    }

    public function addCategory($title) {
        return $this->model->addCategory($title);
    }

    public function editCategory($id, $title) {
        return $this->model->editCategory($id, $title);
    }

    public function deleteCategory($id) {
        return $this->model->deleteCategory($id);
    }

    public function addProductView() {
        $producers = $this->model->getProducers();
        $categories = $this->model->getCatalogs();

        return $this->view->render('products/item_add.twig', array(
            'title' => 'Добавление товара',
            'producers' => $producers,
            'categories' => $categories
        ));
    }

    public function uploadImage($file) {
        $result = array(
            'status' => '',
            'message' => '',
            'filename' => ''
        );

        $allowed = array('png', 'jpg', 'gif', 'jpeg');
        if(isset($file) && $file['error'] == 0){

            $extension = pathinfo($file['name'], PATHINFO_EXTENSION);

            if(!in_array(strtolower($extension), $allowed)){
                $result['status'] = 'error';
                $result['message'] = 'Неверное расширение файла!';
                return json_encode($result, JSON_UNESCAPED_UNICODE);
            }

            if (file_exists('img/content/'.$file['name'])) {
                $result['status'] = 'error';
                $result['message'] = 'Файл с таким именем уже существует!';
                return json_encode($result, JSON_UNESCAPED_UNICODE);
            }

            if(move_uploaded_file($file['tmp_name'], 'img/content/'.$file['name'])){
                $result['status'] = 'success';
                $result['message'] = 'Файл успешно загружен';
                $result['filename'] = $file['name'];
                return json_encode($result, JSON_UNESCAPED_UNICODE);
            }
        }

        $result['status'] = 'error';
        $result['message'] = 'Ошибка при загрузке файла!';
        return json_encode($result, JSON_UNESCAPED_UNICODE);
    }

    public function addProduct($data) {
        return $this->model->addProduct($data);
    }

    public function deleteProducts($data) {
        $results = [];

        foreach($data as $id) {
            // Если продукта нет в базе данных, выдаем ошибку
            if ($this->model->deleteProduct($id)) {
                 $results[] = array(
                    'status' => 'success',
                    'message' => 'Товар с id = ' . $id . ' удален!',
                    'id' => $id
                );
            } else {
                $results[] = array(
                    'status' => 'error',
                    'message' => 'Невозможно удалить товар с id = ' . $id,
                    'id' => $id
                );
            }
        }

        return $results;
    }

    public function editProductView($id) {
        $product = $this->model->get($id);

        $producers = $this->model->getProducers();
        $categories = $this->model->getCatalogs();

        return $this->view->render('products/item_edit.twig', array(
            'title' => 'Редактирование товара',
            'product' => $product,
            'producers' => $producers,
            'categories' => $categories
        ));
    }

    public function updateProduct($product) {
        return $this->model->updateProduct($product);
    }

    public function getCatalogs($messages) {
        $catalogs = $this->model->getCatalogs();

        return $this->view->render('products/products.twig', array(
            'title' => 'Каталог',
            'catalogs' => $catalogs,
            'messages' => $messages
        ));
    }

    public function getProducts($idCatalog = 'all', $page = 1) {
        // Так работать проще
        if ($idCatalog == 'all')
            $idCatalog = null;

        $products = $this->model->getProducts($idCatalog, $this->count_on_page, $this->count_on_page*($page-1));
        if (isset($idCatalog))
            $title = $this->model->getCatalogName($idCatalog);
        else
            $title = 'Все';

        // Вычисляем количество страниц
        $pages = ceil($this->model->getCount($idCatalog) / $this->count_on_page);

        // Формируем каталог для ссылки
        $catalog = (isset($idCatalog)) ? $idCatalog : 'all';

        return $this->view->render('products/list_view.twig', array(
            'title' => $title,
            'products' => $products,
            'pages' => $pages,
            'activePage' => $page,
            'catalog' => $catalog
        ));
    }

    public function getProduct($id) {
        $product = $this->model->get($id);

        if ($product) {
            $categoryTitle = $this->model->getCatalogName($product->id_category);
            $count = ($product->count > 6) ? 6 : $product->count;

            $product->producer = $this->model->getProducer($product->id_producer)->title;

            return $this->view->render('products/item_view.twig', array(
                'title' => $product->title,
                'product' => $product,
                'count' => $count,
                'category' => $categoryTitle
            ));
        } else {
            $error404 = new Controller_404();
            return $error404->action_index();
        }
    }

}

?>