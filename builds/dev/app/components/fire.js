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

})();
