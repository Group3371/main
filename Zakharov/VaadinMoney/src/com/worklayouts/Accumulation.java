package com.worklayouts;

import com.db.DbWorker;
import com.dialog.DialogLayout;
import com.enumes.DialogStates;
import com.user.User;
import com.vaadin.server.FileResource;
import com.vaadin.server.VaadinService;
import com.vaadin.shared.ui.MarginInfo;
import com.vaadin.shared.ui.label.ContentMode;
import com.vaadin.ui.*;

import java.io.File;

/**
 * Created by User on 22.12.2015.
 */
public class Accumulation extends HorizontalLayout {

    HorizontalLayout buttons;
    DialogLayout dialog;
    VerticalLayout textLayout;

    Label sumAccumLabel;
    Label perMonthLabel;
    User user;

    public Accumulation(User user, DbWorker dbWorker){
        this.user = user;
        this.setMargin(new MarginInfo(false,false,false,true));
        textLayout = new VerticalLayout();

        Button.ClickListener clickCancel = new Button.ClickListener() {
            @Override
            public void buttonClick(Button.ClickEvent clickEvent) {
                textLayout.removeComponent(dialog);
                textLayout.addComponent(buttons);
                updateLayouts();
            }
        };
        dialog = new DialogLayout(DialogStates.INPUT_ANY_EXPENSES, clickCancel ,user, dbWorker);

        sumAccumLabel = new Label();
        perMonthLabel = new Label();

        updateLayouts();

        textLayout.addComponent(new Label("<h1>Accumulation</h1>", ContentMode.HTML));
        textLayout.addComponent(sumAccumLabel);
        textLayout.addComponent(perMonthLabel);

        this.addComponent(textLayout);
        String basepath = VaadinService.getCurrent()
                .getBaseDirectory().getAbsolutePath();
        FileResource resource = new FileResource(new File(basepath +
                "/WEB-INF/images/coin.png"));
        Image image = new Image("", resource);
        image.setWidth("160px");
        image.setHeight("160px");
        this.addComponent(image);
        initButtons();
        textLayout.addComponent(buttons);

    }

    public void updateLayouts(){
        String sum = "На данный момент накопленных средств: " + user.getSumAccumulate();
        String perMonth = "Каждый месяц Вы откладываете по: " + user.getAccumulatePerMonth();

        sumAccumLabel.setCaption(sum);
        perMonthLabel.setCaption(perMonth);

    }

    private void initButtons(){
        buttons = new HorizontalLayout();

        Button updateSum = new Button("Изменить накопления");
        Button updatePerMontch = new Button("Изменить накопления в месяц");
        Button clearAccum = new Button("Снять наколпления");

        updateSum.addClickListener(new Button.ClickListener() {
            @Override
            public void buttonClick(Button.ClickEvent clickEvent) {
                dialog.setDialogState(DialogStates.INPUT_ACCUM);
                textLayout.removeComponent(buttons);
                textLayout.addComponent(dialog);
            }
        });

        updatePerMontch.addClickListener(new Button.ClickListener() {
            @Override
            public void buttonClick(Button.ClickEvent clickEvent) {
                dialog.setDialogState(DialogStates.INPUT_ACCUM_PER_MONTH);
                textLayout.removeComponent(buttons);
                textLayout.addComponent(dialog);
            }
        });

        clearAccum.addClickListener(new Button.ClickListener() {
            @Override
            public void buttonClick(Button.ClickEvent clickEvent) {
                user.clearAccumulate();
                updateLayouts();
            }
        });


        buttons.addComponent(updateSum);
        buttons.addComponent(updatePerMontch);
        buttons.addComponent(clearAccum);

    }
}
