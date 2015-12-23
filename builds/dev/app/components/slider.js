;(function () {
    'use strict';
    angular.module('isArlikin.slider', [

    ])
        .directive('ngSlider',slider)
        .directive('ngSlide',slide)
        .controller('SliderCtrl', SliderCtrl);


    //@ngInject
    function SliderCtrl($scope,$interval) {
        var s = this;
        console.log("Controller");
        s.slide = {};
        s.slides = [];
        s.dots = [];
        s.activeSlide = null;
        s.dotsContainer = null;
        s.indexActive = 0;
        s.flag = true;
        s.timer = 5000;
        s.duration = $scope.duration;



        s.addSlide = function (scope, element) {
            s.slides.push(element);
            if(s.slides.length == 1)
                s.activeSlide(s.slides[0]);
        };

        s.activeSlide = function (active) {
            s.activeSlide = active;
            active.classList.add("slide-active");
        };

        s.addDot = function() {
            var dot = $(document.createElement('li'));
            s.dots.push(dot);
            if(s.dots.length == 1)
                dot.addClass('slider__dot slider__dot-active');
            else
                dot.addClass('slider__dot');
            s.dotsContainer.append(dot);

            return dot;
        };

        s.move = function(event) {
            var direction = event.target.classList.contains('rectungle-right') ? 'forward': 'backward',
                next = s.activeSlide.nextElementSibling || s.slides[0],
                prev = s.activeSlide.previousElementSibling || s.slides[s.slides.length - 1],
                slide = direction === "forward"? next : prev;

            s.moveDot(direction);
            s.moveSlide(slide, s.activeSlide,direction);


        };

        s.moveSlide = function (next,active,direction) {
            var slideWidth = active.offsetWidth,
                strafe = 0,
                positionSlide = 0;

            if(direction === 'forward') {
                positionSlide = slideWidth + 'px';
                strafe = - slideWidth;
            }
            else {
                positionSlide = -slideWidth + 'px';
                strafe =  slideWidth;
            }


            if(s.flag) {
                s.flag = false;
                next.style.left = positionSlide;
                next.classList.add('slide-inslide');
                $(next).animate({left: 0}, s.duration);
                $(active).animate({left: strafe}, s.duration,function(){
                    active.style.left = 0;
                    next.classList.remove('slide-inslide');
                    next.classList.add('slide-active');
                    s.activeSlide = next;
                    active.classList.remove('slide-active');
                    s.indexActive = $(next).index();
                    s.flag = true;

                });
            }

        };

        s.moveDot = function (direction) {
            var activeDot = s.dots[s.indexActive],
                nextDot = s.dots[s.indexActive + 1] || s.dots[0],
                backDot = s.dots[s.indexActive - 1] || s.dots[s.dots.length - 1];

            activeDot.removeClass('slider__dot-active');
            if(direction == 'forward')
                nextDot.addClass('slider__dot-active');
            else
                backDot.addClass('slider__dot-active');

        };

        s.clickDot = function (event) {
            var _this = $(this),
                activeDot = s.dots[s.indexActive],
                numberOfDot = _this.index(),
                duration = s.indexActive < numberOfDot? "forward": "backward";

            if(s.indexActive != _this.index()) {
                activeDot.removeClass('slider__dot-active');
                s.dots[numberOfDot].addClass('slider__dot-active');
                s.moveSlide(s.slides[numberOfDot], s.slides[s.indexActive],duration);
            }
        };

        s.autoSwitch = function () {
            s.intervalID = $interval(function () {
                var next = s.indexActive == (s.slides.length - 1)? s.slides[0]: s.slides[s.indexActive +1 ];
                s.moveDot("forward");
                s.moveSlide(next, s.slides[s.indexActive],"forward");
            }, s.timer) ;
        };

        // Автоматическое переключение слайдов.
        //s.autoSwitch();
    }

    //@ngInject
    function slider () {
        return {
            scope: {
                duration: '@'
            },
            replace: true,
            restrict: 'EA',
            priority: 1,
            transclude: true,
            template: "<div class='ng-slider-wrapper'> \
                            <div class='rectungle rectungle-left'></div> \
                            <div class='rectungle rectungle-right'></div> \
                            <ul class='ng-slider' ng-transclude> \
                            </ul> \
                            <ul class='slider__dots'>\
                            </ul>\
                        </div>",
            link: function (scope,element,attrs,SliderCtrl){
                var dotsContainer = element.find('ul')[1];
                var buttons = element[0].querySelectorAll('.rectungle');

                SliderCtrl.dotsContainer = angular.element(dotsContainer);
                buttons[0].addEventListener('click',SliderCtrl.move);
                buttons[1].addEventListener('click',SliderCtrl.move);

            },
            controller: "SliderCtrl",
            controllerAs: "sc"
        }
    }

    //@ngInject
    function slide (){
        return {
            require: '^ngSlider',
            scope: {},
            replace: true,
            transclude: true,
            priority: 100,
            restrict: 'EA',
            template: "<li class='ng-slider__item slide ' ng-transclude></li>",
            link: function (scope,element,attr,sliderController) {
                sliderController.addSlide(scope,element[0]);

                var dot = sliderController.addDot();
                dot.on('click',sliderController.clickDot)

            }
        }
    }

})();
