/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package hanarig.spareparts_web2;

import com.vaadin.annotations.Theme;
import com.vaadin.data.Container;
import com.vaadin.data.validator.NullValidator;
import com.vaadin.server.ClassResource;
import com.vaadin.ui.Alignment;
import com.vaadin.ui.Button;
import com.vaadin.ui.DateField;
import com.vaadin.ui.FormLayout;
import com.vaadin.ui.HorizontalLayout;
import com.vaadin.ui.Image;
import com.vaadin.ui.Notification;
import com.vaadin.ui.Panel;
import com.vaadin.ui.TextField;
import com.vaadin.ui.UI;
import com.vaadin.ui.VerticalLayout;
import com.vaadin.ui.Window;
import com.vaadin.ui.themes.ValoTheme;
import java.sql.SQLException;
import java.util.ArrayList;
import java.util.Date;
import java.util.logging.Level;
import java.util.logging.Logger;

/**
 *
 * @author Артём
 */
@Theme("mytheme")
public class InfoWindow {
    
    private TextField tf1 = new TextField("Артикул");
    private TextField tf2 = new TextField("Наименование");
    private TextField tf3 = new TextField("Комментарий");
    private TextField tf4 = new TextField("Доступное количество");
    private TextField tf5 = new TextField("Цена");
    private DateField date = new DateField("Дата поставки на склад");
    private TextField tf7 = new TextField("Адрес картинки");
    public static ArrayList<Busket_elem> busketArray = new ArrayList(); 
    Button busketButton = new Button("Добавить элемент в корзину");
    static Button saveButton = new Button("Сохранить внесенные изменения");
    static Button deleteButton = new Button("Удалить элемент из базы");     
        
