$(document).ready(function() {
  const $notifyTrigger = $('.js-calendar-notify-trigger');
  const $notifyClose = $('.js-close-notify-panel');
  
  $notifyTrigger.click(function() {
    $('.js-notify-panel .notify-panel__wrapper').addClass('active');
    $('.js-notify-panel .right__drawer__overlay').addClass('active');
    
    //Show form 
    const formID = $(this).attr('data-list-id');
    const $form = $(`.js-notify-klaviyo-form-${formID}`);

    $('.notify__form').removeClass('active');
    
    if ($form.length) {
      $(`.js-notify-klaviyo-form-${formID}`).addClass('active');
    }
  });
  
  $notifyClose.click(function() {
    $('.js-notify-panel .notify-panel__wrapper').removeClass('active');
    $('.js-notify-panel .right__drawer__overlay').removeClass('active');
  });
});