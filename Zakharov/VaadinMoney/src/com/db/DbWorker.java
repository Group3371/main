package com.db;

import com.mysql.fabric.jdbc.FabricMySQLDriver;
import com.user.User;

import java.sql.*;

/**
 * Created by User on 26.12.2015.
 */
public class DbWorker {

    String URL = "jdbc:mysql://localhost:3306/userdb";
    String USERNAME = "root";
    String PASSWORD = "root";

    PreparedStatement preparedStatement = null;
    Connection connection = null;

    String INSERT_USER = "INSERT INTO users (name,email,salary,pension,anyincomings,shops,road,anyexpenses,accum,accumpermonth,money,password)" +
            " VALUES (?,?,?,?,?,?,?,?,?,?,?,?)";
    String UPDATE_USER = "UPDATE users SET name = ? , email = ?, salary = ?, pension = ?, anyincomings =?," +
            "shops = ?, road = ?, anyexpenses = ?, accum = ?, accumpermonth = ?, money = ? WHERE id = ?";
    String SELECT_USER = "SELECT * FROM users WHERE email = ? AND password = ?";
    String SELECT_NEW_USER = "SELECT * FROM users WHERE email = ?";

    public DbWorker(){

        try {
            Class.forName("com.mysql.jdbc.Driver");
        } catch (ClassNotFoundException e) {
            e.printStackTrace();
        }
        try {
            Driver driver = new FabricMySQLDriver();
            DriverManager.registerDriver(driver);
            connection = DriverManager.getConnection(URL,USERNAME,PASSWORD);
        } catch (SQLException e) {
            e.printStackTrace();
        }
    }

    public void saveNewUser(User user) throws SQLException {
        try {
            preparedStatement = connection.prepareStatement(INSERT_USER);
            preparedStatement.setString(1,user.getName());//NAME
            preparedStatement.setString(2,user.getEmail());//EMAIL
            preparedStatement.setDouble(3,user.getIncomeZP());//SALARY
            preparedStatement.setDouble(4,user.getIncomePnsiya());//PENSION
            preparedStatement.setDouble(5,user.getIncomePlus());//ANYINCOMINGS
            preparedStatement.setDouble(6,user.getExpensesShop());//SHOPS
            preparedStatement.setDouble(7,user.getExpensesRoad());//ROAD
            preparedStatement.setDouble(8,user.getExpensesPlus());//ANYEXPENSES
            preparedStatement.setDouble(9,user.getSumAccumulate());//ACCUM
            preparedStatement.setDouble(10,user.getAccumulatePerMonth());//ACCUMPERMONTH
            preparedStatement.setDouble(11,user.getMoney());//MONEY
            preparedStatement.setString(12,user.getPassword());//PASSWORD

            preparedStatement.execute();
        } catch (SQLException e) {
            e.printStackTrace();
        }
    }

    public void updateUser(User user) {
        try {
            preparedStatement = connection.prepareStatement(UPDATE_USER);

            preparedStatement.setString(1,user.getName());//NAME
            preparedStatement.setString(2,user.getEmail());//EMAIL
            preparedStatement.setDouble(3,user.getIncomeZP());//SALARY
            preparedStatement.setDouble(4,user.getIncomePnsiya());//PENSION
            preparedStatement.setDouble(5,user.getIncomePlus());//ANYINCOMINGS
            preparedStatement.setDouble(6,user.getExpensesShop());//SHOPS
            preparedStatement.setDouble(7,user.getExpensesRoad());//ROAD
            preparedStatement.setDouble(8,user.getExpensesPlus());//ANYEXPENSES
            preparedStatement.setDouble(9,user.getSumAccumulate());//ACCUM
            preparedStatement.setDouble(10,user.getAccumulatePerMonth());//ACCUMPERMONTH
            preparedStatement.setDouble(11,user.getMoney());//MONEY
            preparedStatement.setInt(12, user.getUdid());//ID

            preparedStatement.execute();
        } catch (SQLException e) {
            e.printStackTrace();
        }
    }

    public boolean autentification(User user){

        try {
            preparedStatement = connection.prepareStatement(SELECT_USER);
            preparedStatement.setString(1,user.getEmail());//EMAIL
            preparedStatement.setString(2,user.getPassword());//PASSWORD
            ResultSet resultSet = preparedStatement.executeQuery();
            return resultSet.next();

        } catch (SQLException e) {
            e.printStackTrace();
        }

        return false;
    }

    public boolean autentificationNewUser(User user){

        try {
            preparedStatement = connection.prepareStatement(SELECT_NEW_USER);
            preparedStatement.setString(1,user.getEmail());//EMAIL
            ResultSet resultSet = preparedStatement.executeQuery();
            return resultSet.next();

        } catch (SQLException e) {
            e.printStackTrace();
        }

        return false;
    }

    public User autorization(User user){

        try {
            preparedStatement = connection.prepareStatement(SELECT_USER);
            preparedStatement.setString(1,user.getEmail());//NAME
            preparedStatement.setString(2,user.getPassword());//PASSWORD
            ResultSet resultSet = preparedStatement.executeQuery();
            if(resultSet.next()) {
                user.setUdid(resultSet.getInt("id"));
                user.setName(resultSet.getString("name"));
                user.setEmail(resultSet.getString("email"));
                user.setIncomeZP(resultSet.getDouble("salary"));
                user.setIncomePnsiya(resultSet.getDouble("pension"));
                user.setIncomePlus(resultSet.getDouble("anyincomings"));
                user.setExpensesShop(resultSet.getDouble("shops"));
                user.setExpensesRoad(resultSet.getDouble("road"));
                user.setExpensesPlus(resultSet.getDouble("anyexpenses"));
                user.setSumAccumulate(resultSet.getDouble("accum"));
                user.setAccumulatePerMonth(resultSet.getDouble("accumpermonth"));
                user.setMoney(resultSet.getDouble("money"));
                user.setPassword(resultSet.getString("password"));
            }

        } catch (SQLException e) {
            e.printStackTrace();
        }

        return user;
    }

    public Connection getConnection() {
        return connection;
    }
}
