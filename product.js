
var state = {
  id: null,
  options: [] // This stores an array of the selected options
}

$(document).ready(function () {
  // product zoom modal
  const $productZoomModal = $('.product__zoom-modal');

  // product zoom close
  const $productZoomClose = $('.product__zoom-modal__close');

  // body
  const $body = $('body');

  // product overlay
  const $productOverlay = $('.product__overlay');

  // product size guide modal close
  const $productSizeModalClose = $('.product__modal__close');

  // product size modal
  const $productSizeModal = $('.product__size__guides-modal');

  // size guide
  const $sizeGuideBtn = $('.product__form__sizes__guide');

  // size guide table nav btn
  const $sizeGuideNavBtn = $('.product__size__nav__btn');

  // size guide table nav btns
  const $sizeGuideNavBtns = $('.product__size__nav__btn');

  /* ======= Product images zoom ======= */

  $('[data-product-images]').on("click", function (e) {
    if (e.target.closest('img')) {
      $productZoomModal[0].querySelector('[data-zoom-modal-inner]').innerHTML = `
        <img src="${e.target.closest('img').src}&width=2000" />
      `;
    }
    $productZoomModal.addClass('active');
    $body.addClass('no-scroll');
  });

  $productZoomClose.on("click", function () {
    $productZoomModal.removeClass('active');
    $body.removeClass('no-scroll');
  });

  /* ======= Product Size Guide ======= */

  $sizeGuideBtn.on("click", function (e) {
    e.preventDefault();
    $productOverlay.addClass('active');
    $productSizeModal.addClass('active');
  });

  $productSizeModalClose.on("click", function () {
    $productOverlay.removeClass('active');
    $productSizeModal.removeClass('active');
  });

  $productOverlay.on("click", function () {
    $productOverlay.removeClass('active');
    $productSizeModal.removeClass('active');
  });

  $sizeGuideNavBtn.on("click", function (e) {
    // active table type
    const type = $(this).attr('data-table-type');
    // new active table
    const $activeTable = $('.product__size__guide__' + type);

    $('.product__size__guide').removeClass('active');
    $activeTable.addClass('active');
  });

  $sizeGuideNavBtns.on("click", function (e) {
    $sizeGuideNavBtns.removeClass("active");
    $(this).addClass("active");
  });


 $('.slider-for').slick({
    slidesToShow: 1,
    slidesToScroll: 1,
    arrows: false,
    fade: true,
    asNavFor: '.slider-nav'
  });
  $('.slider-nav').slick({
    slidesToShow: 6,
    slidesToScroll: 1,
    asNavFor: '.slider-for',
    dots: true,
    centerMode: true,
    focusOnSelect: true,
    infinite: true,
  });


  // end product slider for mobile

  /* Klaviyo Back In Stock */
  const $bisForm = $('.js-bis-form');

  $bisForm.submit(function(e) {
    const activeProduct = parseInt($('.js-product-json').attr('data-product-id') || $('#notifyMe').attr("data-product-id"));
    const activeVariant = parseInt($('#notifyMe').attr("data-variant"));
    
    const email = $bisForm.find('input[type="email"]').val();

    $.ajax({
      type: "POST",
      url: "https://a.klaviyo.com/onsite/components/back-in-stock/subscribe",
      data: {
        a: "WCf4dt",
        email: email,
        variant: activeVariant,
        product: activeProduct,  // Product must be present in Klaviyo catalog to record event.
        platform: "shopify",
        subscribe_for_newsletter: false  // Optional with "g". Defaults to false if omitted.
      },
      success: function(response){
        $bisForm.find('button[type="submit"]').addClass('hidden');
        $bisForm.append('<p class="js-bis-success success">You\'re in! We\'ll let you know when it\'s back.</p>');
      },
      error: function(response) {
        console.log(response);
      }
    });
    
    e.preventDefault();
  })
});


$(document).ready(function() {
  $('.collapsible-header').click(function() {
    $(this).toggleClass('active');
    $(this).next('.collapsible-content').slideToggle();
    $(this).find('.arrow-icon').toggleClass('rotate');
  });
});