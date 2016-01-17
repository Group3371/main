/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package hanarig.spareparts_web2;

import com.vaadin.annotations.Theme;
import com.vaadin.data.validator.NullValidator;
import com.vaadin.ui.Button;
import com.vaadin.ui.DateField;
import com.vaadin.ui.FormLayout;
import com.vaadin.ui.Notification;
import com.vaadin.ui.TextField;
import com.vaadin.ui.UI;
import com.vaadin.ui.Window;
import com.vaadin.ui.themes.ValoTheme;
import java.sql.SQLException;
import java.util.Date;
import java.util.logging.Level;
import java.util.logging.Logger;

/**
 *
 * @author Артём
 */
@Theme("mytheme")
public class AddItemWindow extends Window {
       
    public AddItemWindow(){
        final Window addItem = new Window("Add item");        
        addItem.setWidth("450px");
        addItem.setHeight("500px");
        
//layouts and panels:    
        final FormLayout boxes = new FormLayout();        
        boxes.setMargin(true);
        boxes.setSpacing(true);
        addItem.setContent(boxes);        
                
        final TextField tf1 = new TextField("Артикул");        
        tf1.setRequired(true);
        tf1.addValidator(new NullValidator("Поле должно быть заполнено!", false));
        boxes.addComponent(tf1);

        final TextField tf2 = new TextField("Наименование");        
        tf2.setRequired(true);
        tf2.addValidator(new NullValidator("Поле должно быть заполнено!", false));
        boxes.addComponent(tf2);
        
        final TextField tf3 = new TextField("Комментарий");        
        //tf3.setRequired(true);
        tf3.addValidator(new NullValidator("Поле должно быть заполнено!", false));
        boxes.addComponent(tf3);
        
        final TextField tf4 = new TextField("Доступное количество");        
        tf4.setRequired(true);        
        boxes.addComponent(tf4);
        
        final TextField tf5 = new TextField("Цена");        
        tf5.setRequired(true);        
        boxes.addComponent(tf5);        
       
        final DateField date = new DateField("Дата поставки на склад");
        date.setDateFormat("yyyy-MM-dd");
        date.setValue(new Date());
        date.setRequired(true);
        date.addValidator(new NullValidator("Поле должно быть заполнено!", false));
        boxes.addComponent(date);
        
        final TextField tf7 = new TextField("Адрес картинки");      
        tf7.addValidator(new NullValidator("Поле должно быть заполнено!", false));
        boxes.addComponent(tf7);
        
        Button addButton = new Button("Добавить элемент");
        boxes.addComponent(addButton);
        addButton.addStyleName(ValoTheme.BUTTON_FRIENDLY);
        
        addButton.addClickListener(new Button.ClickListener() {
            @Override
            public void buttonClick(Button.ClickEvent event) {               
                try {
                    if (DataBase.WriteDB(tf1,tf2,tf3,tf4,tf5,date,tf7)) {
                        Notification.show("Успешно!", "Новый элемент добавлен в базу",
                                Notification.Type.HUMANIZED_MESSAGE);
                        Thread.sleep(1500);
                        addItem.close();
                    } else {
                        Notification.show("Провал!", "Новый элемент НЕ добавлен в базу!",
                                Notification.Type.ERROR_MESSAGE);
                        Thread.sleep(1500);
                    }
                } catch (InterruptedException | SQLException ex) {
                    Logger.getLogger(AddItemWindow.class.getName()).log(Level.SEVERE, null, ex);
                }                
            }
        });
        
        // Center it in the browser window
        addItem.center();
        
        // Open it in the UI
        UI.getCurrent().addWindow(addItem);
        
    }
}
   