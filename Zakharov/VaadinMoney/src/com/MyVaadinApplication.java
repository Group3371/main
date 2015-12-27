package com;

import com.db.DbWorker;
import com.mysql.fabric.jdbc.FabricMySQLDriver;
import com.vaadin.annotations.Theme;
import com.vaadin.server.ExternalResource;
import com.vaadin.server.VaadinRequest;
import com.vaadin.ui.*;
import models.UsersEntity;
import org.hibernate.ejb.HibernatePersistence;

import javax.persistence.EntityManager;
import javax.persistence.EntityManagerFactory;
import javax.persistence.Persistence;
import javax.persistence.spi.PersistenceProvider;
import java.sql.*;
import java.util.HashMap;
import java.util.List;

/**
 * Created by user on 21.12.2015.
 */
public class MyVaadinApplication extends UI {



    @Override
    public void init(VaadinRequest request) {
        VerticalLayout layoutStart = new StartLayout(this);
        setContent(layoutStart);
    }
}
