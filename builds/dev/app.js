;(function (){
    'use strict';
    angular
        .module('FitTreker',[
            'ui.router',
            'ui.bootstrap',
            'ngAnimate',
            'templates',
            'FitTreker.Navbar',
            'FitTreker.UsersRepository',
            'FitTreker.Fire',
            'FitTreker.Home',
            'FitTreker.Auth',
            'FitTreker.Workout',
            'FitTreker.Profile',
            'FitTreker.Exercises',
            'FitTreker.Statistic',
            'FitTreker.Workout.Area'
        ])
        .constant('FIREBASE_URL','https://fittrecker.firebaseio.com/')
        .controller('MainCtrl', MainCtrl)
        .run(Run)
        .config(Config);

    //@ngInject
    function Config ($stateProvider, $urlRouterProvider, $logProvider){
        $logProvider.debugEnabled(true);
        $urlRouterProvider
        .otherwise('/');
    }
    Config.$inject = ["$stateProvider", "$urlRouterProvider", "$logProvider"];

    //@ngInject
    function Run($rootScope) {
        $rootScope.dataLoaded = true;
        $rootScope.currentUser = {};
    }
    Run.$inject = ["$rootScope"];

    //@ngInject
    function MainCtrl ($scope, $modal) {
        var s = this;
        s.sign = "Sign In";
    }
    MainCtrl.$inject = ["$scope", "$modal"];
})();

;(function () {
    'use strict';
    angular.module('FitTreker.Navbar', [
        'ui.router'
    ])
        .controller('NavbarCtrl',navbarCtrl);

    //@ngInject
    function navbarCtrl (AuthFactory,$rootScope) {
        var s = this;


        s.logOut = function () {
            AuthFactory.logout();
        }
    }
    navbarCtrl.$inject = ["AuthFactory", "$rootScope"];

})();
;(function () {
    'use strict';
    angular.module('alert', [])
        .controller('FormAlertCtrl',FormAlertCtrl)
        .directive('formAlert', formAlert);

    //@ngInject
    function FormAlertCtrl ($scope,$attrs){
        var o = this;
    }
    FormAlertCtrl.$inject = ["$scope", "$attrs"];

    //@ngInject
    function formAlert (){
        return {
            scope: {
                type: '@',
                show: '=',
                close: '&'
            },
            transclude: true,
            replace: true,
            controller: "FormAlertCtrl",
            controllerAs: 'fac',
            restrict: "EA",
            template: "<div class='form-alert' ng-show='show' ng-class='setClass()'>\
                            <a class='form-alert__close' ng-click='close()'></a>\
                            <div class='form-alert__body' ng-transclude>\
                            </div>\
                        </div>",
            link: function (scope, element, attrs) {
                scope.setClass = function () {
                    return {
                        success: scope.type === "success",
                        error: scope.type === "error"
                    }
                };

                scope.close = function () {
                    scope.show = !scope.show;
                }
            }

        }
    }



})();

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
    AuthFactory.$inject = ["dbc", "$firebaseAuth", "$state", "$rootScope", "$firebaseArray", "$firebaseObject", "UsersRepositoryFactory"];
    
})();
;(function () {
    'use strict';

    angular.module('FitTreker.Fire', [
        'firebase'
    ])
    .factory('dbc', dbcFactory);

    // @ngInject
    function dbcFactory ($firebaseAuth, $firebaseArray, FIREBASE_URL) {
        var o = {};

        var reference = new Firebase(FIREBASE_URL);

        o.getRef = function () {
            return reference;
        };


        return o;
    }
    dbcFactory.$inject = ["$firebaseAuth", "$firebaseArray", "FIREBASE_URL"];

})();

;(function () {
    'use strict';
    angular.module('modal-dialog', [
        'ngAnimate'
    ])
        .directive('modalDialog',modalDialog);

    // Директива, которая создает и вызывает модальное окно.
    //@ngInject
    function modalDialog () {
        return {
            scope: {
                show: '=',
                settings: '='
            },
            replace: true,
            controller: 'HomeCtrl',
            controllerAs: 'hc',
            transclude: true,
            template: "<div class='ng-modal-dialog ' ng-show='show'><div class='ng-modal-dialog__overlay' ng-click='close()'></div><div class='popup' ng-class='{popupModal: show}' ng-transclud><ng-include  src='settings.templateUrl'></ng-include></div> </div>",
            priority: 1000,
            restrict: 'EA',// Можно использовать как атрибу и как элемент
            link: function(scope, element, attrs) {
                var width = scope.settings.width,
                    height = scope.settings.height,
                    overlay = angular.element(element.children()[0]),
                    popup = angular.element(element.children()[1]);

                // Закрытие модального окна по клику на темной зоне
                scope.close = function () {
                    scope.show = false;
                };
                // Задание основных стилей модальному окну
                overlay.css({
                    zIndex: 9999,
                    position: 'absolute',
                    left: 0,
                    top: 0,
                    width: '100%',
                    height: '100%',
                    background: 'rgba(0,0,0,.7)'
                });
                // Задание основных стилей оболочке модального окна.
                popup.css({
                    zIndex: 10000,
                    position: 'absolute',
                    width: width+ 'px',
                    height: height+ 'px',
                    marginLeft: -width/2 +'px',
                    marginTop: -height/2 + 'px',
                    left: '50%'
                });

            }

        }
    }

})();
;(function () {
    'use strict';
    angular.module('numberPicker', [ ])
    .directive('numberPicker',numberPicker)
    .controller('pickerCtrl', pickerCtrl);


    //@ngInject
    function pickerCtrl($scope) {
        var o = this;
        $scope.value = $scope.value | 0 ;
        $scope.minvalue = $scope.minvalue | 0;
        o.maxValueString = "";
        o.maxlength = o.maxlength | 3;

        if(!$scope.maxvalue) {
            for(var i = 0; i < $scope.maxlength; i++)
            {
                o.maxValueString = o.maxValueString + "9";
            }
            $scope.maxvalue = Number(o.maxValueString);
        }

        o.setValue = function (_directon) {
            if(_directon == "up")
            {
                if($scope.value < $scope.maxvalue)
                    $scope.value++;
            }
            else {
                if($scope.value > $scope.minvalue)
                    $scope.value--;
                else
                    $scope.value = $scope.minvalue;
            }
        }
    }
    pickerCtrl.$inject = ["$scope"];


    //@ngInject
    function numberPicker () {
        return {
            scope: {
                maxlength: "=",
                maxvalue: "=",
                value: '=',
                minvalue: "="
            },
            controller: 'pickerCtrl',
            controllerAs: 'piC',
            priority: 1000,
            replace: true,
            template: "<div class='number-picker'> \
                        <form class='form-picker' name='piC.formPicker'>\
                             <input type='text'\
                                name='picker' \
                                ng-model='value' \
                                ng-pattern='/^[0-9]{1,7}$/'\
                                ng-change='piC.validatePicker()' \
                                maxlength='{{maxlength}}'   \
                                disabled\
                                class='number-picker__field'> \
                        </form> \
                        <div class='number-picker__group number-picker__buttons'> \
                            <div class='number-picker__button button-picker'>\
                                <a ng-click='piC.setValue(\"up\")' class='button-picker__tungle top-tungle'></a>\
                            </div> \
                            <div class='number-picker__button button-picker'>\
                                <a ng-click='piC.setValue(\"down\")' class='button-picker__tungle bottom-tungle'></a>\
                            </div> \
                        </div> \
                    </div>",
            restrict: "EA",
            link: function (scope, element, attrs) {
                //console.log(scope.value);
            }
        }
    }

})();
;(function () {
    'use strict';
    angular.module('isArlikin.slider', [

    ])
        .directive('ngSlider',slider)
        .directive('ngSlide',slide)
        .controller('SliderCtrl', SliderCtrl);


    //@ngInject
    function SliderCtrl($scope,$interval) {
        var s = this;
        console.log("Controller");
        s.slide = {};
        s.slides = [];
        s.dots = [];
        s.activeSlide = null;
        s.dotsContainer = null;
        s.indexActive = 0;
        s.flag = true;
        s.timer = 5000;
        s.duration = $scope.duration;



        s.addSlide = function (scope, element) {
            s.slides.push(element);
            if(s.slides.length == 1)
                s.activeSlide(s.slides[0]);
        };

        s.activeSlide = function (active) {
            s.activeSlide = active;
            active.classList.add("slide-active");
        };

        s.addDot = function() {
            var dot = $(document.createElement('li'));
            s.dots.push(dot);
            if(s.dots.length == 1)
                dot.addClass('slider__dot slider__dot-active');
            else
                dot.addClass('slider__dot');
            s.dotsContainer.append(dot);

            return dot;
        };

        s.move = function(event) {
            var direction = event.target.classList.contains('rectungle-right') ? 'forward': 'backward',
                next = s.activeSlide.nextElementSibling || s.slides[0],
                prev = s.activeSlide.previousElementSibling || s.slides[s.slides.length - 1],
                slide = direction === "forward"? next : prev;

            s.moveDot(direction);
            s.moveSlide(slide, s.activeSlide,direction);


        };

        s.moveSlide = function (next,active,direction) {
            var slideWidth = active.offsetWidth,
                strafe = 0,
                positionSlide = 0;

            if(direction === 'forward') {
                positionSlide = slideWidth + 'px';
                strafe = - slideWidth;
            }
            else {
                positionSlide = -slideWidth + 'px';
                strafe =  slideWidth;
            }


            if(s.flag) {
                s.flag = false;
                next.style.left = positionSlide;
                next.classList.add('slide-inslide');
                $(next).animate({left: 0}, s.duration);
                $(active).animate({left: strafe}, s.duration,function(){
                    active.style.left = 0;
                    next.classList.remove('slide-inslide');
                    next.classList.add('slide-active');
                    s.activeSlide = next;
                    active.classList.remove('slide-active');
                    s.indexActive = $(next).index();
                    s.flag = true;

                });
            }

        };

        s.moveDot = function (direction) {
            var activeDot = s.dots[s.indexActive],
                nextDot = s.dots[s.indexActive + 1] || s.dots[0],
                backDot = s.dots[s.indexActive - 1] || s.dots[s.dots.length - 1];

            activeDot.removeClass('slider__dot-active');
            if(direction == 'forward')
                nextDot.addClass('slider__dot-active');
            else
                backDot.addClass('slider__dot-active');

        };

        s.clickDot = function (event) {
            var _this = $(this),
                activeDot = s.dots[s.indexActive],
                numberOfDot = _this.index(),
                duration = s.indexActive < numberOfDot? "forward": "backward";

            if(s.indexActive != _this.index()) {
                activeDot.removeClass('slider__dot-active');
                s.dots[numberOfDot].addClass('slider__dot-active');
                s.moveSlide(s.slides[numberOfDot], s.slides[s.indexActive],duration);
            }
        };

        s.autoSwitch = function () {
            s.intervalID = $interval(function () {
                var next = s.indexActive == (s.slides.length - 1)? s.slides[0]: s.slides[s.indexActive +1 ];
                s.moveDot("forward");
                s.moveSlide(next, s.slides[s.indexActive],"forward");
            }, s.timer) ;
        };

        // Автоматическое переключение слайдов.
        //s.autoSwitch();
    }
    SliderCtrl.$inject = ["$scope", "$interval"];

    //@ngInject
    function slider () {
        return {
            scope: {
                duration: '@'
            },
            replace: true,
            restrict: 'EA',
            priority: 1,
            transclude: true,
            template: "<div class='ng-slider-wrapper'> \
                            <div class='rectungle rectungle-left'></div> \
                            <div class='rectungle rectungle-right'></div> \
                            <ul class='ng-slider' ng-transclude> \
                            </ul> \
                            <ul class='slider__dots'>\
                            </ul>\
                        </div>",
            link: function (scope,element,attrs,SliderCtrl){
                var dotsContainer = element.find('ul')[1];
                var buttons = element[0].querySelectorAll('.rectungle');

                SliderCtrl.dotsContainer = angular.element(dotsContainer);
                buttons[0].addEventListener('click',SliderCtrl.move);
                buttons[1].addEventListener('click',SliderCtrl.move);

            },
            controller: "SliderCtrl",
            controllerAs: "sc"
        }
    }

    //@ngInject
    function slide (){
        return {
            require: '^ngSlider',
            scope: {},
            replace: true,
            transclude: true,
            priority: 100,
            restrict: 'EA',
            template: "<li class='ng-slider__item slide ' ng-transclude></li>",
            link: function (scope,element,attr,sliderController) {
                sliderController.addSlide(scope,element[0]);

                var dot = sliderController.addDot();
                dot.on('click',sliderController.clickDot)

            }
        }
    }

})();

