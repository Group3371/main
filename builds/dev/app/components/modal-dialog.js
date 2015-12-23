;(function () {
    'use strict';
    angular.module('modal-dialog', [
        'ngAnimate'
    ])
        .directive('modalDialog',modalDialog);

    // Директива, которая создает и вызывает модальное окно.
    //@ngInject
    function modalDialog () {
        return {
            scope: {
                show: '=',
                settings: '='
            },
            replace: true,
            controller: 'HomeCtrl',
            controllerAs: 'hc',
            transclude: true,
            template: "<div class='ng-modal-dialog ' ng-show='show'><div class='ng-modal-dialog__overlay' ng-click='close()'></div><div class='popup' ng-class='{popupModal: show}' ng-transclud><ng-include  src='settings.templateUrl'></ng-include></div> </div>",
            priority: 1000,
            restrict: 'EA',// Можно использовать как атрибу и как элемент
            link: function(scope, element, attrs) {
                var width = scope.settings.width,
                    height = scope.settings.height,
                    overlay = angular.element(element.children()[0]),
                    popup = angular.element(element.children()[1]);

                // Закрытие модального окна по клику на темной зоне
                scope.close = function () {
                    scope.show = false;
                };
                // Задание основных стилей модальному окну
                overlay.css({
                    zIndex: 9999,
                    position: 'absolute',
                    left: 0,
                    top: 0,
                    width: '100%',
                    height: '100%',
                    background: 'rgba(0,0,0,.7)'
                });
                // Задание основных стилей оболочке модального окна.
                popup.css({
                    zIndex: 10000,
                    position: 'absolute',
                    width: width+ 'px',
                    height: height+ 'px',
                    marginLeft: -width/2 +'px',
                    marginTop: -height/2 + 'px',
                    left: '50%'
                });

            }

        }
    }

})();