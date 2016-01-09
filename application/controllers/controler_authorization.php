<?php
class Controler_authorization extends Controller
{
    private $_reCaptcha = false;
    private $_recaptcha_secret;
    private $_recaptcha_public;
    private $_dataTime;
    private $_ip;
    protected $_config = array();

    public function __construct() {
        parent::__construct();
        $this->model = new Model_authorization();
        $this->_config = include_once 'config/main.php';
        $this->_dataTime = (new \DateTime())->format("Y-m-d H:i:s");
        $this->_ip = $_SERVER["REMOTE_ADDR"];
        $this->_recaptcha_secret = $this->_config["captcha"]["google_recaptcha_secret"];
        $this->_recaptcha_public = $this->_config["captcha"]["google_recaptcha_public"];
    }

    // Страница авторизации
    public function getLogin() {
        return $this->view->render('authorization/login.twig', array(
            'title' => 'Авторизация'
        ));
    }

    // Выход
    public function logout() {
        unset($_SESSION["LOGIN"]);
        unset($_SESSION["ACTIVE"]);
        unset($_SESSION['admin']);

        return array(
            'status' => 'success',
            'message' => 'Всего доброго!'
        );
    }

    // Авторизация
    public function setLogin($login, $password) {

        $result = array(
            'status' => '',
            'message' => ''
        );

        if(!empty($login) && !empty($password)) {
            $user = $this->model->getUser($login);

            if (!$user) {
                $result['status'] = 'error';
                $result['message'] = 'Данные введены неверно!';
                return $result;
            }

            $userPassword = $user['password'];

            if (password_verify($password, $userPassword)) {
                $group = $this->model->getUserGroup($user['id']);
                $isActive = $user['is_active'];

                $_SESSION["LOGIN"] = $login;
                $_SESSION["ACTIVE"] = $isActive;

                if ($group == 2) {
                    $_SESSION['admin'] = true;
                }

                $result['status'] = 'success';
                $result['message'] = 'Вы успешно авторизованы!';
            } else {
                $result['status'] = 'error';
                $result['message'] = 'Данные введены неверно!';
            }
        } else {
            $result['status'] = 'error';
            $result['message'] = 'Все поля должны быть заполнены!';
        }

        return $result;
    }

    // Форма регистрации
    public function registerForm()
    {
        return $this->view->render('authorization/register.twig', array(
            'title' => 'Регистрация',
            'config' => $this->_config,
            'post' => $_POST
        ));
    }

    // Регистрация
    public function setRegister($data, $reCaptcha)
    {
        $result = array(
            'status' => '',
            'messages' => []
        );

        $emptyInput = false;
        foreach($data as $k => $item) {
            if(empty($item)){
                $emptyInput = true;
                break;
            }
        }

        if($emptyInput != true) {
            if(!filter_var($data["email"], FILTER_VALIDATE_EMAIL)) {
                $result['status'] = 'error';
                $result['messages'][] = 'E-mail введен не правильно';
            }

            if($this->model->getDataCount(array('email' => $data["email"])) > 0) {
                $result['status'] = 'error';
                $result['messages'][] = 'Пользователь с таким Email уже существует!';
            }

            if($this->reCaptcha($reCaptcha)) {
                $result['status'] = 'error';
                $result['messages'][] = 'Проверка не пройдена!';
            }

            if($data["password"] != $data["password_two"]) {
                $result['status'] = 'error';
                $result['messages'][] = 'Пароли не совпадают!';
            }

            if ($result['status'] == 'error') {
                return $result;
            }
        } else {
            $result['status'] = 'error';
            $result['messages'][] = 'Пожалуйста, заполните все поля!';
            return $result;
        }

        $data["password"] = password_hash($data["password"], PASSWORD_DEFAULT);
        unset($data["password_two"]);

        try {

            // Начинаем транзакцию
            $this->model->beginTransaction();

            $id = $this->model->createUser($data);

            if (!$id) {
                throw new Exception('Пользователь не был создан!');
            }

            $link = $this->model->setUserGroup($id, 1);

            if (!$link) {
                throw new Exception('Не удалось установить группу!');
            }

            // Закрываем транзакцию
            $this->model->commitTransaction();
        } catch(Exception $e) {
            $this->model->rollbackTransaction();
            $result['status'] = 'error';
            $result['messages'][] = 'Что-то пошло не так=(';
            return $result;
        }

        $result['status'] = 'success';
        $result['messages'][] = 'Регистрация прошла успешно!';
        $_SESSION['LOGIN'] = $data['email'];
        $_SESSION['ACTIVE'] = 1;
        return $result;
    }

    // Проверка капчи
    public function reCaptcha($g_recaptcha_response)
    {
        if(isset($g_recaptcha_response) && $g_recaptcha_response)
        {
            $result = file_get_contents("https://www.google.com/recaptcha/api/siteverify?secret={$this->_recaptcha_secret}&response={$g_recaptcha_response}&remoteip={$this->_ip}");
            return false;
        } else {
            return true;
        }
    }
}