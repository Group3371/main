package com;

import com.db.DbWorker;
import com.user.User;
import com.vaadin.data.Validator;
import com.vaadin.data.validator.EmailValidator;
import com.vaadin.data.validator.StringLengthValidator;
import com.vaadin.ui.*;
import com.worklayouts.MoneyLayout;
import org.apache.tools.ant.taskdefs.SendEmail;

import java.sql.SQLException;

/**
 * Created by user on 21.12.2015.
 */
public class SignUpLayout extends VerticalLayout {


    public SignUpLayout(MenuBar menuBar , DbWorker dbWorker, User user, MoneyLayout layout){
        this.addComponent(menuBar);
        TextField tfEmail = new TextField("Your email:");
        tfEmail.addValidator(new EmailValidator("Неверный Email!"));
        tfEmail.addValidator(new StringLengthValidator("Некорректная длинна!",5,64,true));
        TextField tfName = new TextField("Your name: ");
        tfName.addValidator(new StringLengthValidator("Некорректная длинна!",5,30,true));
        PasswordField passwordField = new PasswordField("Enter you password: ");
        passwordField.addValidator(new StringLengthValidator("Некорректная длинна!",5,30,true));
        PasswordField passwordConfimField = new PasswordField("Confim you password: ");
        passwordConfimField.addValidator(new StringLengthValidator("Некорректная длинна!",5,30,true));
        Button signUp = new Button("Sign Up!");

        this.addComponent(tfEmail);
        this.addComponent(tfName);
        this.addComponent(passwordField);
        this.addComponent(passwordConfimField);
        this.addComponent(signUp);

        this.setComponentAlignment(tfEmail, Alignment.BOTTOM_CENTER);
        this.setComponentAlignment(tfName, Alignment.BOTTOM_CENTER);
        this.setComponentAlignment(passwordField, Alignment.BOTTOM_CENTER);
        this.setComponentAlignment(passwordConfimField, Alignment.BOTTOM_CENTER);
        this.setComponentAlignment(signUp, Alignment.BOTTOM_CENTER);

        signUp.addClickListener(new Button.ClickListener() {
            @Override
            public void buttonClick(Button.ClickEvent clickEvent) {
                boolean flag = true;
                //NEED VALIDATION
                try {
                    tfEmail.validate();
                    tfName.validate();
                    passwordConfimField.validate();
                    passwordField.validate();
                } catch (Validator.InvalidValueException e) {
                    flag = false;
                    Notification.show("Проверьте правильность всех введенных полей!");
                }

                if(flag){
                    if(!passwordField.getValue().equals(passwordConfimField.getValue())) {
                        flag = false;
                        Notification.show("Не совпадают пароли!", Notification.Type.ERROR_MESSAGE);
                    }
                }
                //VALIDATION

                if(flag) {
                    user.setEmail(tfEmail.getValue());
                    user.setName(tfName.getValue());
                    user.setPassword(passwordField.getValue());
                    user.clear();
                    tfEmail.clear();
                    tfName.clear();
                    passwordConfimField.clear();
                    passwordField.clear();


                    try {
                        if (!dbWorker.autentificationNewUser(user)) {
                            dbWorker.saveNewUser(user);
                            layout.updateLayouts();
                            getUI().setContent(layout);
//                            Notification.show("Успешная регистрация!", Notification.Type.HUMANIZED_MESSAGE);
                        } else Notification.show("Такой Email уже занят!", Notification.Type.ERROR_MESSAGE);
                    } catch (SQLException e) {
                        e.printStackTrace();
                    }
                }
            }
        });

    }


}
