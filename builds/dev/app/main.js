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

    //@ngInject
    function Run($rootScope) {
        $rootScope.dataLoaded = true;
        $rootScope.currentUser = {};
    }

    //@ngInject
    function MainCtrl ($scope, $modal) {
        var s = this;
        s.sign = "Sign In";
    }
})();
