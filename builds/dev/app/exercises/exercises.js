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

    function Config ($stateProvider) {
        $stateProvider
            .state('exercises',{
                resolve: {
                    currentUser: /*@ngInject*/function(AuthFactory) {
                        // Проверка на авториацию
                        return AuthFactory.require().then(function (_authData) {
                            return AuthFactory.getCurrentUser(_authData.uid);
                        });
                    }
                },
                url: '/exercises',
                templateUrl: 'app/exercises/exercises.tpl.html',
                controller: 'ExercisesCtrl',
                controllerAs: 'ec'
            });
    }
})();