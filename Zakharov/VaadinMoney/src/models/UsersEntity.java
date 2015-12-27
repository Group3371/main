package models;

import javax.persistence.*;

/**
 * Created by User on 23.12.2015.
 */
@Entity
@Table(name = "users", schema = "userdb", catalog = "")
public class UsersEntity {
    private int id;
    private String name;
    private String email;
    private Double salary;
    private Double pension;
    private Double anyincomings;
    private Double shops;
    private Double road;
    private Double anyexpenses;
    private Double accum;
    private Double accumpermonth;
    private Double money;

    @Id
    @Column(name = "id")
    public int getId() {
        return id;
    }

    public void setId(int id) {
        this.id = id;
    }

    @Basic
    @Column(name = "name")
    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    @Basic
    @Column(name = "email")
    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    @Basic
    @Column(name = "salary")
    public Double getSalary() {
        return salary;
    }

    public void setSalary(Double salary) {
        this.salary = salary;
    }

    @Basic
    @Column(name = "pension")
    public Double getPension() {
        return pension;
    }

    public void setPension(Double pension) {
        this.pension = pension;
    }

    @Basic
    @Column(name = "anyincomings")
    public Double getAnyincomings() {
        return anyincomings;
    }

    public void setAnyincomings(Double anyincomings) {
        this.anyincomings = anyincomings;
    }

    @Basic
    @Column(name = "shops")
    public Double getShops() {
        return shops;
    }

    public void setShops(Double shops) {
        this.shops = shops;
    }

    @Basic
    @Column(name = "road")
    public Double getRoad() {
        return road;
    }

    public void setRoad(Double road) {
        this.road = road;
    }

    @Basic
    @Column(name = "anyexpenses")
    public Double getAnyexpenses() {
        return anyexpenses;
    }

    public void setAnyexpenses(Double anyexpenses) {
        this.anyexpenses = anyexpenses;
    }

    @Basic
    @Column(name = "accum")
    public Double getAccum() {
        return accum;
    }

    public void setAccum(Double accum) {
        this.accum = accum;
    }

    @Basic
    @Column(name = "accumpermonth")
    public Double getAccumpermonth() {
        return accumpermonth;
    }

    public void setAccumpermonth(Double accumpermonth) {
        this.accumpermonth = accumpermonth;
    }

    @Basic
    @Column(name = "money")
    public Double getMoney() {
        return money;
    }

    public void setMoney(Double money) {
        this.money = money;
    }

    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (o == null || getClass() != o.getClass()) return false;

        UsersEntity that = (UsersEntity) o;

        if (id != that.id) return false;
        if (name != null ? !name.equals(that.name) : that.name != null) return false;
        if (email != null ? !email.equals(that.email) : that.email != null) return false;
        if (salary != null ? !salary.equals(that.salary) : that.salary != null) return false;
        if (pension != null ? !pension.equals(that.pension) : that.pension != null) return false;
        if (anyincomings != null ? !anyincomings.equals(that.anyincomings) : that.anyincomings != null) return false;
        if (shops != null ? !shops.equals(that.shops) : that.shops != null) return false;
        if (road != null ? !road.equals(that.road) : that.road != null) return false;
        if (anyexpenses != null ? !anyexpenses.equals(that.anyexpenses) : that.anyexpenses != null) return false;
        if (accum != null ? !accum.equals(that.accum) : that.accum != null) return false;
        if (accumpermonth != null ? !accumpermonth.equals(that.accumpermonth) : that.accumpermonth != null)
            return false;
        if (money != null ? !money.equals(that.money) : that.money != null) return false;

        return true;
    }

    @Override
    public int hashCode() {
        int result = id;
        result = 31 * result + (name != null ? name.hashCode() : 0);
        result = 31 * result + (email != null ? email.hashCode() : 0);
        result = 31 * result + (salary != null ? salary.hashCode() : 0);
        result = 31 * result + (pension != null ? pension.hashCode() : 0);
        result = 31 * result + (anyincomings != null ? anyincomings.hashCode() : 0);
        result = 31 * result + (shops != null ? shops.hashCode() : 0);
        result = 31 * result + (road != null ? road.hashCode() : 0);
        result = 31 * result + (anyexpenses != null ? anyexpenses.hashCode() : 0);
        result = 31 * result + (accum != null ? accum.hashCode() : 0);
        result = 31 * result + (accumpermonth != null ? accumpermonth.hashCode() : 0);
        result = 31 * result + (money != null ? money.hashCode() : 0);
        return result;
    }
}
