package com.worklayouts;

import com.db.DbWorker;
import com.dialog.DialogLayout;
import com.enumes.DialogStates;
import com.user.User;
import com.vaadin.server.FileResource;
import com.vaadin.server.Resource;
import com.vaadin.server.VaadinService;
import com.vaadin.shared.ui.MarginInfo;
import com.vaadin.shared.ui.label.ContentMode;
import com.vaadin.ui.*;

import java.io.File;

/**
 * Created by User on 22.12.2015.
 */
public class Expenses extends HorizontalLayout {

    HorizontalLayout buttons;
    DialogLayout dialog;
    VerticalLayout textLayout;
    Label shopLabel;
    Label roadLabel;
    Label plusLabel;
    User user;

    public Expenses(User user, DbWorker dbWorker){
        this.user = user;
        this.setMargin(new MarginInfo(false,false,false,true));
        textLayout = new VerticalLayout();

        shopLabel = new Label();
        roadLabel = new Label();
        plusLabel = new Label();

        String basepath = VaadinService.getCurrent()
                .getBaseDirectory().getAbsolutePath();
        FileResource resource = new FileResource(new File(basepath +
                "/WEB-INF/images/donegtgg.png"));
        Image image = new Image("", resource);
        image.setWidth("110px");
        image.setHeight("160px");

        Button.ClickListener clickCancel = new Button.ClickListener() {
            @Override
            public void buttonClick(Button.ClickEvent clickEvent) {
                textLayout.removeComponent(dialog);
                textLayout.addComponent(buttons);
                updateLayouts();
            }
        };
        dialog = new DialogLayout(DialogStates.INPUT_ANY_EXPENSES, clickCancel ,user, dbWorker);

        updateLayouts();
        textLayout.addComponent(new Label("<h1>Expenses</h1>", ContentMode.HTML));
        textLayout.addComponent(shopLabel);
        textLayout.addComponent(roadLabel);
        textLayout.addComponent(plusLabel);
        textLayout.setMargin(new MarginInfo(false,true,false,false));
        this.addComponent(textLayout);
        HorizontalLayout imageLayout = new HorizontalLayout();
        imageLayout.addComponent(image);
        imageLayout.setWidth("100%");
        imageLayout.setComponentAlignment(image, Alignment.BOTTOM_CENTER);
        this.addComponent(imageLayout);
        initButtons();
        textLayout.addComponent(buttons);

    }

    public void updateLayouts(){
        String shop = "Затраты на магазины составляют: " + user.getExpensesShop();
        String road = "Затраты на дорогу составляют: " + user.getExpensesRoad();
        String any = "Прочие затраты: "+user.getExpensesPlus();

        shopLabel.setCaption(shop);
        roadLabel.setCaption(road);
        plusLabel.setCaption(any);

    }

    private void initButtons() {
        buttons = new HorizontalLayout();

        Button updateShops = new Button("Изменить расходы на магазины");
        Button updateRoad = new Button("Изменить расходы на дорогу");
        Button updateAny = new Button("Изменить прочие расходы");

        updateShops.addClickListener(new Button.ClickListener() {
            @Override
            public void buttonClick(Button.ClickEvent clickEvent) {
                dialog.setDialogState(DialogStates.INPUT_SHOPS);
                textLayout.removeComponent(buttons);
                textLayout.addComponent(dialog);
            }
        });

        updateRoad.addClickListener(new Button.ClickListener() {
            @Override
            public void buttonClick(Button.ClickEvent clickEvent) {
                dialog.setDialogState(DialogStates.INPUT_ROAD);
                textLayout.removeComponent(buttons);
                textLayout.addComponent(dialog);
            }
        });

        updateAny.addClickListener(new Button.ClickListener() {
            @Override
            public void buttonClick(Button.ClickEvent clickEvent) {
                dialog.setDialogState(DialogStates.INPUT_ANY_EXPENSES);
                textLayout.removeComponent(buttons);
                textLayout.addComponent(dialog);
            }
        });

        buttons.addComponent(updateShops);
        buttons.addComponent(updateRoad);
        buttons.addComponent(updateAny);
    }
}
