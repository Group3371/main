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


})();