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
                    currentUser: /*@ngInject*/function(AuthFactory, $rootScope) {
                        // Загрузка прелоадера!
                        $rootScope.dataLoaded = false;
                        // Проверка на авториацию
                        return AuthFactory.require().then(function (_authData) {
                            return AuthFactory.getCurrentUser(_authData.uid);
                        });
                    },
                    complexes: /*@ngInject*/function(WorkoutFactory) {
                        return WorkoutFactory.getBaseComplexes();
                    }
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
})();