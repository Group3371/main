package com.worklayouts;

import com.user.User;
import com.vaadin.server.FileResource;
import com.vaadin.server.VaadinService;
import com.vaadin.shared.ui.MarginInfo;
import com.vaadin.shared.ui.label.ContentMode;
import com.vaadin.ui.Image;
import com.vaadin.ui.Label;
import com.vaadin.ui.VerticalLayout;

import java.io.File;

/**
 * Created by User on 22.12.2015.
 */
public class Information extends VerticalLayout {

    User user;

    Label hello;
    Label incomingInfo;
    Label allMoney;
    String basepath = VaadinService.getCurrent()
            .getBaseDirectory().getAbsolutePath();
    FileResource resourceGreen = new FileResource(new File(basepath + "/WEB-INF/images/green.png"));
    FileResource resourceYellow = new FileResource(new File(basepath + "/WEB-INF/images/yellow.png"));
    FileResource resourceOrange = new FileResource(new File(basepath + "/WEB-INF/images/orange.png"));
    FileResource resourceRed = new FileResource(new File(basepath + "/WEB-INF/images/red.png"));
    Image imageGreen ;
    Image imageYellow ;
    Image imageOrange ;
    Image imageRed ;
    Image activeImage;

    public Information(User user){
        this.user = user;
        this.hello = new Label();
        hello.setContentMode(ContentMode.HTML);
        this.incomingInfo = new Label();
        this.allMoney = new Label();

        imageGreen = new Image("Индикатор состояния: ", resourceGreen);
        imageGreen.setWidth("160px");
        imageGreen.setHeight("160px");

        imageOrange = new Image("Индикатор состояния: ", resourceOrange);
        imageOrange.setWidth("160px");
        imageOrange.setHeight("160px");

        imageYellow = new Image("Индикатор состояния: ", resourceYellow);
        imageYellow.setWidth("160px");
        imageYellow.setHeight("160px");

        imageRed = new Image("Индикатор состояния: ", resourceRed);
        imageRed.setWidth("160px");
        imageRed.setHeight("160px");
//        updateLayouts();
//        this.setMargin(new MarginInfo(true,false,false,false));
        activeImage = imageOrange;
        this.setMargin(new MarginInfo(false,false,false,true));
        this.addComponent(hello);
        this.addComponent(allMoney);
        this.addComponent(incomingInfo);
        this.addComponent(activeImage);
        updateLayouts();
    }

    public void updateLayouts(){
        Double incoming = user.getIncomePlus() + user.getIncomeZP() + user.getIncomePnsiya()
                - user.getExpensesShop() - user.getExpensesRoad() - user.getExpensesPlus();

        String name = "<h1>Welcome, " + user.getName() + "</h1>";
        String message = "На данный момент, состояние вашего счета: " + user.getMoney();
        String incomingMessage = "Средняя прибыль: " + (incoming);

        if(incoming < 0d){
            this.removeComponent(activeImage);
            activeImage = imageRed;
            this.addComponent(activeImage);
        }
        else if (incoming < 1000d){
            this.removeComponent(activeImage);
            activeImage = imageOrange;
            this.addComponent(activeImage);
        }
        else if (incoming < 10000d){
            this.removeComponent(activeImage);
            activeImage = imageYellow;
            this.addComponent(activeImage);
        }
        else {
            this.removeComponent(activeImage);
            activeImage = imageGreen;
            this.addComponent(activeImage);
        }


//        hello.setCaption(name);
        hello.setValue(name);
        incomingInfo.setCaption(incomingMessage);
        allMoney.setCaption(message);
    }
}
