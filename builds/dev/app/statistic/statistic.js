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

    function Config ($stateProvider) {
        $stateProvider
            .state('statistic',{
                url: '/statistic',
                templateUrl: 'app/statistic/statistic.tpl.html',
                controller: 'StatisticCtrl',
                controllerAs: 'sc'
            });
    }
})();