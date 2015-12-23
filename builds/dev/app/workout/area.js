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
                    currentUser: /*@ngInject*/function(AuthFactory,$stateParams) {
                        // Проверка на авториацию
                        return AuthFactory.require().then(function (_authData) {
                            return AuthFactory.getCurrentUser(_authData.uid);
                        });
                    }
                },
                url: '/workout/area/:id',
                templateUrl: 'app/workout/area.html',
                controller: 'AreaCtrl',
                controllerAs: 'ac'
            });
    }
})();