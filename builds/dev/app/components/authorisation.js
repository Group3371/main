;(function () {
    'use strict';
    angular.module('FitTreker.Auth', [
        'FitTreker.Fire'
    ])
    .factory('AuthFactory', AuthFactory);

    // @ngInject
    function AuthFactory (dbc,$firebaseAuth,$state,$rootScope, $firebaseArray, $firebaseObject, UsersRepositoryFactory) {
        var o = {};
        var ref = dbc.getRef();
        var authObj = $firebaseAuth(ref);


        // Авторизация
        o.auth = function (User) {
            authObj.$authWithPassword(User)
                .then(function(authData) {
                    $rootScope.isUserLogged = true;
                    $rootScope.close();
                    console.log("Logged in as:", authData.uid);
                    $state.go('workout');
                }).catch(function(error) {
                    $rootScope.isUserLogged = false;
                    console.error("Authentication failed:", error);
                });
        };
        // Авторизация через Fasebook
        o.authWithFacebook = function () {
             authObj.$authWithOAuthPopup("facebook")
                .then(function(authData){
                    console.log("Выполнен вход через Facebook:", authData.uid);
                    $rootScope.close();
                    $state.go('workout');
                })
                .catch(function(error) {
                    console.error("Authentication failed:", error);
                });
        };
        // регистрация через Facebook
        o.RegistrationWithFacebook = function () {
            return authObj.$authWithOAuthPopup("facebook")
                .then(function(authData) {
                    console.log(authData);

                    var refUser = ref.child('users'),
                        user = {
                            uid: authData.uid,
                            email: null,
                            fullName: authData.facebook.displayName,
                            facebookId: authData.facebook.id,
                            src: authData.facebook.profileImageURL
                        };

                    refUser.child(authData.uid).set(user);
                    o.addBaseComplexes(user);

                    console.log("Регистрация через Facebook:", authData.uid);
                    $rootScope.close();
                    $state.go('workout');
                })
                .catch(function(error) {
                    console.error("Authentication failed:", error);
                });
        };

        // Проверка на авторизованность
        o.isAuth = function () {
            var authData = authObj.$getAuth();
            if (authData) {
                console.log("Logged in as:", authData.uid);
                return true;
            } else {
                console.log("Logged out");
                return false;
            }
        };

        // Сброс пароля
        o.changePassword = function (email,oldPassword,newPassword) {
            return authObj.$changePassword({
                    email: email,
                    oldPassword: oldPassword,
                    newPassword: newPassword
                });
        };

        // Проверка статуса авторизации
        o.onAuth = function() {
            console.log("=== On Auth ===");
            authObj.$onAuth(function(authData) {
                if (authData) {
                    $rootScope.isUserLogged = true;
                    var currentUser = $firebaseObject(ref.child('users').child(authData.uid));
                    currentUser.$loaded(function(_user){
                        $rootScope.currentUser = _user;
                    });
                    $rootScope.currentUser.uid = authData.uid;
                    console.log("Logged in as:", authData.uid);
                } else {
                    console.log("Not Logged in");
                    $rootScope.isUserLogged = false;
                    $rootScope.currentUser = {};
                }
            });
        };
        // Выход
        o.logout = function (){
            authObj.$unauth();
            $state.go('home');
        };

        o.onAuth();
        // Метод require
        o.require = function () {
            return authObj.$requireAuth();
        };

        o.update = function (_user) {
            var refUser = ref.child('users/' + _user.uid);
            var fireUser = $firebaseObject(refUser);
            Object.assign(fireUser,_user);
            return fireUser.$save();
            // Трехстороннее связывание данных. Пользователь.
            //return fireUser.$bindTo(scope,"pc.user");
        };
        // Регистрация нового пользователя
        o.createUser = function (newUser) {
            authObj.$createUser({
                email: newUser.email,
                password: newUser.password
            })
            .then(function (userData){
                console.log("User " + userData.uid + " created successfully!");
                // Сохранение в БД информации о пользователе
                // Сохранение его uid
                // Сохранение полного имени
                newUser.uid = userData.uid;

                var refUser = ref.child('users'),
                // Создания пользователя ,перед добавлением его в бд
                    user =  {
                        uid: newUser.uid,
                        email: newUser.email,
                        fullName: newUser.fullName || "Дорогой друг",
                        src: 'app/img/default_user_avatar.png'
                    };

                refUser.child(newUser.uid).set(user);
                o.addBaseComplexes(user);

                return o.auth(newUser);
            })
            .catch(function (error) {
                    console.error("Error: ", error);
            });
        };

        o.getCurrentUser = function (_uid) {
            var refUser = ref.child('users').child(_uid);
            return $firebaseObject(refUser).$loaded();
        };

        // После того, как пользователь зарегестрируется, ему необходимо добавить
        // Стандартный комплекс упражнений
        o.addBaseComplexes = function (_user) {
            var refComplexes = ref.child('complexes');
            var refUser = ref.child('users/' + _user.uid);

            $firebaseArray(refComplexes).$loaded(function(_complexes){
                _user.complexes = [];
                for(var i = 0; i < _complexes.length; i++) {
                    _user.complexes[i] = true;
                }
                refUser.set(_user);
            });

        };
        return o;
    }
    
})();