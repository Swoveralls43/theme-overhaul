document.addEventListener('DOMContentLoaded', function () {
  const slider = $('[data-team-slider]');
  const slides = $('[data-team-slide]');
  const scrollBarWrapper = $('[data-teams-scrollbar-wrapper]');
  const scrollBarWidget = $('[data-teams-scrollbar-widget]');

  let sliderWidth = 0;
  let scrollWidth = 0;
  let scrollRatio = 0;
  let scrollBarWidth = 0;
  let scrollLeft = 0;

  let inited = false;

  if ($(window).width() < 750) {
    if (inited) {
      slider.slick('unslick');
      inited = false;
    }
  } else {
    initSlider();
  }

  $(window).resize(function () {
    if ($(window).width() < 750) {
      if (inited) {
        setTimeout(function () {
          slider.slick('unslick');
          inited = false;
        }, 100)
      }
    } else {
      initSlider();
    }
  });

  function initSlider() {
    if (!inited) {
      slider.slick({
        slidesToShow: 10,
        slidesToScroll: 1,
        rows: 0,
        infinite: false,
        responsive: [
          {
            breakpoint: 1440,
            settings: {
              slidesToShow: 7,
            }
          },
          {
            breakpoint: 1024,
            settings: {
              slidesToShow: 6
            }
          }
        ]
      });
      inited = true;
    }
  }

  function getScroll() {
    sliderWidth = slider.width() - 15;
    scrollWidth = 0;
    scrollRatio = 0;

    slides.each(function () {
      scrollWidth += $(this).outerWidth();
    });

    scrollRatio = scrollWidth / sliderWidth;
    scrollBarWidth = (100 / scrollRatio) + '%';
    scrollBarWidget.width(scrollBarWidth);
  }

  function hideScroll() {
    if (scrollWidth <= sliderWidth + 1) {
      scrollBarWrapper.css('display', 'none');
    } else {
      scrollBarWrapper.css('display', 'block');
    }
  }

  getScroll();
  hideScroll();

  $(window).on('resize rotate', function () {
    if ($(window).width() < 750) {
      setTimeout(function () {
        getScroll();
      }, 100)

      setTimeout(function () {
        hideScroll();
      }, 100)

      scrollLeft = slider.scrollLeft() / scrollRatio;

      scrollBarWidget.css({
        "left": scrollLeft
      });
    } else {
      scrollBarWrapper.css('display', 'none');
    }
  });

  slider.scroll(function () {
    scrollLeft = $(this).scrollLeft() / scrollRatio;

    scrollBarWidget.css({
      "left": scrollLeft
    });
  });
});