package hanarig.spareparts_web2;

import com.vaadin.data.Container;
import com.vaadin.data.util.sqlcontainer.SQLContainer;
import com.vaadin.data.util.sqlcontainer.connection.JDBCConnectionPool;
import com.vaadin.data.util.sqlcontainer.connection.SimpleJDBCConnectionPool;
import com.vaadin.data.util.sqlcontainer.query.TableQuery;
import com.vaadin.ui.DateField;
import com.vaadin.ui.Notification;
import com.vaadin.ui.TextField;
import static hanarig.spareparts_web2.InfoWindow.busketArray;
import static java.lang.Integer.parseInt;
import java.sql.Connection;
import java.sql.Date;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.sql.Statement;
import java.util.logging.Level;
import java.util.logging.Logger;


/**
* @author Артём
*/
public class DataBase {

    public static Connection conn;
    public static Statement statmt;
    public static ResultSet resSet;
    private static JDBCConnectionPool connectionPool = null;
    public static SQLContainer sparepartsContainer = null; 
    public static Container searchContainer = null; 
    public static Container busketContainer = null; 

    // --------ПОДКЛЮЧЕНИЕ К БАЗЕ ДАННЫХ--------
    public static int ConnectDB() throws ClassNotFoundException, SQLException {
        try {
            connectionPool = new SimpleJDBCConnectionPool(
                    "com.mysql.jdbc.Driver", "jdbc:mysql://localhost:3306/spareparts",
                    "root", "", 2, 5);
        } catch (SQLException ex) {
            Logger.getLogger(MyUI.class.getName()).log(Level.SEVERE, null, ex);
        }
        return 1;
    }
    
    public static SQLContainer initContainer() {
        TableQuery q1 = new TableQuery("spareparts_list", connectionPool);   
        try {
            sparepartsContainer = new SQLContainer(q1);
        } catch (SQLException ex) {
            Logger.getLogger(MyUI.class.getName()).log(Level.SEVERE, null, ex);
        }
        return sparepartsContainer;
    }
    
    // -------- Вывод таблицы--------
    public static int ReadDB() throws ClassNotFoundException, SQLException {     
        sparepartsContainer.refresh();
        MyUI.table.refreshRowCache(); 
        return 1;
    }
    
    // --------Заполнение таблицы--------
    public static boolean WriteDB(TextField textField1, TextField textField2, TextField textField3, TextField textField4, 
            TextField textField5, DateField date, TextField textField7) throws SQLException {
        Object newItem = sparepartsContainer.addItem();
        sparepartsContainer.getItem(newItem).getItemProperty("article").setValue(textField1.getValue());
        sparepartsContainer.getItem(newItem).getItemProperty("name").setValue(textField2.getValue());
        sparepartsContainer.getItem(newItem).getItemProperty("comment").setValue(textField3.getValue());
        sparepartsContainer.getItem(newItem).getItemProperty("storage").setValue(parseInt(textField4.getValue()));
        sparepartsContainer.getItem(newItem).getItemProperty("price").setValue(parseInt(textField5.getValue()));       
        sparepartsContainer.getItem(newItem).getItemProperty("warehouse_date").setValue(date.getValue());
        sparepartsContainer.commit(); 
        sparepartsContainer.refresh();
        MyUI.table.refreshRowCache();     
        return true;
    }
    
    public static boolean DeleteRowDB(Object itemId, final Container container) throws SQLException { 
        
        Object current = null;
        for (int i = 0; i < sparepartsContainer.size(); i++) {
            current = sparepartsContainer.getIdByIndex(i);
            if (sparepartsContainer.getItem(current).getItemProperty("id").getValue().toString().equals(container.getItem(itemId).getItemProperty("id").getValue())){
                break;
            }
        }         
        sparepartsContainer.removeItem(current);        
        sparepartsContainer.commit(); 
        sparepartsContainer.refresh();
        MyUI.table.refreshRowCache();      
        return true;
    }
      
