package com.worklayouts;

import com.ContactLayout;
import com.db.DbWorker;
import com.user.User;
import com.vaadin.server.FontAwesome;
import com.vaadin.ui.*;
import models.UsersEntity;
import org.hibernate.ejb.HibernatePersistence;

import javax.persistence.EntityManager;
import javax.persistence.EntityManagerFactory;
import javax.persistence.spi.PersistenceProvider;
import java.util.HashMap;
import java.util.List;

/**
 * Created by user on 22.12.2015.
 */
public class MoneyLayout extends VerticalLayout {

    UI ui;
    Layout prevLayout;
    ContactLayout contactLayout;
    Information infoLayout;
    Incomings incomingsLayout;
    Expenses expensesLayout;
    Accumulation accumulationLayout;
    MoneyLayout startMoneyLayout = this;
    Layout activeLayout;
    HorizontalLayout mainLayout;
    User user;
    DbWorker dbWorker;

    public MoneyLayout(UI ui, Layout prevLayout, DbWorker dbWorker, User user){
        this.ui = ui;
        this.prevLayout = prevLayout;
        contactLayout = new ContactLayout(getMenuBar());
        this.addComponent(getMenuBar());
        this.user = user;
        this.dbWorker = dbWorker;
        incomingsLayout = new Incomings(user, dbWorker);
        infoLayout = new Information(user);
        expensesLayout = new Expenses(user, dbWorker);
        accumulationLayout = new Accumulation(user, dbWorker);

        mainLayout = new HorizontalLayout();
        mainLayout.addComponent(getLeftMenu());
        mainLayout.addComponent(infoLayout);

        activeLayout = infoLayout;

        this.addComponent(mainLayout);
    }


    public MenuBar getMenuBar() {
        MenuBar menuBar = new MenuBar();
        menuBar.setWidth("100%");
        addMenuItems(menuBar);
        return menuBar;
    }

    private  void  addMenuItems(MenuBar menuBar){

        MenuBar.MenuItem workspace = menuBar.addItem("Workspace",null,null);
        MenuBar.MenuItem contacts = menuBar.addItem("Contact us",null,null);
        MenuBar.MenuItem exit = menuBar.addItem("Exit",null, null);


        contacts.setCommand(new MenuBar.Command() {
            @Override
            public void menuSelected(MenuBar.MenuItem menuItem) {
                ui.setContent(contactLayout);
            }
        });

        workspace.setCommand(new MenuBar.Command() {
            @Override
            public void menuSelected(MenuBar.MenuItem menuItem) {
                ui.setContent(startMoneyLayout);
            }
        });


        exit.setCommand(new MenuBar.Command() {
            @Override
            public void menuSelected(MenuBar.MenuItem menuItem) {
                ui.setContent(prevLayout);
            }
        });
    }


    public GridLayout getLeftMenu(){
        GridLayout layout = new GridLayout(1,4);

        Button info = new Button("Information");
        Button incom = new Button("Incomings");
        Button expen = new Button("Expenses");
        Button accum = new Button("Accumulation");

        info.setIcon(FontAwesome.INFO_CIRCLE);
        incom.setIcon(FontAwesome.ARROW_CIRCLE_UP);
        expen.setIcon(FontAwesome.ARROW_CIRCLE_DOWN);
        accum.setIcon(FontAwesome.PLUS_CIRCLE);

        info.setStyleName("fontbuttuns");

        layout.addComponent(info);
        layout.addComponent(incom);
        layout.addComponent(expen);
        layout.addComponent(accum);

        info.setWidth("120px");
        incom.setWidth("120px");
        expen.setWidth("120px");
        accum.setWidth("120px");

        info.addClickListener(new Button.ClickListener() {
            @Override
            public void buttonClick(Button.ClickEvent clickEvent) {
                mainLayout.removeComponent(activeLayout);
                mainLayout.addComponent(infoLayout);
                activeLayout = infoLayout;
                infoLayout.updateLayouts();
            }
        });

        incom.addClickListener(new Button.ClickListener() {
            @Override
            public void buttonClick(Button.ClickEvent clickEvent) {
                mainLayout.removeComponent(activeLayout);
                mainLayout.addComponent(incomingsLayout);
                activeLayout = incomingsLayout;
                incomingsLayout.updateLayouts();
            }
        });

        expen.addClickListener(new Button.ClickListener() {
            @Override
            public void buttonClick(Button.ClickEvent clickEvent) {
                mainLayout.removeComponent(activeLayout);
                mainLayout.addComponent(expensesLayout);
                activeLayout = expensesLayout;
                expensesLayout.updateLayouts();
            }
        });

        accum.addClickListener(new Button.ClickListener() {
            @Override
            public void buttonClick(Button.ClickEvent clickEvent) {
                mainLayout.removeComponent(activeLayout);
                mainLayout.addComponent(accumulationLayout);
                activeLayout = accumulationLayout;
                accumulationLayout.updateLayouts();
            }
        });

        return layout;
    }

    public void  updateLayouts(){
        infoLayout.updateLayouts();
        accumulationLayout.updateLayouts();
        incomingsLayout.updateLayouts();
        expensesLayout.updateLayouts();
    }
}
