/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package hanarig.spareparts_web2;

import com.vaadin.data.util.sqlcontainer.SQLContainer;
import com.vaadin.data.util.sqlcontainer.connection.SimpleJDBCConnectionPool;
import com.vaadin.data.util.sqlcontainer.query.TableQuery;
import com.vaadin.event.ItemClickEvent;
import com.vaadin.event.ItemClickEvent.ItemClickListener;
import com.vaadin.ui.Button;
import com.vaadin.ui.Notification;
import static hanarig.spareparts_web2.DataBase.searchContainer;
import static hanarig.spareparts_web2.InfoWindow.busketArray;
import static hanarig.spareparts_web2.MyUI.loginTextField;
import static hanarig.spareparts_web2.MyUI.passwordTextField;
import static hanarig.spareparts_web2.MyUI.table;
import static hanarig.spareparts_web2.BusketWindow.busketTable;
import java.sql.Date;
import java.sql.SQLException;
import java.util.logging.Level;
import java.util.logging.Logger;

/**
 *
 * @author Артём
 */
public class UIActionListeners {
    boolean flag = false;    

    public UIActionListeners() {
        
        MyUI.searchButton.addClickListener(new Button.ClickListener() {
            @Override
            public void buttonClick(Button.ClickEvent event) {
                try {
                    if ("".equals(MyUI.search.getValue())) {
                        Notification.show("Введите искомый текст!", "", Notification.Type.WARNING_MESSAGE);
                    } else {
                        if (searchContainer!=null){
                            searchContainer.removeAllItems();
                        }
                        MyUI.table.setContainerDataSource(DataBase.searchContainer);
                        DataBase.SearchDB(MyUI.search);                        
                        final String[] columnHeaders = new String[]{"id", "Артикул", "Наименование", "Комментарий", "Доступное количество", "Цена", "Дата поставки на склад"};
                        table.setColumnHeaders(columnHeaders);
                        table.setVisibleColumns(new Object[]{"article", "name", "comment", "storage", "price", "warehouse_date"});
                        MyUI.table.refreshRowCache();
                    }
                } catch (ClassNotFoundException | SQLException ex) {
                    Logger.getLogger(UIActionListeners.class.getName()).log(Level.SEVERE, null, ex);
                }
            }

        });
        
        MyUI.dbase.addClickListener(new Button.ClickListener() {
            @Override
            public void buttonClick(Button.ClickEvent event) {
                try {
                    DataBase.ReadDB();
                    MyUI.table.setContainerDataSource(DataBase.sparepartsContainer);
                    final String[] columnHeaders = new String[]{"id", "Артикул", "Наименование", "Комментарий", "Доступное количество", "Цена", "Дата поставки на склад"};
                    table.setColumnHeaders(columnHeaders);
                    table.setVisibleColumns(new Object[]{"article", "name", "comment", "storage", "price", "warehouse_date"});
                    MyUI.table.refreshRowCache(); 
                } catch (ClassNotFoundException | SQLException ex) {
                    Logger.getLogger(UIActionListeners.class.getName()).log(Level.SEVERE, null, ex);
                }
            }
        });
        
        MyUI.addButton.addClickListener(new Button.ClickListener() {
            @Override
            public void buttonClick(Button.ClickEvent event) {
                AddItemWindow addItemWindow = new AddItemWindow();
            }
        });

        MyUI.table.addItemClickListener(new ItemClickListener() {
            @Override
            public void itemClick(ItemClickEvent event) {
                try {                    
                    InfoWindow infoWindow = new InfoWindow(event.getItemId(),table.getContainerDataSource());                     
                } catch (SQLException | ClassNotFoundException ex) {
                    Logger.getLogger(UIActionListeners.class.getName()).log(Level.SEVERE, null, ex);
                }
            }
        });
         
        MyUI.buyPrintButton.addClickListener(new Button.ClickListener() {
            @Override
            public void buttonClick(Button.ClickEvent event) {
                try {
                    if (busketArray.isEmpty()) {
                        Notification.show("Корзина пуста!", "Добавьте элементы в корзину из их описания",
                                Notification.Type.HUMANIZED_MESSAGE);
                    } else {
                        busketTable.addContainerProperty("id", Integer.class, null);
                        busketTable.addContainerProperty("article", String.class, null);
                        busketTable.addContainerProperty("name", String.class, null);
                        busketTable.addContainerProperty("comment", String.class, null);
                        busketTable.addContainerProperty("storage", Integer.class, null);
                        busketTable.addContainerProperty("price", Integer.class, null);
                        busketTable.addContainerProperty("warehouse_date", Date.class, null);
                        final String[] columnHeaders = new String[]{"id","Артикул", "Наименование", "Комментарий", "Доступное количество", "Цена", "Дата поставки на склад"};
                        busketTable.setColumnHeaders(columnHeaders); 
                        busketTable.setVisibleColumns(new Object[]{"id","article", "name", "comment", "storage", "price", "warehouse_date"});
                        BusketWindow busketWindow = new BusketWindow();
                    }
                } catch (SQLException ex) {
                    Logger.getLogger(UIActionListeners.class.getName()).log(Level.SEVERE, null, ex);
                }
            }
        });
        
        MyUI.authButton.addClickListener(new Button.ClickListener() {
            @Override
            public void buttonClick(Button.ClickEvent event) {                
                SessionController sessionControl = new SessionController();
                if (!flag) {
                    try {
                        MyUI.authConnectionPool = new SimpleJDBCConnectionPool(
                                "com.mysql.jdbc.Driver", "jdbc:mysql://localhost:3306/spareparts",
                                "root", "", 2, 5);
                    } catch (SQLException ex) {
                        Logger.getLogger(MyUI.class.getName()).log(Level.SEVERE, null, ex);
                    }
                    TableQuery q1 = new TableQuery("users", MyUI.authConnectionPool);
                    //q1.setVersionColumn("OPTLOCK");
                    try {
                        MyUI.authContainer = new SQLContainer(q1);
                    } catch (SQLException ex) {
                        Logger.getLogger(MyUI.class.getName()).log(Level.SEVERE, null, ex);
                    }
                    flag = true;
                }
                sessionControl.sessionAuth(loginTextField,passwordTextField);  
            }
        });        
    }
}
