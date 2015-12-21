$(document).ready(function() {

    /* JavaScript Media Queries */
    if (matchMedia) {
        var sm = window.matchMedia("(max-width: 992px)");
        sm.addListener(WidthChangeSm);
        WidthChangeSm(sm);
    }

    // media query change
    function WidthChangeSm(mq) {

        if (mq.matches) {
            $('#categories .nav-pills').addClass('nav-stacked');
        } else {
            $('#categories .nav-pills').removeClass('nav-stacked');
        }

    }

});