    // -------- Поиск по таблице --------
    public static Container SearchDB(TextField searchText) throws ClassNotFoundException, SQLException {
        boolean searchFlag = false;  
        MyUI.table.addContainerProperty("id", Integer.class, null);
        MyUI.table.addContainerProperty("article", String.class, null);
        MyUI.table.addContainerProperty("name", String.class, null);
        MyUI.table.addContainerProperty("comment", String.class, null);
        MyUI.table.addContainerProperty("storage", Integer.class, null);
        MyUI.table.addContainerProperty("price", Integer.class, null);
        MyUI.table.addContainerProperty("warehouse_date", Date.class, null);
        searchContainer = MyUI.table.getContainerDataSource();        
        //заполняем searchContainer найденными элементами в контейнере sql
        for (int i = 0; i < sparepartsContainer.size(); i++) {
            Object current = sparepartsContainer.getIdByIndex(i);
            if (sparepartsContainer.getItem(current).getItemProperty("article").getValue().toString().contains(searchText.getValue())
                    || sparepartsContainer.getItem(current).getItemProperty("name").getValue().toString().contains(searchText.getValue())
                    || sparepartsContainer.getItem(current).getItemProperty("comment").getValue().toString().contains(searchText.getValue())) {
                Object newItem = searchContainer.addItem();  
                searchContainer.getItem(newItem).getItemProperty("id").setValue(sparepartsContainer.getItem(current).getItemProperty("id").getValue());
                searchContainer.getItem(newItem).getItemProperty("article").setValue(sparepartsContainer.getItem(current).getItemProperty("article").getValue());
                searchContainer.getItem(newItem).getItemProperty("name").setValue(sparepartsContainer.getItem(current).getItemProperty("name").getValue());
                searchContainer.getItem(newItem).getItemProperty("comment").setValue(sparepartsContainer.getItem(current).getItemProperty("comment").getValue());
                searchContainer.getItem(newItem).getItemProperty("storage").setValue(sparepartsContainer.getItem(current).getItemProperty("storage").getValue());
                searchContainer.getItem(newItem).getItemProperty("price").setValue(sparepartsContainer.getItem(current).getItemProperty("price").getValue());
                searchContainer.getItem(newItem).getItemProperty("warehouse_date").setValue(sparepartsContainer.getItem(current).getItemProperty("warehouse_date").getValue());                
                searchFlag=true;                
                Notification.show("Найдено!", "", Notification.Type.HUMANIZED_MESSAGE);
            }
        }
        if (!searchFlag) {
            Notification.show("Ничего не найдено!", "Попробуйте изменить запрос",
                    Notification.Type.HUMANIZED_MESSAGE);
        }        
        return searchContainer;
    }
   // -------- Изменение обьекта из таблицы главной формы--------
    public static boolean EditDB(Object itemId,Container container,TextField textField1, TextField textField2, TextField textField3, TextField textField4, 
            TextField textField5, DateField date, TextField textField7) throws SQLException {   
        Object current = null;
        for (int i = 0; i < sparepartsContainer.size(); i++) {
            current = sparepartsContainer.getIdByIndex(i);
            if (sparepartsContainer.getItem(current).getItemProperty("id").getValue().toString().equals(container.getItem(itemId).getItemProperty("id").getValue())){
                //sparepartsContainer.getItem(current)
                break;
            }
        }
        sparepartsContainer.getItem(current).getItemProperty("article").setValue(textField1.getValue());
        sparepartsContainer.getItem(current).getItemProperty("name").setValue(textField2.getValue());
        sparepartsContainer.getItem(current).getItemProperty("comment").setValue(textField3.getValue());
        sparepartsContainer.getItem(current).getItemProperty("storage").setValue(parseInt(textField4.getValue()));
        sparepartsContainer.getItem(current).getItemProperty("price").setValue(parseInt(textField5.getValue()));       
        sparepartsContainer.getItem(current).getItemProperty("warehouse_date").setValue(date.getValue());
        sparepartsContainer.commit();   
        sparepartsContainer.refresh();
        MyUI.table.refreshRowCache();  
        return true;
    }
    
    public static void loadBusketDB(Container busketContainer) {
        for (int currentRow = 0; currentRow < busketArray.size(); currentRow++) {
            //current = busketContainer.getIdByIndex(i);
            //Object dbItem = sparepartsContainer.getItem(busketArray.get(currentRow).id);
            //Object newItem = busketContainer.addItem();
            Object newItem = busketContainer.addItem();
            busketContainer.getItem(newItem).getItemProperty("id")              .setValue(sparepartsContainer.getItem(busketArray.get(currentRow).id).getItemProperty("id").getValue());
            busketContainer.getItem(newItem).getItemProperty("article")         .setValue(sparepartsContainer.getItem(busketArray.get(currentRow).id).getItemProperty("article").getValue());
            busketContainer.getItem(newItem).getItemProperty("name")            .setValue(sparepartsContainer.getItem(busketArray.get(currentRow).id).getItemProperty("name").getValue());
            busketContainer.getItem(newItem).getItemProperty("comment")         .setValue(sparepartsContainer.getItem(busketArray.get(currentRow).id).getItemProperty("comment").getValue());
            busketContainer.getItem(newItem).getItemProperty("storage")         .setValue(sparepartsContainer.getItem(busketArray.get(currentRow).id).getItemProperty("storage").getValue());
            busketContainer.getItem(newItem).getItemProperty("price")           .setValue(sparepartsContainer.getItem(busketArray.get(currentRow).id).getItemProperty("price").getValue());
            busketContainer.getItem(newItem).getItemProperty("warehouse_date")  .setValue(sparepartsContainer.getItem(busketArray.get(currentRow).id).getItemProperty("warehouse_date").getValue());
        }        
    }
     
    public static boolean EditBasketStorageDB() throws SQLException {        
        /*sparepartsContainer.getItem(itemId).getItemProperty("article").getValue();
        sparepartsContainer.getItem(itemId).getItemProperty("name").setValue(textField2.getValue());
        sparepartsContainer.getItem(itemId).getItemProperty("comment").setValue(textField3.getValue());
        sparepartsContainer.getItem(itemId).getItemProperty("storage").setValue(parseInt(textField4.getValue()));
        sparepartsContainer.getItem(itemId).getItemProperty("price").setValue(parseInt(textField5.getValue()));       
        sparepartsContainer.getItem(itemId).getItemProperty("warehouse_date").setValue(date.getValue());
        sparepartsContainer.commit();  
        sparepartsContainer.refresh();
        MyUI.table.refreshRowCache();  
        */        
        return true;
    }
}
