document.addEventListener('DOMContentLoaded', function () {
  const slider = $('.js-collection-slider');
  const slides = $('.js-collection-slides');
  const scrollbar = $('.collection-slider-scrollbar');
  const widget = $('.js-collection-slider-scrollbar-widget');

  let count = slides.length;
  let ScrollBarWidth = 0;
  let widgetWidth = 0;
  let nextSlideInit = 0;
  let position = 0;

  function changeScrollBar() {
    ScrollBarWidth = scrollbar.width();
    widgetWidth = ScrollBarWidth / count;
    position = widgetWidth * nextSlideInit;
    widget.css('width', `${widgetWidth}px`);
    widget.css('left', `${position}px`);
  }

  changeScrollBar();

  $(window).resize(function (){
    changeScrollBar();
  })

  slider.on('beforeChange', function (event, slick, currentSlide, nextSlide) {
    nextSlideInit = nextSlide;
    position = widgetWidth * nextSlide;
    widget.css('left', `${position}px`)
  });

  slider.slick({
    slidesToShow: 5,
    slidesToScroll: 1,
    rows: 0,
    infinite: false,
    responsive: [
      {
        breakpoint: 1440,
        settings: {
          slidesToShow: 4,
        }
      },
      {
        breakpoint: 1024,
        settings: {
          slidesToShow: 3
        }
      },
      {
        breakpoint: 750,
        settings: {
          slidesToShow: 2
        }
      },
      {
        breakpoint: 480,
        settings: {
          slidesToShow: 1.2,
          swipeToSlide: true,
          arrows: false
        }
      }
    ]
  });
});