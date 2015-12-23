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

    //@ngInject
    function AboutCarouselCtrl ($scope) {
        $scope.$slideIndex = 0;
        $scope.slides = [
            { 'image': 'app/img/slide_about0.jpg'},
            { 'image': 'app/img/slide_about1.jpg'}
        ];

    }


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


})();