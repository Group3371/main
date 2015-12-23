;(function () {
    'use strict';
    angular.module('alert', [])
        .controller('FormAlertCtrl',FormAlertCtrl)
        .directive('formAlert', formAlert);

    //@ngInject
    function FormAlertCtrl ($scope,$attrs){
        var o = this;
    }

    //@ngInject
    function formAlert (){
        return {
            scope: {
                type: '@',
                show: '=',
                close: '&'
            },
            transclude: true,
            replace: true,
            controller: "FormAlertCtrl",
            controllerAs: 'fac',
            restrict: "EA",
            template: "<div class='form-alert' ng-show='show' ng-class='setClass()'>\
                            <a class='form-alert__close' ng-click='close()'></a>\
                            <div class='form-alert__body' ng-transclude>\
                            </div>\
                        </div>",
            link: function (scope, element, attrs) {
                scope.setClass = function () {
                    return {
                        success: scope.type === "success",
                        error: scope.type === "error"
                    }
                };

                scope.close = function () {
                    scope.show = !scope.show;
                }
            }

        }
    }



})();
