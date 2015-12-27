package com.worklayouts;

import com.db.DbWorker;
import com.dialog.DialogLayout;
import com.enumes.DialogStates;
import com.user.User;
import com.vaadin.server.FileResource;
import com.vaadin.server.FontAwesome;
import com.vaadin.server.VaadinService;
import com.vaadin.shared.ui.MarginInfo;
import com.vaadin.shared.ui.label.ContentMode;
import com.vaadin.ui.*;

import java.io.File;

/**
 * Created by User on 22.12.2015.
 */
public class Incomings extends HorizontalLayout {

    DialogLayout dialog;
    VerticalLayout textLayout;
    Label zpLabel;
    Label pensLabel;
    Label anyLabel;
    User user;
    HorizontalLayout buttons;


    public Incomings(User user, DbWorker dbWorker){

        this.user = user;
        this.setMargin(new MarginInfo(false,false,false,true));
        textLayout = new VerticalLayout();
        zpLabel = new Label();
        pensLabel = new Label();
        anyLabel = new Label();

        String basepath = VaadinService.getCurrent()
                .getBaseDirectory().getAbsolutePath();
        FileResource resource = new FileResource(new File(basepath +
                "/WEB-INF/images/donUp.png"));
        Image image = new Image("", resource);
        image.setWidth("110px");
        image.setHeight("160px");

        HorizontalLayout imageLayout = new HorizontalLayout();
        imageLayout.addComponent(image);
        imageLayout.setWidth("100%");

        Button.ClickListener clickCancel = new Button.ClickListener() {
            @Override
            public void buttonClick(Button.ClickEvent clickEvent) {
                textLayout.removeComponent(dialog);
                textLayout.addComponent(buttons);
                updateLayouts();
            }
        };


        dialog = new DialogLayout(DialogStates.INPUT_SALARY, clickCancel, user, dbWorker);

        updateLayouts();
        textLayout.addComponent(new Label("<h1>Incomings</h1>", ContentMode.HTML));
        textLayout.addComponent(zpLabel);
        textLayout.addComponent(pensLabel);
        textLayout.addComponent(anyLabel);
        textLayout.setMargin(new MarginInfo(false,true,false,false));
        initButtons();
        textLayout.addComponent(buttons);
        this.addComponent(textLayout);
        this.addComponent(imageLayout);
    }

    public void updateLayouts(){
        String zp = "Прибыль от заработной платы составляет: " + user.getIncomeZP();
        String pens = "Прибыль от различных пенсионных начислений составляет: " + user.getIncomePnsiya();
        String any = "Прибыль от других источников составляет: "+user.getIncomePlus();

        zpLabel.setCaption(zp);
        pensLabel.setCaption(pens);
        anyLabel.setCaption(any);

    }

    private void initButtons(){
        buttons = new HorizontalLayout();

        Button updateZP = new Button("Изменить заработную плату");
        Button updatePens = new Button("Изменить пенсионные начисления");
        Button updateAny = new Button("Изменить прочие доходы");

        updateZP.addClickListener(new Button.ClickListener() {
            @Override
            public void buttonClick(Button.ClickEvent clickEvent) {
                dialog.setDialogState(DialogStates.INPUT_SALARY);
                textLayout.removeComponent(buttons);
                textLayout.addComponent(dialog);
            }
        });

        updatePens.addClickListener(new Button.ClickListener() {
            @Override
            public void buttonClick(Button.ClickEvent clickEvent) {
                dialog.setDialogState(DialogStates.INPUT_PENSION);
                textLayout.removeComponent(buttons);
                textLayout.addComponent(dialog);
            }
        });

        updateAny.addClickListener(new Button.ClickListener() {
            @Override
            public void buttonClick(Button.ClickEvent clickEvent) {
                dialog.setDialogState(DialogStates.INPUT_ANY_INCOMINGS);
                textLayout.removeComponent(buttons);
                textLayout.addComponent(dialog);
            }
        });

        buttons.addComponent(updateZP);
        buttons.addComponent(updatePens);
        buttons.addComponent(updateAny);
    }
}
