document.addEventListener('DOMContentLoaded', function () {
  let $productInstagramSlider = $('.js-product-instagram-feed-slider');
  const $progressBar = $('.js-product-instagram-progress > span');
  let progressLeft = $progressBar.css('left');

  $productInstagramSlider.slick({
    slidesToShow: 3,
    slidesToScroll: 1,
    dots: true,
    arrows: true,
    infinite: false,
    rows: false,
    responsive: [
      {
        breakpoint: 1440,
        settings: {
          slidesToShow: 3,
        }
      },
      {
        breakpoint: 750,
        settings: {
          slidesToShow: 1.1,
          swipeToSlide: true,
          dots: false,
          arrows: false,
          centredMode: true
        }
      }
    ]
  });

  $productInstagramSlider.on('beforeChange', function (event, slick, currentSlide, nextSlide) {
    let progressWidth = $progressBar.width();

    // If swiping forward
    if (nextSlide == 0) {
      progressLeft = 0;
    }
    else if (currentSlide < nextSlide) {
      progressLeft = parseInt($progressBar.css('left')) + progressWidth;
    }
    else if (currentSlide > nextSlide) { // If swiping back
      progressLeft = parseInt($progressBar.css('left')) - progressWidth;

      if (progressLeft < 0) {
        progressLeft = 0;
      }
    }

    // Adjust progress bar
    $progressBar.animate({
      left: progressLeft
    }, 200);
  });
});