    public InfoWindow(Object ItemId,final Container container) throws SQLException, ClassNotFoundException{
        final Object itemId = ItemId;
        final Window InfoWindow = new Window("Item page");        
        InfoWindow.setWidth("790px");
        InfoWindow.setHeight("540px");
        
//layouts and panels:    
        HorizontalLayout main = new HorizontalLayout();
        InfoWindow.setContent(main);
        
        Panel leftPanel = new Panel();        
        leftPanel.setHeight("500px");
        
        Panel rightPanel = new Panel();        
        rightPanel.setHeight("500px");  
                
        final FormLayout leftFormLayout = new FormLayout();        
        leftFormLayout.setMargin(true);
        leftFormLayout.setSpacing(true);
        leftPanel.setContent(leftFormLayout);
        
        VerticalLayout rightVerticalLayout = new VerticalLayout();
        rightVerticalLayout.setMargin(true);
        rightVerticalLayout.setSpacing(true);
        rightPanel.setContent(rightVerticalLayout);
        
        main.addComponent(leftPanel);
        main.addComponent(rightPanel);
        
        tf1.setRequired(true);
        tf1.addValidator(new NullValidator("Поле должно быть заполнено!", false));
        leftFormLayout.addComponent(tf1);
        
        tf2.setRequired(true);
        tf2.addValidator(new NullValidator("Поле должно быть заполнено!", false));
        leftFormLayout.addComponent(tf2);
                
        tf3.addValidator(new NullValidator("Поле должно быть заполнено!", false));
        leftFormLayout.addComponent(tf3);
                
        tf4.setRequired(true);        
        leftFormLayout.addComponent(tf4);
                
        tf5.setRequired(true);        
        leftFormLayout.addComponent(tf5);
                
        date.setDateFormat("yyyy-MM-dd");
        date.setValue(new Date());
        date.setRequired(true);
        date.addValidator(new NullValidator("Поле должно быть заполнено!", false));
        leftFormLayout.addComponent(date);
                
        tf7.addValidator(new NullValidator("Поле должно быть заполнено!", false));
        leftFormLayout.addComponent(tf7);
        
    //right panel
        Image itemPic = new Image("", new ClassResource("/images/engine-transmission2.png"));
        rightVerticalLayout.addComponent(itemPic);
        rightVerticalLayout.setComponentAlignment(itemPic, Alignment.MIDDLE_CENTER);
        
        rightVerticalLayout.addComponent(busketButton);
        rightVerticalLayout.setComponentAlignment(busketButton, Alignment.MIDDLE_CENTER);
                
        rightVerticalLayout.addComponent(saveButton);
        rightVerticalLayout.setComponentAlignment(saveButton, Alignment.MIDDLE_CENTER);
        
        rightVerticalLayout.addComponent(deleteButton);
        rightVerticalLayout.setComponentAlignment(deleteButton, Alignment.MIDDLE_CENTER);
        
        deleteButton.addStyleName(ValoTheme.BUTTON_DANGER);        
        busketButton.addStyleName(ValoTheme.BUTTON_PRIMARY);
        saveButton.addStyleName(ValoTheme.BUTTON_FRIENDLY);
        saveButton.setEnabled(false);
        deleteButton.setEnabled(false);
           
        if ("Yes".equals((String)MyUI.userSession.getAttribute("Admin"))) {
            saveButton.setEnabled(true);
            deleteButton.setEnabled(true);
        }
        
        getInfo(itemId,container);              
                
        busketButton.addClickListener(new Button.ClickListener() {
            @Override
            public void buttonClick(Button.ClickEvent event) {
                Busket_elem newItem = new Busket_elem();
                newItem.id = itemId;
                newItem.storage++;
                busketArray.add(newItem);                
                Notification.show("Успешно!", "Объект добавлен в корзину ("+busketArray.size()+")",
                                Notification.Type.HUMANIZED_MESSAGE);                
                InfoWindow.close();                             
            }
        });
        
        saveButton.addClickListener(new Button.ClickListener() {
            @Override
            public void buttonClick(Button.ClickEvent event) {
                try {
                    if (DataBase.EditDB(itemId,container,tf1,tf2,tf3,tf4,tf5,date,tf7)) {
                        Notification.show("Успешно!", "Изменения добавлены в базу",
                                Notification.Type.HUMANIZED_MESSAGE);
                        Thread.sleep(1500);
                        InfoWindow.close();                        
                    } else {
                        Notification.show("Провал!", "Изменения НЕ добавлены в базу!",
                                Notification.Type.ERROR_MESSAGE);                        
                    }        
                } catch (SQLException | InterruptedException ex) {
                    Logger.getLogger(InfoWindow.class.getName()).log(Level.SEVERE, null, ex);
                }
                
            }
        });
        
        deleteButton.addClickListener(new Button.ClickListener() {
            @Override
            public void buttonClick(Button.ClickEvent event) {
                try {                       
                    if (DataBase.DeleteRowDB(itemId,container)) {
                        Notification.show("Успешно!", "Объект удален из базы",
                                Notification.Type.HUMANIZED_MESSAGE);
                        Thread.sleep(1500);
                        InfoWindow.close();                        
                    } else {
                        Notification.show("Провал!", "Объект не удален!",
                                Notification.Type.ERROR_MESSAGE);
                        Thread.sleep(1500);
                    }        
                } catch (SQLException | InterruptedException ex) {
                    Logger.getLogger(InfoWindow.class.getName()).log(Level.SEVERE, null, ex);
                }                
            }
        });
        
        // Center it in the browser window
        InfoWindow.center();
        
        // Open it in the UI
        UI.getCurrent().addWindow(InfoWindow);
    }
    
    final void getInfo(Object itemId,Container container){
        tf1.setValue(container.getItem(itemId).getItemProperty("article").getValue().toString());
        tf2.setValue(container.getItem(itemId).getItemProperty("name").getValue().toString());
        tf3.setValue(container.getItem(itemId).getItemProperty("comment").getValue().toString());
        tf4.setValue(container.getItem(itemId).getItemProperty("storage").getValue().toString());
        tf5.setValue(container.getItem(itemId).getItemProperty("price").getValue().toString());
        date.setData(container.getItem(itemId).getItemProperty("warehouse_date"));
    }
    
}
