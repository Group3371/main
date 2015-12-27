package com.dialog;

import com.db.DbWorker;
import com.enumes.DialogStates;
import com.user.User;
import com.vaadin.data.Validator;
import com.vaadin.data.validator.DoubleRangeValidator;
import com.vaadin.data.validator.DoubleValidator;
import com.vaadin.data.validator.NullValidator;
import com.vaadin.ui.*;

/**
 * Created by User on 24.12.2015.
 */
public class DialogLayout extends HorizontalLayout {

    TextField tf;
    Button ok;
    Button cancel;
    DialogStates dialogState;
    User user;

    public DialogLayout(DialogStates state, Button.ClickListener clickCancel, User user, DbWorker dbWorker){
        tf = new TextField(state.getName());
//        tf.addValidator(new DoubleRangeValidator("Введите корректное число!", 0d, 100000d));
        tf.addValidator(new DoubleValidator("Введите корректное число!"));
        ok = new Button("Ok");
        cancel = new Button("Cancel");
        dialogState = state;
        this.user = user;
        ok.addClickListener(new Button.ClickListener() {
            @Override
            public void buttonClick(Button.ClickEvent clickEvent) {

                boolean flag = true;

                try {
                    tf.validate();
                } catch (Validator.InvalidValueException e){
                    Notification.show(e.getMessage());
                    flag = false;
                }

                if(flag) {
                    Double d = new Double(tf.getValue());
                    switch (dialogState) {
                        case INPUT_SALARY:
                            user.setIncomeZP(d);
                            break;
                        case INPUT_PENSION:
                            user.setIncomePnsiya(d);
                            break;
                        case INPUT_ANY_INCOMINGS:
                            user.setIncomePlus(d);
                            break;
                        case INPUT_SHOPS:
                            user.setExpensesShop(d);
                            break;
                        case INPUT_ROAD:
                            user.setExpensesRoad(d);
                            break;
                        case INPUT_ANY_EXPENSES:
                            user.setExpensesPlus(d);
                            break;
                        case INPUT_ACCUM:
                            user.setSumAccumulate(d);
                            break;
                        case INPUT_ACCUM_PER_MONTH:
                            user.setAccumulatePerMonth(d);
                            break;
                    }
                    dbWorker.updateUser(user);
                }
            }
        });
        ok.addClickListener(clickCancel);
        cancel.addClickListener(clickCancel);

        this.addComponent(tf);
        this.addComponent(ok);
        this.addComponent(cancel);

    }


    public void setDialogState(DialogStates state){
        dialogState = state;
        tf.setCaption(state.getName());
        switch (dialogState){
            case INPUT_SALARY: tf.setValue(user.getIncomeZP().toString()); break;
            case INPUT_PENSION: tf.setValue(user.getIncomePnsiya().toString());break;
            case INPUT_ANY_INCOMINGS: tf.setValue(user.getIncomePlus().toString()); break;
            case INPUT_SHOPS: tf.setValue(user.getExpensesShop().toString()); break;
            case INPUT_ROAD: tf.setValue(user.getExpensesRoad().toString()); break;
            case INPUT_ANY_EXPENSES: tf.setValue(user.getExpensesPlus().toString()); break;
            case INPUT_ACCUM: tf.setValue(user.getSumAccumulate().toString()); break;
            case INPUT_ACCUM_PER_MONTH: tf.setValue(user.getAccumulatePerMonth().toString()); break;
        }
    }
}

