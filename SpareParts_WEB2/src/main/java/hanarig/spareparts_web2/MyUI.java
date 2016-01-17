package hanarig.spareparts_web2;

import javax.servlet.annotation.WebServlet;

import com.vaadin.annotations.Theme;
import com.vaadin.annotations.VaadinServletConfiguration;
import com.vaadin.annotations.Widgetset;
import com.vaadin.data.util.sqlcontainer.SQLContainer;
import com.vaadin.data.util.sqlcontainer.connection.JDBCConnectionPool;
import com.vaadin.data.validator.NullValidator;
import com.vaadin.server.ClassResource;
import com.vaadin.server.VaadinRequest;
import com.vaadin.server.VaadinServlet;
import com.vaadin.server.VaadinSession;
import com.vaadin.ui.Alignment;
import com.vaadin.ui.Button;
import com.vaadin.ui.FormLayout;
import com.vaadin.ui.HorizontalLayout;
import com.vaadin.ui.Image;
import com.vaadin.ui.Label;
import com.vaadin.ui.Panel;
import com.vaadin.ui.PasswordField;
import com.vaadin.ui.Table;
import com.vaadin.ui.TextField;
import com.vaadin.ui.UI;
import com.vaadin.ui.VerticalLayout;
import com.vaadin.ui.themes.ValoTheme;
import java.sql.SQLException;
import java.util.logging.Level;
import java.util.logging.Logger;

/**
 *
 */

@Theme("mytheme")

@Widgetset("hanarig.spareparts_web2.MyAppWidgetset")
public class MyUI extends UI {
    
    static VaadinSession userSession;    
    static JDBCConnectionPool authConnectionPool = null;
    static SQLContainer authContainer = null;  
    static Button addButton = new Button("Добавить запчасть");        
    static Button dbase = new Button("Обновить данные в таблице");    
    //static Button dbaseMoto = new Button("Обновить данные в таблице 2");
    static Button buyPrintButton = new Button("Сохранить заказ");
    static Button authButton = new Button("Вход");
    static Button searchButton = new Button("Найти");
    static TextField search = new TextField();
    static TextField loginTextField = new TextField("Логин:");     
    static PasswordField passwordTextField = new PasswordField("Пароль:"); 
    static Table table = new Table();  
    static Panel authPanel = new Panel(); 
    static FormLayout authLayout = new FormLayout();
    static FormLayout authLayoutUser = new FormLayout();
    
 
    static {
        UIActionListeners UIActionListener = new UIActionListeners(); 
    }
     
