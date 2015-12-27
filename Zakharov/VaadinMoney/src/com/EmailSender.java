package com;

import com.vaadin.annotations.Title;

import java.util.Properties;


import javax.mail.*;
import javax.mail.internet.InternetAddress;
import javax.mail.internet.MimeMessage;
import javax.mail.internet.MimeUtility;

public class EmailSender {

    private String username;
    private String password;
    private Properties props;

    public EmailSender(String username, String password) {
        this.username = username;
        this.password = password;

        props = new Properties();
        props.put("mail.smtp.auth", "true");
        props.put("mail.smtp.starttls.enable", "true");
        props.put("mail.smtp.host", "smtp.gmail.com");
        props.put("mail.smtp.port", "587");
    }

    public void send(String subject, String text, String fromEmail, String toEmail){
        Session session = Session.getInstance(props, new Authenticator() {
            protected PasswordAuthentication getPasswordAuthentication() {
                return new PasswordAuthentication(username, password);
            }
        });

        try {
//            Message message = new MimeMessage(session);
//            //от кого
//            message.setFrom(new InternetAddress(username));
//            //кому
//            message.setRecipients(Message.RecipientType.TO, InternetAddress.parse(toEmail));
//            //Заголовок письма
//            message.setSubject(subject);
//            //Содержимое
//            message.setText(text);

            Session mailSession = Session.getDefaultInstance(props, null);
            MimeMessage message = new MimeMessage(mailSession);
            message.setFrom(new InternetAddress("from@sample.com"));
            message.setSubject("title");
            message.addRecipient(Message.RecipientType.TO, new InternetAddress("to@sample.com"));
            message.setText("text");

            //Отправляем сообщение
            Transport.send(message);
        } catch (MessagingException e) {
            throw new RuntimeException(e);
        }
    }
}