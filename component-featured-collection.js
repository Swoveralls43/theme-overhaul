document.addEventListener('DOMContentLoaded', function () {
  const featuredRow = $('[data-featured-row]');
  const featuredCols = $('[data-featured-col]');
  const scrollBarWrapper = $('[data-featured-scrollbar-wrapper]');
  const scrollBarWidget = $('[data-featured-scrollbar-widget]');

  let sliderWidth = 0;
  let scrollWidth = 0;
  let scrollRatio = 0;
  let scrollBarWidth = 0;
  let scrollLeft = 0;

  function getScroll() {
    sliderWidth = featuredRow.width() - 15;
    scrollWidth = 0;
    scrollRatio = 0;

    featuredCols.each(function () {
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

      scrollLeft = featuredRow.scrollLeft() / scrollRatio;

      scrollBarWidget.css({
        "left": scrollLeft
      });
    } else {
      scrollBarWrapper.css('display', 'none');
    }
  });

  featuredRow.scroll(function () {
    scrollLeft = $(this).scrollLeft() / scrollRatio;

    scrollBarWidget.css({
      "left": scrollLeft
    });
  });
});
