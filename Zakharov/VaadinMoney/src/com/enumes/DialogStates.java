package com.enumes;

/**
 * Created by User on 24.12.2015.
 */
public enum DialogStates {

    INPUT_SALARY("Введите заработную плату (в мес.): "),
    INPUT_PENSION("Введите количество пенсионных начислений (в мес.): "),
    INPUT_ANY_INCOMINGS("Введите количество другой прибыли (в мес.): "),
    INPUT_SHOPS("Расходы на магазины (в мес.): "),
    INPUT_ROAD("Расходы на дорогу (в мес.): "),
    INPUT_ANY_EXPENSES("Другие расходы (в мес.): "),
    INPUT_ACCUM("Накопленно: "),
    INPUT_ACCUM_PER_MONTH("Накапливается в месяц: ");

    String name;

    DialogStates(String name){
        this.name = name;

    }

    public String getName(){
        return name;
    }
}
