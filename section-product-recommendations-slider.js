document.addEventListener('DOMContentLoaded', function () {
  const recommendSliderSection = $('.js-product-recommendations');
  const recommendContainer = $('.product-recommendations__container');

  if (!recommendSliderSection && !recommendContainer) {
    return;
  }

  let productId = recommendSliderSection.attr('data-product-id');
  let baseUrl = recommendSliderSection.attr('data-base-url');
  let limit = recommendSliderSection.attr('data-limit');

  let requestUrl = baseUrl + "?section_id=product-recommendations-slider&product_id="
    + productId + "&limit=" + limit;

  fetch(requestUrl)
    .then(response => response.text())
    .then(text => {
      const html = document.createElement('div');
      html.innerHTML = text;

      const recommendations = html.querySelector('.js-product-recommendations-slider');
      recommendContainer.append(recommendations);

      let slider = $('.js-product-recommendations-slider');

      // slider.slick({
      //   slidesToShow: 5,
      //   slidesToScroll: 1,
      //   dots: true,
      //   infinite: false,
      //   responsive: [
      //     {
      //       breakpoint: 1440,
      //       settings: {
      //         slidesToShow: 4,
      //       }
      //     },
      //     {
      //       breakpoint: 1024,
      //       settings: {
      //         slidesToShow: 3,
      //       }
      //     },
      //     {
      //       breakpoint: 750,
      //       settings: {
      //         slidesToShow: 2.1,
      //         swipeToSlide: true,
      //         dots: false,
      //         arrows: false,
      //         centredMode: true
      //       }
      //     }
      //   ]
      // });

    })
    .catch(e => {
      console.error(e);
    });
});