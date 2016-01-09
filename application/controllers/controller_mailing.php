<?php

class Controller_Mailing extends Controller {

    use sendMail;

    public function action_index() {
        return $this->view->render('admin/mailing/mailing_view.twig', array(
            'title' => 'Рассылка писем'
        ));
    }

    public function sendMails($data) {

        $config = include_once 'config/main.php';
        $result = array(
            'status' => 'success',
            'message' => 'Сообщения успешно разосланы!'
        );

        // Получаем всех пользователей
        $model = new Model_Users();

        $users = $model->getUsersMailing(intval($data['id_group']));

        if (!$users) {
            $result['status'] = 'error';
            $result['message'] = 'Пользователи не найдены!';
            return $result;
        }

        //Формируем адресатов
        $addresses = [];

        for ($i = 0; $i < count($users); $i++) {
            if ($users[$i]->name) {
                $addresses[$i]['name'] = $users[$i]->name;
            } else {
                $addresses[$i]['name'] = 'пользователь сайта LoftShop';
            }
            $addresses[$i]['email'] = $users[$i]->email;
        }

        $username = 'пользователь сайта LoftShop';

        $letter = [
            'preview' => $data['subject'],
            'title' => $data['title'],
            'username' => $username,
            'body' => $data['body']
        ];

        $bodyHtml = $this->view->render('admin/mailing/letter_template.twig', array(
            'letter' => $letter
        ));
        $bodyText = 'Здравствуйте, '. $username .'! '. $data['body'] . ' С уважением, администрация сайта LoftShop!';

        $sendStatus = $this->sendMailMany(
            $config['email']['adminname'],
            $config['email']['adminemail'],
            $config['email']['adminpassword'],
            $addresses,
            $data['subject'], $bodyHtml, $bodyText
        );

        if (!$sendStatus) {
            $result['status'] = 'error';
            $result['message'] = 'Не удалось отправить сообщения=(';
            return $result;
        }

        return $result;
    }
}