    @Override 
    protected void init(VaadinRequest vaadinRequest) {
        
        userSession=this.getSession();        
        userSession.setAttribute("Admin", "No");
        
        searchButton.addStyleName(ValoTheme.BUTTON_PRIMARY);
        addButton.addStyleName(ValoTheme.BUTTON_FRIENDLY);
        buyPrintButton.addStyleName(ValoTheme.BUTTON_PRIMARY);
        addButton.setEnabled(false);
        
//layouts and panels:            
        Panel mainPanel = new Panel();        
        mainPanel.setSizeFull();        
        Panel headerPanel = new Panel();
        headerPanel.setWidth("100%");
        headerPanel.setHeight("75px");
         
        Panel bodyPanel = new Panel();
        bodyPanel.setSizeFull();
                
        Panel mainMenuPanel = new Panel(); 
        Panel footerPanel = new Panel(" All rights reserved by Khanganu A.I., 2015-2016.");
                       
        VerticalLayout mainVerticalLayout = new VerticalLayout();
        HorizontalLayout headerHorizontalLayout = new HorizontalLayout();
        HorizontalLayout bodyHorizontalLayout = new HorizontalLayout();         
        VerticalLayout mainMenuVerticalLayout = new VerticalLayout();        
        
        setContent(mainPanel); 
        mainPanel.setContent(mainVerticalLayout);
        
        headerPanel.setContent(headerHorizontalLayout);  
        bodyPanel.setContent(bodyHorizontalLayout);  
        mainMenuPanel.setContent(mainMenuVerticalLayout);
        authPanel.setContent(authLayout);        
        
//header
        Image siteLogo = new Image("", new ClassResource("/Parts.png"));
        Image menuPic = new Image("", new ClassResource("/images/engine-transmission2.png"));
        Panel siteNamePanel = new Panel(" SpareParts!");
        Label margin = new Label(" ");
        
        headerHorizontalLayout.addComponent(siteLogo);
        headerHorizontalLayout.setComponentAlignment(siteLogo, Alignment.BOTTOM_LEFT);
                
        headerHorizontalLayout.addComponent(siteNamePanel);
        headerHorizontalLayout.setComponentAlignment(siteNamePanel, Alignment.BOTTOM_LEFT);
        headerHorizontalLayout.setExpandRatio(siteNamePanel, 5*2.0f);
        
        headerHorizontalLayout.addComponent(search);
        headerHorizontalLayout.addComponent(searchButton);
        headerHorizontalLayout.setComponentAlignment(search, Alignment.BOTTOM_RIGHT);
        headerHorizontalLayout.setExpandRatio(search,1.0f);
        headerHorizontalLayout.setComponentAlignment(searchButton, Alignment.BOTTOM_RIGHT);
        headerHorizontalLayout.addComponent(margin);
        headerHorizontalLayout.setComponentAlignment(margin, Alignment.BOTTOM_RIGHT);
                
        headerHorizontalLayout.setSpacing(true);         
        
//body
    //main menu
        Label mainMenuName=new Label("Главное меню: ");        
        mainMenuVerticalLayout.addComponent(mainMenuName);  
        mainMenuVerticalLayout.addComponent(dbase);
        mainMenuVerticalLayout.addComponent(addButton);
        mainMenuVerticalLayout.addComponent(buyPrintButton);        
        mainMenuVerticalLayout.addComponent(new Label("   ")); 
        mainMenuVerticalLayout.setSpacing(true);               
        mainMenuVerticalLayout.setMargin(true);
        
        mainMenuVerticalLayout.addComponent(authPanel); 
    //auth
        loginTextField.setRequired(true);
        loginTextField.addValidator(new NullValidator("Поле должно быть заполнено!", false));
        loginTextField.addStyleName("align-center");       
        loginTextField.setWidth("150px");
        authLayout.addComponent(loginTextField);                
        passwordTextField.setRequired(true);
        passwordTextField.addValidator(new NullValidator("Поле должно быть заполнено!", false));
        passwordTextField.addStyleName("align-center"); 
        passwordTextField.setWidth("150px");
        authLayout.addComponent(passwordTextField);
        authLayout.setSpacing(true);
        authLayout.addComponent(authButton);        
        
    //content        
      //database association
        try {            
            DataBase.ConnectDB();
            DataBase.initContainer();
            DataBase.ReadDB();
        } catch (ClassNotFoundException | SQLException ex) {
            Logger.getLogger(MyUI.class.getName()).log(Level.SEVERE, null, ex);
        }        
        
        table.setContainerDataSource(DataBase.sparepartsContainer);
        table.setSelectable(true);        
        final String[] columnHeaders = new String[] 
        { "id", "Артикул", "Наименование", "Комментарий", "Доступное количество", "Цена", "Дата поставки на склад"}; 
        table.setColumnHeaders(columnHeaders);
        table.setVisibleColumns(new Object[]{"article", "name", "comment", "storage", "price", "warehouse_date"});
        
//adding to mainVerticalLayout      
        mainVerticalLayout.addComponent(headerPanel);
        bodyHorizontalLayout.addComponent(mainMenuPanel);
        bodyHorizontalLayout.addComponent(table);
        mainMenuPanel.setWidth("25%");
        mainMenuPanel.setHeight("520px");
        authPanel.setWidth("250px");
        table.setWidth("75%");
        table.setHeight("520px");  
        mainVerticalLayout.addComponent(bodyPanel);
        mainVerticalLayout.addComponent(footerPanel);
        
    }    
    @WebServlet(urlPatterns = "/*", name = "MyUIServlet", asyncSupported = true)
    @VaadinServletConfiguration(ui = MyUI.class, productionMode = false)
    public static class MyUIServlet extends VaadinServlet {
    }
} 

