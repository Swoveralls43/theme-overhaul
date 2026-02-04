document.addEventListener('DOMContentLoaded', function () {
  let $productSlider = $('.js-product-best-sellers-slider');
  const $progressBar = $('.js-images-progress > span');
  let progressLeft = $progressBar.css('left');

  $productSlider.slick({
    slidesToShow: 6,
    slidesToScroll: 1,
    dots: true,
    infinite: false,
    responsive: [
      {
        breakpoint: 1500,
        settings: {
          slidesToShow: 5,
        }
      },
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
          slidesToShow: 2.1,
          swipeToSlide: true,
          dots: false,
          arrows: false,
          centredMode: true
        }
      }
    ]
  });

  $productSlider.on('beforeChange', function (event, slick, currentSlide, nextSlide) {
    let progressWidth = $progressBar.width();

    // If swiping forward
    if (nextSlide == 0) {
      progressLeft = 0;
    }
    else if (currentSlide < nextSlide) {
      progressLeft = parseInt($progressBar.css('left')) + progressWidth;
    }
    else { // If swiping back
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