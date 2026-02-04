document.addEventListener('DOMContentLoaded', function () {
  
  const slider = $('.js-product-finder');
  
  slider.slick({
    slidesToShow: 4,
    slidesToScroll: 1,
    dots: false,
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
          slidesToShow: 3,
        }
      },
      {
        breakpoint: 750,
        settings: {
          slidesToShow: 4.1,
          swipeToSlide: true,
          dots: false,
          arrows: false,
          centredMode: true
        }
      }
    ]
  });
});