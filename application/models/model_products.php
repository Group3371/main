<?php

class Model_Products extends Model {
    protected $table = 'products';

    public function getCatalogName($idCatalog) {
        return ORM::for_table('categories')->find_one($idCatalog)->title;
    }

    public function addCategory($title) {
        // Создаем ответ запроса
        $messages = [
            'success_message' => '',
            'error_message' => ''
        ];

        // Проверяем, что такой категории еще не существует
        if (!ORM::for_table('categories')->where('title', $title)->count()) {
            $category = ORM::for_table('categories')->create();
            $category->title = $title;
            $category->save();
            $messages['success_message'] = 'Категория "' . $title . '" успешно добавлена!';
        } else {
            $messages['error_message'] = 'Категория "' . $title . '" уже существует!';
        }

        return $messages;
    }

    public function deleteCategory($id) {
        // Создаем ответ запроса
        $messages = [
            'success_message' => '',
            'error_message' => ''
        ];

        if (ORM::for_table('categories')->find_one($id)) {
            ORM::for_table('categories')->find_one($id)->delete();
            $messages['success_message'] = 'Категория успешно удалена!';
        } else {
            $messages['error_message'] = 'Такой категории уже нет!';
        }

        return $messages;
    }

    public function editCategory($id, $title) {
        // Создаем ответ запроса
        $messages = [
            'success_message' => '',
            'error_message' => ''
        ];

        // Проверяем, что такой категории еще не существует
        if (!ORM::for_table('categories')->where('title', $title)->count()) {
            $category = ORM::for_table('categories')->find_one($id);
            $category->title = $title;
            $category->save();
            $messages['success_message'] = 'Категория успешно обновлена!';
        } else {
            $messages['error_message'] = 'Категория "' . $title . '" уже существует!';
        }

        return $messages;
    }

    public function addProduct($data) {
        $result = [
            'status' => '',
            'message' => ''
        ];

        if (ORM::for_table($this->table)->where('title', $data['title'])->count()) {
            $result['status'] = 'error';
            $result['message'] = 'Товар с именем ' . $data["title"] . ' уже существует';
            return $result;
        }

        $product = ORM::for_table($this->table)->create();
        foreach ($data as $key => $value) {
            if (!empty($value))
                $product->$key = $value;
        }

        if ($product->save()) {
            $result['status'] = 'success';
            $result['message'] = 'Товар ' . $data["title"] . ' успешно добавлен!';
        } else {
            $result['status'] = 'error';
            $result['message'] = 'Возникла какая-то ошибка при добавлении товара ' . $data["title"] . '!';
        }

        return $result;
    }

    public function updateProduct($product) {
        $newProduct = ORM::for_table($this->table)->find_one($product['id']);

        // Удаляем id, чтобы не перезаписать его в цикле ниже
        unset($product['id']);

        // Устанавливаем новые данные товара
        foreach ($product as $key => $value) {
            if (!empty($value))
                $newProduct->$key = $value;
        }

        $newProduct->save();
    }

    public function deleteProduct($id) {
        $product = ORM::for_table($this->table)->find_one($id);

        $imagePath = 'img/content/' . $product->img;
        if (isset($imagePath)) {
            unlink($imagePath);
        }

        return $product->delete();
    }

    public function getProducer($id) {
        return ORM::for_table('producers')->find_one($id);
    }

    public function getLimit($limit) {
        return ORM::for_table($this->table)->limit($limit)->find_many();
    }

    public function getSlides($limit, $offset = 0) {
        return ORM::for_table($this->table)->having_like('img', '%.png')->limit($limit)->find_many();
    }

    public function getCatalogs() {
        return ORM::for_table('categories')->find_many();
    }

    public function getMinPrice() {
        return ORM::for_table($this->table)->min('price');
    }

    public function getMaxPrice() {
        return ORM::for_table($this->table)->max('price');
    }

    public function getProducts($idCatalog, $limit = 15, $offset = 0) {
        if (isset($idCatalog)) {
            return ORM::for_table($this->table)->where('id_category', $idCatalog)->limit($limit)->offset($offset)->find_many();
        } else {
            return ORM::for_table($this->table)->limit($limit)->offset($offset)->find_many();
        }
    }

    public function getProducers() {
        return ORM::for_table('producers')->find_many();
    }

    public function getCount($idCatalog) {
        if (isset($idCatalog)) {
            return ORM::for_table($this->table)->where('id_category', $idCatalog)->count();
        } else {
            return ORM::for_table($this->table)->count();
        }
    }

    public function getSearchResults($params, $price) {
        // Формируем sql запрос
        $sql = 'SELECT * FROM products';

        if (isset($params) || isset($price)) {
            $sql .= ' WHERE ';

            if (isset($params)) {
                foreach ($params as $key => $value) {
                    if ($value != 'all')
                        $sql .= "({$key} = {$value}) AND ";
                }
                // Удаляем последний AND, если он есть и цена не указана
                if (strpos($sql, 'AND') && !isset($price))
                    $sql = substr($sql, 0, strlen($sql) - 5);
            }

            if (isset($price)) {
                $sql .= ' (price > ' . $price['min_price'] . ') AND (price < ' . $price['max_price'] . ')';
            }
        }

        return ORM::for_table($this->table)->raw_query($sql)->find_many();
    }

    public function getDownloadData($conditions, $limit = null) {
        if ($limit) {
            return ORM::for_table($this->table)->where($conditions)->limit($limit)->find_array();
        } else {
            return ORM::for_table($this->table)->where($conditions)->find_array();
        }
    }
}
?>