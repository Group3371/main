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
})();