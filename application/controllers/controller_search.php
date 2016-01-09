<?php
class Controller_Search extends Controller {

    public function __construct() {
        parent::__construct();
        $this->model = new Model_Products();
    }

    public function action_index($products = null, $params = array())
    {
        // TODO: Слишком много запросов к БД
        $min_price = $this->model->getMinPrice();
        $max_price = $this->model->getMaxPrice();
        $producers = $this->model->getProducers();
        $categories = $this->model->getCatalogs();

        // Добавляем название каталога и производителя к каждому продукту
        if (isset($products)) {
            foreach ($products as $product) {
                foreach ($categories as $category) {
                    if ($product->id_category == $category->id) {
                        $product->category = $category->title;
                    }
                }

                foreach ($producers as $producer) {
                    if ($product->id_producer == $producer->id) {
                        $product->producer = $producer->title;
                    }
                }
            }
        }

        return $this->view->render('search_view.twig', array(
            'title' => 'Поиск',
            'min_price' => $min_price,
            'max_price' => $max_price,
            'producers' => $producers,
            'categories' => $categories,
            'products' => $products,
            'params' => $params
        ));
    }

    public function getSearchResults($name, $price, $producer, $category)
    {
        // TODO:Тут должна быть проверка на корректность данных
        if (isset($price)) {
            $price_array = explode(' ', $price);
            $sql_price = array(
                'min_price' => $price_array[0],
                'max_price' => $price_array[2],
            );
        } else {
            $sql_price = null;
        }

        // Формируем массив параметров для sql запроса
        if (isset($producer) || isset($category)) {
            $sql_params = array(
                'id_producer' => $producer,
                'id_category' => $category
            );
        } else {
            $sql_params = null;
        };

        $results = $this->model->getSearchResults($sql_params, $sql_price);

        // Если навзание указано, выбирает только те записи, которые его содержат
        if (!empty($name)) {
            $products = [];
            foreach ($results as $result) {
                if (stripos($result->title, $name) !== false) {
                    $products[] = $result;
                }
            }
        } else {
            $products = $results;
        }

        return $this->action_index($products, array(
            'name' => $name,
            'producer' => $producer,
            'category' => $category
        ));

    }

}