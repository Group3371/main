<?php

trait sendMail
{

    public function sendMail($adminName, $adminEmail, $adminPassword, $emailTo, $nameTo, $subject, $body){
        $mailer = new PHPMailer();
        $mailer->isSMTP();
        $mailer->Host = "smtp.gmail.com";
        $mailer->SMTPAuth = true;
        $mailer->Username = $adminEmail;
        $mailer->Password = $adminPassword;
        $mailer->SMTPSecure = "ssl";
        $mailer->Port = 465;
        $mailer->CharSet = 'UTF-8';
        // Я так и не понял зачем указывать email в методе SetFrom.
        $mailer->SetFrom('admin@loftshop.ru', $adminName);
        $mailer->Subject = $subject;
        $mailer->MsgHTML($body);
        $mailer->AddAddress($emailTo, $nameTo);
        return $mailer->Send();
    }

    public function sendMailMany($adminName, $adminEmail, $adminPassword, $addresses, $subject, $bodyHtml, $bodyText){

        $mailer = new PHPMailer();

        $mailer->isSMTP();
        $mailer->Host = "smtp.gmail.com";
        $mailer->SMTPAuth = true;
        $mailer->Username = $adminEmail;
        $mailer->Password = $adminPassword;
        $mailer->SMTPSecure = "ssl";
        $mailer->Port = 465;
        $mailer->CharSet = 'UTF-8';

        // Я так и не понял зачем указывать email в методе SetFrom.
        $mailer->SetFrom('admin@loftshop.ru', $adminName);

        $mailer->Subject = $subject;
        $mailer->Body = $bodyHtml;
        $mailer->isHTML(true);
        $mailer->AltBody = $bodyText;

        foreach ($addresses as $address) {
            $mailer->AddBCC($address['email'], $address['name']);
        }

        return $mailer->Send();
    }
}