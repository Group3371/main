package com;

import com.db.DbWorker;
import com.user.User;
import com.vaadin.server.FileResource;
import com.vaadin.server.VaadinService;
import com.vaadin.ui.*;
import com.worklayouts.MoneyLayout;

import java.io.File;


/**
 * Created by user on 21.12.2015.
 */
public class StartLayout extends VerticalLayout {

    VerticalLayout logInLayout = new VerticalLayout();
    String basepath = VaadinService.getCurrent().getBaseDirectory().getAbsolutePath();
    FileResource resource = new FileResource(new File(basepath + "/WEB-INF/images/moneyBackgorund.jpg"));
    UI ui;
    ContactLayout contactLayout;
    SignUpLayout signUpLayout;
    MoneyLayout moneyLayout;
    StartLayout startLayout = this;
    User user;
    DbWorker dbWorker;

    public StartLayout(UI ui){

        this.addComponent(getMenuBar());
        logInTab();
        this.ui = ui;
        user = new User();
        dbWorker = new DbWorker();
        contactLayout =  new ContactLayout(getMenuBar());
        moneyLayout = new MoneyLayout(ui, startLayout,dbWorker ,user);
        signUpLayout = new SignUpLayout(getMenuBar(), dbWorker, user, moneyLayout);
//        Image image = new Image("Image from file", resource);
//        this.setStyleName("background");

    }


    public MenuBar getMenuBar() {
        MenuBar menuBar = new MenuBar();
        menuBar.setWidth("100%");
        addMenuItems(menuBar);
        return menuBar;
    }

    private  void  addMenuItems(MenuBar menuBar){
        MenuBar.MenuItem registration = menuBar.addItem("Sign up",null, null);
        MenuBar.MenuItem logIn = menuBar.addItem("Log in",null, null);
        MenuBar.MenuItem contacts = menuBar.addItem("Contact us",null,null);


        contacts.setCommand(new MenuBar.Command() {
            @Override
            public void menuSelected(MenuBar.MenuItem menuItem) {
                ui.setContent(contactLayout);
            }
        });

        logIn.setCommand(new MenuBar.Command() {
            @Override
            public void menuSelected(MenuBar.MenuItem menuItem) {
                ui.setContent(startLayout);
            }
        });


        registration.setCommand(new MenuBar.Command() {
            @Override
            public void menuSelected(MenuBar.MenuItem menuItem) {
                ui.setContent(signUpLayout);
            }
        });
    }

    private void  logInTab(){
        TextField tfLogin = new TextField("Email");
        PasswordField tfPassword = new PasswordField("Password");
        Button loginButton = new Button("Log In!");
        loginButton.addClickListener(new Button.ClickListener() {
            @Override
            public void buttonClick(Button.ClickEvent clickEvent) {

                user.setEmail(tfLogin.getValue());
                user.setPassword(tfPassword.getValue());
                tfLogin.clear();
                tfPassword.clear();
                if(dbWorker.autentification(user)) {
                    user = dbWorker.autorization(user);
                    moneyLayout.updateLayouts();
                    ui.setContent(moneyLayout);
                }else {
                    Notification.show("Неверный Email или пароль!", Notification.Type.ERROR_MESSAGE);
                }
            }
        });
        logInLayout.addComponent(tfLogin);
        logInLayout.addComponent(tfPassword);
        logInLayout.addComponent(loginButton);
        logInLayout.setComponentAlignment(tfLogin, Alignment.BOTTOM_CENTER);
        logInLayout.setComponentAlignment(tfPassword, Alignment.BOTTOM_CENTER);
        logInLayout.setComponentAlignment(loginButton, Alignment.BOTTOM_CENTER);
        this.addComponent(logInLayout);
        this.setComponentAlignment(logInLayout,Alignment.BOTTOM_CENTER);

    }

}
