package com;

import com.vaadin.ui.*;


/**
 * Created by user on 21.12.2015.
 */
public class ContactLayout extends VerticalLayout {

    EmailSender emailSender;
    public ContactLayout(MenuBar menuBar){
        this.addComponent(menuBar);
        TextArea area = new TextArea("Send your question for us: ");
        area.setWidth("350px");
//        TextField tfEmail = new TextField("Send your message");
//        this.addComponent(tfEmail);
        this.addComponent(area);
        emailSender = new EmailSender("zakharovvolodya95@gmail.com", "power1325");
        Button send = new Button("Send");
        send.addClickListener(new Button.ClickListener() {
            @Override
            public void buttonClick(Button.ClickEvent clickEvent) {
                emailSender.send("Info from site","info","zakharovvolodya95@gmail.com","zakharovvolodya95@gmail.com");
            }
        });


        this.addComponent(send);


        this.setComponentAlignment(area, Alignment.BOTTOM_CENTER);
        this.setComponentAlignment(send, Alignment.BOTTOM_CENTER);

    }

}
