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

})();