;(function () {
    'use strict';
    angular
        .module('FitTreker.UsersRepository', [
            'FitTreker.Fire'
        ])
        .factory('UsersRepositoryFactory', UsersRepositoryFactory);

    // @ngInject
    function UsersRepositoryFactory (dbc, $firebaseArray) {
        var o = {};
        var ref = dbc.getRef();
        o.getAllUsers = function () {
            var refUsers = ref.child('users');

            return $firebaseArray(refUsers);

        };
        return o;
    }
    UsersRepositoryFactory.$inject = ["dbc", "$firebaseArray"];


})();
;(function () {
    'use strict';


    angular
    .module('FitTreker.Components.Workout', [
        'FitTreker.Fire'
    ])
    .factory('WorkoutFactory',WorkoutFactory);


    //@ngInject
    function WorkoutFactory (dbc, $firebaseArray, $firebaseObject, $timeout, $q) {
        var o = {};
        // Private
        var ref = dbc.getRef();
        var usersRef = ref.child('users');
        var exercisesRef = ref.child('exercises');
        var complexesRef = ref.child('complexes');
        var baseExercises = ref.child('baseExercises'); // Базовые упражнения, доступные всем пользователям
        var userComplexesRef = ref.child('userComplexes');

        // Public Function

        // Возвращает комплекс упражнений.
        // Получает id комплекса и флаг (базовый это комплекс или пользовательский)
        o.getComplexOnId = function (_idComplex, _base) {
            console.log(_idComplex);
            var complexe = {};
            var exercises = {};


            if(_base) {
                complexe = $firebaseObject(complexesRef.child(_idComplex));
            }
            else {
                complexe = $firebaseObject(userComplexesRef.child(_idComplex));
            }

            complexe.$loaded(function (_complexe) {
                angular.forEach(_complexe.exercises, function (val, keyEx) {
                    var userExercise = $firebaseObject(exercisesRef.child(keyEx));
                    exercises[keyEx] = userExercise;
                });
                complexe.exercises = [];
                angular.forEach(exercises, function (val, keyEx) {
                    complexe.exercises.push(exercises[keyEx]);
                });

            });
            return complexe;
        };

        // Возращает массив базовых комплексов упражнений
        o.getBaseComplexes = function () {
            var baseComplexes = $firebaseArray(complexesRef);
            var exercise;

            baseComplexes.$loaded(function (_baseComplexes) {

                for(var i = 0; i < baseComplexes.length; i++){
                    angular.forEach(baseComplexes[i].exercises, function (val, key) {
                        exercise = o.getBaseExercises(key);
                        baseComplexes[i].exercises[key] = exercise;
                    });
                }

            });

            return baseComplexes;
        };

        // Возвращает базовое упражнение, которе можно найти по переданному ключу
        o.getBaseExercises = function (_key) {
            return  $firebaseObject(baseExercises.child(_key));
        };

        // Получение комплекса упражнений по ключу этого комплекса
        // Ключ комплекса упр хранится у пользователя.
        o.getUserComplexes = function (_key) {
            return $firebaseObject(userComplexesRef.child(_key));
        };

        // Возвращает пользовательское упражнение
        o.getUserExercise = function (_key) {
            return  $firebaseObject(exercisesRef.child(_key));
        };

        o.getComplexes = function (_currentUser, _start, _len) {
            var exercises = $firebaseObject(baseExercises);
            var exercise;
            var userExercise;
            var userComplexes = [];
            var defered = $q.defer();
            var test = [];
            var index = 0;

            //user.$loaded(function(){

                // Добавление в итоговый массив, тех комплексов упражненией, которые были созданны
                // пользователем.
                // Добавление в готовый массив, новых комплексов происходит после загрузки массива с базовыми
                // комплексами
                angular.forEach(_currentUser.userComplexes, function (val, key) {
                    if(index > 0 && index <= _len) {
                        index++;
                        userComplexes = o.getUserComplexes(key);



                        //// Добавление в пользовательские комплексы упражнений
                        //// То бишь подгрузка упражнений, по существующим ключам
                        //userComplexes.$loaded(function (_userComplexes) {
                        //    angular.forEach(_userComplexes.exercises, function (val, keyEx) {
                        //        userExercise = o.getUserExercise(keyEx);
                        //        _userComplexes.exercises[keyEx] = userExercise;
                        //    });
                        //
                        //
                        //});

                        userComplexes.$watch(function(_idUpdateComplexe){
                            console.log("Упражнения в комлпксе изменились!");

                            var temp = o.getUserComplexes(_idUpdateComplexe.key);
                            temp.$loaded(function (_userComplexes) {
                                angular.forEach(temp.exercises, function (val, keyEx) {
                                    userExercise = o.getUserExercise(keyEx);
                                    temp.exercises[keyEx] = userExercise;
                                });

                            });

                            for(var i = 0, l = test.length; i < l ; i++) {
                                if(test[i].$id == temp.$id) {
                                    test[i] == temp;

                                }
                            }

                            //userComplexes.$loaded(function (_userComplexes) {
                            //    console.log(_userComplexes);
                            //    angular.forEach(_userComplexes.exercises, function (val, keyEx) {
                            //        userExercise = o.getUserExercise(keyEx);
                            //        _userComplexes.exercises[keyEx] = userExercise;
                            //    });
                            //
                            //
                            //});

                        });

                        test.push(userComplexes);
                    }
                    if(_start == key) {
                        index++;
                    }
                });
                defered.resolve(test);

            //});


            return defered.promise;

        };

        //o.getComplexes = function (_currentUser, _start, _len) {
        //    var complexes = o.getBaseComplexes();
        //    var exercises = $firebaseObject(baseExercises);
        //    var exercise;
        //    var userExercise;
        //    var userComplexes;
        //
        //    var userRef = usersRef.child(_currentUser.uid).child('userComplexes')
        //        .orderByKey()
        //        .startAt(_start)
        //        .limitToFirst(_len);
        //    var user = $firebaseObject(userRef);
        //
        //
        //    complexes.$loaded(function (_complexes) {
        //
        //        complexes.$watch(function (_ref) {
        //            for(var i = 0; i < _complexes.length; i++){
        //                angular.forEach(_complexes[i].exercises, function (val, key) {
        //                    exercise = o.getBaseExercises(key);
        //                    complexes[i].exercises[key] = exercise;
        //                });
        //            }
        //        });
        //
        //        for(var i = 0; i < _complexes.length; i++){
        //            angular.forEach(_complexes[i].exercises, function (val, key) {
        //                exercise = o.getBaseExercises(key);
        //                complexes[i].exercises[key] = exercise;
        //            });
        //        }
        //
        //        //user.$watch(function() {
        //        //    // Добавление в итоговый массив, тех комплексов упражненией, которые были созданны
        //        //    // пользователем.
        //        //    // Добавление в готовый массив, новых комплексов происходит после загрузки массива с базовыми
        //        //    // комплексами
        //        //    angular.forEach(user, function (val, key) {
        //        //        userComplexes = o.getUserComplexes(key);
        //        //
        //        //        // Добавление в пользовательские комплексы упражнений
        //        //        // То бишь подгрузка упражнений, по существующим ключам
        //        //        userComplexes.$loaded(function (_userComplexes) {
        //        //            angular.forEach(_userComplexes.exercises, function (val, keyEx) {
        //        //                userExercise = o.getUserExercise(keyEx);
        //        //                _userComplexes.exercises[keyEx] = userExercise;
        //        //            });
        //        //        });
        //        //
        //        //        var flag = false;
        //        //
        //        //        for(var i = 0; i < complexes.length; i++) {
        //        //            if(complexes[i].$id == userComplexes.$id)
        //        //            {
        //        //                flag = true;
        //        //                break;
        //        //            }
        //        //        }
        //        //        if(!flag)
        //        //            complexes.push(userComplexes);
        //        //    });
        //        //});
        //
        //        // Добавление в итоговый массив, тех комплексов упражненией, которые были созданны
        //        // пользователем.
        //        // Добавление в готовый массив, новых комплексов происходит после загрузки массива с базовыми
        //        // комплексами
        //        angular.forEach(user, function (val, key) {
        //            userComplexes = o.getUserComplexes(key);
        //
        //            userComplexes.$watch(function(){
        //                console.log("Упражнения в комлпксе изменились!");
        //                userComplexes.$loaded(function (_userComplexes) {
        //                    angular.forEach(_userComplexes.exercises, function (val, keyEx) {
        //                        userExercise = o.getUserExercise(keyEx);
        //                        _userComplexes.exercises[keyEx] = userExercise;
        //                    });
        //                });
        //
        //            });
        //
        //            // Добавление в пользовательские комплексы упражнений
        //            // То бишь подгрузка упражнений, по существующим ключам
        //            userComplexes.$loaded(function (_userComplexes) {
        //                angular.forEach(_userComplexes.exercises, function (val, keyEx) {
        //                    userExercise = o.getUserExercise(keyEx);
        //                    _userComplexes.exercises[keyEx] = userExercise;
        //                });
        //            });
        //
        //            complexes.push(userComplexes);
        //        });
        //
        //    });
        //
        //
        //    return complexes;
        //};

        //o.getTest = function (_currentUser, _start, _len) {
        //    console.log(_start, _len);
        //    var refTest = usersRef.child(_currentUser.uid).child('userComplexes')
        //        .orderByKey()
        //        .startAt(_start)
        //        .limitToFirst(_len);
        //
        //    return $firebaseObject(refTest);
        //};

        // Получение всех упражнений, вне зависимости от комлексов
        o.getAllExercise = function(_currentUser) {
            var exercises = $firebaseObject(baseExercises); // Получение базовых упражнений
            var userExercise;

            exercises.$loaded(function (_exercises) {

                // Установка ключей базовым упражнениям
                // Для того чтобы их было удобно удалять
                angular.forEach(exercises, function (val, key) {
                    val.$id = key;

                });

                angular.forEach(_currentUser.exercises, function (val, key) {
                    userExercise = o.getUserExercise(key);
                    exercises[userExercise.$id] = userExercise;
                });
            });

            return exercises;
        };

        o.addNewUserComplex = function (_complexe, _idUser) {
            var complexes = $firebaseArray(ref.child('userComplexes'));

            angular.forEach(_complexe.exercises, function (val, key) {
                _complexe.exercises[key] = true;
            });
            complexes.$add(_complexe).then(function (_complexeRef) {
                o.addComplexInUser(_complexeRef.key(), _idUser);
            });
        };

        o.addComplexInUser = function (_idComplexe, _idUser) {
            var userComplexes = $firebaseObject(usersRef.child(_idUser).child("userComplexes"));

            userComplexes.$loaded(function () {
                userComplexes[_idComplexe] = true;
                userComplexes.$save();
            });
        };

        // Обновляет запись в БД
        o.updateUserComplexe = function (_complexe, _idUser) {
            angular.forEach(_complexe.exercises, function (val, key) {
                _complexe.exercises[key] = true;
            });
            _complexe.$save();
            o.addComplexInUser(_complexe.$id, _idUser);
        };

        // Удаление данных предидущего запроса
        o.clearList = function () {
            o.complexes =[];
        };

        o.deleteUserComplexe = function (_complexe, _idUser) {
            var complexeInUser = $firebaseObject(usersRef.child(_idUser).child('userComplexes').child(_complexe.$id));
            // Удаление комплекса упражнений в БД.
            _complexe.$remove();
            // Удаление ключа этого комплекса у пользователя
            complexeInUser.$remove();


        };

        o.getMoreComplexes = function (_currentUser, _last, _count) {

        };

        //********************************************************
        //************* Start Block Exercises ********************
        //********************************************************

        o.getAllUserExercises = function (_currentUser) {
            var exercises = [];
            var baseExercisesArray = [];
            var user = $firebaseObject(usersRef.child(_currentUser.$id));
            var flag = false;

            // Получение и добавление в исходный массив, всех базовых упражнение
            baseExercisesArray = $firebaseObject(baseExercises);
            baseExercisesArray.$loaded(function () {
                angular.forEach(baseExercisesArray, function (val, key) {
                   exercises.push(baseExercisesArray[key]);
                });
            });

            user.$watch(function () {
                angular.forEach(user.exercises, function (val, key) {
                    // Флаг в положении false означает, что не было найдено упражненией
                    // в общем списке упражнений с таким же ключем (т.е. одинаковыых)
                    // true -> упражнение не добавляем
                    // false -> упражнение добавляем
                    // Изначально флаг в положении false (упражнение уникальное)
                    flag = false;
                    for (var i = 0; i < exercises.length; i++) {

                        if (exercises[i].$id == key && !exercises[i].base) {
                            flag = true;
                        }

                    }
                    if(!flag)
                        exercises.push(o.getUserExercise(key));

                })
            });

            //// Добавляет в исходный массив упражненией те упражнения, которые создал
            //// сам пользователь
            //if('exercises' in _currentUser) {
            //    angular.forEach(_currentUser.exercises, function (val, key) {
            //        exercises.push(o.getUserExercise(key));
            //    })
            //}
            return exercises;
        };

        o.saveExercise = function (_exercise, _currentUser) {
            var exercises;
            var userExercises = $firebaseObject(usersRef.child(_currentUser.uid).child("exercises"));

            // Базовые показатели, пока что они определяются тут, позже необходимо будет вынести
            // их в бд
            _exercise.src = "app/img/base-exercises/base.jpg";
            // Сохранения времени между упражнениями
            _exercise.transition = 10;

            if(_exercise.$id){
                exercises = $firebaseObject(exercisesRef.child(_exercise.$id));
                exercises = _exercise;
                exercises.$save();
            }
            else {
                exercises = $firebaseArray(exercisesRef);

                exercises.$add(_exercise).then(function (_ref) {
                    userExercises[_ref.key()] = true;
                    userExercises.$save();
                });
            }

        };

        o.deleteUserExercise = function (_exercise,_userId) {
            var currentUser = $firebaseObject(usersRef.child(_userId));
            $firebaseObject(exercisesRef.child(_exercise.$id)).$remove();
            currentUser.$loaded(function (_currentUser) {
                var complexesKeys = _currentUser.userComplexes;
                $firebaseObject(usersRef.child(_userId).child("exercises/" + _exercise.$id)).$remove();
                o.deleteExerciseInComplexe(complexesKeys, _exercise.$id);
            });
        };

        o.deleteExerciseInComplexe = function (_ComplexesKeys,_idExercise) {
            angular.forEach(_ComplexesKeys, function (val, key) {
                $firebaseObject(userComplexesRef.child(key).child("exercises/" + _idExercise)).$remove();
            });
        };
        //********************************************************
        //*************** End Block Exercises ********************
        //********************************************************

        o.complexes = [];

        return o;
    }
    WorkoutFactory.$inject = ["dbc", "$firebaseArray", "$firebaseObject", "$timeout", "$q"];
})();
;(function () {
    'use strict';

    angular.module('FitTreker.Exercises', [
        'ui.router',
        'ui.bootstrap',
        'FitTreker.Components.Workout',
        'numberPicker'
    ])
    .config(Config)
    .controller('ExercisesCtrl', ExercisesCtrl)
    .controller('ExerciseModalCtrl', ExerciseModalCtrl);

    //@ngInject
    function ExercisesCtrl($scope,$q, WorkoutFactory,$modal, currentUser) {
        var s = this;
        var modalInstance;
        // Возвращает масив в котором находится масив всех упражнений пользователя.
        // Включаются, как базовые, так и обычные упражнения
        s.baseExercise = WorkoutFactory.getAllUserExercises(currentUser);

        s.addNewExercise = function (exercise) {
            modalInstance = $modal.open({
                animation: false,
                windowClass: "modalAnimation",
                templateUrl: 'app/common/new-exercise.tpl.html',
                controller: 'ExerciseModalCtrl',
                controllerAs: 'emc',
                resolve: {
                    currentUser: function () {
                        return currentUser;
                    },
                    exercise: function () {
                        return exercise;
                    }
                }

            });
        };

        s.showExercise = function (exercise,$event) {
            if(!exercise.base) {
                $event.preventDefault();
                s.addNewExercise(exercise);
            }
        };

        // Удаляет элемент из массива упражнений
        // Вызывает функцию, которая удаляет из БД запись од этом упр и
        // удаляет у текущего пользователя ключ, ссылающийся на это упр.
        s.deleteExercise = function (exercise, index) {
            WorkoutFactory.deleteUserExercise(exercise,currentUser.uid);
            s.baseExercise.splice(index,1);
        };

        s.getCountComplexes = function () {
            if("userComplexes" in currentUser)
                return Object.keys(currentUser.userComplexes).length;
            else
                return 0;
        };

    }
    ExercisesCtrl.$inject = ["$scope", "$q", "WorkoutFactory", "$modal", "currentUser"];

    //@ngInject
    function ExerciseModalCtrl ($scope,exercise,currentUser, WorkoutFactory) {
        var s = this;
        s.exercise = exercise;

        // Количество подходов в упражнении по умолчанию
        s.approach = 4;
        // Количество раз, которе необходимо сделать данное упражнение
        s.step = 10;
        // Настройка времени
        $scope.quantity = {
            min: 2,
            sec: 1
        };
        // Настройка продолжительности упражнения по умолчанию
        $scope.timeStep = {
            min: 1,
            sec: 10
        };

        // Ватчер следит за тем, чтобы вовремя секнуды преобразовывались в минуты
        $scope.$watch('quantity.sec', function (newVal, oldVal) {
            s.timeCounter(newVal, oldVal);
        }, true);

        // Данный вотчер следит за тем, что вовремя секунды преобразовывались в минуты
        // для поля timeStep
        $scope.$watch('timeStep.sec', function (newVal, oldVal) {
            s.timeCounter(newVal, oldVal);
        }, true);

        // Влияет на то, какая кнопка добавляется в форму редактирования упр.
        // При добавлении нового упр - кнопка "Добавить"
        // При редактировании нового упр - кнопка "Сохранить"
        if(exercise)
            s.base = false;
        else
            s.base = true;

        s.saveExercise = function () {
            $scope.$close();
            s.exercise.approach = s.approach;
            s.exercise.step = s.step;
            s.exercise.quantity = s.covertTime($scope.quantity);
            s.exercise.timeStep = s.covertTime($scope.timeStep);

            WorkoutFactory.saveExercise(s.exercise,currentUser);
        };

        s.covertTime = function (time) {
            return time.min * 60 + time.sec;
        };

        s.timeCounter = function (newVal, oldVal) {
            if((newVal == 60) && (oldVal == 59)) {
                $scope.quantity.min++;
                $scope.quantity.sec = 0;
            }
            if(newVal == 0 && oldVal != 60) {
                if($scope.quantity.min > 0) {
                    $scope.quantity.min--;
                    $scope.quantity.sec = 59;
                }
                else
                    $scope.quantity.sec = 0;
            }
        };
    }
    ExerciseModalCtrl.$inject = ["$scope", "exercise", "currentUser", "WorkoutFactory"];

    function Config ($stateProvider) {
        $stateProvider
            .state('exercises',{
                resolve: {
                    currentUser: /*@ngInject*/["AuthFactory", function(AuthFactory) {
                        // Проверка на авториацию
                        return AuthFactory.require().then(function (_authData) {
                            return AuthFactory.getCurrentUser(_authData.uid);
                        });
                    }]
                },
                url: '/exercises',
                templateUrl: 'app/exercises/exercises.tpl.html',
                controller: 'ExercisesCtrl',
                controllerAs: 'ec'
            });
    }
    Config.$inject = ["$stateProvider"];
})();
;(function (){
    'use strict';
    angular
        .module('FitTreker.Home',[
            'ui.router',
            'FitTreker.Fire',
            'modal-dialog', // Собственная директива модального окна
            'isArlikin.slider',
            'ngAnimate'
        ])
        .config(Config)
        .controller('HomeCtrl', HomeCtrl)
        .controller('CarouselCtrl', CarouselCtrl)
        .directive('email', emailValidation)
        .controller('AboutCarouselCtrl', AboutCarouselCtrl);

    //@ngInject
    function HomeCtrl ($scope,$modal,$rootScope, $log,AuthFactory,$state) {
        var s = this;
        $log.debug("=== Home Ctrl ===");
        // Для слайдера
        s.duration = 500;
        s.slides = [
            {
                src: 'app/img/img1.jpg',
                alt: '1 картинка'
            },
            {
                src: 'app/img/img2.jpg',
                alt: '2 картинка'
            },
            {
                src: 'app/img/img3.jpg',
                alt: '3 картинка'
            },
            {
                src: 'app/img/img4.jpg',
                alt: '4 картинка'
            },
            {
                src: 'app/img/img5.jpg',
                alt: '5 картинка'
            }
        ];

        $scope.show = false;
        $scope.settings = {
            width: 410,
            height: 410,
            templateUrl: 'app/common/signin.tpl.html',
            ctrl: 'HomeCtrl',
            ctrlAs: 'hc'
        };
        // Закрытие модального окна.
        // Помещаю в $rootScope для того, чтобы была возможность вызывать этот метод
        // из любой части приложения
        $rootScope.close = function() {
            $scope.close();
        };
        // Управление модальным окном.
        $rootScope.open = function (modal) {
            if(modal == 'auth'){
                $scope.settings = {
                    width: 410,
                    height: 410,
                    templateUrl: 'app/common/signin.tpl.html'
                };
                $scope.show = !$scope.show;
            }
            else {
                $scope.settings = {
                    width: 410,
                    height: 426,
                    templateUrl: 'app/common/signup.tpl.html'
                };
                $scope.show = !$scope.show;
            }
        };


        function clean () {
            s.user = {
                email: '',
                password: '',
                fullName: ''
            };
        }

        clean();

        s.registration = function () {
            AuthFactory.createUser(s.user);
        };

        s.facebookSignIn = function () {
            AuthFactory
                .authWithFacebook();
        };

        s.facebookSignUp = function () {
            AuthFactory
                .RegistrationWithFacebook();

        };

        s.authorisation = function () {
            AuthFactory.auth(s.user);
        };
    }
    HomeCtrl.$inject = ["$scope", "$modal", "$rootScope", "$log", "AuthFactory", "$state"];

    //@ngInject
    function emailValidation () {
        return {
            require: 'ngModel',
            link: function (scope, elem, attrs, ctrl) {
                // Данное решение было описано в одной очень популярной статье на хабре
                // Все, что сверх этого - стрельба из пушки по воробьям
                var emailRegExp = /.+@.+\..+/i;

                ctrl.$validators.email = function (modelValue, viewValue) {
                    // Пустое значение не является валидным
                    if(ctrl.$isEmpty(modelValue))
                        return false;

                    if(emailRegExp.test(viewValue))
                        return true;

                    console.log("Неверно!!!");
                    // Иначе значение, введенное пользователем недопустимо!
                    return false;

                }
            }
        }
    }

    //@ngInject
    function CarouselCtrl ($scope) {
        $scope.myInterval = 5000;
        $scope.noWrapSlides = false;
        var slides = $scope.slides = [];
        $scope.addSlide = function() {
            var newWidth = 1900 + slides.length + i;
            slides.push({
                image: 'app/img/fon' + i + '.jpg'
            });
        };

        for (var i=0; i<3; i++) {
            $scope.addSlide();
        }
    }
    CarouselCtrl.$inject = ["$scope"];

    //@ngInject
    function AboutCarouselCtrl ($scope) {
        $scope.$slideIndex = 0;
        $scope.slides = [
            { 'image': 'app/img/slide_about0.jpg'},
            { 'image': 'app/img/slide_about1.jpg'}
        ];

    }
    AboutCarouselCtrl.$inject = ["$scope"];


    //@ngInject
    function Config ($stateProvider) {
        $stateProvider
            .state('home',{
                url: '/',
                templateUrl: 'app/home/home.html',
                controller: 'HomeCtrl',
                controllerAs: 'hc'
            })
            .state('about',{
                url: '/#about'
            });
    }
    Config.$inject = ["$stateProvider"];


})();
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
    ProfileFactory.$inject = ["dbc", "$firebaseObject"];




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
    ProfileCtrl.$inject = ["Profile", "AuthFactory", "$scope", "$rootScope", "$timeout", "user", "$mdDatePicker", "$mdDateLocale"];


    //@ngInject
    function Config($stateProvider,$mdDateLocaleProvider) {
        $stateProvider.
            state('profile',{
                resolve: {
                    auth: /*@ngInject*/["AuthFactory", function(AuthFactory) {
                        return AuthFactory.require();
                    }],
                    user: /*@ngInject*/["$stateParams", "Profile", function($stateParams,Profile) {
                        return Profile.getUser($stateParams.id);
                    }]

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
    Config.$inject = ["$stateProvider", "$mdDateLocaleProvider"];

})();
;(function () {
    'use strict';
    angular.module('FitTreker.Statistic', [
        'ui.router'
    ])
        .config(Config)
        .controller('StatisticCtrl', StatisticCtrl);


    //@ngInject
    function StatisticCtrl($scope) {
        var s = this;
    }
    StatisticCtrl.$inject = ["$scope"];

    function Config ($stateProvider) {
        $stateProvider
            .state('statistic',{
                url: '/statistic',
                templateUrl: 'app/statistic/statistic.tpl.html',
                controller: 'StatisticCtrl',
                controllerAs: 'sc'
            });
    }
    Config.$inject = ["$stateProvider"];
})();
;(function () { angular.module("templates", []).run(["$templateCache", function($templateCache) {$templateCache.put("create-complexe.tpl.html","<form method=\"POST\" name=\"newExercise\" class=\"form form-newExerciese\" >\n    <div class=\"form__header\">\n        {{ (cmc.create && cmc.newComplex.name) || \"Создай свой комплекс упражнений\" }}\n    </div>\n    <div class=\"form-container\">\n        <label for=\"name\" class=\"form-label name-label\">Название комплекса</label>\n        <input type=\"text\"\n               ng-model=\"cmc.newComplex.name\"\n               name=\"name\"\n               id=\"name\"\n               minlength=\"3\"\n               maxlength=\"70\"\n               ng-class=\"\"\n               placeholder=\"Название комплекса\"\n               required\n               class=\"input\">\n    </div>\n    <!--<div class=\"form-container\">-->\n        <!--<label for=\"src\" class=\"form-label\">Картинка</label>-->\n        <!--<input type=\"text\"-->\n               <!--ng-model=\"cmc.newComplex.src\"-->\n               <!--name=\"src\"-->\n               <!--id=\"src\"-->\n               <!--placeholder=\"URL картинки\"-->\n               <!--class=\"input\">-->\n    <!--</div>-->\n    <div class=\"exercises clearfix\">\n        <div class=\"exercises__left-column\">\n            <div class=\"exercise-list__header\">Список всех упражнений</div>\n            <ul class=\"exercises-list\">\n                <li class=\"exercises-list__item\"\n                    ng-class=\"{\'base-exercise\': exercise.base}\"\n                    ng-repeat=\"exercise in cmc.exercises\">\n                    {{exercise.name}} <span class=\"add-ex\" ng-click=\"cmc.addExerciseInList(exercise)\">+</span>\n                </li>\n            </ul>\n        </div>\n        <div class=\"exercises__right-column\">\n            <div class=\"exercise-list__header\">Упражнения в комплексе</div>\n            <ul class=\"exercises-list\">\n                <li class=\"exercises-list__item\"\n                    ng-class=\"{\'base-exercise\': exercise.base}\"\n                    ng-repeat=\"exercise in cmc.newExercises\">\n                    {{exercise.name}}<span class=\"del-ex\" ng-click=\"cmc.deleteExerciseInList(exercise.$id,exercise)\">-</span>\n                </li>\n            </ul>\n        </div>\n    </div>\n    <button class=\"button add-new-complexe\"\n            ng-class=\"{disabled: newExercise.name.$invalid || cmc.errors.exerciseLenght}\"\n            ng-disabled=\"cmc.errors.exerciseLenght || newExercise.name.$invalid\"\n            ng-click=\"!cmc.create ? cmc.saveComplexe() : cmc.updateComplexe()\">Сохранить комплекс!</button>\n    <!--<pre>{{cmc | json}}</pre>-->\n</form>");
$templateCache.put("menu.html","<div class=\"navbar  navbar-fixed-top\" role=\"navigation\" ng-controller=\"NavbarCtrl as nbc\">\r\n    <div class=\"navbar__container\">\r\n        <div class=\"navbar-header\">\r\n            <button type=\"button\" class=\"navbar-toggle\" data-toggle=\"collapse\" data-target=\".navbar-collapse\">\r\n                <span class=\"sr-only\"></span>\r\n                <span class=\"icon-bar\"></span>\r\n                <span class=\"icon-bar\"></span>\r\n                <span class=\"icon-bar\"></span>\r\n            </button>\r\n            <a class=\"navbar-brand\" ng-if=\"!isUserLogged\" href=\"#\">Fitness Tracker</a>\r\n        </div>\r\n        <div class=\"navbar-collapse collapse\">\r\n            <!-- Меню неавторизированного пользователя -->\r\n            <ul class=\"nav navbar-nav navbar-right menu-list\" ng-if=\"!isUserLogged\">\r\n                <li class=\"menu-list__item\"><a class=\"menu__href\" ui-sref=\"home\">Home</a></li>\r\n                <li class=\"menu-list__item\"><a class=\"menu__href\" ui-sref=\"about\">About</a></li>\r\n                <li class=\"menu-list__item\"><a class=\"menu__href\" ng-click=\"open(\'auth\')\">{{mc.sign}}</a></li>\r\n            </ul>\r\n\r\n            <!-- Меня авторизированного пользователя -->\r\n            <ul class=\"nav navbar-nav navbar-left menu-list\" ng-if=\"isUserLogged\">\r\n                <li class=\"menu-list__item\"><a  ui-sref=\"workout\" class=\"menu__href\">Тренировка</a></li>\r\n                <li class=\"menu-list__item\"><a  ui-sref=\"exercises\" class=\"menu__href\">Мои Упражнения</a></li>\r\n                <li class=\"menu-list__item\"><a  ui-sref=\"statistic\" class=\"menu__href\">Упражнения</a></li>\r\n                <li class=\"menu-list__item\"><a  ui-sref=\"profile({id:currentUser.uid})\" class=\"menu__href\">Профиль</a></li>\r\n            </ul>\r\n            <ul class=\"nav navbar-nav navbar-right menu-list\" ng-if=\"isUserLogged\">\r\n                <li class=\"menu-list__item\" ><a class=\"menu__href\" ui-sref=\"profile({id:currentUser.id})\">{{currentUser.fullName}}</a></li>\r\n                <li class=\"menu-list__item\" ng-if=\"isUserLogged\"><a class=\"menu__href\"  ng-click=\"nbc.logOut()\">Log Out</a></li>\r\n            </ul>\r\n        </div><!--/.nav-collapse -->\r\n    </div>\r\n</div>\r\n");
$templateCache.put("new-exercise.tpl.html","<form method=\"POST\" name=\"newExercise\" class=\"form form-newExerciese\">\n    <div class=\"form__header\">\n        Создайте свое собственное упражнение!\n    </div>\n    <div class=\"form-container\">\n        <label for=\"name\" class=\"form-label name-label\">Название упражнения</label>\n        <input type=\"text\"\n               ng-model=\"emc.exercise.name\"\n               name=\"name\"\n               id=\"name\"\n               minlength=\"3\"\n               maxlength=\"60\"\n               ng-class=\"{error: newExercise.name.$invalid && newExercise.name.$dirty,\n                          success:  newExercise.name.$valid && newExercise.name.$dirty}\"\n               required\n               placeholder=\"Название упражнения\"\n               class=\"input exercise-name\">\n    </div>\n    <div class=\"form-container form-picker\">\n        <label class=\"form-label\">Количество подходов</label>\n        <div class=\"exercise-approach input-field\">\n            <number-picker maxlength=\"2\" maxvalue=\"10\" value=\"emc.approach\"></number-picker>\n        </div>\n        <!--<input type=\"text\"-->\n               <!--ng-model=\"emc.exercise.approach\"-->\n               <!--name=\"approach\"-->\n               <!--id=\"approach\"-->\n               <!--placeholder=\"Сколько подходов?\"-->\n               <!--class=\"input exercise-approach\">-->\n    </div>\n    <div class=\"form-container\">\n        <label class=\"form-label\">Отдых</label>\n        <div class=\"exercise-quantity input-field time-picker\">\n            <div class=\"time-picker__group time-picker__group-left\">\n                <number-picker maxlength=\"2\" maxvalue=\"59\" minvalue=\"0\" value=\"quantity.min\"></number-picker>\n                <div class=\"time-picker__description time-picker__min\"> мин. </div>\n            </div>\n            <div class=\"time-picker__group time-picker__group-right\">\n                <number-picker maxlength=\"2\" maxvalue=\"60\" minvalue=\"0\" value=\"quantity.sec\" ></number-picker>\n                <div class=\"time-picker__description time-picker__sec\"> с. </div>\n            </div>\n        </div>\n        <!--<input type=\"text\"-->\n               <!--ng-model=\"emc.exercise.quantity\"-->\n               <!--name=\"quantity\"-->\n               <!--id=\"quantity\"-->\n               <!--placeholder=\"Отдых между упражнениями\"-->\n               <!--class=\"input exercise-quantity\">-->\n    </div>\n    <div class=\"form-container\">\n        <label class=\"form-label\">Количество раз</label>\n        <div class=\"exercise-step input-field\">\n            <number-picker maxlength=\"2\" maxvalue=\"10\" value=\"emc.step\"></number-picker>\n        </div>\n        <!--<input type=\"text\"-->\n               <!--ng-model=\"emc.exercise.step\"-->\n               <!--name=\"step\"-->\n               <!--id=\"step\"-->\n               <!--placeholder=\"Количество раз\"-->\n               <!--class=\"input exercise-step\">-->\n    </div>\n    <div class=\"form-container\">\n        <label class=\"form-label\">Время подхода</label>\n        <div class=\"exercise-timeStep input-field time-picker\">\n            <div class=\"time-picker__group time-picker__group-left\">\n                <number-picker maxlength=\"2\" maxvalue=\"59\" minvalue=\"0\" value=\"timeStep.min\"></number-picker>\n                <div class=\"time-picker__description time-picker__min\"> мин. </div>\n            </div>\n            <div class=\"time-picker__group time-picker__group-right\">\n                <number-picker maxlength=\"2\" maxvalue=\"60\" minvalue=\"0\" value=\"timeStep.sec\" ></number-picker>\n                <div class=\"time-picker__description time-picker__sec\"> с. </div>\n            </div>\n        </div>\n        <!--<input type=\"text\"-->\n               <!--ng-model=\"emc.exercise.timeStep\"-->\n               <!--name=\"timeStep\"-->\n               <!--id=\"timeStep\"-->\n               <!--class=\"input exercise-timeStep\">-->\n    </div>\n    <div class=\"form-container\">\n        <label for=\"video\" class=\"form-label\">Ссылка на видео</label>\n        <input type=\"text\"\n               ng-model=\"emc.exercise.video\"\n               name=\"video\"\n               id=\"video\"\n               placeholder=\"Ссылка с youtobe\"\n               class=\"input exercise-video\">\n    </div>\n    <!--<div class=\"form-container\">-->\n        <!--<label for=\"src\" class=\"form-label\">Картинка</label>-->\n        <!--<input type=\"text\"-->\n               <!--ng-model=\"emc.exercise.src\"-->\n               <!--name=\"src\"-->\n               <!--id=\"src\"-->\n               <!--class=\"input exercise-\">-->\n    <!--</div>-->\n    <button class=\"button add-new-exercise\"\n         ng-if=\"emc.base\"\n         ng-class=\"{disabled: newExercise.$invalid}\"\n         ng-disabled=\"newExercise.$invalid\"\n         ng-click=\"emc.saveExercise()\">Добавить упражнение!</button>\n    <button class=\"button add-new-exercise\"\n         ng-if=\"!emc.base\"\n         ng-class=\"{disabled: newExercise.$invalid}\"\n         ng-disabled=\"newExercise.$invalid\"\n         ng-click=\"emc.saveExercise()\">Сохранить изменения!</button>\n    <!--<pre>{{ newExercise | json }}</pre>-->\n</form>");
$templateCache.put("signin.tpl.html","<form  method=\"POST\" class=\"form\"   name=\"user\" ng-submit=\"hc.authorisation()\" novalidate>\r\n    <div class=\"form-container\">\r\n        <div class=\"form__head clearfix\">\r\n            <div class=\"left form__head-header\">Authorisation</div>\r\n            <div class=\" right form__head-redirect\">\r\n                <a  class=\"sign-up\" ng-click=\"open(\'registr\')\"> Sign Up</a>\r\n            </div>\r\n        </div>\r\n        <div class=\"form__socials clearfix\">\r\n            <a class=\"social_fb\" ng-click=\"hc.facebookSignIn()\">Log in Fasebook</a>\r\n            <a class=\"social_vk\">Log in Vkontakte</a>\r\n        </div>\r\n        <div class=\"separator\">or</div>\r\n        <div class=\"form-input-field clearfix\">\r\n            <div class=\"input-container\">\r\n                <input class=\"input input-email\"\r\n                       type=\"email\"\r\n                       name=\"email\"\r\n                       ng-model=\"hc.user.email\"\r\n                       ng-class=\"{\'error\':user.email.$invalid && user.$dirty}\"\r\n                       required\r\n                       placeholder=\"Email\">\r\n            </div>\r\n            <div class=\"input-container\">\r\n                <input class=\"input input-password\"\r\n                       type=\"password\"\r\n                       name=\"password\"\r\n                       ng-model=\"hc.user.password\"\r\n                       required\r\n                       min=\"1\"\r\n                       max=\"12\"\r\n                       placeholder=\"Password\">\r\n            </div>\r\n            <a href=\"#\" class=\"forgot-pas\"> Forgot password?</a>\r\n            <div class=\"input-container remember-me\">\r\n                <input  type=\"checkbox\" name=\"remember\">\r\n                <div  class=\"remember\" for=\"remember\"> Remember me? </div>\r\n            </div>\r\n            <input type=\"submit\"\r\n                   ng-class=\"{disabled: user.$invalid}\"\r\n                   class=\"input submit\"\r\n                   ng-disabled=\"user.$invalid\"\r\n                   value=\"Sign In\">\r\n        </div>\r\n        <pre> {{user | json}}</pre>\r\n    </div>\r\n</form>");
$templateCache.put("signup.tpl.html","<form  method=\"POST\" class=\"form\" name=\"createUser\" novalidate ng-submit=\"hc.registration()\">\r\n    <div class=\"form-container\">\r\n        <div class=\"form__head clearfix\">\r\n            <div class=\"left form__head-header\">Registration</div>\r\n            <div class=\" right form__head-redirect\">\r\n                <a ng-click=\"open(\'auth\')\" class=\"sign-up\"> Sign In</a>\r\n            </div>\r\n        </div>\r\n        <div class=\"form__socials clearfix\">\r\n            <a class=\"social_fb\" ng-click=\"hc.facebookSignUp()\">Log in Fasebook</a>\r\n            <a class=\"social_vk\">Log in Vkontakte</a>\r\n        </div>\r\n        <div class=\"separator\">or</div>\r\n        <div class=\"form-input-field clearfix\">\r\n            <div class=\"input-container\">\r\n                <input class=\"input input-email\"\r\n                       type=\"email\"\r\n                       name=\"email\"\r\n                       ng-model=\"hc.user.email\"\r\n                       placeholder=\"Email\"\r\n                       ng-class=\"{\'error\':createUser.email.$invalid && createUser.$dirty}\"\r\n                       required>\r\n            </div>\r\n            <div class=\"input-container\">\r\n                <input class=\"input input-pass\"\r\n                       type=\"password\"\r\n                       name=\"password\"\r\n                       ng-model=\"hc.user.password\"\r\n                       placeholder=\"Password\"\r\n                       min=\"1\"\r\n                       max=\"12\"\r\n                       required>\r\n            </div>\r\n            <div class=\"input-container\">\r\n                <input class=\"input input-fullname\"\r\n                       type=\"text\"\r\n                       name=\"fullName\"\r\n                       ng-model=\"hc.user.fullName\"\r\n                       placeholder=\"Full name\"\r\n                       required>\r\n            </div>\r\n            <button type=\"submit\"\r\n                    ng-disabled=\"createUser.$invalid\"\r\n                    class=\"input submit\">Sign Up with email</button>\r\n        </div>\r\n    </div>\r\n</form>");}]); })();
;(function () {
    'use strict';
    angular.module('FitTreker.Workout.Area', [
        'FitTreker.Fire',
        'youtube-embed',
        'FitTreker.Components.Workout'
    ])
    .controller('AreaCtrl', AreaCtrl)
    .filter('TimeFilter',TimeFilter)
    .config(Config);

    //@ngInject
    function AreaCtrl($scope,$rootScope, WorkoutFactory,currentUser,$interval,$stateParams,$timeout) {
        var s = this;

        //Получение комплекса, в котором содержится список всех упражнений
        s.complexe = WorkoutFactory.getComplexOnId($stateParams.id, $rootScope.complexeBaseType);

        s.countExercise = 0;
        s.startRest = false;
        s.timeStep = 0;
        s.once = true;
        s.intervalID;
        s.intervalRest;
        s.timeOut;
        s.endComplex = false;
        s.numberExercise = 0;
        s.pause = false;
        s.endExercise = false;
        s.restDelay = 0;
        s.transition = 0;

        var settings = function (complexe) {
            s.countExercise = complexe.exercises.length;
            s.exercise = complexe.exercises[s.numberExercise];
            s.exercise.$loaded(function () {
                s.exercise.fullTime = s.setFullTime(s.exercise);
                console.log(s.exercise.fullTime);
                s.timeStep = s.exercise.timeStep;
                s.restDelay = s.exercise.quantity;
                s.transition = s.exercise.transition;

            });
        };
        // Видео готово к воспроизведению
        $scope.$on('youtube.player.ready', function ($event, player) {
            settings(s.complexe);
            s.player = player;
        });

        // Начало воспроизведения
        $scope.$on('youtube.player.playing', function ($event, player) {
            // Нужно для того, чтобы по клику на youtube кнопку запусколсь воспроизведение видео и
            // запуск комплекса упражнений
            if(s.once) {
                player.playVideo();
                s.start(player);
                s.once = false;
            }

            // Возобновление воспроизведения видео после паузы
            if(s.pause)
            {
                player.playVideo();
                s.start(player);
                s.pause = false;
            }
        });

        // Завершение воспроизведения
        // Обработчик на событие завершения проигрывания видеозаписи
        $scope.$on('youtube.player.ended', function ($event, player) {
            if(!s.endExercise)
                player.playVideo();
        });


        // Пауза
        $scope.$on('youtube.player.paused',function($event, player){
            s.stop(s.intervalID);
            s.pause = true;
        });


        // Запускает комплекс упражнений
        // Запускает два таймера.
        // Тайемер одного подхода
        // и общий таймер всего комплекса упражнений
        s.start = function (player) {
            s.intervalID = $interval(function () {
                if(s.exercise.timeStep == 0) {
                    $interval.cancel(s.intervalID);
                    if(s.exercise.approach >= 1)
                        s.rest(player);
                }
                else {
                    s.exercise.timeStep--;
                    s.exercise.fullTime--;
                }
            },1000);
        };

        // Остановка таймера, срабатывает при остановке видео
        // или при завершении видео.
        s.stop = function (intervalId) {
            $interval.cancel(intervalId);
        };

        // Подсчет общего времени на выполнение упражнения с учетом отдыха.
        s.setFullTime = function (exercise) {
            var test;
            console.log(exercise);
            //if(exercise) {
                test = exercise.timeStep * exercise.approach;
                console.log(test);
                return test;
            //}
        };

        // Устанавливает таймер отдыха, по завершению которого возобновляется воспроизведение видео
        s.rest = function (player) {
            player.stopVideo();
            s.exercise.approach--;
            if(s.exercise.approach >= 1) {
                s.startRest = !s.startRest;
                s.timeOut = $timeout(function () {
                    $timeout.cancel(s.timeOut);
                    s.startRest = !s.startRest;
                    s.exercise.timeStep = s.timeStep;
                    player.playVideo();
                    s.start(player);
                },1100 * s.restDelay);

                s.intervalRest = $interval(function () {
                    if(s.exercise.quantity == 0) {
                        s.stop(s.intervalRest);
                        s.exercise.quantity = s.restDelay;
                    }
                    else
                        s.exercise.quantity--;
                },1000);
            }
            else {
                s.endExercise = true;
                if(!s.endComplex)
                    s.startTransition();
                else
                    console.log("Конец всего комплекса!");
            }
        };

        // Запускает таймер, отвечающий за отдых между упражнениями
        s.startTransition = function () {
            s.exercise.quantity = s.exercise.transition;
            s.startRest = !s.startRest;

            s.timeOut = $timeout(function () {
                s.stop(s.timeOut);
                s.stop(s.intervalRest);

                s.exercise.quantity = s.restDelay;

                if(s.numberExercise != s.countExercise-1) {
                    s.numberExercise++;
                    s.nextExercise(s.numberExercise);
                }
                else
                    s.endComplex = true;
            },1000 * s.exercise.quantity + 1000);

            s.intervalRest = $interval(function () {
                if(s.exercise.quantity == 1)
                {
                    s.exercise.quantity--;
                    s.stop(s.intervalRest);
                    s.startRest = !s.startRest;
                }
                else
                {
                    s.exercise.quantity--;

                }
            },1000);
        };

        // Переход к следующему упражнению в комплексе
        s.nextExercise = function (idExercise) {
            s.exercise = s.complexe.exercises[idExercise];
            s.once = true;
            s.endExercise = false;
        };

        // Перезапускает весь комплекс уражнений
        // Вызывается нажатием на кнопку "Повторить комплекс"
        s.restartComplex = function () {
            s.numberExercise = 0;
            s.endComplex = false;
            s.once = true;
            s.complexe = WorkoutFactory.getComplexOnId($stateParams.id,true);
            s.complexe.$loaded(function(_complexe){
                settings(_complexe);
                s.player.seekTo(0);
            });
            //console.log(s.exercise);
        };

    }
    AreaCtrl.$inject = ["$scope", "$rootScope", "WorkoutFactory", "currentUser", "$interval", "$stateParams", "$timeout"];

    //@ngInject
    function TimeFilter(){
        return function (_timeStep) {
            var time = Number(_timeStep);
            var min = 0;
            var sec = 0;

            // Фильтр форматирования времени.
            // Представляет время в удобном формате 00:15
            if(time){
                min = (time / 60 | 0);
                sec = String((time % 60));
                if(sec.indexOf(".") == 1){
                    sec =  sec.substring(0,1);
                }
                else
                    sec = sec.substring(0,2);
                if(min < 10){
                    if(sec < 10)
                        return "0" + min + ":" + "0" + sec;
                    else
                        return "0" + min + ":" + sec;
                }
                else
                    if(sec < 10)
                        return min + ":" + "0" + sec;
                    else
                        return min + ":" + sec;
            }
            else
                return "00:00";

        }
    }

    //@ngInject
    function Config($stateProvider) {
        $stateProvider
            .state('area',{
                resolve: {
                    currentUser: /*@ngInject*/["AuthFactory", "$stateParams", function(AuthFactory,$stateParams) {
                        // Проверка на авториацию
                        return AuthFactory.require().then(function (_authData) {
                            return AuthFactory.getCurrentUser(_authData.uid);
                        });
                    }]
                },
                url: '/workout/area/:id',
                templateUrl: 'app/workout/area.html',
                controller: 'AreaCtrl',
                controllerAs: 'ac'
            });
    }
    Config.$inject = ["$stateProvider"];
})();
;(function () {
    'use strict';

    angular
        .module('FitTreker.Workout', [
        'templates',
        'ui.router',
        'FitTreker.Components.Workout',
        'FitTreker.Fire',
        'infinite-scroll'
    ])
    .controller('WorkoutCtrl', WorkoutCtrl)
    .filter('fullTime',fullTime)
    .controller('ComplexeModelCtrl', ComplexeModelCtrl)
    .config(Config);

    //@ngInject
    function WorkoutCtrl ($scope,$rootScope, $state,WorkoutFactory,$location,currentUser, complexes,  $filter, $modal,$templateCache, $log) {
        var o = this;

        $rootScope.dataLoaded = true;

        var modalInstance;
        var modal = {
            animation: false,
            windowClass: "modalAnimation",
            template: $templateCache.get('create-complexe.tpl.html'),
            controller: 'ComplexeModelCtrl',
            controllerAs: 'cmc',
            resolve: {
                currentUser: function () {
                    return currentUser;
                },
                exercises: function() {
                    return WorkoutFactory.getAllExercise(currentUser);
                },
                complexe: null
            }
        };
        $log.log("=== WorkoutCtrl ===");

        o.complexes = complexes;
        o.start = "-K5UHaml8jTIzzciSS8Y";
        o.len = 2;

        $rootScope.complexes = o.complexes;

        o.dateFormat = function (date) {
            // Исправить дату рождения
            // для этого нужно сохранять дату в БД в правильном формате.
            var date = new Date(date);
            date = $filter('date')(date,'dd/MM/yyyy');
            if(date == "Invalid Date")
                return "";
            else
                return date;
        };

        // Подсчет общего времени, которе необходимо затратить на выполнение всего комплекса упражнений
        o.complexTime = function (exercises) {
            var fullTime = 0;

            if(exercises != "undefined" && exercises != null) {
                angular.forEach(exercises, function (val, key) {
                    fullTime+=val.timeStep * val.approach;
                });
                return fullTime;
            }
            else {
                return 0;
            }
        };

        o.createComplexe = function () {
            modal.resolve.complexe = null;
            modalInstance = $modal.open(modal);
        };

        // Удаление пользовательского комплекса упражненией
        // Функция вызывается при клике на иконку delete
        o.deleteComplexe = function (_index, _complexe) {
            WorkoutFactory.deleteUserComplexe(_complexe, currentUser.uid);
            // Удаление одного элемента из массива комплексов упражнений по его индексу
            o.complexes.splice(_index,1);
        };

        // Обновление комплекса
        // Функция вызывает модальное окно, в котором произвожится изменение
        o.updateComplexe = function (_complexe) {
            modal.resolve.complexe = _complexe;
            modalInstance = $modal.open(modal);
        };

        o.saveTypeComplexe = function (_idComplexe) {
            $rootScope.complexeBaseType = o.complexes[_idComplexe].base || false;
        };

        o.LoadMoreComplexes = function () {
            WorkoutFactory.getComplexes(currentUser,o.start, o.len).then(function (_data) {
                angular.forEach(_data, function (val, key) {
                    o.complexes.push(val);
                    o.start = val.$id;
                });
            });
        };
    }
    WorkoutCtrl.$inject = ["$scope", "$rootScope", "$state", "WorkoutFactory", "$location", "currentUser", "complexes", "$filter", "$modal", "$templateCache", "$log"];

    //@ngInject
    function ComplexeModelCtrl ($scope, currentUser,WorkoutFactory, complexe, exercises, $rootScope) {
        var o = this;

        o.form = {};
        o.create = true;
        o.exercises = exercises;
        o.newExercises = {}; // Объект в котором будут хранится добавленные упражнения. После
                             // нажатия на кнопку сохрнаить, этот объект добавиться в комплекс упражнений
        o.exercisesLength = 0;
        // Возвращает целое рандомное число из диапазона от 0 до 6 не включая
        o.getRandomSrc = function  () {
            return Math.floor(Math.random() * (4 + 1) + 1);
        };

        o.errors = {
            exerciseLenght: true
        };

        // Функуция производит инициализацию
        // Объявляет объект complexe
        // Либо этот объект = null
        // Либо это уже существующий комплекс упражнений
        function init () {
            if(complexe) {
                o.newComplex = complexe;
                angular.forEach(o.newComplex.exercises, function (val, key) {
                    o.newExercises[key] = val;
                });
            }
            else {
                o.create = false;
                o.newComplex = {};
                o.newComplex.exercises = {};
                o.newComplex.src = "app/img/complex_random/img" + o.getRandomSrc() + ".jpg";
            }

            // Проверка, нет ли в упражнениях, тех упражнений, которе уже имеются в комплексе
            angular.forEach(o.exercises, function (val, keyExercise) {
                angular.forEach(o.newComplex.exercises, function (value, key) {
                    if(keyExercise == key)
                        delete o.exercises[keyExercise];
                });
            });
        }

        init();

        // mini-popup, которые будет показывать при вызове этой функции
        // Может иметь два состояния success и error
        o.showMsg = function (type, msg) {
            console.log(msg);
            // Необходимо создать alert, который будет появляться в правом верхнем углу и
            // будет содержать сообщение
        };

        o.addExerciseInList = function (exercise) {
            // Проверка на то, было ли добавлено это упрж раньше!
            //if(!o.newComplex.exercises)
            //    o.newComplex.exercises = {};
            if( !(exercise.$id in o.newComplex.exercises)) {
                o.newExercises[exercise.$id] = exercise;
                o.exercisesLength++;
            }

            o.errors.exerciseLenght = false;
            delete o.exercises[exercise.$id];
        };

        o.deleteExerciseInList = function (_id,_exercise) {
            o.exercises[_id] = _exercise;
            delete o.newExercises[_id];
            if(o.exercisesLength != 0)
                o.exercisesLength--;
            if(o.exercisesLength == 0)
                o.errors.exerciseLenght = true;
        };

        o.saveComplexe = function () {
            angular.forEach(o.newExercises, function (val, key) {
                o.newComplex.exercises[key] = val;
            });
            WorkoutFactory.addNewUserComplex(o.newComplex,currentUser.uid);
            $scope.$close();
        };

        o.updateComplexe = function () {
            o.newComplex.exercises = {};
            angular.forEach(o.newExercises, function (val, key) {
                o.newComplex.exercises[key] = val;
            });
            WorkoutFactory.updateUserComplexe(o.newComplex, currentUser.uid);
            $scope.$close();
        };
    }
    ComplexeModelCtrl.$inject = ["$scope", "currentUser", "WorkoutFactory", "complexe", "exercises", "$rootScope"];

    //@ngInject
    function fullTime () {
        return function (item) {
            var time = Number(item);
            if(time % 60 == 0){
                return (time / 60) + ' мин.';
            }
            else {
                return (time/60 | 0) +" мин. "+ (time % 60) + " сек.";
            }

        }
    }

    //@ngInject
    function Config($stateProvider) {
        $stateProvider
            .state('workout',{
                resolve: {
                    currentUser: /*@ngInject*/["AuthFactory", "$rootScope", function(AuthFactory, $rootScope) {
                        // Загрузка прелоадера!
                        $rootScope.dataLoaded = false;
                        // Проверка на авториацию
                        return AuthFactory.require().then(function (_authData) {
                            return AuthFactory.getCurrentUser(_authData.uid);
                        });
                    }],
                    complexes: /*@ngInject*/["WorkoutFactory", function(WorkoutFactory) {
                        return WorkoutFactory.getBaseComplexes();
                    }]
                    //complexes: /*@ngInject*/function (AuthFactory, WorkoutFactory) {
                    //    return AuthFactory.require().then(function (_authData) {
                    //        return AuthFactory.getCurrentUser(_authData.uid).then(function (currentUser) {
                    //            return WorkoutFactory.getComplexes(currentUser,"-K5UHaml8jTIzzciSS8Y",2);
                    //        });
                    //    });
                    //}
                },
                url: '/workout',
                templateUrl: 'app/workout/workout.html',
                controller: 'WorkoutCtrl',
                controllerAs: 'wc'
            });
    }
    Config.$inject = ["$stateProvider"];
})();