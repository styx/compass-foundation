$(document).ready(function() {
    $('.mobileSlider').flexslider({
        animation: "slide",
        slideshowSpeed: 3000,
        controlNav: false,
        directionNav: true,
        prevText: "&#171;",
        nextText: "&#187;"
    });
    $('.flexslider').flexslider({
        animation: "slide",
        directionNav: false
    });             
    $('a[href*=#]:not([href=#])').click(function() {
        if (location.pathname.replace(/^\//,'') == this.pathname.replace(/^\//,'') || location.hostname == this.hostname) {
            var target = $(this.hash);
            target = target.length ? target : $('[name=' + this.hash.slice(1) +']');
            if ($(window).width() < 768) {
                if (target.length) {
                    $('html,body').animate({
                        scrollTop: target.offset().top - $('.navbar-header').outerHeight(true) + 1
                    }, 1000);
                    return false;
                }
            }
            else {
                if (target.length) {
                    $('html,body').animate({
                        scrollTop: target.offset().top - $('.navbar').outerHeight(true) + 1
                    }, 1000);
                    return false;
                }
            }
        }
    });
    $('#toTop').click(function() {
        $('html,body').animate({
            scrollTop: 0
        }, 1000);
    });
    var timer;
    $(window).bind('scroll',function () {
        clearTimeout(timer);
        timer = setTimeout( refresh , 50 );
    });
    var refresh = function () {
        if ($(window).scrollTop()>100) {
            $(".tagline").fadeTo( "slow", 0 );
        }
        else {
            $(".tagline").fadeTo( "slow", 1 );
        }
    };    
});