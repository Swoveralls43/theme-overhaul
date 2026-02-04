/*
 **************************************
  Filters
 **************************************
*/

window.addEventListener('load', function () {
  const selectors = {
    filter: ".js-filter",
    grid: ".js-product-grid",
    filterWrapper: '.js-filter-body-wrapper',
    filterInput: '.js-filter-input',
    sortInput: '.js-sort-input',
    filterInputChecked: '.js-filter-input:checked',
    accordionToggle: '.js-filter-heading',
    accordionContent: '.js-filter-list',
    btnOpen: '.js-toggle-filters',
    btnClose: '.js-filter-btn-close',
    btnShow: '.js-filter-btn-show',
    btnClear: '.js-filter-btn-clear',
    overlay: '.js-filter-overlay',
    activeFiltersWrapper: '.js-active-filters',
    productGrid: '.js-product-grid',
    paginationControl: '.js-page-update',
    productFinder: '.js-product-finder'
  }
  let filter = $(selectors.filter);
  let sortInputs = $(selectors.sortInput);
  let filterWrapper = $(selectors.filterWrapper);
  let btnOpen = $(selectors.btnOpen);
  let btnClose = $(selectors.btnClose);
  let overlay = $(selectors.overlay);
  
  const setSelectors = () => {
    filter = $(selectors.filter);
    sortInputs = $(selectors.sortInput);
    filterWrapper = $(selectors.filterWrapper);
    btnOpen = $(selectors.btnOpen);
    btnClose = $(selectors.btnClose);
    overlay = $(selectors.overlay);
  }
  
  let windowWidth = window.innerWidth;
  let isOpen = false;

  const disableBodyScroll = bodyScrollLock.disableBodyScroll;
  const clearAllBodyScrollLocks = bodyScrollLock.clearAllBodyScrollLocks;
  
  function applyFilters() {
    const productCountDisplay = document.querySelector('[data-product-count-display]');
    let filterArray = [];
    [...document.querySelectorAll('[data-param-name]')]
      .filter(({ checked }) => checked).forEach((filterCheckbox) => {
      const {
        value,
        dataset: {
          paramName
        }
      } = filterCheckbox;
      
      if (value, paramName) {
        filterArray.push({ paramName, value });
      }
    });
    
    const filterString = filterArray.length ? `${filterArray.map(({ paramName, value }) => `${paramName}=${value}`).join('&')}` : false;
    [...document.querySelectorAll('[data-filter-count]')].forEach((count) => {
      const paramType = count.dataset.filterCount;
      const itemsOfType = filterArray.filter((item) => item.paramName === paramType);

      if (itemsOfType.length < 1) {
        count.innerHTML = "";
        return;
      }

      count.innerHTML = `(${itemsOfType.length})`;
    });

    let newUrl = `${window.location.pathname}${filterString ? `?${filterString}` : ''}`;

    window.location.href = newUrl;

    window.history.pushState({}, '', newUrl);
    fetch(window.location.pathname + `?section_id=collection-product-grid${filterString ? `&${filterString}&filter.v.availability=1` : ''}`)
      .then(res => res.text())
      .then((data) => {
        document.querySelector('[data-product-grid-wrapper]').innerHTML = data;
        if (productCountDisplay) {
          productCountDisplay.innerHTML = `${document.querySelector('[data-product-grid-wrapper] [data-product-count]')?.dataset?.productCount}&nbsp;`;
        }
      }).finally(() => {
        fetch(window.location.pathname + `?section_id=filter${filterString ? `&${filterString}` : ''}`)
          .then(res => res.text())
          .then(data => {
            const temp = document.createElement('div');
            temp.innerHTML = data;
            [...document.querySelectorAll('.js-filter-heading.open')].forEach((toggle) => {
              const selector = toggle.dataset.filterToggle;
              temp.querySelector(`[data-filter-toggle="${selector}"]`).classList.add('open');
              temp.querySelector(`[data-filter-toggle="${selector}"] ~ ul`).style.display = 'block';
            });
            const prevScrollTop = $('.js-filter').scrollTop();
            document.querySelector('.js-filter .filter__body-wrapper').replaceWith(temp.querySelector('.filter__body-wrapper'));
            $('.js-filter').scrollTop(prevScrollTop);
            setSelectors();
            $('.js-filter-body-wrapper').on('click', selectors.filterInput, function() {
              applyFilters();
            });
          });
      });
  }
  
  function clearFilters() {    
    [...document.querySelectorAll('[data-param-name]')]
      .filter(({ checked }) => checked).forEach((filterCheckbox) => filterCheckbox.checked = false)

    applyFilters();
  }

  function initAccordion() {
    $('.js-filter').on('click', selectors.accordionToggle, function() {
      const $accordion = $(this).parent().find(selectors.accordionContent);
      $(selectors.accordionContent).not($accordion).slideUp();
      $(selectors.accordionToggle).not(this).removeClass('open');

      $accordion.slideToggle();
      $(this).toggleClass('open');
    })
  }

  function getScreenOrientation() {
    let isLandscape = ($(window).width() > $(window).height());

    clearAllBodyScrollLocks();

    if (isOpen) {
      if (!isLandscape && windowWidth < 480) {
        disableBodyScroll(filterWrapper[0]);
      } else {
        disableBodyScroll(filter[0]);
      }
    }
  }

  function iOSOverflowFix() {
    filter.style.overflowY = 'hidden';

    setTimeout(() => {
      filter.style.overflowY = 'scroll';
      filter.removeEventListener('webkitTransitionEnd', () => iOSOverflowFix());
    }, 10);
  }

  function openFilter() {
    isOpen = true;

    overlay.addClass('open');
    filter.addClass('open');
    if (window.innerWidth < 768) filter.addEventListener('webkitTransitionEnd', () => iOSOverflowFix());
    getScreenOrientation();
  }

  function closeFilter() {
    isOpen = false;
    overlay.removeClass('open');
    filter.removeClass('open');

    clearAllBodyScrollLocks();
  }
  

  
  btnOpen.on('click', () => {
    openFilter();
  });

  overlay.on('click', () => {
    closeFilter();
  });

  btnClose.on('click', () => {
    closeFilter();
  });
  
  $(selectors.btnClear).on('click', function() {
    clearFilters();    
  });
  
  $('.js-filter-body-wrapper').on('click', selectors.filterInput, function() {
    // applyFilters();
  });

  $('.js-filter-btn-close').click(function(){
    applyFilters();
  });
  
  sortInputs.on('click', function() {
    $(this).trigger('change');
    
    const searchParams = new URLSearchParams(window.location.search);
    searchParams.set('sort_by', $(this).val())

    window.location.href = `${window.location.pathname}?${searchParams.toString()}`;
  });
  
  initAccordion();

  $(window).on('resize rotate', function () {
    windowHeight = window.innerHeight;
    windowWidth = window.innerWidth;

    getScreenOrientation();
  });
  
  // Toggle sorting 
  const $toggleSort = $('.js-toggle-sorting');

  $toggleSort.on('click', function() {
    $(this).closest('.sorting__list').find('.js-filter-list').toggleClass('active');
  });
});

$('.custom-filter-button-size').click(function(e){
  const url = new URL(window.location);
  url.searchParams.set('filter.v.availability', 1);
  url.searchParams.set('filter.v.option.size', e.target.innerHTML);
  window.location.href = url.toString();
});


document.querySelectorAll('.remove-filter').forEach(btn => {
  btn.addEventListener('click', function () {
    const paramName = this.getAttribute('data-filter-name');
    const paramValue = this.getAttribute('data-filter-value');

    const url = new URL(window.location.href);
    const params = url.searchParams;

    // Get all values for this filter name
    const values = params.getAll(paramName);

    // Remove all existing
    params.delete(paramName);

    // Re-add only values not equal to the one clicked
    values.forEach(value => {
      if (value !== paramValue) {
        params.append(paramName, value);
      }
    });

    // Redirect to updated URL
    window.location.href = url.pathname + '?' + params.toString();
  });
});
