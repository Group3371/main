package com.user;

import javax.persistence.criteria.CriteriaBuilder;

/**
 * Created by User on 22.12.2015.
 */
public class User {

    Integer udid;
    String name;
    String email;
    Double money;
    Double incomeZP;
    Double incomePnsiya;
    Double incomePlus;
    Double expensesShop;
    Double expensesRoad;
    Double expensesPlus;
    Double sumAccumulate;
    Double accumulatePerMonth;

    String password;

    public User(int udid, String name,String email ,Double money, Double incomeZP, Double incomePnsiya, Double incomePlus,
                Double expensesShop, Double expensesRoad, Double expensesPlus,
                Double sumAccumulate, Double accumulatePerMonth){
        this.udid = udid;
        this.name = name;
        this.email = email;
        this.money = money;
        this.incomeZP = incomeZP;
        this.incomePnsiya = incomePnsiya;
        this.incomePlus = incomePlus;
        this.expensesShop = expensesShop;
        this.expensesRoad = expensesRoad;
        this.expensesPlus = expensesPlus;
        this.sumAccumulate = sumAccumulate;
        this.accumulatePerMonth = accumulatePerMonth;
    }

    public User(){
        this.udid = 0;
        this.name = "NAME";
        this.email = "EMAIL@EMAIL.EMAIL";
        this.password = "0";
        this.money = 0d;
        this.incomeZP = 0d;
        this.incomePnsiya = 0d;
        this.incomePlus = 0d;
        this.expensesShop = 0d;
        this.expensesRoad = 0d;
        this.expensesPlus = 0d;
        this.sumAccumulate = 0d;
        this.accumulatePerMonth = 0d;
    }

    public void clear(){
        this.money = 0d;
        this.incomeZP = 0d;
        this.incomePnsiya = 0d;
        this.incomePlus = 0d;
        this.expensesShop = 0d;
        this.expensesRoad = 0d;
        this.expensesPlus = 0d;
        this.sumAccumulate = 0d;
        this.accumulatePerMonth = 0d;
    }

    public Integer getUdid() {
        return udid;
    }

    public void setUdid(Integer udid) {
        this.udid = udid;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public Double getMoney() {
        return money;
    }

    public void setMoney(Double money) {
        this.money = money;
    }

    public Double getIncomeZP() {
        return incomeZP;
    }

    public void setIncomeZP(Double incomeZP) {
        this.incomeZP = incomeZP;
    }

    public Double getIncomePnsiya() {
        return incomePnsiya;
    }

    public void setIncomePnsiya(Double incomePnsiya) {
        this.incomePnsiya = incomePnsiya;
    }

    public Double getIncomePlus() {
        return incomePlus;
    }

    public void setIncomePlus(Double incomePlus) {
        this.incomePlus = incomePlus;
    }

    public Double getExpensesShop() {
        return expensesShop;
    }

    public void setExpensesShop(Double expensesShop) {
        this.expensesShop = expensesShop;
    }

    public Double getExpensesRoad() {
        return expensesRoad;
    }

    public void setExpensesRoad(Double expensesRoad) {
        this.expensesRoad = expensesRoad;
    }

    public Double getExpensesPlus() {
        return expensesPlus;
    }

    public void setExpensesPlus(Double expensesPlus) {
        this.expensesPlus = expensesPlus;
    }

    public Double getSumAccumulate() {
        return sumAccumulate;
    }

    public void setSumAccumulate(Double sumAccumulate) {
        this.sumAccumulate = sumAccumulate;
    }

    public Double getAccumulatePerMonth() {
        return accumulatePerMonth;
    }

    public void setAccumulatePerMonth(Double accumulatePerMonth) {
        this.accumulatePerMonth = accumulatePerMonth;
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public String getPassword() {
        return password;
    }

    public void setPassword(String password) {
        this.password = password;
    }

    public void clearAccumulate(){
        setSumAccumulate(0d);
    }
}
