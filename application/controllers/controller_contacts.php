<?php

class Controller_Contacts extends Controller
{
    use sendMail, validateData;

    public function __construct()
    {
        parent::__construct();
        $this->model = new Model_Contacts();
        $this->_config = include_once 'config/main.php';
        $this->_ip = $_SERVER["REMOTE_ADDR"];
        $this->_recaptcha_secret = $this->_config["captcha"]["google_recaptcha_secret"];
        $this->_recaptcha_public = $this->_config["captcha"]["google_recaptcha_public"];
    }

    public function action_index()
    {
        $records = $this->model->getAll();

        return $this->view->render('contacts/contacts_view.twig', array(
            'title' => 'Контакты',
            'managers' => $records,
            'config' => $this->_config
        ));
    }

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

    public function feedbackSend()
    {
        if (!empty($_POST['name']) && !empty($_POST['message']) && !empty($_POST['email']) && !empty($_POST["g-recaptcha-response"])) {
            $name = $this->clean($_POST['fio']);
            $message = $this->clean($_POST['message']);
            $email = $this->clean($_POST['email']);
            $phone = (int)$_POST['phone'];
            $reCaptcha = $_POST["g-recaptcha-response"];

            if (!empty($name) && !empty($message) && !empty($email)) {
                $email_validate = filter_var($email, FILTER_VALIDATE_EMAIL);

                if ($this->checkLength($name, 2, 20) && $this->checkLength($message, 2, 1000) && $email_validate) {
                    if(!$this->reCaptcha($reCaptcha)) {

                        $config = include 'config/main.php';

                        $subject = "Письмо с сайта LoftShop";
                        $body = $name . " написал(а): " . $message . ". Телефон для обратной связи: " . $phone . ", e-mail: " . $email;

                        $sendStatus = $this->sendMail(
                            $config['email']['adminname'],
                            $config['email']['adminemail'],
                            $config['email']['adminpassword'],
                            $config['email']['adminemail'],
                            $config['email']['adminname'],
                            $subject, $body
                        );

                        if ($sendStatus) {
                            echo json_encode(array('msg' => 'success'));
                        } else {
                            echo json_encode(array('msg' => 'Просим прошения, но нам не удалось отправить письмо=('));
                        }
                    } else {
                        echo json_encode(array('msg' => 'Проверка не пройдена!'));
                    }
                } else {
                    echo json_encode(array('msg' => 'Введенные данные некорректные!'));
                }
            } else {
                echo json_encode(array('msg' => 'Поля формы отмеченные звездочкой должны быть заполнены!'));
            }
        } else {
            echo json_encode(array('msg' => 'Поля формы отмеченные звездочкой должны быть заполнены!'));
        }
    }
}