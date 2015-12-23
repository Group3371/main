;(function () {
    'use strict';
    angular.module('numberPicker', [ ])
    .directive('numberPicker',numberPicker)
    .controller('pickerCtrl', pickerCtrl);


    //@ngInject
    function pickerCtrl($scope) {
        var o = this;
        $scope.value = $scope.value | 0 ;
        $scope.minvalue = $scope.minvalue | 0;
        o.maxValueString = "";
        o.maxlength = o.maxlength | 3;

        if(!$scope.maxvalue) {
            for(var i = 0; i < $scope.maxlength; i++)
            {
                o.maxValueString = o.maxValueString + "9";
            }
            $scope.maxvalue = Number(o.maxValueString);
        }

        o.setValue = function (_directon) {
            if(_directon == "up")
            {
                if($scope.value < $scope.maxvalue)
                    $scope.value++;
            }
            else {
                if($scope.value > $scope.minvalue)
                    $scope.value--;
                else
                    $scope.value = $scope.minvalue;
            }
        }
    }


    //@ngInject
    function numberPicker () {
        return {
            scope: {
                maxlength: "=",
                maxvalue: "=",
                value: '=',
                minvalue: "="
            },
            controller: 'pickerCtrl',
            controllerAs: 'piC',
            priority: 1000,
            replace: true,
            template: "<div class='number-picker'> \
                        <form class='form-picker' name='piC.formPicker'>\
                             <input type='text'\
                                name='picker' \
                                ng-model='value' \
                                ng-pattern='/^[0-9]{1,7}$/'\
                                ng-change='piC.validatePicker()' \
                                maxlength='{{maxlength}}'   \
                                disabled\
                                class='number-picker__field'> \
                        </form> \
                        <div class='number-picker__group number-picker__buttons'> \
                            <div class='number-picker__button button-picker'>\
                                <a ng-click='piC.setValue(\"up\")' class='button-picker__tungle top-tungle'></a>\
                            </div> \
                            <div class='number-picker__button button-picker'>\
                                <a ng-click='piC.setValue(\"down\")' class='button-picker__tungle bottom-tungle'></a>\
                            </div> \
                        </div> \
                    </div>",
            restrict: "EA",
            link: function (scope, element, attrs) {
                //console.log(scope.value);
            }
        }
    }

})();