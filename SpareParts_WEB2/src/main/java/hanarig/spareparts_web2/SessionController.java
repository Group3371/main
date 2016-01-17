/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package hanarig.spareparts_web2;

import com.vaadin.ui.Button;
import com.vaadin.ui.Label;
import com.vaadin.ui.Notification;
import com.vaadin.ui.PasswordField;
import com.vaadin.ui.TextField;

/**
 *
 * @author Артём
 */
public class SessionController {   

    public SessionController() {                             
    }
                      
    void sessionAuth(TextField login, PasswordField password){
        
        for (int i = 0; i < MyUI.authContainer.size(); i++) {
            Object current = MyUI.authContainer.getIdByIndex(i);
            if (login.getValue().equals(MyUI.authContainer.getItem(current).getItemProperty("login").getValue().toString())) {
                if (password.getValue().equals(MyUI.authContainer.getItem(current).getItemProperty("password").getValue().toString())) {
                    if ("admin".equals(MyUI.authContainer.getItem(current).getItemProperty("role").getValue().toString())) {
                        SetAdminActive();
                        SetAnyUserIsActive();
                        Notification.show("Успешно!", "Привет, Админ!",
                                Notification.Type.HUMANIZED_MESSAGE);
                        break;
                    } else {         
                        SetAdminUnActive();
                        SetAnyUserIsActive();
                        Notification.show("Успешно!", "Привет, Пользователь!",
                                Notification.Type.HUMANIZED_MESSAGE);
                        break;
                    }
                }
            }
            current = MyUI.authContainer.nextItemId(current);
            if(current!= MyUI.authContainer.lastItemId()){
                Notification.show("Провал!", "Неправильный логин или пароль",
                        Notification.Type.ERROR_MESSAGE);
                break;                
            }
        }        
    }
    
    private void SetAdminActive(){
        MyUI.userSession.setAttribute("Admin", "Yes"); // identified admin        
        InfoWindow.saveButton.setEnabled(true); 
        InfoWindow.deleteButton.setEnabled(true); 
        MyUI.addButton.setEnabled(true); 
    }
    
    private void SetAdminUnActive(){
        MyUI.userSession.setAttribute("Admin", "No"); // identified user (простой смертный =))
        InfoWindow.saveButton.setEnabled(false); 
        InfoWindow.deleteButton.setEnabled(false); 
        MyUI.addButton.setEnabled(false); 
    }
    
    private void SetAnyUserIsActive(){
        MyUI.authLayoutUser.removeAllComponents();    
        if ("Yes".equals((String)MyUI.userSession.getAttribute("Admin"))) 
            MyUI.authLayoutUser.addComponent(new Label("Добро пожаловать, Администратор! Доступны все функции"));
        else MyUI.authLayoutUser.addComponent(new Label("Добро пожаловать, Пользователь! Некоторые функции недоступны"));
        Button exitButton = new Button("Выход");
        MyUI.authLayoutUser.addComponent(exitButton);
        MyUI.authPanel.setContent(MyUI.authLayoutUser);
        exitButton.addClickListener(new Button.ClickListener() {
            @Override
            public void buttonClick(Button.ClickEvent event) {
                UserIsUnActive();
                SetAdminUnActive();
            }
        });
    }
    
    private void UserIsUnActive(){
        MyUI.authPanel.setContent(MyUI.authLayout);
    }
}
