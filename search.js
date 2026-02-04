document.addEventListener('DOMContentLoaded', function () {


  const primaryIndex = 'shopify_ics_products',
  $body = $('body'),
  $headerSearch = $('.js-header-search'),
  $headerSearchMobile = $('.js-header-search-mobile'),
  $headerSearchInput = $('.js-header-search-input'),
  $searchMobileWrapper = $('.header__search__mobile__wrapper');
  $searchMobileClose = $('.header__search__mobile__close');
  $searchOverlay = $('.js-search-overlay'),
  $resultsModal = $('.js-header-results-modal'),
  $resultsContainer = $('.js-header-results'),
  $resultsTeamsList = $('.js-search-teams-list'),
  $resultsCollectionsList = $('.js-search-collections-list'),
  $resultsSidebar = $('.js-search-results-sidebar'),
  $submitSearch = $('.js-submit-search'),
  $searchTeams = $('.js-see-all-teams'),
  $allTeamsList = $('.js-all-teams-list'),
  $teamsSearch = $('.js-teams-search'),
  $searchFavoriteTeams = $('.js-favorite-teams-toggle'),
  $favoriteTeamsContainer = $('.js-favorite-teams-container'),
  $searchIcon = $('.js-search-icon'),
  activeClass = 'active',
  gridOnlyClass = 'grid-only';
  
  $headerSearchInput.focus(function() {
    const currentSearchType = $(this).data("searchType");
    
    $headerSearch.addClass(activeClass);
    
    const val = $(this).val();
    
    if (val != '') {
      const filteredResultsModal = $resultsModal.filter(function() {
        return $(this).data("searchType") === currentSearchType
      });
      filteredResultsModal.addClass(activeClass);
    }
  }).focusout(function() {
    $headerSearch.removeClass(activeClass);
  });
  
  $searchIcon.click(function() {
    $headerSearchInput.focus();
  })
  
  $headerSearch.click(function(e) {
    e.stopPropagation();
  });

  $headerSearchMobile.click(function(e) {
    e.stopPropagation();
  });

  $headerSearchMobile.click(function(e) {
    $searchMobileWrapper.addClass(activeClass);
    $body.addClass('no-scroll');
  });

  $searchMobileClose.click(function(e) {
    $searchMobileWrapper.removeClass(activeClass);
    $body.removeClass('no-scroll');
  });
  
  let callSearch;
  
  $headerSearchInput.keydown(function() {
    //Reset search timer each keypress
    clearTimeout(callSearch);

    const $headerSearchInputThis = $(this);
    const currentSearchType = $(this).data("searchType");
    const filteredResultsModal = $resultsModal.filter(function() {
      return $(this).data("searchType") === currentSearchType
    });
    
    callSearch = setTimeout(function() {
      const val = $headerSearchInputThis.val();
      
      if (val == '') {
        filteredResultsModal.removeClass(activeClass);
      }
      else {
        headerSearch(val, filteredResultsModal);
      }
    }, 500);
  });
  
  $submitSearch.click(function() {
    const val = $(this).closest('.header__search').find('.js-header-search-input').val();
    submitSearch(val);
  });

  $headerSearch.submit(function(e) {
    e.preventDefault();
    const val = $(this).find('.js-header-search-input').val();
    submitSearch(val);
  });
  
  function submitSearch(search) {
    let searchURL = '/search?type=product&q=' + encodeURIComponent(search);
    window.location.href = searchURL;
  }
  
  function buildCollectionItems(item) {
    return `
    <div class="search__results__list-item">
      <a href="/collections/${item.handle}">
        <img src="https://cdn.shopify.com/s/files/1/0457/9908/0097/files/arrow-circle.png?v=1644884645" alt="">
        <h4>${item.title}</h4>
      </a>
    </div>
    `
  }
  
  function buildTeamItems(item) {
    const teamTitle = $.trim(item.title.split('|')[1]);
    const teamHandle = item.handle.replace('logo-', '');
    return `
    <div class="search__results__list-item">
      <a href="/collections/${teamHandle}">
        ${item.body_html}
        <h4>${teamTitle}</h4>
      </a>
    </div>
    `
  }
  
  function buildResultItems(item) {
    return `
    <div class="header__search__grid-item">
      <a href="/products/${item.handle}">
        <img src="${item.product_image}" alt="${item.title}">
        <h4>${item.title}</h4>
        <p>$${item.price.toFixed(2)}</p>
      </a>
    </div>
    `
  }
  
  function buildTeamsList(item) {
    const teamTitle = $.trim(item.title.split('|')[1]);
    const teamHandle = item.handle.replace('logo-', '');
    
    return `
    <div class="right__drawer__team">
      <a href="/collections/${teamHandle}">
        ${item.body_html}
        <div class="right__drawer__team-info">
          <h4 class="right__drawer__team-title">${teamTitle}</h4>
        </div>
      </a>
    </div>
    `
  }
  
  function buildFavotireTeamsList(item) {
    const teamTitle = $.trim(item.title.split('|')[1]);
    const teamHandle = item.handle.replace('logo-', '');
    let league;
    
    let $img = '';
    
    if (item.body_html !== null && typeof item.body_html !== "undefined") {
      $img = item.body_html;
    }
    
    $.each(item.tags, function(i, tag) {
      if (tag.includes('league-logo-')) {
        league = tag.split('league-logo-')[1].toUpperCase();
      }
    });
    
    return `
    <div class="drawer__suggested__favorite__team favorite-team-result js-favorite-team" data-team="${teamTitle}" data-league="${league}">
      <div class="drawer__suggested__favorite__team-left">
        ${$img}
        <div class="drawer__suggested__favorite__team-info">
          <h4 class="drawer__suggested__favorite__team-title">${teamTitle}</h4>
          <h4 class="drawer__suggested__favorite__team-name">${league}</h4>
        </div>
      </div>
      <div>
      <div class="full-heart">
        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="18" viewBox="0 0 20 18">
            <path data-name="Heart" d="M14.591 0A5.443 5.443 0 0 0 10 2.481 5.443 5.443 0 0 0 5.409 0 5.347 5.347 0 0 0 0 5.271a5.447 5.447 0 0 0 .915 2.936c1.136 1.792 8.483 9.351 8.8 9.671a.406.406 0 0 0 .579 0c.312-.32 7.659-7.879 8.794-9.671a5.444 5.444 0 0 0 .916-2.936A5.347 5.347 0 0 0 14.591 0z"/>
        </svg>
      </div>
      <div class="empty-heart">
        <svg xmlns="http://www.w3.org/2000/svg" width="21" height="19" viewBox="0 0 21 19">
            <path data-name="Path 444" d="M210.5 4379.558a5.224 5.224 0 0 1 4.783-3.058 5.159 5.159 0 0 1 5.217 5.1 5.331 5.331 0 0 1-.891 2.854c-1.174 1.859-9.109 10.044-9.109 10.044s-7.935-8.185-9.109-10.044a5.331 5.331 0 0 1-.891-2.854 5.159 5.159 0 0 1 5.217-5.1 5.224 5.224 0 0 1 4.783 3.058z" transform="translate(-200 -4376)" style="fill:none;stroke:#000;stroke-linecap:round;stroke-linejoin:round"/>
        </svg>
      </div>
    </div>
    `
  }
  
  function dropdownTeamBuilder(item) {
    return `
    <li class="dropdown__teams__link__wrapper">
      <a class="dropdown__teams__link" href="/collections/${item.handle.replace('logo-', '')}">
        ${item.body_html}
        <span class="dropdown__teams__link__title">${item.title.split('|')[1].trim()}</span>
      </a>
    </li>
    `;
  }
  
  function filteredSearch(val, filters, $container, builder, searchIndex) {
    searchIndex.search(val, {
      filters: filters,
      hitsPerPage: 100
    }).then((results) => {
      const html = results.hits.map(builder);
      $container.each(function() {
        $(this).html(html);
      });
      
      if ($container.hasClass('js-dropdown-teams')) {
        $container.addClass('dropdown__teams--loaded');
        $container.removeClass('dropdown__teams--hidden');
      }
    });
  }
  
  //Teams search 
  $searchTeams.click(function() {
    const league = $(this).attr('data-league');
    const filterString = `tags:team-logo AND tags:league-logo-${league}`;
    const $leagueTitle = $('.js-teams-drawer-league');
    
    if ($leagueTitle.length) {
      $leagueTitle.text(league);
    }
    
    if ($teamsSearch.length) {
      $teamsSearch.attr('data-league', league);
      $teamsSearch.attr('placeholder', `Search ${league} teams`);
    }
    
    filteredSearch('', filterString, $allTeamsList, buildTeamsList, aZIndex);
  });
  
  $searchFavoriteTeams.click(function () {
    const filterString = `tags:team-logo`;
    filteredSearch('', filterString, $favoriteTeamsContainer, buildFavotireTeamsList, aZIndex);
  });
  
  $teamsSearch.keydown(function() {
    //Reset search timer each keypress
    clearTimeout(callSearch);
    
    callSearch = setTimeout(function() {
      const val = $teamsSearch.val();
      const league = $teamsSearch.attr('data-league');
      const filterString = `tags:team-logo AND tags:league-logo-${league}`;
      
      filteredSearch(val, filterString, $allTeamsList, buildTeamsList, aZIndex);
    }, 500);
  });
  
  $(document).on('keydown', '.js-favorite-teams-search', function() {
    const $searchBar = $(this);
    
    //Reset search timer each keypress
    clearTimeout(callSearch);
    
    callSearch = setTimeout(function() {
      const val = $searchBar.val();
      const filterString = `tags:team-logo`;
      
      filteredSearch(val, filterString, $favoriteTeamsContainer, buildFavotireTeamsList, aZIndex);
    }, 500);
  });
  
  
  $(document).on('keydown', '.js-dropdown-search', function() {
    const $searchBar = $(this);
    
    //Reset search timer each keypress
    clearTimeout(callSearch);
    
    callSearch = setTimeout(function() {
      const league  = $searchBar.attr('data-league');
      const $dropdownTeams = $(`.js-dropdown-teams[data-league="${league}"]`);
      const val = $searchBar.val();
      const filterString = `tags:team-logo AND tags:league-logo-${league}`;
      
      filteredSearch(val, filterString, $dropdownTeams, dropdownTeamBuilder, index);
    }, 500);
  });
  
  //Mobile header menus
  $leagueMenuToggle = $('.js-mobile-league-menu-toggle');
  $leagueMenuToggle.click(function() {
    const league  = $(this).attr('data-league');
    const $dropdownTeams = $(`.js-dropdown-teams[data-league="${league}"]`);
    const filterString = `tags:team-logo AND tags:league-logo-${league}`;
    
    if ($dropdownTeams.length) {
      filteredSearch('', filterString, $dropdownTeams, dropdownTeamBuilder, aZIndex);
    }
  });
});