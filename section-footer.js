document.addEventListener('DOMContentLoaded', function () {
  const selectors = {
    trigger: '.js-footer-accordion-trigger',
    content: '.js-footer-accordion-content'
  }

  const modifications = {
    open: 'open'
  }

  const trigger = $(selectors.trigger);
  const contents = $(selectors.content);
  let isInit = false;

  function triggerAccordion($this) {
    if ($this.hasClass(modifications.open)) {
      $this.removeClass(modifications.open);
      $this.next().slideUp(350);
    } else {
      trigger.removeClass(modifications.open);
      contents.slideUp(350);
      $this.toggleClass(modifications.open);
      $this.next().slideToggle(350);
    }
  }

  function initAccordion() {
    if (window.innerWidth <= 1200) {
      if (!isInit) {
        contents.stop().slideUp(0);

        trigger.click(function (e) {
          e.preventDefault();
          let $this = $(this);
          triggerAccordion($this);
        });
        isInit = true;
      }
    } else {
      if (isInit) {
        contents.stop().slideDown(0);
        trigger.removeClass(modifications.open);
        trigger.unbind('click');
        isInit = false;
      }
    }
  }

  initAccordion();

  $(window).resize(function () {
    initAccordion();
  })
});