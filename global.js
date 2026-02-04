function setOpenDrawerListeners(button) {
  button.addEventListener("click", function(e) {
  const rightDrawerTargetType = e.currentTarget.dataset.rightDrawerRenderer;
  if (!button.hasAttribute("data-right-drawer-renderer") ||
    ((window.location.href.indexOf("account") > -1) && rightDrawerTargetType == "account-actions"))
    return
  e.preventDefault();
  renderRightDrawerType(rightDrawerTargetType);
  document.body.classList.add("right__drawer--active");
  document.body.classList.add("no-scroll");
  });
}

function renderRightDrawerType(targetType) {
  const rendererTargetContainer = document.querySelector(`[data-right-drawer-type="${targetType}"]`);
  activeDrawerContent = document.querySelector(".right__drawer__content--active");
  if (activeDrawerContent)
    activeDrawerContent.classList.remove("right__drawer__content--active");
  rendererTargetContainer.getElementsByClassName("right__drawer__content")[0].classList.add("right__drawer__content--active");
}

//Favorite teams

$(document).on('click', '.js-favorite-team', function() {
  
  if ($(this).closest('.js-cf').hasClass('js-no-customer')) {
    renderRightDrawerType('account-actions');
  }
  else {
    $(this).addClass('selected');
    selectFavoriteTeam($(this).attr('data-team'), $(this).attr('data-league'));
    populateSavedTeam($(this));  
  }
});

$(document).on('click', '.js-pdp-ft', function() {
  
  if ($(this).closest('.js-cf').hasClass('js-no-customer')) {
    renderRightDrawerType('account-actions');
    document.body.classList.add("right__drawer--active");
    document.body.classList.add("no-scroll");
  }
  else {
    if ($(this).hasClass('selected')) {
      const team = $(this).attr('data-team');
      const $currentTeam = $(`.js-current-team[data-team="${team}"]`);
      
      $(this).removeClass('selected');
      $currentTeam.removeClass('active');
      $currentTeam.addClass('hidden');
      
      removeTeam($(this).attr('data-team'));
    } 
    else {
      $(this).addClass('selected');
      selectFavoriteTeam($(this).attr('data-team'), $(this).attr('data-league'));
      populateSavedTeam($(this));  
    }
  }
});

function selectFavoriteTeam(team, league) {
  //Build favorite teams array
  let teamsArr = [];
  $.each(CF.customer.get("favorite_teams_list"), function(i, val) {
    teamsArr.push(val);
  });
  
  const teamString = `${team}|${league}`;
  teamsArr.push(teamString);
  
  //Set favorite teams
  CF.customer.set("favorite_teams_list", teamsArr);
  
  //Submit to CF
  saveCfData();
}

function saveCfData() {
  CF.customer.save().then(function(errorObj) {
    if (errorObj) {

    } else {
      const $teamCount = $('.js-header-ft-count');
      const teamCount = CF.customer.get("favorite_teams_list").length;
      
      $teamCount.html(teamCount);
    }
  })
  .catch(function(err) {
    // Something wrong happened :(
    console.error("Could not save customer", err);
  });
}

$(document).on('click', '.js-remove-team', function() {
  const $teamElem = $(this).closest('.js-current-team');
  const team = $teamElem.attr('data-team');
  
  //Visually hide team
  $teamElem.removeClass('active');
  $teamElem.addClass('removed');
  $teamElem.removeClass('selected');
  
  removeTeam(team);
  
  setTimeout(() => {
    $teamElem.addClass('hidden');
  }, 350);
  
  $teamElem.removeClass('.js-current-team');
});

function removeTeam(team) {
  const currentTeam = team;
  let teamsArr = [];
  
  $('.js-current-team.active').each(function() {
    const team = $(this).attr('data-team');
    const league = $(this).attr('data-league');
    const teamString = `${team}|${league}`;
    teamsArr.push(teamString);
  });
  
  //Set favorite teams
  CF.customer.set("favorite_teams_list", teamsArr);
  
  //Submit to CF
  saveCfData();
}

function populateSavedTeam(elem) {
  const img = elem.find('img').clone();
  const team = elem.attr('data-team');
  const league = elem.attr('data-league');
  const teamCol = team.replace(/ /g, '-').toLowerCase();
  
  html = `
  <div class="drawer__suggested__favorite__team js-current-team current-team active" data-team="${team}" data-league="${league}">
    <div class="drawer__suggested__favorite__team-left">
      <a href="/collections/${teamCol}" aria-label="${team}"></a>
      ${img[0] ? img[0].outerHTML : ''}
      <div class="drawer__suggested__favorite__team-info">
        <h4 class="drawer__suggested__favorite__team-title">${team}</h4>
        <h4 class="drawer__suggested__favorite__team-name">${league}</h4>
      </div>
    </div>
    <button type="button" class="js-remove-team">
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
    </button>
  </div>
  `
  $('.js-current-teams').append(html);
}

const getUrlParameter = function getUrlParameter(param) {
  var sPageURL = window.location.search.substring(1),
      sURLVariables = sPageURL.split('&'),
      parameterName,
      i;

  for(i = 0; i < sURLVariables.length; i++) {
    parameterName = sURLVariables[i].split('=');

    if(parameterName[0] === param) {
      return parameterName[1] === undefined ? true : decodeURIComponent(parameterName[1]);
    }
  }
};

//Submit subscriber to Attentive
if ($('.customer__account__page').length) {
  console.log("customer__account__page");
  const createdAccount = getUrlParameter('register') == 'true' ? true : false;
  const dataObj = JSON.parse($('.js-attentive-obj').html());
  
  const userData = {
    phone: dataObj.phone,
    email: dataObj.email
  };
  
  if (createdAccount) {
    console.log("createdAccount");
    $.ajax({
      url: 'https://47brandapps.com/attentive/attentive-ajax-subscriber.php',
      type: 'POST',
      data: userData,
      error: function(data) {
        console.log('error');
        console.log(data);
      },
      success: function(data) {
        console.log('success');
        console.log(data);
      }
    }).done(function(data) {
      const newurl = window.location.protocol + '//' + window.location.host + window.location.pathname;
      window.history.replaceState({path: newurl}, '', newurl);
    });
    
  }
}

window.addEventListener('load', () => {
  const instafeed = document.getElementById('insta-feed');
  const sizeTiles = () => {
    [...document.querySelectorAll('.instafeed-container')]?.forEach((el) => {
      if (window.innerWidth > 768) {
        el.style.paddingTop = `${100 / 3}%`;
        el.style.width = `${100 / 3}%`;
        instafeed.closest('.page-width').style.padding = '0 50px 80px';
      } else {
        el.style.paddingTop = `${100 / 3}%`;
        el.style.width = `${100 / 3}%`;
        instafeed.closest('.page-width').style.padding = '0 18px 40px';
      }
    });
  }

  if (instafeed) {
    setTimeout(() => {
      instafeed.style.padding = '0';

      sizeTiles();
      window.addEventListener('resize', () => {
          sizeTiles();
      })

    }, 200)
  }
});