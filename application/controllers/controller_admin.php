<?php

class Controller_Admin extends Controller {

    // Возвращает главную страницу администрирования
    public function action_index() {
        return $this->view->render('admin/main.twig', array(
            'title' => 'Администрирование'
        ));
    }

    // Возвращает страницу управления товарами
    public function getProductsPage() {

        $productsModel = new Model_Products();
        $categories = $productsModel->getCatalogs();
        $producers = $productsModel->getProducers();


        return $this->view->render('admin/products.twig', array(
            'title' => 'Управление товарами',
            'categories' => $categories,
            'producers' => $producers
        ));
    }

    // Создает файл товаров
    public function createProductsFile($data) {

        $result = [
            'status' => '',
            'message' => ''
        ];

        $allowFormats = ['json', 'pdf', 'xml'];

        if (!in_array($data['format'], $allowFormats)) {
            $result['status'] = 'error';
            $result['messages'] = 'Формат данных указан неверно!';
        } else {
            $format = $data['format'];
        }

        $productsModel = new Model_Products();

        // Условия выбора товаров
        $conditions = [];
        if (!$data['category'] == 0) {
            $categories = $productsModel->getCatalogs();
            foreach ($categories as $category) {
                $allowCategories[] = $category->id;
            }

            if (in_array($data['category'], $allowCategories)) {
                $conditions['id_category'] = $data['category'];
            } else {
                $result['status'] = 'error';
                $result['message'] = 'Категория указана неверно!';
            }
        }

        if (!$data['producer'] == 0) {
            $producers = $productsModel->getProducers();
            foreach ($producers as $producer) {
                $allowProducers[] = $producer->id;
            }

            if (in_array($data['producer'], $allowProducers)) {
                $conditions['id_producer'] = $data['producer'];
            } else {
                $result['status'] = 'error';
                $result['message'] = 'Производитель указан неверно!';
            }
        }

        if (isset($data['count']) && intval($data['count']) > 0) {
            $data = $productsModel->getDownloadData($conditions, $data['count']);
        } else {
            $data = $productsModel->getDownloadData($conditions);
        }

        if ($data) {
            // Путь к файлу с "уникальным" именем
            $filepath = 'files/' . (new DateTime())->format("Y-m-d_H-i-s") . '.' . $format;

            switch($format) {
                case 'pdf':
                    //$this->createPdf($data, $keys_array, $filepath);
                    $result['status'] = 'error';
                    $result['message'] = 'Эта функция еще не реализована=(';
                    return $result;
                    break;
                case 'json':
                    $this->createJson($data, $filepath);
                    break;
                case 'xml':
                    $this->createXml($data, $filepath);
                    break;
            }

            if (file_exists($filepath)) {
                $result['status'] = 'success';
                $result['filepath'] = $filepath;
            } else {
                $result['status'] = 'error';
                $result['message'] = 'Что-то пошло не так=(';
                $result['detail_error'] = 'Не удалось создать файл';
            }
        } else {
            $result['status'] = 'error';
            $result['message'] = 'Данных не найдено или произошла какая-то ошибка!';
        }

        return $result;
    }

    // Скачивает файл на компьютер пользователя
    public function downloadFile($file) {
        if (file_exists($file)) {
            // сбрасываем буфер вывода PHP, чтобы избежать переполнения памяти выделенной под скрипт
            // если этого не сделать файл будет читаться в память полностью!
            if (ob_get_level()) {
                ob_end_clean();
            }
            // заставляем браузер показать окно сохранения файла
            header('Content-Description: File Transfer');
            header('Content-Type: application/octet-stream');
            header('Content-Disposition: attachment; filename=' . basename($file));
            header('Content-Transfer-Encoding: binary');
            header('Expires: 0');
            header('Cache-Control: must-revalidate');
            header('Pragma: public');
            header('Content-Length: ' . filesize($file));
            // читаем файл и отправляем его пользователю
            readfile($file);
            unlink($file);
            exit;
        }
    }

    // Создает файл .json
    public function createJson($data, $filepath) {
        $json = fopen($filepath, 'w');
        fwrite($json, json_encode($data, JSON_UNESCAPED_UNICODE | JSON_PRETTY_PRINT ));
        fclose($json);
    }

    // Создает файл .xml
    public function createXml($data, $filepath) {
        // Создаем DOM документ
        $xml = new DOMDocument('1.0', 'UTF-8');
        $xml->formatOutput = true;

        // Создаем корневой элемент
        $loft_shop = $xml->createElement("loft_shop");
        $xml->appendChild($loft_shop);

        // Создаем список
        $elements = $xml->createElement('products');
        $loft_shop->appendChild($elements);

        foreach($data as $item) {
            // Создаем элемент списка
            $element = $xml->createElement('product');

            foreach ($item as $key => $value) {
                $xml_field = $xml->createElement($key, $value);
                $element->appendChild($xml_field);
            }

            $elements->appendChild($element);
        }

        $xml->save($filepath);
    }

    // Создает файл .pdf
    public function createPdf() {

    }

    public function uploadProductsFile($file) {
        $result = array(
            'status' => '',
            'message' => '',
            'filename' => ''
        );

        $allowed = array('json', 'xml');
        if(isset($file) && $file['error'] == 0){

            $extension = pathinfo($file['name'], PATHINFO_EXTENSION);

            if(!in_array(strtolower($extension), $allowed)){
                $result['status'] = 'error';
                $result['message'] = 'Неверное расширение файла!';
                return $result;
            }

            if(move_uploaded_file($file['tmp_name'], 'temp/'.$file['name'])){
                $result['status'] = 'success';
                $result['message'] = 'Файл успешно загружен';
                $result['filename'] = $file['name'];
                return $result;
            }
        }

        $result['status'] = 'error';
        $result['message'] = 'Ошибка при загрузке файла!';
        return $result;
    }

    public function uploadProducts($filename) {
        $result = [
            'status' => '',
            'message' => '',
            'results' => []
        ];

        $filepath = 'temp/'.$filename;

        if (file_exists($filepath)) {
            if (($file = file_get_contents($filepath)) !== false) {

                $extension = pathinfo($filepath, PATHINFO_EXTENSION);

                switch ($extension) {
                    case 'json':
                        $products = json_decode($file);

                        $model = new Model_Products();
                        for ($i = 0; $i < count($products); $i++) {
                            $result['results'][$i] = $model->addProduct((array) $products[$i]);
                        }
                        break;
                    case 'xml':
                        $xml = simplexml_load_file($filepath);

                        $model = new Model_Products();
                        // Небольшая валидация xml файла
                        if ($xml && isset($xml->products) && isset($xml->products->product)) {
                            $products = $xml->products;
                            foreach ($products->product as $product) {
                                $result['results'][] = $model->addProduct((array) $product);
                            }
                        } else {
                            $result['status'] = 'error';
                            $result['message'] = 'Неправильный xml файл!';
                            return $result;
                        }
                        break;
                    default:
                        $result['status'] = 'error';
                        $result['message'] = 'Неверное расширение файла!';
                        return $result;
                        break;
                }

                // Удаляем файл после того, как он загружен
                unlink($filepath);

                $result['status'] = 'success';
                $result['message'] = 'Товары успешно добавлены';
            } else {
                $result['status'] = 'error';
                $result['message'] = 'Не удалось открыть файл=(';
            }
        } else {
            $result['status'] = 'error';
            $result['message'] = 'Файла почему-то нет=(';
        }

        return $result;
    }
}