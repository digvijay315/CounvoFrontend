jQuery(document).ready(function ($) {



    "use strict";

    const playerContainers = document.querySelectorAll(".hoverEffects");
    playerContainers.forEach(container => {
        container.addEventListener("mouseover", () => {
            const player = container.querySelector("lottie-player");
            player.setDirection(1);
            player.play();
        });

        container.addEventListener("mouseleave", () => {
            const player = container.querySelector("lottie-player");
            player.setDirection(-1);
            player.play();
        });
    });





    $(".listing-tgl-button").on('click', function () {
        $(this).toggleClass('active');
    });



    $('.menu-toggle').on('click', function () {
        $('.menu-toggle').toggleClass('active');
    });

    var $preloader = $('#page-preloader'),
        $spinner = $preloader.find('.spinner-loader');
    $spinner.fadeOut();
    $preloader.delay(50).fadeOut('slow');


    $("a.view_more_link").click(function () {
        $("html, body").animate({
            scrollTop: $($(this).attr("href")).offset().top + "px"
        }, {
            duration: 500,
            easing: "swing"
        });
        return false;
    });

    $('button[data-bs-toggle="pill"]').on("shown.bs.tab", function (e) {
        $(".slww").slick("setPosition");
    });

    $(".reviews__slider").slick({
        slidesToShow: 3,
        slidesToScroll: 1,
        dots: true,
        arrows: false,
        appendDots: $(".slider-dots-box"),
        dotsClass: "slider-dots",
        responsive: [
            {
                breakpoint: 1025,
                settings: {
                    slidesToShow: 2,
                    slidesToScroll: 1,
                    centerMode: true,
                },
    },
            {
                breakpoint: 769,
                settings: {
                    slidesToShow: 1,
                    slidesToScroll: 1,
                },
    },
            {
                breakpoint: 561,
                settings: {
                    slidesToShow: 1,
                    slidesToScroll: 1,
                },
    },
    // You can unslick at a given breakpoint now by adding:
    // settings: "unslick"
    // instead of a settings object
  ],
    });

    $(".slider__top").slick({
        slidesToShow: 1,
        slidesToScroll: 1,
        arrows: false,
        fade: true,
        asNavFor: ".slider__second",
    });


    $(".slider__second").slick({
        slidesToShow: 4,
        slidesToScroll: 1,
        asNavFor: ".slider__top",
        dots: false,
        arrows: false,
        focusOnSelect: true,
    });

    $(".aside-slider__top").slick({
        slidesToShow: 1,
        slidesToScroll: 1,
        arrows: false,
        fade: true,
        asNavFor: ".aside-slider__second",
    });


    $(".aside-slider__second").slick({
        slidesToShow: 4,
        slidesToScroll: 1,
        asNavFor: ".aside-slider__top",
        dots: false,
        arrows: false,
        focusOnSelect: true,
    });


    $(function () {
        $("#dl-menu").dlmenu();
    });

    $(".link-dots").on("click", function (e) {
        $(".dots-menu").toggleClass("is-open");
    });






    $(".slww").slick({
        slidesToShow: 4,
        infinite: true,
        slidesToScroll: 1,
        prevArrow: '<button type="button" class=" article-slider__arrowLeft"><svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" class="bi bi-chevron-left" viewBox="0 0 16 16"><path fill-rule="evenodd" d="M11.354 1.646a.5.5 0 0 1 0 .708L5.707 8l5.647 5.646a.5.5 0 0 1-.708.708l-6-6a.5.5 0 0 1 0-.708l6-6a.5.5 0 0 1 .708 0z"/></svg></button>',
        nextArrow: '<button type="button" class="article-slider__arrowRight"><svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" class="bi bi-chevron-right" viewBox="0 0 16 16"><path fill-rule="evenodd" d="M4.646 1.646a.5.5 0 0 1 .708 0l6 6a.5.5 0 0 1 0 .708l-6 6a.5.5 0 0 1-.708-.708L10.293 8 4.646 2.354a.5.5 0 0 1 0-.708z"/></svg></button>',
        responsive: [
            {
                breakpoint: 1025,
                settings: {
                    slidesToShow: 2,
                    slidesToScroll: 1,
                    centerMode: true,
                    dots: false,
                },
    },
            {
                breakpoint: 769,
                settings: {
                    slidesToShow: 1,
                    slidesToScroll: 1,
                },
    },
            {
                breakpoint: 561,
                settings: {
                    slidesToShow: 1,
                    slidesToScroll: 1,
                },
    },
  ],
    });





});
