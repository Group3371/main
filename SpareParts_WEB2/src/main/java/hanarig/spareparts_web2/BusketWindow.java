/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package hanarig.spareparts_web2;

import com.vaadin.annotations.Theme;
import com.vaadin.ui.Alignment;
import com.vaadin.ui.Button;
import com.vaadin.ui.HorizontalLayout;
import com.vaadin.ui.Table;
import com.vaadin.ui.UI;
import com.vaadin.ui.VerticalLayout;
import com.vaadin.ui.Window;
import com.vaadin.ui.themes.ValoTheme;
import java.sql.SQLException;

/**
 *
 * @author Артём
 */
@Theme("ValoTheme")
public class BusketWindow {
    static Table busketTable = new Table("");
    
    public BusketWindow() throws SQLException{
        
        final Window busketWindow = new Window("Корзина");        
        busketWindow.setWidth("800px");
        busketWindow.setHeight("540px");        
        Button deleteRow = new Button("Удалить элемент");        
        Button deleteAll = new Button("Очистить корзину");
        Button Save = new Button("ЗАКАЗАТЬ!");
        
//layouts and panels:    
        VerticalLayout main = new VerticalLayout();
        HorizontalLayout buttons = new HorizontalLayout();
        busketWindow.setContent(main);
               
        buttons.addComponent(deleteRow);
        buttons.setComponentAlignment(deleteRow, Alignment.MIDDLE_CENTER);        
        buttons.addComponent(deleteAll);
        buttons.setComponentAlignment(deleteAll, Alignment.MIDDLE_LEFT);        
        buttons.addComponent(Save);
        buttons.setComponentAlignment(Save, Alignment.MIDDLE_RIGHT);
        buttons.setMargin(true);
        buttons.setSpacing(true);
        
        deleteAll.addStyleName(ValoTheme.BUTTON_DANGER);        
        Save.addStyleName(ValoTheme.BUTTON_PRIMARY);                                
                     
        DataBase.loadBusketDB(busketTable.getContainerDataSource());
        
        busketTable.refreshRowCache();  
        
        main.addComponent(busketTable);
        busketTable.setWidth("100%");
        busketTable.setHeight("350px");        
        main.addComponent(buttons);        
        
        // Center it in the browser window
        busketWindow.center();
        
        // Open it in the UI
        UI.getCurrent().addWindow(busketWindow);
    }
    
}
