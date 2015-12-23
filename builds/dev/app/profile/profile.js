;(function () {
    'use strict';
    angular.module('FitTreker.Profile', [
        'ui.router',
        'ngMaterial',
        'ngAnimate',
        'FitTreker.Fire',
        'mdPickers',
        'alert'
    ])
    .controller('ProfileCtrl', ProfileCtrl)
    .config(Config)
    .factory('Profile',ProfileFactory);



    //@ngInject
    function ProfileFactory (dbc,$firebaseObject) {
    	var o = {};
        var ref = dbc.getRef();
        var usersRef = ref.child('users');


        o.getUser = function (_id) {
            return $firebaseObject(usersRef.child(_id)).$loaded();
        };
    	return o;
    }




    //@ngInject
    function ProfileCtrl(Profile, AuthFactory, $scope,$rootScope,$timeout,user,$mdDatePicker,$mdDateLocale) {
        var s = this;

        s.alert = {
            type: null,
            msg: null,
            show: false
        };

        s.user = user;
        // Для того, чтобы после отправки формы, удалять классы у полей, вводится эта переменная,
        // которая хранит в себе статус отправленна форма или нет.
        s.submitForm = false;

        // Проверяет, установленна ли дата рождения у пользователя.
        // Елси нет, то изначально выводится placeholder в input "дд.мм.гггг"
        if(!s.user.birthday)
            s.time = "";
        else
            s.time = new Date(s.user.birthday);


        s.url = 'app/profile/profile.html';
        s.activeHref = 'profile';
        s.changePassForm = {
            email: user.email,
            oldPassword: "",
            newPassword: ""
        };

        s.saveChange = function (form) {
            // Добавление объекту user поля, содержаещее дату рождения, выбранную при помощи календаря
            s.user.birthday = s.time.getTime();
            AuthFactory.update(s.user).then(function() {
                s.alert.type = "success";
                s.alert.msg = "Данные обновлены успешно!";
                s.alert.show = true;
                s.submitForm = true;
                $timeout(function (){
                    s.alert.show = false;
                },3000);
            })
            .catch(function (){
                s.alert.type = "error";
                s.alert.msg = "Произошла ошибка при сохранении данных, попробуйте позднее!";
                s.alert.show = true;
                $timeout(function (){
                    s.alert.show = false;
                },3000);
            });
        };

        // Настройка календаря
        // Неделя начинается с понедельника
        $mdDateLocale.firstDayOfWeek = 1;

        s.showPicker = function (ev) {
            $mdDatePicker(ev, s.currentDate).then(function(selectedDate){
                s.time = selectedDate;
            });
        };

        s.alertClose = function () {
            s.alert.show = false;
        };

        // Блок валидации
        s.validate = function (element) {
            return {
                errorInput: element.$invalid && element.$dirty && !s.submitForm,
                success: element.$valid && element.$dirty && !s.submitForm
            };

        };

        s.setNewView = function (view) {
            console.log();
            switch (view) {
                case "profile":
                    s.url= 'app/profile/profile.html';
                    s.activeHref = "profile";
                    break;
                case "password":
                    s.url= 'app/profile/changePassword.tpl.html';
                    s.activeHref = "password";
                    break;
            }
        };

        // Смена пароля
        s.changePassword = function () {
            AuthFactory.changePassword(s.changePassForm.email,s.changePassForm.oldPassword,s.changePassForm.newPassword)
                .then(function(){
                    console.log("Все хорошо");
                })
                .catch(function(){
                    console.log("Все плохо");

                });
        };

    }


    //@ngInject
    function Config($stateProvider,$mdDateLocaleProvider) {
        $stateProvider.
            state('profile',{
                resolve: {
                    auth: /*@ngInject*/function(AuthFactory) {
                        return AuthFactory.require();
                    },
                    user: /*@ngInject*/function($stateParams,Profile) {
                        return Profile.getUser($stateParams.id);
                    }

                },
                url: '/profile/:id',
                templateUrl: 'app/profile/mainProfile.html',
                controller: 'ProfileCtrl',
                controllerAs: 'pc'
            });

        // Настройка календаря
        // Неделя начинается с понедельника
        $mdDateLocaleProvider.firstDayOfWeek = 1;
    }

})();