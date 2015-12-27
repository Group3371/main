<?php

$mail_to = 'leraivanovskaya@yandex.ru'; 
$type = 'plain'; 
$charset = 'windows-1251';

include('smtp-func.php');
if ($_REQUEST['message'])
{
   $message = $_REQUEST['message'];
   $subject = $_REQUEST['subject'];
   $mail_from = $_REQUEST['mail_from'];
   $replyto = $_REQUEST['replyto'];
   $headers = "To: \"Administrator\" <$mail_to>\r\n".
              "From: \"$replyto\" <$mail_from>\r\n".
              "Reply-To: $replyto\r\n".
              "Content-Type: text/$type; charset=\"$charset\"\r\n";
   $sended = smtpmail($mail_to, $subject, $message, $headers);
   echo '<html>
        <head>
        <meta http-equiv="content-type" content="text/html; charset='.$charset.'">
        </head>
              <body>';
   if (!$sended) echo 'Письмо не удалось отправить. Пожалуйста свяжитесь с администратором сайта по адресу: '.$mail_to;
   else echo 'Письмо было успешно отправлено. В ближайшее Вы получите ответ на него.';
   echo '</body>';
   exit;
}
Header('Location: mailer.html');
?>