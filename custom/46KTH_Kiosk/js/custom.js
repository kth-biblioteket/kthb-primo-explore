var kth_vid = "46KTH_Kiosk"
console.log(kth_vid);

/**************************

Kioskanpassningar inlagda med "//Kiosk"

***************************/

(function () {
    'use strict';
    var app = angular.module('viewCustom', ['angularLoad','ngSanitize','ngMaterial','primo-explore.config']);

    /****************************************************************************************************/

        /*In case of CENTRAL_PACKAGE - comment out the below line to replace the other module definition*/

        /*var app = angular.module('centralCustom', ['angularLoad']);*/

    /****************************************************************************************************/
	
	//Ändra de timeouts som ExLibris har satt
	//Numera parameter i BO
	//Starting from the Primo November 2017 Release, New UI users can define the Session Timeout per view via the Views Wizard General Views Attributes page

	//Kiosktimeout via firefox kioskvy(mkiosk)
	app.config(['KeepaliveProvider', 'IdleProvider','$translateProvider', function(KeepaliveProvider, IdleProvider, $translateProvider) {
		//Kiosk 180 sekunder

		IdleProvider.idle(180); //Idle är hur länge man kan vara inaktiv, efter x sekunder visas ExLibris "session upphör..."
		IdleProvider.timeout(0); //Styr hur lång tid användaren har på sig efter att ha blivit "idle" (att klicka på "håll mig inloggad") 0 för att disabla!
		KeepaliveProvider.interval(360);
	}]);
	
	/*****************************************
	
	prmExploreMainAfter
		
	*****************************************/
	app.component('prmExploreMainAfter', {
			bindings: {parentCtrl: '<'},
			controller: 'prmExploreMainAfterController',
			/*template: 	'{{$ctrl.started}}<button type="button" class="btn btn-success" data-ng-hide="$ctrl.started" data-ng-click="$ctrl.start()">Start Demo</button>' +
						'<button type="button" class="btn btn-danger" data-ng-show="$ctrl.started" data-ng-click="$ctrl.stop()">Stop Demo</button>',
						*/
			require: {
				primoExploreCtrl: '^primoExplore'
			}
	});
	
	/********************************************************
	
	full view , ange samma controller som prmExploreMainAfter
	
	*******************************************************/
	app.component('prmFullViewPageAfter', {
		bindings: {parentCtrl: '<'},
		controller: 'prmExploreMainAfterController',
		require: {
				primoExploreCtrl: '^primoExplore'
			}
	});
	
	/*****************************************
	
	prm-account, ange samma controller som prmExploreMainAfter
	
	*****************************************/
	app.component('prmAccountAfter', {
			bindings: {parentCtrl: '<'},
			controller: 'prmExploreMainAfterController',
			require: {
				primoExploreCtrl: '^primoExplore'
			}
	});	
	
	/*****************************************
	
	prm-tags ange samma controller som prmExploreMainAfter
	
	*****************************************/
	app.component('prmTagsAfter', {
			bindings: {parentCtrl: '<'},
			controller: 'prmExploreMainAfterController',
			require: {
				primoExploreCtrl: '^primoExplore'
			}
	});	
	
	/*****************************************
	
	prm-services-page ange samma controller som prmExploreMainAfter
	
	*****************************************/
	app.component('prmServicesPageAfter', {
			bindings: {parentCtrl: '<'},
			controller: 'prmExploreMainAfterController',
			require: {
				primoExploreCtrl: '^primoExplore'
			}
	});
	
	app.controller('prmExploreMainAfterController', function ($compile, $scope, $http, $rootScope, $timeout, $templateCache, $element, Idle, $location, $translate, $mdDialog, $window) {
        var vm = this;
		//Kiosk
		$scope.$on('IdleWarn', function(e, countdown) {
			/*
			$mdDialog.show({
				template: '<div>TIMEOUT</div>',
				bindToController: true,
				clickOutsideToClose: true,
				fullscreen: false,
				escapeToClose: true,
				controller: function() {
				},
				controllerAs: '$ctrl'
			});
			*/
		});
		
		//Kiosk gå till tom söksida vid timeout
		$scope.$on('IdleTimeout', function() {
			vm.absUrl = $location.absUrl();
			//är det redan tomma söksidan?
			if (vm.absUrl.indexOf("primo-explore/search?sortby=rank&vid=" + kth_vid + "&lang=en_US")!== -1) {
				document.querySelector('button[aria-label="Keep me alive"]').click();
			} else {
				//reset personalization?
				//vm.primoExploreCtrl.userSessionManagerService.personalizationDialogService.resetPersonalization();
				$window.location.assign('/primo-explore/search?vid=' + kth_vid);
			}
		});
		
		/*************************************************************
		
		Templates(i $templateCache) för Primo directives som KTH-anpassats.
		
		Dessa måste ses över vid varje ny release!!
		
		Ändra strategi till att endast använda  After - "placeholder directives" som 
		exlibris har lagt in sist i varje eget directive: prm-[whatever]-after.
		
		*************************************************************/
		
		/**************************
		
		prm-saved-queries-list	
		
		**************************/
		
		$templateCache.put('components/search/searchResult/savedQueriesList/saved-queries-list.html',
		'<div class="content-tab saved-query-list" ng-init="selectedCounter=0;">' +
			'<md-list aria-label="{{\'nui.aria.savedQueriesList.list\' | translate}}">' +
				'<md-subheader>' +
					'<div layout="row" sticky sticky-class="is-stuck" offset="56">' +
						'<md-checkbox ng-if="$ctrl.itemlist.length > 0" aria-label="Select All" ng-checked="$ctrl.isAllChecked()" md-indeterminate="$ctrl.getCheckedItems().length > 0  && $ctrl.getCheckedItems().length < $ctrl.itemlist.length" ng-click="$ctrl.selectAllToggle()"></md-checkbox>' +
						'<span>{{$ctrl.getSavedQueriesHeader()}}</span>' +
					'</div>' +
				'</md-subheader>' +
				'<md-list-item tabindex="0" class="md-2-line saved-query-list-2-line" aria-label="{{\'nui.aria.savedQueriesList.item\' | translate}}" ng-repeat="item in $ctrl.itemlist track by $index" layout="row">' +
					'<div class="has-checkbox" flex="5">' +
						'<span class="list-item-count">{{$index+1}}</span>' +
						'<md-checkbox flex="5" aria-live="assertive" aria-label="{{$ctrl.decodeString(item.query.split(\',\')[2])}} {{\'nui.aria.brief.select\' | translate}} {{$index+1}}" ng-model="item.checked"></md-checkbox>' +
					'</div>' +
					'<div id="{{item.ID}}" class="md-list-item-text" layout="column" flex="80" layout-align="start start">' +
						'<a ng-href="{{$ctrl.isSearchHistory ? item.deepLink + \'&came_from=search_history\' : item.deepLink + \'&came_from=saved_queries\'}}" target="_self" class="bold-text">' +
							'<h3 class="item-title">' +
								'<div ng-if="item.mode === \'simple\'">' +
									'<span ng-if="!(item.query.split(\',\')[0]===\'any\' && item.query.split(\',\')[1]===\'contains\')" class="ng-binding">' +
										'<span translate="search-advanced.scope.option.nui.advanced.index.{{item.query.split(\',\')[0]}}"></span> ' +
										'<span translate="search-advanced.precisionOperator.option.{{item.query.split(\',\')[1]}}"></span> ' +
									'</span>' +
									'<span>{{$ctrl.decodeString(item.query.split(\',\')[2])}}</span>' +
								'</div>' +
								'<span ng-init="prevBoolOper=\'AND\'"></span>' +
								'<div ng-if="item.mode === \'advanced\'" ng-repeat="q in item.query.split(\';\') track by $index" class="string-block animate-scale middle" ng-class="{\'clear-row\': prevBoolOper === \'OR\'}" ng-init="prevBoolOper = item.query.split(\';\')[$index-1].split(\',\')[3];multipleQueryItems=item.query.split(\';\').length>1">' +
									'<prm-icon ng-if="$index===0 || prevBoolOper === \'OR\'" icon-type="svg" svg-icon-set="primo-ui" aria-label="{{\'nui.aria.savedQueriesList.arrow\' | translate}}" icon-definition="keyboard-return" class="prm-positive h-flipped"></prm-icon>' +
									'<span ng-if="$index!==0 && prevBoolOper !== \'OR\'">&nbsp;</span>' +
									'<span ng-if="$index!==0" class="ng-binding"><span translate="search-advanced.boolOperator.option.{{prevBoolOper}}"></span></span> ' +
									'<span class="ng-binding">' +
										'<span ng-if="multipleQueryItems || !(item.query.split(\',\')[0]===\'any\' && item.query.split(\',\')[1]===\'contains\')" class="ng-binding">' +
											'<span translate="search-advanced.scope.option.nui.advanced.index.{{q.split(\',\')[0]}}"></span> ' +
											'<span translate="search-advanced.precisionOperator.option.{{q.split(\',\')[1]}}"></span> ' +
										'</span>{{$ctrl.decodeString(q.split(\',\')[2])}}' +
									'</span>' +
								'</div>' +
							'</h3>' +
						'</a>' +
						'<h4><strong><span translate="nui.favorites.search.scope"></span></strong> <span translate="{{\'tabbedmenu.\'+ item.tab +\'.label\'}}"></span> <i>/</i> <span translate="scopes.option.{{item.scope}}"></span></h4>' +
						'<p class="weak-text text-ellipsis">' +
							'<prm-saved-query-filter [item]="item"></prm-saved-query-filter><md-tooltip><prm-saved-query-filter [item]="item"></prm-saved-query-filter></md-tooltip>' +
						'</p>' +
						'<h4>{{$ctrl.convertDate(item.creationDate)}}</h4>' +
						'<div class="md-secondary item-actions saved-query-actions result-item-actions" layout-xs="column" layout-sm="column" layout-gt-sm="row" layout-align="center center">' +
							//RSS AUGUSTIRELEASE
							'<md-button ng-if="$ctrl.displayRSS && !$ctrl.isSearchHistory" class="md-icon-button" aria-label="{{\'nui.favorites.search.rss.tooltip\' | translate}}" ng-click="$ctrl.createRSS(item)">' +
								'<prm-icon ng-if="!item.rsscreated" icon-type="svg" svg-icon-set="primo-ui" icon-definition="rss" aria-label="{{\'nui.favorites.search.rss.tooltip\' | translate}}" class="custom-button"></prm-icon>' +
								'<prm-icon ng-if="item.rsscreated" icon-type="svg" svg-icon-set="primo-ui" icon-definition="rss" aria-label="{{\'nui.favorites.search.rss.tooltip\' | translate}}" class="custom-button"></prm-icon>' +
								'<md-tooltip><span translate="nui.favorites.search.rss.tooltip"></span></md-tooltip>' +
							'</md-button>' +
							'<md-button ng-if="!$ctrl.isSearchHistory && $ctrl.isDisplayAlert(item)" class="md-icon-button" aria-label="{{\'nui.aria.savedQueriesList.alert\' | translate}}" ng-click="$ctrl.updateAlert(item,item.email)">' +
								'<prm-icon ng-if="!item.alert" icon-type="svg" svg-icon-set="primo-ui" icon-definition="alert" aria-label="{{\'nui.aria.savedQueriesList.alert\' | translate}}" class="custom-button"></prm-icon>' +
								'<prm-icon ng-if="item.alert" icon-type="svg" svg-icon-set="primo-ui" icon-definition="alerted" aria-label="{{\'nui.aria.savedSearches.notAlert\' | translate}}" class="custom-button"></prm-icon>' +
								'<md-tooltip><span translate="nui.favorites.search.alert.single.tooltip"></span></md-tooltip>' +
							'</md-button>' +
							'<md-button ng-if="!$ctrl.isSearchHistory" class="md-icon-button" aria-label="{{\'nui.aria.savedQueriesList.remove\' | translate}}" ng-click="$ctrl.removeSearch(item.ID)">' +
								//KTHB hjärta
								//'<prm-icon icon-type="svg" svg-icon-set="primo-ui" icon-definition="prm_unpin" aria-label="{{\'nui.aria.savedQueriesList.remove\' | translate}}" class="custom-button"></prm-icon>' +
								'<prm-icon icon-type="svg" svg-icon-set="action" icon-definition="ic_favorite_24px" aria-label="{{\'nui.aria.savedQueriesList.remove\' | translate}}" class="custom-button"></prm-icon>' +
								'<md-tooltip><span translate="nui.favorites.search.unpin.single.tooltip"></span></md-tooltip>' +
							'</md-button>' +
							'<md-button ng-if="$ctrl.isLoggedIn() && $ctrl.isSearchHistory   && $ctrl.isSearchHistoryItemInSavedSearches(item)" class="md-icon-button" aria-label="{{\'nui.favorites.search.unpin.single.tooltip\' | translate}}" ng-click="$ctrl.removeSearchHistoryItemFromSavedSearches(item.ID)">' +
								//KTHB hjärta
								//'<prm-icon icon-type="svg" svg-icon-set="primo-ui" icon-definition="prm_unpin" aria-label="{{\'nui.favorites.search.unpin.single.tooltip\' | translate}}" class="custom-button"></prm-icon>' +
								'<prm-icon icon-type="svg" svg-icon-set="action" icon-definition="ic_favorite_24px" aria-label="{{\'nui.favorites.search.unpin.single.tooltip\' | translate}}" class="custom-button"></prm-icon>' +
								'<md-tooltip><span translate="nui.favorites.search.unpin.single.tooltip"></span></md-tooltip>' +
							'</md-button>' +
							'<md-button ng-if="$ctrl.isLoggedIn() && $ctrl.isSearchHistory  && !$ctrl.isSearchHistoryItemInSavedSearches(item)" class="md-icon-button" aria-label="{{\'nui.favorites.search.save.single.tooltip\' | translate}}" ng-click="$ctrl.saveSearchHistoryItemToSavedSearches(item.ID)">' +
								//KTHB hjärta
								//'<prm-icon icon-type="svg" svg-icon-set="primo-ui" icon-definition="prm_pin" aria-label="{{\'nui.favorites.search.save.single.tooltip\' | translate}}" class="custom-button"></prm-icon>' +
								'<prm-icon icon-type="svg" svg-icon-set="action" icon-definition="ic_favorite_outline_24px" aria-label="{{\'nui.favorites.search.save.single.tooltip\' | translate}}" class="custom-button"></prm-icon>' +
								'<md-tooltip><span translate="nui.favorites.search.save.single.tooltip"></span></md-tooltip>' +
							'</md-button>' +
							'<md-button ng-if="$ctrl.isSearchHistory" class="md-icon-button" aria-label="{{\'nui.favorites.search.remove.single.tooltip\' | translate}}" ng-click="$ctrl.removeSearchHistoryItem(item.ID)">' +
								'<prm-icon icon-type="svg" svg-icon-set="action" icon-definition="ic_delete_24px" aria-label="{{\'nui.favorites.search.remove.single.tooltip\' | translate}}" class="custom-button"></prm-icon>' +
								'<md-tooltip><span translate="nui.favorites.search.remove.single.tooltip"></span></md-tooltip>' +
							'</md-button>' +
						'</div>' +
					'</div>' +
					'<div flex="20" flex-md="0" flex-lg="20" flex-xl="20" ng-class="{\'flex-lgPlus-15\': $ctrl.mediaQueries.lgPlus}"></div>' +
				'</md-list-item>' +
			'</md-list>' +
			//RSS AUGUSTIRELEASE
			'<form method="post" id="RRSFORM" name="RssForm" action="/" target="rssWindow">' +
				'<input type="hidden" name="ver" value="2_1_4"> ' +
				'<input type="hidden" name="gatherpagestat" value="true"> ' +
				'<input type="hidden" name="subscribeRSS" value="A=Primo_Local&amp;I=VOLCANO&amp;S=F4CE012EC5946271B54EED773A411568&amp;G=&amp;IP=10.1.234.133&amp;SRVR=il-primoqa02.corp.exlibrisgroup.com&amp;P=rssSubscription&amp;OP=click&amp;TYP=Page_View_4.9.9.0&amp;O=%26%26rank%26%26VOLCANO%26VOLCANO%26%26&amp;O1=&amp;O2=primo_alma&amp;O3=&amp;O4=&amp;O5=972EXL.PCO.PSTG&amp;O6=&amp;O7=0&amp;O8=war&amp;O9=Auto1&amp;O10=&amp;O11=&amp;O12=0&amp;O13=&amp;O14=&amp;O15=&amp;O16=&amp;O17=default_tab&amp;O18=&amp;O19=&amp;O20=&amp;O23=Primo&amp;"> ' +
				'<input type="hidden" name="boombaseurl" value="https://beacon01.alma.exlibrisgroup.com/boom/apache_pb.gif">' +
			'</form>' +
			'<div layout="row" layout-align="center center" class="padding-top-large">' +
				'<md-button (click)="$ctrl.nextResults()" ng-if="$ctrl.hasNextResults()" translate="nui.brief.results.loadMore" class="button-confirm button-large"></md-button>' +
			'</div>' +
		'</div>' +
		'<prm-saved-queries-list-after parent-ctrl="$ctrl"></prm-saved-queries-list-after>');
				
		/******	prm-top-bar ******/
		$templateCache.put('components/search/topbar/topbar.html',
		'<prm-top-bar-before parent-ctrl="ctrl"></prm-top-bar-before>' +
		//Visa vem som är inloggad / språkbyte
		'<div layout="row" class="kth_top-language-bar">' +
			'<div flex="15" flex-md="0" flex-sm="0" flex-xs="0"></div>' +
			'<div flex layout="column" layout-align="center end">' +
				'<div flex layout="row">' +
					// lagt in "eshelf.user.logged_in_as" i code table i Primo BO
					//Kiosk visa inte username
					//'<div>{{\'eshelf.user.logged_in_as\' | translate}}: <span class="user-name" ng-cloak>{{$ctrl.username || \'eshelf.user.anonymous\' | translate}}</span>&nbsp;&nbsp;</div>' +
					'<prm-change-lang aria-label="{{\'eshelf.signin.title\' | translate}}" ndg-if="$ctrl.displayLanguage" label-type="icon"></prm-change-lang>' +
				'</div>' +
			'</div>' +
			'<div flex="15" flex-md="0" flex-sm="0" flex-xs="0"></div>' +
		'</div>' +
		
		'<div class="top-nav-bar" layout="row" tabindex="0" role="navigation">' +
			//'<prm-skip-to tabindex="0"></prm-skip-to>' +
			'<div flex="15" flex-md="0" flex-sm="0" flex-xs="0"></div>' +
			'<prm-logo flex></prm-logo>' +
			//'<prm-main-menu ng-if="::$ctrl.showMainMenu" menu-type="menu" flex="50" hide-xs></prm-main-menu>' +
			//här ligger även scroll to top of page... dölj via css istället?
			'<prm-search-bookmark-filter ng-show="$ctrl.displayFavorites" class="view-switcher" layout-align="end center" layout="row" flex="0"></prm-search-bookmark-filter>' +
			//'<prm-search-bookmark-filter ng-show="$ctrl.displayFavorites" class="view-switcher" layout-align="end center" layout="row" flex="noshrink"></prm-search-bookmark-filter>' +
			'<prm-user-area flex="2"></prm-user-area>' +
			'<div flex="15" flex-md="0" flex-sm="0" flex-xs="0"></div>' +
		'</div>' +
		'<prm-topbar-after parent-ctrl="$ctrl"></prm-topbar-after>');
		
		/******	prm-search-bookmark-filter ******/
		$templateCache.put('components/search/topbar/bookmarkFilter/search-bookmark-filter.html',
		'<md-button ng-if="!$ctrl.isFavorites && $ctrl.showSearchHistoryTab()" class="md-icon-button button-over-dark" aria-label="{{\'nui.favorites.gohistory.tooltip\' | translate}}" ng-click="$ctrl.goToSearchHistory()" ui-state="$ctrl.FAVORITES_STATE" ui-state-params="$ctrl.searchHistoryParams" ui-sref-opts="{reload: true, inherit:false}" href="">' +
			'<md-tooltip md-delay="400"><span translate="nui.favorites.gohistory.tooltip"></span></md-tooltip>' +
			'<prm-icon aria-label="{{\'nui.favorites.gohistory.tooltip\' | translate}}" class="rotate-25" icon-type="svg" svg-icon-set="primo-ui" icon-definition="restore"></prm-icon>' +
		'</md-button>' +
		'<div id="fixed-buttons-holder" ng-class="{\'fixed-to-top\': $ctrl.fixedToTop()}" layout="row" layout-align="center center">' +
			//Ta bort ikonerna utom backtotop
			'<md-button ng-if="$ctrl.isFavorites" id="search-button" class="md-icon-button button-over-dark" aria-label="{{\'nui.favorites.goSearch.tooltip\' | translate}}" ng-click="$ctrl.goToSearch()" ui-state="$ctrl.uiState" ui-state-params="$ctrl.searchStateParams" ui-sref-opts="{reload: true, inherit:false}" href="">' +
				'<md-tooltip md-delay="400"><span translate="nui.favorites.goSearch.tooltip"></span></md-tooltip>' +
				'<prm-icon aria-label="{{\'nui.favorites.goSearch.tooltip\' | translate}}" icon-type="svg" svg-icon-set="primo-ui" icon-definition="magnifying-glass" layout="row"></prm-icon>' +
			'</md-button>' +
			'<md-button ng-if="!$ctrl.isFavorites" id="favorites-button" class="md-icon-button button-over-dark" aria-label="{{\'nui.favorites.goFavorites.tooltip\' | translate}}" ng-click="$ctrl.goToFavorties()" ui-state="$ctrl.FAVORITES_STATE" ui-state-params="$ctrl.favoritesStateParams" ui-sref-opts="{reload: true, inherit:false}" href="">' +
				'<md-tooltip md-delay="400"><span translate="nui.favorites.goFavorites.tooltip"></span></md-tooltip>' +
				'<prm-icon aria-label="{{\'nui.favorites.goFavorites.tooltip\' | translate}}" class="rotate-25" icon-type="svg" svg-icon-set="primo-ui" icon-definition="prm_pin"></prm-icon>' +
			'</md-button>' +
			
			'<div ng-if="$ctrl.fixedToTop()" class="ng-scope">' +
				'<md-button id="back-to-top-button" class="zero-margin md-icon-button md-button md-ink-ripple" type="button" aria-label="User Action" ng-click="$ctrl.backToTop()">' +
					'<prm-icon icon-type="{{$ctrl.backToTopIcon.backToTop.type}}" svg-icon-set="{{$ctrl.backToTopIcon.backToTop.iconSet}}" icon-definition="{{$ctrl.backToTopIcon.backToTop.icon}}"></prm-icon>' +
					'<div class="md-ripple-container"></div>' +
				'</md-button>' +
			'</div>' +
		'</div>' +
		'<prm-search-bookmark-filter-after parent-ctrl="$ctrl"></prm-search-bookmark-filter-after>');

		/******	prm-logo ******/
		$templateCache.put('components/search/topbar/logo/logo.html',
		'<div class="product-logo" tabindex="0" role="banner" id="banner">' +
			//
			'<a href="{{$ctrl.kthb_link}}">' +
				//'<img class="logo-image" translate-attr="{ alt: \'nui.header.LogoAlt\' }" ng-src="{{$ctrl.iconLink}}"/>' +
				'<img class="logo-image" translate-attr="{ alt: \'nui.header.LogoAlt\' }" ng-src="custom/' + kth_vid + '/img/KTH_Logotyp_RGB_2013-2.svg"/>' +
			'</a>' +
		'</div>' +
		'<prm-logo-after parent-ctrl="$ctrl"></prm-logo-after>');

		/******	prm-user-area ******/
		$templateCache.put('components/search/topbar/userArea/user-area.html',
		'<md-button class="user-menu-button accessible-only" aria-label="{{\'nui.aria.userarea.open\' | translate}}" ng-mouseenter="$ctrl.doMenuHover()" ng-mouseleave="$ctrl.cancelMenuHover()" ng-click="$event.stopPropagation();$ctrl.enableMobileMenu()" hide-xs>' +
			'<div class="user-button-text" layout="column" layout-align="center start">' +
				'<span class="user-name">{{$ctrl.userName() || \'eshelf.user.anonymous\' | translate}}</span>'+ 
				'<span class="user-language text-uppercase" ng-if="$ctrl.displayLanguage" translate="mypref.language.option.{{$ctrl.selectedLanguage}}"></span>' +
			'</div>' +
		'</md-button>' + 
		//bort med user menu
		//'<md-button class="user-menu-button" tabindex="-1" aria-hidden="true" aria-label="{{\'nui.aria.userarea.open\' | translate}}" ng-mouseenter="$ctrl.doMenuHover()" ng-mouseleave="$ctrl.cancelMenuHover()" (click)="$ctrl.showUserMenu = true" hide-xs>' +
			//'<div class="user-button-text" layout="column" layout-align="center start"><span class="user-name">{{$ctrl.userName() || \'eshelf.user.anonymous\' | translate}}</span> ' +
				//'<span class="user-language text-uppercase" ng-if="$ctrl.displayLanguage" translate="mypref.language.option.{{$ctrl.selectedLanguage}}"></span>' +
			//'</div>' +
		//'</md-button>' +
		//Bort med mobile menu button
		//'<md-button class="mobile-menu-button zero-margin" aria-label="{{\'nui.aria.userarea.open\' | translate}}" (click)="$ctrl.enableMobileMenu()" hide-gt-xs style="min-width: 60px"> ' +
		//	'<prm-icon [icon-type]="::$ctrl.topBarIcons.more.type" [svg-icon-set]="::$ctrl.topBarIcons.more.iconSet" [icon-definition]="::$ctrl.topBarIcons.more.icon"></prm-icon>' +
		//'</md-button>' +
		//Ingen fab toolbar
		//'<md-fab-toolbar md-direction="left" md-open="$ctrl.showUserMenu" ng-mouseleave="$ctrl.showUserMenu = false">'+
		//'<md-fab-toolbar md-direction="left" md-open="true" ng-mouseleave="">'+
			/*
			'<md-fab-trigger class="align-with-text">' +
				'<md-button aria-hidden="true" class="button-with-icon zero-margin" aria-label="{{\'nui.aria.userarea.open\' | translate}}">' + 
					'<div style="opacity: 0" class="user-button-text" layout="column" layout-align="center start">' +
						'<span class="user-name">{{$ctrl.userName() || \'eshelf.user.anonymous\' | translate}}</span> <span class="user-language" ng-if="$ctrl.displayLanguage" translate="mypref.language.option.{{$ctrl.selectedLanguage}}"></span>' +
					'</div>' +
				'</md-button>' +
			'</md-fab-trigger>' +
			*/
			'<md-toolbar>' +
				'<md-fab-actions class="md-toolbar-tools zero-padding buttons-group">' +
					//KTHB Meny (ordningen ändrad)
					//Help
					'<div class="kth_fabaction">' +
					//Kiosk egen helpdialogruta
						'<md-button aria-label="{{$ctrl.getLibraryCardAriaLabel() | translate}}" class="button-with-icon zero-margin" ng-click="$ctrl.helpdialog()">' +
							//'<prm-icon>' + 
								'<md-icon class="md-primoExplore-theme" aria-hidden="true" style="">' + 
									'<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" version="1.1" id="Capa_1" width="100%" height="100%" viewBox="0 0 70 70" xml:space="preserve"><path d="M50.859,45.206c-4.799-1.713-9.594-3.426-14.394-5.14c-0.292-1.569-0.567-3.153-0.774-4.741c0.135-0.559,0.188-1.146,0.141-1.75c-0.591-7.523-4.064-13.958-5.971-16.979c2.425-0.926,4.966-2.099,7.619-3.535c0.84-0.455,1.406-1.287,1.525-2.235c0.116-0.947-0.229-1.894-0.938-2.54L29.93,0.812c-1.201-1.104-3.072-1.025-4.175,0.177c-1.104,1.202-1.025,3.071,0.178,4.175l4.987,4.581c-3.637,1.68-6.948,2.751-9.881,3.193c-0.286,0.043-0.548,0.138-0.797,0.253c-0.226,0.001-0.454,0.021-0.683,0.076c-3.2,0.777-6.406,0.337-8.58-1.176C9.445,11.022,8.555,9.51,8.332,7.597c-0.19-1.621-1.657-2.785-3.277-2.594C3.434,5.193,2.272,6.66,2.461,8.28c0.421,3.617,2.198,6.611,5.14,8.66c2.454,1.71,5.604,2.605,8.912,2.605c0.716,0,1.44-0.043,2.165-0.128c0.172,0.743,0.491,1.463,0.98,2.111c0.044,0.06,4.434,6.041,4.975,12.923c0.002,0.026,0.011,0.051,0.014,0.077c-2.554,2.882-4.527,6.245-4.483,10.237c0.053,4.796,3.879,8.294,7.742,10.473c3.988,2.249,7.562-3.878,3.578-6.125c-1.631-0.918-3.997-2.236-4.228-4.348c-0.195-1.77,0.826-3.422,2.022-4.825c0.15,0.865,0.307,1.729,0.459,2.586c0.46,2.604,2.144,3.414,4.402,4.222c4.942,1.767,9.888,3.53,14.828,5.295C53.292,53.587,55.133,46.733,50.859,45.206z"/><circle cx="18.086" cy="5.554" r="5.554"/></svg>' + 
								'</md-icon>' + 
							//'</prm-icon>' +
							'<md-tooltip md-delay="">' +
								'<span translate="mainmenu.help"></span>' +
							'</md-tooltip>' + 
							'<span translate="mainmenu.label.help"></span>' +
						'</md-button>' + 
					'</div>' +
					//Databaslistan
					//Kiosk ingen dblista
					/*
					'<div class="kth_fabaction">' +
						'<button class="button-with-icon zero-margin md-button md-primoExplore-theme md-ink-ripple" type="button" aria-label="Go To Test" ng-click="$ctrl.goToKTHDatabases()">' + 
							//'<prm-icon aria-label="Go to my favorites" icon-type="svg" svg-icon-set="action" icon-definition="ic_favorite_outline_24px">' + 
								'<md-icon class="md-primoExplore-theme" aria-hidden="true" style="">' +
									'<svg viewBox="-50 0 1100 1100"><g><path d="M436.7,379.5c229.3,0,415.1-82.7,415.1-184.8C851.8,92.7,666,10,436.7,10C207.4,10,21.6,92.7,21.6,194.8C21.6,296.8,207.4,379.5,436.7,379.5L436.7,379.5z M436.7,571.5c6.1,0,12-0.3,18.1-0.4c39.2-84.7,124.7-143.6,224.2-143.6c48.7,0,93.9,14.3,132.2,38.6c25.8-24.1,40.6-50.9,40.6-79.3V245.4c0,102.1-185.8,184.8-415.1,184.8c-229.3,0-415.1-82.7-415.1-184.8v141.3C21.6,488.8,207.4,571.5,436.7,571.5L436.7,571.5z M436.7,763.4c3.9,0,7.7-0.2,11.6-0.3c-10.6-27.5-16.6-57.2-16.6-88.4c0-18.1,2.1-35.6,5.7-52.6c-0.3,0-0.5,0-0.8,0c-229.3,0-415.1-82.7-415.1-184.8v141.3C21.6,680.8,207.4,763.4,436.7,763.4L436.7,763.4z M610.3,911.9c-56.1-16.2-104.1-51.4-136.1-98.6c-12.4,0.5-24.9,0.8-37.5,0.8c-229.3,0-415.1-82.7-415.1-184.8v141.3c0,102.1,185.8,184.8,415.1,184.8c64.1,0,124.4-6.7,178.6-18.3c-3.4-6.9-5.3-14.5-5.3-22.5C610,913.7,610.2,912.8,610.3,911.9L610.3,911.9z M969.2,913.2L840.4,784.5c-1.2-1.2-2.5-2.3-3.9-3.3c20.7-31.6,32.7-69.3,32.7-109.8c0-110.7-90.1-200.8-200.8-200.8c-110.7,0-200.8,90.1-200.8,200.8c0,110.7,90.1,200.8,200.8,200.8c36.2,0,70.2-9.7,99.6-26.5c1.3,2.3,2.9,4.3,4.8,6.2l128.7,128.7c14.7,14.7,41.8,11.6,60.4-7.1C980.7,955,983.9,927.9,969.2,913.2L969.2,913.2z M523.6,671.5c0-79.9,65-144.8,144.8-144.8c79.9,0,144.9,65,144.9,144.8s-65,144.8-144.9,144.8C588.6,816.3,523.6,751.3,523.6,671.5L523.6,671.5z"></path></g></svg>' +
								'</md-icon>' + 
							//'</prm-icon>' +
							'<md-tooltip md-delay="">' +
								'<span translate="mainmenu.tooltip.hitta_mer"></span>' +
							'</md-tooltip>' + 
							'<span translate="mainmenu.label.find_db"></span>'+
						'</button>' + 
					'</div>' +
					*/
					//Kiosk karta wagnerguiden NY TAB
					'<div class="kth_fabaction">' +
						'<a ng-if="$ctrl.selectedLanguage==\'sv_SE\'" class="button-with-icon kth-favorite" aria-label="Map" target="_blank" href="http://web.wagnerguide.com/2.1/KTHlibrary.aspx?Lang=sv&Extern=true">' +
							'<md-icon class="md-primoExplore-theme" aria-hidden="true" style="">' + 
								'<svg version="1.1" id="Capa_1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" x="0px" y="0px" viewBox="0 0 684.234 684.234" style="enable-background:new 0 0 684.234 684.234;" xml:space="preserve"><path style="" d="M342.112,0C223.053,0,126.563,96.5,126.563,215.549c0,119.04,215.549,468.685,215.549,468.685s215.559-349.645,215.559-468.685C557.681,96.5,461.181,0,342.112,0z M342.112,382.326c-91.957,0-166.767-74.8-166.767-166.777s74.81-166.796,166.767-166.796c91.986,0,166.826,74.82,166.826,166.796S434.098,382.326,342.112,382.326z M455.045,168.76v-14.851l-1.114-4.143c-0.313-0.498-5.256-9.145-15.193-18.055c-9.878-8.813-25.227-17.997-45.421-17.997c-20.185,0-35.358,9.194-45.089,18.094c-2.98,2.745-5.51,5.462-7.601,7.924c-2.091-2.501-4.739-5.208-7.787-8.012c-9.897-8.813-25.266-17.997-45.47-17.997c-20.166,0-35.329,9.194-45.089,18.094c-9.712,8.91-14.489,17.596-14.763,18.114l-1.036,3.986v14.851h-7.455v123.944h246.237V168.76H455.045L455.045,168.76z M263.101,267.556c6.585-3.889,14.558-6.722,24.24-6.732c9.672-0.01,17.801,2.833,24.543,6.732H263.101z M332.43,261.879c-9.897-8.744-25.08-17.704-45.06-17.704h-0.029c-19.579,0-34.45,8.705-44.151,17.303V156.264h-0.01c1.72-2.638,5.442-7.806,11.07-12.789c7.738-6.79,18.612-13.072,33.111-13.072c14.997,0,26.34,6.722,34.323,13.795c3.976,3.547,7.083,7.122,9.018,9.77l1.729,2.384C332.43,156.352,332.43,261.879,332.43,261.879z M369.039,267.556c6.614-3.889,14.558-6.722,24.25-6.732c9.633-0.01,17.801,2.833,24.543,6.732H369.039z M438.368,261.879c-9.887-8.744-25.109-17.704-45.031-17.704c-19.628-0.039-34.498,8.705-44.171,17.303V156.264h-0.01c1.69-2.599,5.403-7.806,11.05-12.789c7.797-6.79,18.612-13.072,33.121-13.072c14.9,0,26.292,6.722,34.401,13.795c3.898,3.547,6.937,7.122,8.959,9.77l1.7,2.384v105.528H438.368z"/></svg>' +
							'</md-icon>' + 
							'<md-tooltip md-delay="">' +
								'<span translate="">Karta</span>' +
							'</md-tooltip>' + 
							'<span>Bibliotekskarta</span>' +
						'</a>' +
						'<a ng-if="$ctrl.selectedLanguage==\'en_US\'" class="button-with-icon kth-favorite" aria-label="Map" target="_blank" href="http://web.wagnerguide.com/2.1/KTHlibrary.aspx?Lang=en&Extern=true">' +
							'<md-icon class="md-primoExplore-theme" aria-hidden="true" style="">' + 
								'<svg version="1.1" id="Capa_1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" x="0px" y="0px" viewBox="0 0 684.234 684.234" style="enable-background:new 0 0 684.234 684.234;" xml:space="preserve"><path style="" d="M342.112,0C223.053,0,126.563,96.5,126.563,215.549c0,119.04,215.549,468.685,215.549,468.685s215.559-349.645,215.559-468.685C557.681,96.5,461.181,0,342.112,0z M342.112,382.326c-91.957,0-166.767-74.8-166.767-166.777s74.81-166.796,166.767-166.796c91.986,0,166.826,74.82,166.826,166.796S434.098,382.326,342.112,382.326z M455.045,168.76v-14.851l-1.114-4.143c-0.313-0.498-5.256-9.145-15.193-18.055c-9.878-8.813-25.227-17.997-45.421-17.997c-20.185,0-35.358,9.194-45.089,18.094c-2.98,2.745-5.51,5.462-7.601,7.924c-2.091-2.501-4.739-5.208-7.787-8.012c-9.897-8.813-25.266-17.997-45.47-17.997c-20.166,0-35.329,9.194-45.089,18.094c-9.712,8.91-14.489,17.596-14.763,18.114l-1.036,3.986v14.851h-7.455v123.944h246.237V168.76H455.045L455.045,168.76z M263.101,267.556c6.585-3.889,14.558-6.722,24.24-6.732c9.672-0.01,17.801,2.833,24.543,6.732H263.101z M332.43,261.879c-9.897-8.744-25.08-17.704-45.06-17.704h-0.029c-19.579,0-34.45,8.705-44.151,17.303V156.264h-0.01c1.72-2.638,5.442-7.806,11.07-12.789c7.738-6.79,18.612-13.072,33.111-13.072c14.997,0,26.34,6.722,34.323,13.795c3.976,3.547,7.083,7.122,9.018,9.77l1.729,2.384C332.43,156.352,332.43,261.879,332.43,261.879z M369.039,267.556c6.614-3.889,14.558-6.722,24.25-6.732c9.633-0.01,17.801,2.833,24.543,6.732H369.039z M438.368,261.879c-9.887-8.744-25.109-17.704-45.031-17.704c-19.628-0.039-34.498,8.705-44.171,17.303V156.264h-0.01c1.69-2.599,5.403-7.806,11.05-12.789c7.797-6.79,18.612-13.072,33.121-13.072c14.9,0,26.292,6.722,34.401,13.795c3.898,3.547,6.937,7.122,8.959,9.77l1.7,2.384v105.528H438.368z"/></svg>' +
							'</md-icon>' + 
							'<md-tooltip md-delay="">' +
								'<span translate="">Map</span>' +
							'</md-tooltip>' + 
							'<span>Library Map</span>' + 
						'</a>' +
					'</div>' +
					//Kiosk karta wagnerguiden IFRAME
					/*
					'<div class="kth_fabaction">' +
						'<md-button aria-label="Map" class="button-with-icon zero-margin" ng-click="$ctrl.goToLibraryMap()">' +
							//'<prm-icon>' + 
								'<md-icon class="md-primoExplore-theme" aria-hidden="true" style="">' + 
									'<svg version="1.1" id="Capa_1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" x="0px" y="0px" viewBox="0 0 684.234 684.234" style="enable-background:new 0 0 684.234 684.234;" xml:space="preserve"><path style="" d="M342.112,0C223.053,0,126.563,96.5,126.563,215.549c0,119.04,215.549,468.685,215.549,468.685s215.559-349.645,215.559-468.685C557.681,96.5,461.181,0,342.112,0z M342.112,382.326c-91.957,0-166.767-74.8-166.767-166.777s74.81-166.796,166.767-166.796c91.986,0,166.826,74.82,166.826,166.796S434.098,382.326,342.112,382.326z M455.045,168.76v-14.851l-1.114-4.143c-0.313-0.498-5.256-9.145-15.193-18.055c-9.878-8.813-25.227-17.997-45.421-17.997c-20.185,0-35.358,9.194-45.089,18.094c-2.98,2.745-5.51,5.462-7.601,7.924c-2.091-2.501-4.739-5.208-7.787-8.012c-9.897-8.813-25.266-17.997-45.47-17.997c-20.166,0-35.329,9.194-45.089,18.094c-9.712,8.91-14.489,17.596-14.763,18.114l-1.036,3.986v14.851h-7.455v123.944h246.237V168.76H455.045L455.045,168.76z M263.101,267.556c6.585-3.889,14.558-6.722,24.24-6.732c9.672-0.01,17.801,2.833,24.543,6.732H263.101z M332.43,261.879c-9.897-8.744-25.08-17.704-45.06-17.704h-0.029c-19.579,0-34.45,8.705-44.151,17.303V156.264h-0.01c1.72-2.638,5.442-7.806,11.07-12.789c7.738-6.79,18.612-13.072,33.111-13.072c14.997,0,26.34,6.722,34.323,13.795c3.976,3.547,7.083,7.122,9.018,9.77l1.729,2.384C332.43,156.352,332.43,261.879,332.43,261.879z M369.039,267.556c6.614-3.889,14.558-6.722,24.25-6.732c9.633-0.01,17.801,2.833,24.543,6.732H369.039z M438.368,261.879c-9.887-8.744-25.109-17.704-45.031-17.704c-19.628-0.039-34.498,8.705-44.171,17.303V156.264h-0.01c1.69-2.599,5.403-7.806,11.05-12.789c7.797-6.79,18.612-13.072,33.121-13.072c14.9,0,26.292,6.722,34.401,13.795c3.898,3.547,6.937,7.122,8.959,9.77l1.7,2.384v105.528H438.368z"/></svg>' +
								'</md-icon>' + 
							//'</prm-icon>' +
							'<md-tooltip md-delay="">' +
								'<span ng-if="$ctrl.selectedLanguage==\'sv_SE\'">Bibliotekskarta</span>' +
								'<span ng-if="$ctrl.selectedLanguage==\'en_US\'">Library map</span>' +
							'</md-tooltip>' + 
							//TODO Translate
							'<span ng-if="$ctrl.selectedLanguage==\'sv_SE\'">Bibliotekskarta</span>' +
							'<span ng-if="$ctrl.selectedLanguage==\'en_US\'">Library map</span>' +
						'</md-button>' + 
					'</div>' +
					*/
					//Kiosk Bibliotekskontoansökan
					//SAMMA TAB
					/*
					'<div class="kth_fabaction">' +
						'<md-button aria-label="{{$ctrl.getLibraryCardAriaLabel() | translate}}" class="button-with-icon zero-margin" ng-click="$ctrl.goToLibraryAccountApplication()">' +
							//'<prm-icon>' + 
								'<md-icon class="md-primoExplore-theme" aria-hidden="true" style="">' + 
									'<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" xml:space="preserve" style="shape-rendering:geometricPrecision;text-rendering:geometricPrecision;image-rendering:optimizeQuality;width: 110%;height: 110%;" x="0px" y="0px" fill-rule="evenodd" clip-rule="evenodd" viewBox="0 0 100 125">' +
										//fylld
										//'<path d="M90.976,31.714v-0.496c-3.333-10.676-12.339-11.902-22.042-11.965V7.501H33.253v11.751h-0.429   c-9.306,0.158-17.35,2.105-20.301,11.266v2.103h-0.075V71.89h0.075v1.237c2.393,7.426,8.133,10.112,15.178,10.945v8.683h48.067   v-9.012c6.885-0.792,12.679-3.304,15.208-10.947v-0.301h0.029V31.714H90.976z M36.658,49.597c0-2.246,1.826-4.071,4.07-4.071   c2.246,0,4.071,1.826,4.071,4.071c0,2.244-1.826,4.069-4.071,4.069C38.484,53.666,36.658,51.841,36.658,49.597z M60.895,64.569   c-2.908,1.358-6.021,2.582-9.819,2.582c-2.765,0-5.893-0.648-9.571-2.369c-0.599-0.28-0.856-0.99-0.578-1.591   c0.281-0.597,0.993-0.856,1.591-0.577c7.798,3.647,12.665,1.979,17.365-0.214c0.599-0.278,1.311-0.02,1.591,0.578   C61.752,63.578,61.493,64.29,60.895,64.569z M61.886,53.666c-2.246,0-4.071-1.825-4.071-4.069c0-2.246,1.825-4.071,4.071-4.071   c2.243,0,4.069,1.826,4.069,4.071C65.955,51.841,64.129,53.666,61.886,53.666z"></path>' +
										//outline
										'<path stroke="#1954a6" stroke-width="5" d="M76.393,96.084v-2.957v-3.429v-2.466c7.721-0.242,13.928-6.596,13.928-14.375v-40.21c0-7.932-6.455-14.387-14.387-14.387   h-5.17V8.535c0-2.909-2.367-5.275-5.273-5.275H34.509c-2.909,0-5.275,2.366-5.275,5.275v9.725h-5.168   c-7.933,0-14.387,6.455-14.387,14.387v40.21c0,7.779,6.208,14.133,13.929,14.375v2.466v3.429v2.957H76.393z M73.432,93.127H26.566   v-5.883h46.866V93.127z M32.191,8.535c0-1.279,1.039-2.318,2.318-2.318H65.49c1.279,0,2.316,1.04,2.316,2.318v9.725H32.191V8.535z    M12.636,72.857v-40.21c0-6.301,5.127-11.429,11.43-11.429h5.168h41.53h5.17c6.301,0,11.43,5.128,11.43,11.429v40.21   c0,6.303-5.129,11.431-11.43,11.431H24.066C17.763,84.288,12.636,79.16,12.636,72.857z"></path><circle cx="37.744" cy="48.038" r="4.153"></circle><circle cx="62.256" cy="48.038" r="4.153"></circle><path d="M36.82,62.893c-0.673,0.675-0.67,1.769,0.005,2.439c3.646,3.633,8.436,5.449,13.226,5.449c4.79,0,9.581-1.816,13.223-5.449   c0.676-0.671,0.68-1.765,0.008-2.439c-0.674-0.675-1.766-0.676-2.441-0.005c-5.949,5.928-15.629,5.928-21.581,0   C38.584,62.217,37.493,62.218,36.82,62.893z"></path>' +
									'</svg>' +
								'</md-icon>' + 
							//'</prm-icon>' +
							'<md-tooltip md-delay="">' +
								'<span translate="">Application</span>' +
							'</md-tooltip>' + 
							//TODO Translate
							'<span ng-if="$ctrl.selectedLanguage==\'sv_SE\'">Ansökan om bibliotekskonto</span>' +
							'<span ng-if="$ctrl.selectedLanguage==\'en_US\'">Library Account Application</span>' +
						'</md-button>' + 
					'</div>' +
					*/
					//NY TAB
					'<div class="kth_fabaction">' +
						'<a ng-if="$ctrl.selectedLanguage==\'sv_SE\'" class="button-with-icon kth-favorite" aria-label="Map" target="_blank" href="https://apps.lib.kth.se/kiosk/kthbforms_libraryaccount_kiosk.php?formlanguage=swedish">' +
							'<md-icon class="md-primoExplore-theme" aria-hidden="true" style="">' + 
								'<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" xml:space="preserve" style="shape-rendering:geometricPrecision;text-rendering:geometricPrecision;image-rendering:optimizeQuality;width: 110%;height: 110%;" x="0px" y="0px" fill-rule="evenodd" clip-rule="evenodd" viewBox="0 0 100 125">' +
										//fylld
										//'<path d="M90.976,31.714v-0.496c-3.333-10.676-12.339-11.902-22.042-11.965V7.501H33.253v11.751h-0.429   c-9.306,0.158-17.35,2.105-20.301,11.266v2.103h-0.075V71.89h0.075v1.237c2.393,7.426,8.133,10.112,15.178,10.945v8.683h48.067   v-9.012c6.885-0.792,12.679-3.304,15.208-10.947v-0.301h0.029V31.714H90.976z M36.658,49.597c0-2.246,1.826-4.071,4.07-4.071   c2.246,0,4.071,1.826,4.071,4.071c0,2.244-1.826,4.069-4.071,4.069C38.484,53.666,36.658,51.841,36.658,49.597z M60.895,64.569   c-2.908,1.358-6.021,2.582-9.819,2.582c-2.765,0-5.893-0.648-9.571-2.369c-0.599-0.28-0.856-0.99-0.578-1.591   c0.281-0.597,0.993-0.856,1.591-0.577c7.798,3.647,12.665,1.979,17.365-0.214c0.599-0.278,1.311-0.02,1.591,0.578   C61.752,63.578,61.493,64.29,60.895,64.569z M61.886,53.666c-2.246,0-4.071-1.825-4.071-4.069c0-2.246,1.825-4.071,4.071-4.071   c2.243,0,4.069,1.826,4.069,4.071C65.955,51.841,64.129,53.666,61.886,53.666z"></path>' +
										//outline
										'<path stroke="#1954a6" stroke-width="5" d="M76.393,96.084v-2.957v-3.429v-2.466c7.721-0.242,13.928-6.596,13.928-14.375v-40.21c0-7.932-6.455-14.387-14.387-14.387   h-5.17V8.535c0-2.909-2.367-5.275-5.273-5.275H34.509c-2.909,0-5.275,2.366-5.275,5.275v9.725h-5.168   c-7.933,0-14.387,6.455-14.387,14.387v40.21c0,7.779,6.208,14.133,13.929,14.375v2.466v3.429v2.957H76.393z M73.432,93.127H26.566   v-5.883h46.866V93.127z M32.191,8.535c0-1.279,1.039-2.318,2.318-2.318H65.49c1.279,0,2.316,1.04,2.316,2.318v9.725H32.191V8.535z    M12.636,72.857v-40.21c0-6.301,5.127-11.429,11.43-11.429h5.168h41.53h5.17c6.301,0,11.43,5.128,11.43,11.429v40.21   c0,6.303-5.129,11.431-11.43,11.431H24.066C17.763,84.288,12.636,79.16,12.636,72.857z"></path><circle cx="37.744" cy="48.038" r="4.153"></circle><circle cx="62.256" cy="48.038" r="4.153"></circle><path d="M36.82,62.893c-0.673,0.675-0.67,1.769,0.005,2.439c3.646,3.633,8.436,5.449,13.226,5.449c4.79,0,9.581-1.816,13.223-5.449   c0.676-0.671,0.68-1.765,0.008-2.439c-0.674-0.675-1.766-0.676-2.441-0.005c-5.949,5.928-15.629,5.928-21.581,0   C38.584,62.217,37.493,62.218,36.82,62.893z"></path>' +
									'</svg>' +
							'</md-icon>' + 
							'<md-tooltip md-delay="">' +
								'<span translate="">Ansökan om bibliotekskonto</span>' +
							'</md-tooltip>' + 
							'<span>Ansökan om bibliotekskonto</span>' +
						'</a>' +
						'<a ng-if="$ctrl.selectedLanguage==\'en_US\'" class="button-with-icon kth-favorite" aria-label="Map" target="_blank" href="https://apps.lib.kth.se/kiosk/kthbforms_libraryaccount_kiosk.php?formlanguage=en">' +
							'<md-icon class="md-primoExplore-theme" aria-hidden="true" style="">' + 
								'<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" xml:space="preserve" style="shape-rendering:geometricPrecision;text-rendering:geometricPrecision;image-rendering:optimizeQuality;width: 110%;height: 110%;" x="0px" y="0px" fill-rule="evenodd" clip-rule="evenodd" viewBox="0 0 100 125">' +
										//fylld
										//'<path d="M90.976,31.714v-0.496c-3.333-10.676-12.339-11.902-22.042-11.965V7.501H33.253v11.751h-0.429   c-9.306,0.158-17.35,2.105-20.301,11.266v2.103h-0.075V71.89h0.075v1.237c2.393,7.426,8.133,10.112,15.178,10.945v8.683h48.067   v-9.012c6.885-0.792,12.679-3.304,15.208-10.947v-0.301h0.029V31.714H90.976z M36.658,49.597c0-2.246,1.826-4.071,4.07-4.071   c2.246,0,4.071,1.826,4.071,4.071c0,2.244-1.826,4.069-4.071,4.069C38.484,53.666,36.658,51.841,36.658,49.597z M60.895,64.569   c-2.908,1.358-6.021,2.582-9.819,2.582c-2.765,0-5.893-0.648-9.571-2.369c-0.599-0.28-0.856-0.99-0.578-1.591   c0.281-0.597,0.993-0.856,1.591-0.577c7.798,3.647,12.665,1.979,17.365-0.214c0.599-0.278,1.311-0.02,1.591,0.578   C61.752,63.578,61.493,64.29,60.895,64.569z M61.886,53.666c-2.246,0-4.071-1.825-4.071-4.069c0-2.246,1.825-4.071,4.071-4.071   c2.243,0,4.069,1.826,4.069,4.071C65.955,51.841,64.129,53.666,61.886,53.666z"></path>' +
										//outline
										'<path stroke="#1954a6" stroke-width="5" d="M76.393,96.084v-2.957v-3.429v-2.466c7.721-0.242,13.928-6.596,13.928-14.375v-40.21c0-7.932-6.455-14.387-14.387-14.387   h-5.17V8.535c0-2.909-2.367-5.275-5.273-5.275H34.509c-2.909,0-5.275,2.366-5.275,5.275v9.725h-5.168   c-7.933,0-14.387,6.455-14.387,14.387v40.21c0,7.779,6.208,14.133,13.929,14.375v2.466v3.429v2.957H76.393z M73.432,93.127H26.566   v-5.883h46.866V93.127z M32.191,8.535c0-1.279,1.039-2.318,2.318-2.318H65.49c1.279,0,2.316,1.04,2.316,2.318v9.725H32.191V8.535z    M12.636,72.857v-40.21c0-6.301,5.127-11.429,11.43-11.429h5.168h41.53h5.17c6.301,0,11.43,5.128,11.43,11.429v40.21   c0,6.303-5.129,11.431-11.43,11.431H24.066C17.763,84.288,12.636,79.16,12.636,72.857z"></path><circle cx="37.744" cy="48.038" r="4.153"></circle><circle cx="62.256" cy="48.038" r="4.153"></circle><path d="M36.82,62.893c-0.673,0.675-0.67,1.769,0.005,2.439c3.646,3.633,8.436,5.449,13.226,5.449c4.79,0,9.581-1.816,13.223-5.449   c0.676-0.671,0.68-1.765,0.008-2.439c-0.674-0.675-1.766-0.676-2.441-0.005c-5.949,5.928-15.629,5.928-21.581,0   C38.584,62.217,37.493,62.218,36.82,62.893z"></path>' +
									'</svg>' +
							'</md-icon>' + 
							'<md-tooltip md-delay="">' +
								'<span translate="">Library Account Application</span>' +
							'</md-tooltip>' + 
							'<span>Library Account Application</span>' + 
						'</a>' +
					'</div>' +
					//Favourites
					//Kiosk ingen "favorit-knapp"
					/*
					'<div class="kth_fabaction">' +
						//vid från $ctrl 
						'<a class="button-with-icon kth-favorite" ng-if="!ctrl.isFavorites" id="favorites-button" aria-label="Go to my favorites" ng-click="ctrl.goToFavorties()" href="/primo-explore/favorites?vid={{$ctrl.primolyticsService.userSessionManagerService.vid}}&amp;lang=en_US">' +
							'<prm-icon aria-label="Go to my favorites" icon-type="svg" svg-icon-set="action" icon-definition="ic_favorite_outline_24px">' + 
								'<md-icon ng-if="::(!(ctrl.iconType === \'fa\'))" md-svg-icon="action:ic_favorite_outline_24px" aria-label="nui.favorites.goFavorites.tooltip" class="md-primoExplore-theme" aria-hidden="true"><svg width="100%" height="100%" viewBox="0 0 24 24" y="1056" xmlns="http://www.w3.org/2000/svg" fit="" preserveAspectRatio="xMidYMid meet" focusable="false"><path d="M16.5 3c-1.74 0-3.41.81-4.5 2.09C10.91 3.81 9.24 3 7.5 3 4.42 3 2 5.42 2 8.5c0 3.78 3.4 6.86 8.55 11.54L12 21.35l1.45-1.32C18.6 15.36 22 12.28 22 8.5 22 5.42 19.58 3 16.5 3zm-4.4 15.55l-.1.1-.1-.1C7.14 14.24 4 11.39 4 8.5 4 6.5 5.5 5 7.5 5c1.54 0 3.04.99 3.57 2.36h1.87C13.46 5.99 14.96 5 16.5 5c2 0 3.5 1.5 3.5 3.5 0 2.89-3.14 5.74-7.9 10.05z"></path></svg>' +
								'</md-icon>' + 
								'<prm-icon-after parent-ctrl="ctrl"></prm-icon-after>' + 
							'</prm-icon>' + 
							'<md-tooltip md-delay="">' +
								'<span translate="nui.favorites.goFavorites.tooltip"></span>' +
							'</md-tooltip>' + 
							'<span translate="nui.favorites.header"></span>' + 
						'</a>' +
					'</div>' +
					*/
					//Flytta till extra toppsiduhvud
					//'<prm-change-lang aria-label="{{\'eshelf.signin.title\' | translate}}" ng-if="$ctrl.displayLanguage" label-type="icon"></prm-change-lang>' +
					//Kiosk ingen "konto-knapp"
					//'<prm-library-card-menu></prm-library-card-menu>' +
					//Kiosk ingen "logga in-knapp"
					//'<prm-authentication layout="flex" [is-logged-in]="$ctrl.userName().length > 0"></prm-authentication>' + 
				'</md-fab-actions>' + 
			'</md-toolbar>' +
		//'</md-fab-toolbar>' + 
		'<prm-user-area-after parent-ctrl="$ctrl"></prm-user-area-after>');
		
		/******	prm-library-card ******/
		$templateCache.put('components/search/topbar/userArea/libraryCard/library-card-menu.html',
		'<md-button ng-if="!$ctrl.isOvp()" aria-label="{{\'nui.aria.menu.settings\' | translate}}" class="button-with-icon zero-margin" (click)="$ctrl.goToUserSettings();">' + 
			'<prm-icon [icon-type]="::$ctrl.topBarIcons.library.type" [svg-icon-set]="::$ctrl.topBarIcons.library.iconSet" [icon-definition]="::$ctrl.topBarIcons.library.icon"></prm-icon>' +
			'<span translate="nui.details.header.ovl"></span>' +
		'</md-button>' +
		'<md-button aria-label="{{$ctrl.getLibraryCardAriaLabel() | translate}}" class="button-with-icon zero-margin" (click)="$ctrl.goToMyLibraryCard();">' +
			//Byt ikon till "person"
			//'<prm-icon [icon-type]="::$ctrl.topBarIcons.library.type" [svg-icon-set]="::$ctrl.topBarIcons.library.iconSet" [icon-definition]="::$ctrl.topBarIcons.library.icon"></prm-icon>' +
			'<prm-icon [icon-type]="::$ctrl.topBarIcons.library.type" svg-icon-set="social" icon-definition="ic_person_24px"></prm-icon>' +
			//legogubbe
			/*
			'<md-icon class="md-primoExplore-theme" aria-hidden="true" style="">' +
				'<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" xml:space="preserve" style="shape-rendering:geometricPrecision;text-rendering:geometricPrecision;image-rendering:optimizeQuality;width: 110%;height: 110%;" x="0px" y="0px" fill-rule="evenodd" clip-rule="evenodd" viewBox="0 0 100 125">' +
					//fylld
					//'<path d="M90.976,31.714v-0.496c-3.333-10.676-12.339-11.902-22.042-11.965V7.501H33.253v11.751h-0.429   c-9.306,0.158-17.35,2.105-20.301,11.266v2.103h-0.075V71.89h0.075v1.237c2.393,7.426,8.133,10.112,15.178,10.945v8.683h48.067   v-9.012c6.885-0.792,12.679-3.304,15.208-10.947v-0.301h0.029V31.714H90.976z M36.658,49.597c0-2.246,1.826-4.071,4.07-4.071   c2.246,0,4.071,1.826,4.071,4.071c0,2.244-1.826,4.069-4.071,4.069C38.484,53.666,36.658,51.841,36.658,49.597z M60.895,64.569   c-2.908,1.358-6.021,2.582-9.819,2.582c-2.765,0-5.893-0.648-9.571-2.369c-0.599-0.28-0.856-0.99-0.578-1.591   c0.281-0.597,0.993-0.856,1.591-0.577c7.798,3.647,12.665,1.979,17.365-0.214c0.599-0.278,1.311-0.02,1.591,0.578   C61.752,63.578,61.493,64.29,60.895,64.569z M61.886,53.666c-2.246,0-4.071-1.825-4.071-4.069c0-2.246,1.825-4.071,4.071-4.071   c2.243,0,4.069,1.826,4.069,4.071C65.955,51.841,64.129,53.666,61.886,53.666z"></path>' +
					//outline
					'<path stroke="#1954a6" stroke-width="5" d="M76.393,96.084v-2.957v-3.429v-2.466c7.721-0.242,13.928-6.596,13.928-14.375v-40.21c0-7.932-6.455-14.387-14.387-14.387   h-5.17V8.535c0-2.909-2.367-5.275-5.273-5.275H34.509c-2.909,0-5.275,2.366-5.275,5.275v9.725h-5.168   c-7.933,0-14.387,6.455-14.387,14.387v40.21c0,7.779,6.208,14.133,13.929,14.375v2.466v3.429v2.957H76.393z M73.432,93.127H26.566   v-5.883h46.866V93.127z M32.191,8.535c0-1.279,1.039-2.318,2.318-2.318H65.49c1.279,0,2.316,1.04,2.316,2.318v9.725H32.191V8.535z    M12.636,72.857v-40.21c0-6.301,5.127-11.429,11.43-11.429h5.168h41.53h5.17c6.301,0,11.43,5.128,11.43,11.429v40.21   c0,6.303-5.129,11.431-11.43,11.431H24.066C17.763,84.288,12.636,79.16,12.636,72.857z"></path><circle cx="37.744" cy="48.038" r="4.153"></circle><circle cx="62.256" cy="48.038" r="4.153"></circle><path d="M36.82,62.893c-0.673,0.675-0.67,1.769,0.005,2.439c3.646,3.633,8.436,5.449,13.226,5.449c4.79,0,9.581-1.816,13.223-5.449   c0.676-0.671,0.68-1.765,0.008-2.439c-0.674-0.675-1.766-0.676-2.441-0.005c-5.949,5.928-15.629,5.928-21.581,0   C38.584,62.217,37.493,62.218,36.82,62.893z"></path>' +
				'</svg>' +
			'</md-icon>' + 
			*/
			//KTHB tooltip
			'<md-tooltip md-delay="">' +
				'<span translate="nui.menu.librarycard"></span>' +
			'</md-tooltip>' + 
			'<span translate="nui.menu.librarycard"></span>' +
		'</md-button><prm-library-card-menu-after parent-ctrl="$ctrl"></prm-library-card-menu-after>');
		
		/***************************
		
		prm-change-lang 
		
		***************************/

		$templateCache.put('components/infra/lang/change-lang.html',
		'<div ng-if="::($ctrl.getLabelType() == \'text\')">' +
			'<span translate="nui.mypref.label.interface_languages"></span>' +
		'</div>' +
		//Gör om till att använda flaggor och ingen selectbox
		'<div ng-if="$ctrl.selectedLanguage == \'en_US\'">' +
			'<a class="kth_link" layout="row" layout-align="center center" ng-click="$ctrl.selectedLanguage =\'sv_SE\'; $ctrl.changeLanguage()">' +
				'<span>Svenska&nbsp</span><svg xmlns="http://www.w3.org/2000/svg" width="20" height="12.5" viewBox="0 0 16 10"><rect width="16" height="10" fill="#005293"/><rect width="2" height="10" x="5" fill="#FECB00"/><rect width="16" height="2" y="4" fill="#FECB00"/></svg>' +
			'</a>' +
		'</div>' +
		'<div ng-if="$ctrl.selectedLanguage == \'sv_SE\'" >' +
			'<a class="kth_link" layout="row" layout-align="center center" ng-click="$ctrl.selectedLanguage =\'en_US\'; $ctrl.changeLanguage()">' +
				'English&nbsp<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 50 30" width="20" height="12"><clipPath id="t"><path d="M25,15 h25 v15 z v15 h-25 z h-25 v-15 z v-15 h25 z"/></clipPath><path d="M0,0 v30 h50 v-30 z" fill="#00247d"/><path d="M0,0 L50,30 M50,0 L0,30" stroke="#fff" stroke-width="6"/><path d="M0,0 L50,30 M50,0 L0,30" clip-path="url(#t)" stroke="#cf142b" stroke-width="4"/><path d="M25,0 v30 M0,15 h50" stroke="#fff" stroke-width="10"/><path d="M25,0 v30 M0,15 h50" stroke="#cf142b" stroke-width="6"/></svg>' +
			'</a>' +
		'</div>' +
		'<prm-change-lang-after parent-ctrl="$ctrl"></prm-change-lang-after>'
		/*
		'<md-input-container layout="row" layout-align="center center">' +
			'<prm-icon ng-if="::($ctrl.getLabelType() == \'icon\')" [icon-type]="::$ctrl.topBarIcons.language.type" [svg-icon-set]="::$ctrl.topBarIcons.language.iconSet" [icon-definition]="::$ctrl.topBarIcons.language.icon"></prm-icon>' +
			//Ändra storlek?
			//'<md-icon class="md-primoExplore-theme" aria-hidden="true" style="">' +
				//'<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" id="ic_language_24px" y="1512"><path d="M11.99 2C6.47 2 2 6.48 2 12s4.47 10 9.99 10C17.52 22 22 17.52 22 12S17.52 2 11.99 2zm6.93 6h-2.95c-.32-1.25-.78-2.45-1.38-3.56 1.84.63 3.37 1.91 4.33 3.56zM12 4.04c.83 1.2 1.48 2.53 1.91 3.96h-3.82c.43-1.43 1.08-2.76 1.91-3.96zM4.26 14C4.1 13.36 4 12.69 4 12s.1-1.36.26-2h3.38c-.08.66-.14 1.32-.14 2 0 .68.06 1.34.14 2H4.26zm.82 2h2.95c.32 1.25.78 2.45 1.38 3.56-1.84-.63-3.37-1.9-4.33-3.56zm2.95-8H5.08c.96-1.66 2.49-2.93 4.33-3.56C8.81 5.55 8.35 6.75 8.03 8zM12 19.96c-.83-1.2-1.48-2.53-1.91-3.96h3.82c-.43 1.43-1.08 2.76-1.91 3.96zM14.34 14H9.66c-.09-.66-.16-1.32-.16-2 0-.68.07-1.35.16-2h4.68c.09.65.16 1.32.16 2 0 .68-.07 1.34-.16 2zm.25 5.56c.6-1.11 1.06-2.31 1.38-3.56h2.95c-.96 1.65-2.49 2.93-4.33 3.56zM16.36 14c.08-.66.14-1.32.14-2 0-.68-.06-1.34-.14-2h3.38c.16.64.26 1.31.26 2s-.1 1.36-.26 2h-3.38z"/></svg>' +
			//'</md-icon>' +
			'<md-tooltip md-delay="">' +
			//tooltip
			//hitta en bättre i primo BO, eller skapa en ny.
				'<span translate="nui.aria.account.details.langaugesselect"></span>' +
			'</md-tooltip>' +
			'<md-select ng-model="$ctrl.selectedLanguage" ng-change="$ctrl.changeLanguage()" aria-label="{{\'nui.aria.account.details.langaugesselect\' | translate}}">' +
				'<md-option ng-repeat="language in ::$ctrl.languages" value="{{::language}}"><span translate="mypref.language.option.{{::language}}"></span></md-option>' +
			'</md-select>' +
		'</md-input-container>'
		*/
		);
		
		/********************
		
		prm-authentication 
		
		********************/
		$templateCache.put('components/search/topbar/userArea/authentication.html',
		'<md-button ng-if="!$ctrl.isLoggedIn" ng-click="$ctrl.handleLogin();" aria-label="{{\'eshelf.signin.title\' | translate}}" class="button-with-icon zero-margin">' +
			'<prm-icon icon-type="svg" svg-icon-set="primo-ui" icon-definition="sign-in"></prm-icon>' +
			//tooltip
			'<md-tooltip md-delay="">' +
				'<span translate="eshelf.signin.title"></span>' +
			'</md-tooltip>' + 
			//villkor om det är en signin-request
			'<span ng-if="!$ctrl.requestlogin" translate="eshelf.signin.title"></span>' +
			'<span ng-if="$ctrl.requestlogin" translate="getit.signin_link.sign_in"></span>' +
		'</md-button>' + 
		'<md-button ng-if="$ctrl.isLoggedIn" ng-click="$ctrl.handleLogout(authenticationMethod);" aria-label="{{\'eshelf.signout.title.link\' | translate}}" class="button-with-icon zero-margin">' +
			'<prm-icon icon-type="svg" svg-icon-set="primo-ui" icon-definition="sign-out"></prm-icon>' +
			//tooltip
			'<md-tooltip md-delay="">' +
				'<span translate="eshelf.signout.title"></span>' +
			'</md-tooltip>' +
			'<span translate="eshelf.signout.title.link"></span>' +
		'</md-button>' +
		'<prm-authentication-after parent-ctrl="$ctrl"></prm-authentication-after>');

		/***********************
		
		prm-citation-trails-breadcrumbs
		
		***********************/
		$templateCache.put('components/search/citationTrails/citation-trails-breadcrumbs.html',
		'<md-toolbar class="default-toolbar">' +
			'<div class="md-toolbar-tools" layout="row" ng-hide="citationLimit == 0">' +
				//'<div flex="0" flex-md="5" flex-lg="10" flex-gt-lg="20" ng-class="{\'flex-lgPlus-15\': $ctrl.mediaQueries.lgPlus}"></div>' +
				'<div flex="0" flex-md="0" flex-lg="10" flex-xl="20" ng-class="{\'flex-lgPlus-15\': $ctrl.mediaQueries.lgPlus}"></div>' +
				'<md-button class="back-button offset-to-left" aria-label="{{\'fulldisplay.deatiles.back\' | translate}}" ui-state="$ctrl.SEARCH_STATE" ui-state-params="$ctrl.savedSearchParams" ui-sref-opts="{reload: true, inherit:false}" ref="">' +
					'<prm-icon aria-label="{{\'fulldisplay.deatiles.back\' | translate}}" class="" icon-type="svg" svg-icon-set="primo-ui" icon-definition="back-to-search"></prm-icon>' +
					'<md-tooltip md-delay="400"><span translate="{{::(\'fulldisplay.deatiles.back\'+$ctrl.getActionLabel(action))}}"></span></md-tooltip>' +
				'</md-button>' +
				'<md-divider class="toolbar-divider visible"></md-divider>' +
				'<h1 class="toolbar-title">' +
					'<span aria-label="{{\'nui.citation_trail.link.header\' | translate}}" translate="{{\'nui.citation_trail.link.header\' + $ctrl.getActionLabel(action)}}"></span>' +
				'</h1>' +
			'</div>' +
		'</md-toolbar>' +
		'<div class="prm-horizontal-content no-scrollbar stacked-items prm-background prm-hue1" layout="row" aria-label="{{\'nui.aria.current.path\' | translate}}">' +
			//'<div hide-xs hide-sm flex-md="0" flex-lg="10" flex-gt-lg="20" ng-class="{\'flex-lgPlus-15\': $ctrl.mediaQueries.lgPlus}"></div>' +
			'<div hide-xs hide-sm flex="0" flex-md="0" flex-lg="10" flex-xl="20" ng-class="{\'flex-lgPlus-15\': $ctrl.mediaQueries.lgPlus}"></div>' +
			'<div flex class="horizontal-content-container citations-container">' +
				'<md-button class="horizontal-content-control left-button" ng-if="$ctrl.isShowLeftArrow()" tabindex="0" ng-click="$ctrl.onLeftArrowClick()" aria-label="{{\'nui.citation_trail.link.left.tooltip\' | translate}}">' +
					'<prm-icon aria-label="{{\'nui.citation_trail.link.left.tooltip\' | translate}}" icon-type="svg" svg-icon-set="primo-ui" icon-definition="chevron-left"></prm-icon>' +
					'<md-tooltip><span translate="nui.citation_trail.link.left.tooltip"></span></md-tooltip>' +
				'</md-button>' +
				'<div class="horizontal-content-scroller citations-scroller" role="list" layout="row" ng-class="{\'left-button-visible\': $ctrl.isShowLeftArrow(), \'right-button-visible\': $ctrl.isShowRightArrow()}">' +
					'<div class="horizontal-content-scroll-offseter" layout="row">' +
						'<prm-citation-trails-item id="citationItem{{$index}}" ng-init="index = $index" tabindex="-1" ng-repeat="seed in $ctrl.seedList" ng-class="{\'active-item\':$index === $ctrl.getActiveLevel()}" aria-label="{{::(\'nui.aria.citation_path_item_number\' | translate)}}{{\' \'}}{{::$index+1}}{{\' \'}}{{$ctrl.isActive($index) | translate}}" [seed]="seed" [active]="$index === $ctrl.getActiveLevel()" [active-level]="$ctrl.getActiveLevel()" [index]="$index" class="{{$ctrl.isActive}} horizontal-content-item" (change-active-seed-event)="$ctrl.onChangeActiveSeedEvent(seed, $index)" [z-order]="$index > $ctrl.getActiveLevel() ? ($ctrl.seedList.length - $index) : \'\' "></prm-citation-trails-item>' +
					'</div>' +
				'</div>' +
				'<md-button class="horizontal-content-control right-button" ng-hide="$ctrl.hideArrows" tabindex="0" ng-if="$ctrl.isShowRightArrow()" ng-click="$ctrl.onRightArrowClick()" aria-label="{{\'nui.citation_trail.link.right.tooltip\' | translate}}">' +
					'<prm-icon aria-label="{{\'nui.citation_trail.link.right.tooltip\' | translate}}" icon-type="svg" svg-icon-set="primo-ui" icon-definition="chevron-right"></prm-icon>' +
					'<md-tooltip><span translate="nui.citation_trail.link.right.tooltip"></span></md-tooltip>' +
				'</md-button>' +
			'</div>' +
			'<div hide-xs hide-sm flex-md="0" flex-lg="10" flex-gt-lg="20" ng-class="{\'flex-lgPlus-15\': $ctrl.mediaQueries.lgPlus}"></div>' +
		'</div>' +
		'<prm-alert-bar flex [alert-object]="::$ctrl.citingAlert " ng-if="$ctrl.citationTraisLength && $ctrl.activeSeedTypeCiting"></prm-alert-bar>' +
		'<prm-alert-bar flex [alert-object]="::$ctrl.citedByAlert " ng-if="$ctrl.citationTraisLength && !$ctrl.activeSeedTypeCiting"></prm-alert-bar>' +
		'<prm-search></prm-search>' +
		'<prm-citation-trails-breadcrumbs-after parent-ctrl="$ctrl"></prm-citation-trails-breadcrumbs-after>');

		/****************

		prm-search-bar
		
		****************/
		$templateCache.put('components/search/searchBar/search-bar.html',
		'<div layout="column" layout-fill tabindex="0" role="search" ng-class="{\'zero-padding\': $ctrl.showTabsAndScopesVal()}">' +
			'<div class="search-wrapper dark-toolbar prm-top-bar-container main-header-row" div layout="row" ng-class="{\'facet-to-left\': $ctrl.facetToLeft && !$ctrl.mediaQueries.xs && !$ctrl.mediaQueries.sm && !$ctrl.mediaQueries.md}">' +
				'<div flex="0" flex-md="0" flex-lg="10" flex-xl="20" ng-class="{\'facet-to-left-spacer\': $ctrl.facetToLeft && !$ctrl.mediaQueries.xl && !$ctrl.mediaQueries.md && !$ctrl.mediaQueries.sm && !$ctrl.mediaQueries.xs, \'flex-xl-25\': $ctrl.facetToLeft}">' +
				'</div>' +
				//Lagt till wrapper
				'<div class="kth-searchbarwrapper">' +
					//'<div class="search-elements-wrapper" layout="column" flex flex-sm="85" flex-md="75" flex-lg="65" flex-xl="50" ng-class="(!$ctrl.advancedSearch ?\'simple-mode\' : \'advanced-mode\')  + \' \' + ($ctrl.mainSearchField ? \'has-input\' : \'\') + \' \' + ($ctrl.mediaQueries.lgPlus ? \'flex-lgPlus-55\' : \'\') + \' \' + ($ctrl.facetToLeft? \'facet-to-left-search-bar\' : \'\')">' +
					'<div class="search-elements-wrapper" layout="column" ng-class="(!$ctrl.advancedSearch ?\'simple-mode\' : \'advanced-mode\')  + \' \' + ($ctrl.mainSearchField ? \'has-input\' : \'\') + \' \' + ($ctrl.mediaQueries.lgPlus ? \'flex-lgPlus-55\' : \'\') + \' \' + ($ctrl.facetToLeft? \'facet-to-left-search-bar\' : \'\')">' +
						'<div class="simple-search-wrapper layout-full-width" ng-hide="$ctrl.advancedSearch">' +
							'<form class="layout-full-height" layout="column" name="search-form" ng-submit="$ctrl.onSubmit()">' +
								'<input type="submit" class="accessible-only"/>' +
								'<div class="layout-full-width">' +
									'<div class="search-element-inner layout-full-width">' +
										'<div class="search-input">' +
											'<prm-autocomplete class="search-input-container EXLPRMHeaderAutoComplete" md-input-id="searchBar" md-search-text="$ctrl.mainSearchField" md-search-text-change="$ctrl.autocompleteQuery($ctrl.mainSearchField)" md-selected-item="$ctrl.selectedItem" md-selected-item-change="$ctrl.onSelectItem()" md-item-text="item.display || $ctrl.typedQuery " md-min-length="2" md-autofocus="false" md-no-cache="true" md-items="item in $ctrl.autoCompleteItems" md-item-text="item" placeholder="{{$ctrl.placeHolderText}}" flex>' +
												'<md-item-template>' +
													'<div ng-if="item.tab">' +
														'<span md-highlight-text="$ctrl.mainSearchField">{{$ctrl.mainSearchField}}</span>' +
														'<prm-icon icon-type="svg" svg-icon-set="primo-ui" icon-definition="magnifying-glass"></prm-icon>' +
														'<span class="suggestion-scope" translate="{{\'tabbedmenu.\'+item.tab+\'.label\'}}"></span>' +
													'</div>' +
													'<div ng-if="!item.tab" md-highlight-text="$ctrl.mainSearchField">{{item.shortDisplay}}</div>' +
												'</md-item-template>' +
											'</prm-autocomplete>' +
										'</div>' +
										'<div class="search-options" ng-class="{\'flex-sm-0 flex-0 hide-on-xs\':!$ctrl.showTabsAndScopesVal(), \'flex-sm-40 visible\':$ctrl.showTabsAndScopesVal()}">' +
											'<prm-tabs-and-scopes-selector ng-if="$ctrl.showTabsAndScopesVal()" [(selected-scope)]="$ctrl.scopeField" [(selected-tab)]="$ctrl.selectedTab" ng-class="{\'is-displayed\':$ctrl.showTabsAndScopesVal()}"></prm-tabs-and-scopes-selector>' +
										'</div>' +
										'<div class="search-actions" ng-if="::(!$ctrl.scopesDialerConfiguration.display)" layout-align-xs="start center">' +
											//Aria label
											'<md-button aria-label="Advanced Search" class="zero-margin md-icon-button" ng-if="!$ctrl.advancedSearch" ng-click="$ctrl.switchAdvancedSearch()" hide-gt-xs>' +
												'<prm-icon icon-type="svg" svg-icon-set="primo-ui" icon-definition="tune"></prm-icon>' +
											'</md-button>' +
											'<md-button class="zero-margin button-confirm" aria-label="Search" (click)="$ctrl.onSubmit()">' +
												'<prm-icon icon-type="{{::$ctrl.searchBoxIcons.searchTextBox.type}}" svg-icon-set="{{::$ctrl.searchBoxIcons.searchTextBox.iconSet}}" icon-definition="{{::$ctrl.searchBoxIcons.searchTextBox.icon}}"></prm-icon>' +
											'</md-button>' +
										'</div>' +
									'</div>' +
								'</div>' +
							'</form>' +
						'</div>' +
						'<div class="advanced-search-wrapper layout-full-width" layout="row" ng-if="$ctrl.advancedSearch" ng-cloak>' +
							'<prm-advanced-search tabindex="0" role="search" id="advanced-search" [(selected-scope)]="$ctrl.scopeField" [(selected-tab)]="$ctrl.selectedTab" [(show-tab-and-scopes)]="$ctrl.showTabsAndScopes" [(typed-query)]="$ctrl.mainSearchField"></prm-advanced-search>' +
								'<md-button class="switch-to-simple zero-margin md-icon-button" ng-if="$ctrl.advancedSearch" ng-click="$ctrl.switchAdvancedSearch()" hide-gt-xs>' +
									'<prm-icon icon-type="svg" svg-icon-set="primo-ui" icon-definition="close"></prm-icon>' +
								'</md-button>' +
						'</div>' +
							//november release isShowFindDBButton ingen funktion längre?
							'<div ng-if="$ctrl.isShowFindDBButton" class="search-extras layout-full-width">' +
							'<div layout="row">' +
								'<span flex></span>' +
								'<md-button class="button-over-dark button-with-icon" (click)="::$ctrl.openFdbIframe();" translate-attr-title="mainmenu.label.moreoptions" aria-label="{{::(\'finddb.sb.title\' | translate)}}">' +
									'<prm-icon icon-type="svg" svg-icon-set="primo-ui" icon-definition="database"></prm-icon>' +
									'<span translate="finddb.sb.title"></span>' +
								'</md-button>' +
							'</div>' +
						'</div>' +
					'</div>' +
					//Lagt till mellanrum
					'<div style="flex: 1 1 10px;max-width: 10px"></div>' +
					//Plusknappen
					//'<div class="search-switch-buttons" layout-sm="column" layout-align-sm="start stretch" hide-xs ng-class="{\'facet-to-left-advanced-search\': $ctrl.facetToLeft}">' +
						//180822 inget plus på stora skärmar längre
						//'<md-button style="min-height: 0px;min-width: 60px;line-height: 60px;background-color: rgb(255, 255, 255);color: #000;font-size: 46px;padding: 0;align-self: flex-end;font-weight: lighter;" aria-label="{{\'nui.aria.searchBar.advancedLink\' | translate}}" class="switch-to-advanced zero-margin button-with-icon" ng-if="!$ctrl.advancedSearch" ng-click="$ctrl.switchAdvancedSearch()">' +
						'<md-button style="" aria-label="{{\'nui.aria.searchBar.advancedLink\' | translate}}" class="switch-to-advanced zero-margin button-with-icon" ng-if="!$ctrl.advancedSearch" ng-click="$ctrl.switchAdvancedSearch()">' +
						//'<md-button aria-label="{{\'nui.aria.searchBar.advancedLink\' | translate}}" class="switch-to-advanced zero-margin button-with-icon" ng-if="!$ctrl.advancedSearch" ng-click="$ctrl.switchAdvancedSearch()">' +
							'<span layout="row" layout-align="start center"><span translate="label.advanced_search"></span></span>' +
							//tooltip (Primo BO Code Tables, Header/Footer Tiles)
							'<md-tooltip md-delay="">' +
								'<span translate="searchbar.tooltip.advanced_search"></span>' +
							'</md-tooltip>' +
						'</md-button>' +
						//180822 inget plus på stora skärmar längre
						//'<md-button class="switch-to-simple zero-margin button-with-icon" ng-if="$ctrl.advancedSearch" ng-click="$ctrl.switchAdvancedSearch()">' +
						//'<md-button style="max-height: 60px;min-height: 0px;min-width: 60px;line-height: 60px;background-color: rgb(255, 255, 255);color: #000;font-size: 46px;padding: 0;font-weight: lighter;" class="switch-to-simple zero-margin button-with-icon" ng-if="$ctrl.advancedSearch" ng-click="$ctrl.switchAdvancedSearch()">' +
						'<md-button style="" class="switch-to-simple zero-margin button-with-icon" ng-if="$ctrl.advancedSearch" ng-click="$ctrl.switchAdvancedSearch()">' +
							'<span layout="row" layout-align="start center"><span translate="label.simple_search"></span></span>' +
						'</md-button>' +
					//'</div>' +
				'</div>' +
				'<div flex="0" flex-md="0" flex-sm="0" flex-lg="15" flex-xl="15" ng-class="{\'flex-lgPlus-10\': $ctrl.facetToLeft && !$ctrl.mediaQueries.xs}">' +
				'</div>' +
			'</div>' +
			'<div layout="row" ng-if="!$ctrl.advancedSearch && $ctrl.showSignIn">' +
				'<div flex="0" flex-md="0" flex-lg="15" flex-xl="20">' +
				'</div>' +
				'<prm-alert-bar flex [alert-object]="$ctrl.signInAlert"></prm-alert-bar>' +
				'<div class="padding-left-medium" flex="0" flex-md="25" flex-lg="10" flex-xl="15" hide-xs>' +
				'</div>' +
				'<div flex="0" flex-md="0" flex-sm="10" flex-lg="20" flex-xl="20">' +
				'</div>' +
			'</div>' +
		'</div>' +
		'<div class="advanced-search-backdrop" ng-class="{\'visible\': $ctrl.advancedSearch}"></div>' +
		'<prm-search-bar-after parent-ctrl="$ctrl"></prm-search-bar-after>');

		/*************************************
		
		prm-search-result-availability-line	
		
		**************************************/
		$templateCache.put('components/search/searchResult/searchResultAvailability/searchResultAvailabilityLine.html',
		'<div ng-repeat="availability in $ctrl.displayedAvailability track by $index" layout="row" layout-align="start start">' +
			'<prm-icon ng-if="$ctrl.isOnline($index,availability)" availability-type icon-type="{{::$ctrl.availabilityLineIcons.onlineMaterial.type}}" svg-icon-set="{{::$ctrl.availabilityLineIcons.onlineMaterial.iconSet}}" icon-definition="{{::$ctrl.availabilityLineIcons.onlineMaterial.icon}}"></prm-icon>' +
			'<prm-icon ng-if="$ctrl.isPhysical($index,availability)" availability-type icon-type="{{::$ctrl.availabilityLineIcons.physicalMaterial.type}}" svg-icon-set="{{::$ctrl.availabilityLineIcons.physicalMaterial.iconSet}}" icon-definition="{{::$ctrl.availabilityLineIcons.physicalMaterial.icon}}"></prm-icon>' +
			//Aria label
			'<md-button aria-label="{{::$ctrl.getTranslatedLine(\'delivery.code.\'+availability)}}" prm-brief-internal-button-marker ng-click="$ctrl.handleAvailability($index, $event);$event.preventDefault();" class="neutralized-button arrow-link-button" title="{{::$ctrl.getTranslatedLine(\'delivery.code.\'+availability)}}">' +
				'<span class="button-content">' +
					'<span class="availability-status {{availability}}" translate="delivery.code.{{availability}}" translate-values="$ctrl.getPlaceHolders($ctrl.result)" translate-compile></span>' +
					'<span ng-if="$ctrl.showDisplayOtherLocations() && $ctrl.isPhysical($index)" translate="delivery.and.other.locations"></span>' +
					'<prm-icon ng-if="$ctrl.isDirectLink($index)" external-link icon-type="{{$ctrl.availabilityLineIcons.externalLink.type}}" svg-icon-set="{{$ctrl.availabilityLineIcons.externalLink.iconSet}}" icon-definition="{{$ctrl.availabilityLineIcons.externalLink.icon}}" aria-label="{{\'nui.externalLink\' | translate}}"></prm-icon>' +
				'</span>' +
				'<prm-spinner class="inline-loader display-inline dark-on-light half-transparent" ng-if="$ctrl.result.rtaInProgress"></prm-spinner>' +
				'<prm-icon link-arrow icon-type="{{::$ctrl.availabilityLineIcons.arrowRight.type}}" svg-icon-set="{{::$ctrl.availabilityLineIcons.arrowRight.iconSet}}" icon-definition="{{::$ctrl.availabilityLineIcons.arrowRight.icon}}"></prm-icon>' +
			'</md-button>' +
		'</div>' +
		'<prm-search-result-availability-line-after parent-ctrl="$ctrl"></prm-search-result-availability-line-after>');

		/**************************
		
		prm-search-result-list	
		
		**************************/

		//infinite scroll med en disabledkontroll tillagd i prmSearchResultListAfterController/kthcallSearchServiceNextResults
		$templateCache.put('components/search/searchResult/searchResultList/search-result-list.html',
		//flyttad för att få facetter högst upp...
		'<prm-search-result-list-after parent-ctrl="$ctrl"></prm-search-result-list-after>' +
		//'<div infinite-scroll="$ctrl.nextResults()" infinite-scroll-distance="0" infinite-scroll-disabled="$ctrl.busy" infinite-scroll-immediate-check="false" ng-show="$ctrl.resultsExists || $ctrl.isFavorites" class="list-items-list pages-separated-with-gaps" ng-class="{\'single-page\': ($ctrl.searchInfo.total <= 10) }" layout="column" id="mainResults" tabindex="0" role="main">' + 
		'<div ng-show="$ctrl.resultsExists || $ctrl.isFavorites" class="list-items-list pages-separated-with-gaps" ng-class="{\'single-page\': ($ctrl.searchInfo.total <= 10) }" layout="column" id="mainResults" tabindex="0" role="main">' +
			'<h2 class="accessible-only">' + 
				'<span ng-if="$ctrl.resultsExists && !$ctrl.isFavorites" translate="results.title"></span>' +
				' <span ng-if="$ctrl.isFavorites && !$ctrl.isSavedQuery && $ctrl.favoritesService.getAllItems()" translate="nui.favorites.items"></span>' +
			'</h2>' +
			//inget md-card, margin-left
			'<div class="margin-bottom-medium margin-left-small" ng-if="$ctrl.didUMean && !$ctrl.isFavorites && !$ctrl.controlledVocabulary">' +
				//'<md-card class="default-card padded-container-medium zero-margin">' +
					'<prm-did-u-mean [did-u-mean]="$ctrl.didUMean"></prm-did-u-mean>' +
				//'</md-card>' +
			'</div>' + 
			//padding ingen margin-bottom
			'<div style="padding-bottom: 10px;padding-left: 7px;" class="1margin-bottom-medium" ng-if="!$ctrl.isFavorites && $ctrl.controlledVocabulary" ng-hide="$ctrl.searchInProgress">' + 
				//inget md-card
				//'<md-card class="default-card padded-container-medium zero-margin">' + 
					//february_2018_release
					'<prm-controlled-vocabulary [equivalent-term]="$ctrl.controlledVocabulary.errorMessages[1]" [query]="$ctrl.query"></prm-controlled-vocabulary>' +
					//'<prm-controlled-vocabulary [equivalent-term]="$ctrl.controlledVocabulary.equivalentTerm" [query]="$ctrl.query"></prm-controlled-vocabulary>' + 
				//'</md-card>' + 
			'</div>' + 
			'<div ng-if="$ctrl.searchInfo.total == 0 && !$ctrl.isFavorites" class="margin-bottom-medium">' +
				//vad ska visas om man inte får några sökträffar?
				//'Texterna nedan ändras via Primo BO: nui.noresults.title, nui.noresults.suggestions etc' +
				'<prm-no-search-result [term]="$ctrl.searchString"></prm-no-search-result>' + 
				//material utanför bibblan
				//Visa expand som förslag på små skärmar
				//Visa inte på kiosk
				'<div tabindex="-1" ng-if="!$ctrl.pcAvailability" ng-hide="!$ctrl.screenIsSmall" class="margin-medium">' +
					'<md-checkbox ng-model="$ctrl.pcAvailability" ng-change="$ctrl.expandsearchoutsidelibrary();" aria-label="{{\'expandresults\' | translate}}">' +
						'<span translate="expandresults"></span>' +
					'</md-checkbox>' +
				'</div>' +
			'</div>' +
			'<div ng-if="$ctrl.resultsExists && !$ctrl.isFavorites" ng-hide="$ctrl.searchInfo.total == 0" class="results-title" layout="row" layout-align="start center">' +
				'<span class="results-count">{{$ctrl.searchInfo.total | number}} ' +
					'<span ng-if="$ctrl.searchInfo.maxTotal > 0">(</span>' +
					'<span ng-if="$ctrl.searchInfo.maxTotal > 0" translate="brief.results.outof"></span>' +
					' <span ng-if="$ctrl.searchInfo.maxTotal > 0">{{$ctrl.searchInfo.maxTotal | number}})</span>' +
					' <span translate="results.title"></span>' +
				'</span>' +
				//personalize AUGUSTIRELEASE 2017
				//flytta till facets??
				//'<prm-personalize-results-button ng-if="!$ctrl.isCitationState() && !$ctrl.isJournalSearch() && !$ctrl.isBrowsHeaderResults() && $ctrl.notLocal()"></prm-personalize-results-button>' +
				//visa "logga in för att spara" när INTE inloggad
				//Kiosk ingen loginknapp
				/*
				'<div class="kth_loggain" ng-if="!$ctrl.isSignedIn() && !$ctrl.isCitationState()">' +
					//logga in för att spara fråga etc
					'<button class="button-as-link link-alt-color zero-margin md-button md-primoExplore-theme md-ink-ripple" type="button" (click)="$ctrl.loggain()" aria-label="">' +
						'<prm-icon class="pin-icon" aria-label="Välj register " [icon-type]="::$ctrl.actionsIcons.pin.type" svg-icon-set="action" icon-definition="ic_favorite_outline_24px">' +
						'</prm-icon>' +
						//nytt värde i FE code table i Primo BO
						'<span class="bold-text" translate="results.logintosavequery"></span>' +
						'<div class="md-ripple-container"></div>' +
					'</button>' +
				'</div>' +
				*/
				'<prm-add-query-to-saved-searches ng-if="$ctrl.isSignedIn() && !$ctrl.isCitationState()"></prm-add-query-to-saved-searches>' +
			'</div>' +
			//'itemlist : {{$ctrl.itemlist.length}}' + 
			
			'<div ng-if="$ctrl.isFavorites && !$ctrl.isSavedQuery && $ctrl.favoritesService.getAllItems()" class="results-title results-title-favorites" layout="row">' +
				//lagt till itemlist-villkor för "saved searches" plus en span( så att det inte visas en checkbox vid noll-resultat)
				'<md-checkbox ng-if="$ctrl.itemlist.length > 0" aria-label="Select all items" ng-model="$ctrl.briefResultService.selectAll" ng-change="$ctrl.selectAll()"><span class="results-count" hide-sm hide-md><span translate="nui.favorites.items" translate-values="$ctrl.getPlaceHolders()"></span></span></md-checkbox>' +
				//ta bort att dölja "hide-sm hide-md"
				'<span ng-if="$ctrl.itemlist.length == 0" class="results-count" 1hide-sm 1hide-md><span translate="nui.favorites.items" translate-values="$ctrl.getPlaceHolders()"></span></span>' +
			'</div>' +
			'<div ng-if="$ctrl.isFavorites && !$ctrl.isSavedQuery && !$ctrl.favoritesService.getAllItems()" class="results-title results-title-favorites" layout="row">' +
				'<md-checkbox aria-label="Select all items" ng-model="$ctrl.briefResultService.selectAll" ng-change="$ctrl.selectAll()"><span class="results-count" hide-sm hide-md><span translate="nui.favorites.filter" translate-values="$ctrl.getPlaceHoldersForFilter()"></span></span></md-checkbox>' +
			'</div>' +
			'<div ng-if="::(!$ctrl.isFavorites)">' +
				'<div class="results-container zero-padding" layout="column" ng-disabled="search$ctrl.searchInProgress">' +
					'<div class="list-item-wrapper" ng-repeat="item in $ctrl.itemlist" ng-class="{\'menu-open\':$ctrl.isExpanded($index), \'item-expanded\':$ctrl.isExpanded($index), \'last-item\': $last, \'first-in-page\':$ctrl.firstInPage($index)}" data-page="Page {{::$ctrl.calcPage($index)}}">' +
						'<md-subheader in-view="$ctrl.onTopOfPageInView($ctrl.calcPage($index), $inview, $inviewInfo)" in-view-options="{generateDirection: true, throttle: 50}" id="searchResultPage{{::$ctrl.calcPage($index)}}" ng-if="::$ctrl.firstInPage($index)" ng-hide="$ctrl.searchInfo.total <= 10"><span class="text tiny-uppercase-text">{{\'nui.paging.pagenumber\' | translate}} {{::$ctrl.calcPage($index)}}</span> <span class="sep"></span>' +
						'</md-subheader>' +
						'<prm-brief-result-container class="list-item" ng-class="{\'item-bookmarked\' : $ctrl.showPin(item)}" [item]="::item" [links]="item.delivery.link" [index]="::$ctrl.getItemIndex($index)" [isfavorites]="::$ctrl.isFavorites" [is-expanded]="$ctrl.isExpanded($index)" [item-height]="$ctrl.expandedItemHeight" (expand-item-event)="$ctrl.setExpandedItem($event, $index)">' +
						'</prm-brief-result-container>' +
						'<prm-skip-to [links]="$ctrl.skipLinks" tabindex="-1" ng-if="::($index % 9 === 0 && $index > 0)"></prm-skip-to>' +
					'</div>' +
					'<div layout="row" layout-align="center center" ng-if="$ctrl.isShowMoreResultButton() && $ctrl.searchInfo.total != 0" ng-hide="$ctrl.searchInProgress" class="padding-top-large">' +
						//Aria label
						'<md-button aria-label="More results" ng-if="$ctrl.hasNextResults()" (click)="$ctrl.nextResults()" translate="nui.brief.results.loadMore" class="button-confirm button-large"></md-button>' +
					'</div>' +
					'<prm-spinner ng-if="$ctrl.resultsExists && $ctrl.searchInProgress" class="half-transparent no-text bottom-loader" layout="row" layout-align="center end" layout-margin></prm-spinner>' +
				'</div>' +
				'<prm-page-nav-menu ng-if="$ctrl.shouldDisplayPagingWidget() && $ctrl.resultsExists" (load-next-results-event)="$ctrl.nextResults()" [current-page]="$ctrl.pageInView" [num-of-results]="$ctrl.searchInfo.total" [num-of-loaded-pages]="$ctrl.numOfLoadedPages" [show-components]="$ctrl.pagingConfigutation"></prm-page-nav-menu>' +
			'</div>' +
			//KTHB infinite scroll
			'<md-list class="results-container" ng-if="::($ctrl.isFavorites && !$ctrl.isSavedQuery)" layout="column" infinite-scroll="$ctrl.favoritesService.nextResults()" infinite-scroll-distance="0" infinite-scroll-immediate-check="false">' +
				'<md-list-item class="list-item-wrapper" ng-repeat="item in $ctrl.itemlist" ng-class="{\'menu-open\':$ctrl.isExpanded($index), \'item-expanded\':$ctrl.isExpanded($index), \'last-item\': $last}">' +
					'<prm-brief-result-container class="list-item" [item]="::item" [links]="item.delivery.link" [index]="::($index + 1)" [isfavorites]="::$ctrl.isFavorites" [is-expanded]="$ctrl.isExpanded($index)" [item-height]="$ctrl.expandedItemHeight" (expand-item-event)="$ctrl.setExpandedItem($event, $index)">' +
					'</prm-brief-result-container>' +
				'</md-list-item>' +
				'<prm-spinner ng-if="$ctrl.resultsExists && $ctrl.searchInProgress" class="half-transparent no-text bottom-loader" layout="row" layout-align="center end" layout-margin></prm-spinner>' +
			'</md-list>' +
			//'<prm-saved-queries-list ng-if="$ctrl.isSavedQuery" [(itemlist)]="$ctrl.itemlist"></prm-saved-queries-list>' +
			'<prm-saved-queries-list ng-if="$ctrl.isSavedQuery" [(itemlist)]="$ctrl.itemlist" [(is-search-history)]="$ctrl.isSearchHistory"></prm-saved-queries-list>' +
			'<div ng-class="{\'list-spacer\': !$ctrl.isDisabled(), \'margin-bottom\': $ctrl.isDisabled()}"></div>' +
		'</div>');
		
		/****************

		prm-search 
		
		****************/

		$templateCache.put('components/search/search.html',
		'<div>' +
			//Ta bort inloggningsalert(egen nedan)
			//'<prm-alert-bar ng-if="!$ctrl.displayBorInfoAlert() && !$ctrl.isShowPartsOnCitationTrails()" flex [alert-object]="$ctrl.signInAlert"></prm-alert-bar>' +
			'<div ng-if="$ctrl.displayBorInfoAlert()">' +
				'<prm-alert-bar flex [alert-object]="$ctrl.borInfoAlert"></prm-alert-bar>' +
			'</div>' +
			//Infotext som vi själva lägger in i Primo BO
			//hämta translate-texten i controller för prm-search-after för att användas som villkor?
			//Sätt display eftersom alert bars default är dolda via CSS.
			'<div class="kth_alertbarwrapper" ng-class="!$ctrl.mediaQueries.xs  ? \'1kth_sidepadding\' : \'\' " ng-cloak ng-if="$ctrl.kthinfotext!=\'0\' && $ctrl.showkthinfomessage!=false">' +
				'<div flex="15" flex-md="0" flex-sm="0" flex-xs="0"></div>' +
				'<div style="display:flex" flex ng-cloak layout="column" layout-align="center start" class="bar alert-bar kthinfotext">' +
					//'<div> Texten nedan ändras via Primo BO: nui.kth_infotext</div>' +	
					'<div layout="row" layout-align="center center">' +
						'<span class="bar-text" translate="nui.kth_infotext"></span>' +
						'<md-divider></md-divider>' +
						'<md-button aria-label="{{::(\'nui.message.dismiss\' | translate)}}" (click)="$ctrl.dismisskthinfo()" class="dismiss-alert-button zero-margin" ng-class="ctrl.mediaQueries.xs ? \'md-icon-button\' : \'button-with-icon\' ">' +
							'<prm-icon aria-label="{{::(\'nui.message.dismiss\' | translate)}}" icon-type="svg" svg-icon-set="navigation" icon-definition="ic_close_24px">' +
								'<md-icon md-svg-icon="navigation:ic_close_24px" aria-label="{{::(\'nui.message.dismiss\' | translate)}}" class="md-primoExplore-theme" aria-hidden="true"><svg width="100%" height="100%" viewBox="0 0 24 24" id="ic_close_24px_cache52" y="240" xmlns="http://www.w3.org/2000/svg" fit="" preserveAspectRatio="xMidYMid meet" focusable="false"><path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z"></path></svg></md-icon>' +
							'</prm-icon>' +
							'<span translate="nui.message.dismiss" hide-xs></span>' +
						'</md-button>' +
					'</div>' +
				'</div>' +
				'<div flex="15" flex-md="0" flex-sm="0" flex-xs="0"></div>' +
			'</div>' + 
			//Kiosk ingen loginuppmaning
			/*
			//Avdelare mellan alerts (showcampusmessage = om man klickat på "dismiss")
			'<md-divider ng-if="!$ctrl.userName_kth.length > 0 && $ctrl.kthinfotext!=\'0\' && $ctrl.showcampusmessage!=false && $ctrl.showkthinfomessage!=false"></md-divider>' +
			//inte inloggad
			'<div class="kth_alertbarwrapper" ng-class="!$ctrl.mediaQueries.xs  ? \'1kth_sidepadding\' : \'\' " ng-cloak ng-if="!$ctrl.userName_kth.length > 0 && $ctrl.showcampusmessage!=false">' +
				'<div flex="15" flex-md="0" flex-sm="0" flex-xs="0"></div>' +
				'<div style="display:flex" flex ng-cloak layout="column" layout-align="center start" class="bar alert-bar">' +
					//ändra texten i BO "nui.kth_notoncampus"
					'<div layout="row" layout-align="center center">' +
						//inte på campus
						'<span ng-if="!$ctrl.kthisoncampus" class="bar-text" translate="nui.kth_notoncampus"></span>' +
						//på campus
						'<span ng-if="$ctrl.kthisoncampus" class="bar-text" translate="nui.kth_oncampus"></span>' +
						'<prm-authentication [is-logged-in]="$ctrl.userName_kth.length > 0"></prm-authentication>' + 
						'<md-divider></md-divider>' +
						'<md-button aria-label="{{::(\'nui.message.dismiss\' | translate)}}" (click)="$ctrl.dismisscampusmessage()" class="dismiss-alert-button zero-margin" ng-class="ctrl.mediaQueries.xs ? \'md-icon-button\' : \'button-with-icon\' ">' +
							'<prm-icon aria-label="{{::(\'nui.message.dismiss\' | translate)}}" icon-type="svg" svg-icon-set="navigation" icon-definition="ic_close_24px">' +
								'<md-icon md-svg-icon="navigation:ic_close_24px" aria-label="{{::(\'nui.message.dismiss\' | translate)}}" class="md-primoExplore-theme" aria-hidden="true"><svg width="100%" height="100%" viewBox="0 0 24 24" id="ic_close_24px_cache52" y="240" xmlns="http://www.w3.org/2000/svg" fit="" preserveAspectRatio="xMidYMid meet" focusable="false"><path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z"></path></svg></md-icon>' +
							'</prm-icon>' +
							'<span translate="nui.message.dismiss" hide-xs></span>' +
						'</md-button>' +
					'</div>' +
				'</div>' + 
				'<div flex="15" flex-md="0" flex-sm="0" flex-xs="0"></div>' +
			'</div>' + 
			*/
			//Homepage layout
			//'<md-content class="main" ng-if="!$ctrl.isSearchDone() && !$ctrl.isJournalSearch" layout="row" layout-align="center start" flex>' +
				//'<div flex="0" flex-md="0" flex-lg="15" flex-xl="15" ng-class="{\'flex-lgPlus-15\': $ctrl.mediaQueries.lgPlus}"></div>' +
				//'<prm-static section="homepage" flex class="md-padding"></prm-static>' +
				//'<div flex="0" flex-md="0" flex-lg="15" flex-xl="15" ng-class="{\'flex-lgPlus-15\': $ctrl.mediaQueries.lgPlus}"></div>' +
			//'</md-content>' +

			//NovemberRelease 2019
			'<md-content class="main" ng-if="!$ctrl.isSearchDone() && !$ctrl.isAtozSearch && !$ctrl.isOrgListSearch()" layout="row" layout-align="center start" flex>' +
    			'<div flex="0" flex-md="0" flex-lg="15" flex-xl="15" ng-class="{\'flex-lgPlus-15\': $ctrl.mediaQueries.lgPlus && !$ctrl.facetToLeft, \'flex-lgPlus-15\': $ctrl.mediaQueries.lgPlus && $ctrl.facetToLeft, \'flex-xl-15\': $ctrl.facetToLeft}"></div>' +
    			'<prm-static section="homepage" flex class="md-padding"></prm-static>' +
    			'<div flex="0" flex-md="0" flex-lg="15" ng-class="{\'flex-lgPlus-15\': $ctrl.mediaQueries.lgPlus && !$ctrl.facetToLeft, \'flex-lgPlus-15\': $ctrl.mediaQueries.lgPlus && $ctrl.facetToLeft, \'flex-xl-15\': $ctrl.mediaQueries.xl && !$ctrl.facetToLeft, \'flex-xl-15\': $ctrl.mediaQueries && $ctrl.facetToLeft}"></div>' +
			'</md-content>' +

			//MayRelease 2019
			/*
			'<md-content class="main" ng-if="!$ctrl.isSearchDone() && !$ctrl.isAtozSearch" layout="row" layout-align="center start" flex>' +
    			'<div flex="0" flex-md="0" flex-lg="10" flex-xl="20" ng-class="{\'flex-lgPlus-15\': $ctrl.mediaQueries.lgPlus && !$ctrl.facetToLeft, \'flex-lgPlus-20\': $ctrl.mediaQueries.lgPlus && $ctrl.facetToLeft, \'flex-xl-25\': $ctrl.facetToLeft}"></div>' +
    			'<prm-static section="homepage" flex class="md-padding"></prm-static>' +
    			'<div flex="0" flex-md="10" flex-lg="25" ng-class="{\'flex-lgPlus-30\': $ctrl.mediaQueries.lgPlus && !$ctrl.facetToLeft, \'flex-lgPlus-25\': $ctrl.mediaQueries.lgPlus && $ctrl.facetToLeft, \'flex-xl-30\': $ctrl.mediaQueries.xl && !$ctrl.facetToLeft, \'flex-xl-25\': $ctrl.mediaQueries && $ctrl.facetToLeft}"></div>' +
			'</md-content>' +
			*/
			//Personalize AUGUSTIRELEASE
			'<md-content layout="row" layout-align="center start" flex ng-if="$ctrl.displayDialog()">' +
				'<div flex="0" flex-sm="0" flex-lg="15" flex-xl="20" ng-class="{\'facet-to-left-spacer\': $ctrl.facetToLeft&&!$ctrl.mediaQueries.xl && !$ctrl.mediaQueries.md && !$ctrl.mediaQueries.sm && !$ctrl.mediaQueries.xs, \'flex-xl-25\': $ctrl.facetToLeft}"></div>' +
				'<prm-personalization-dialog tabindex="0" id="personalizationDialog" flex (keydown)="$ctrl.keydownSupport($event)"></prm-personalization-dialog>' +
				'<div flex="0" flex-sm="0" flex-md="0" flex-lg="30" flex-xl="30" ng-class="{\'flex-lg-25 flex-lgPlus-25\': $ctrl.facetToLeft && !$ctrl.mediaQueries.md && !$ctrl.mediaQueries.sm && !$ctrl.mediaQueries.xs}"></div>' +
			'</md-content>' +
			//Träfflista plus facetter
			//'<md-content class="main" ng-if="$ctrl.isSearchDone()" layout="row" layout-align="center start" flex ng-class="{\'padded-container\': $ctrl.mediaQueries.gtxs}">' +
			'<md-content class="main" ng-if="$ctrl.isSearchDone()" layout="row" layout-align="center" flex">' +
				'<div flex="0" flex-md="0" flex-lg="15" flex-xl="15" ng-class="{\'flex-lgPlus-15\': $ctrl.mediaQueries.lgPlus}"></div>' +
				//AUGUSTIRELEASE
				'<prm-search-result-list flex ng-if="$ctrl.isSearchDone()" [itemlist]="$ctrl.searchResults" [featured-result]="$ctrl.featuredResult" [is-favorites]="::(false)" [links]="$ctrl.skipLinks" [query]="$ctrl.parseSearchTerm($ctrl.searchService.getSearchObject().query)" [facet-to-left]="$ctrl.facetToLeft" tabindex="-1"></prm-search-result-list>' +
				//'<prm-search-result-list flex ng-if="$ctrl.isSearchDone()" [itemlist]="$ctrl.searchResults" [is-favorites]="::(false)" [links]="$ctrl.skipLinks"></prm-search-result-list>' +
				'<div tabindex="-1" id="facets" role="contentinfo" class="sidebar" flex-md="25" flex-lg="20" ng-class="{\'flex-order-1\': $ctrl.facetToLeft, \'flex-lgPlus-20\': $ctrl.mediaQueries.lgPlus, \'flex-lgPlus-20\': $ctrl.mediaQueries.lgPlus && $ctrl.facetToLeft, \'flex-lgPlus-20\': $ctrl.mediaQueries.lgPlus && !$ctrl.facetToLeft, \'flex-xl-20\': $ctrl.mediaQueries.xl && !$ctrl.facetToLeft, \'flex-xl-25\': $ctrl.mediaQueries && $ctrl.facetToLeft}" ng-show="$ctrl.mediaQueries.gtsm || !$ctrl.showMobileFacets">' +
					//facett visas bara om sökresultat finns(ta bort för att visa även vid nollresultat)
					//AUGUSTIRELEASE
					//'<prm-facet tabindex="-1" ng-if="($ctrl.hasSearchResults() && !$ctrl.isShowPartsOnCitationTrails() || $ctrl.searchInProgress) && $ctrl.showTimer" (close-mobile-facet-event)="$ctrl.closeMobileFacet($event)"></prm-facet>' +
					//'<prm-facet tabindex="-1" ng-if="(!$ctrl.isShowPartsOnCitationTrails() || $ctrl.searchInProgress) && $ctrl.showTimer" (close-mobile-facet-event)="$ctrl.closeMobileFacet($event)"></prm-facet>' +
					//MAY release 2019
					'<prm-facet tabindex="-1" ng-if="(!$ctrl.isShowPartsOnCitationTrails() || $ctrl.searchInProgress) && !$ctrl.isChaptersAndReviewsState()  && $ctrl.showTimer" (close-mobile-facet-event)="$ctrl.closeMobileFacet($event)"></prm-facet>' +
				'</div>' +
				'<div flex="0" flex-md="0" flex-lg="15" flex-xl="15" ng-class="{\'flex-lgPlus-15\': $ctrl.mediaQueries.lgPlus}"></div>' +
			'</md-content>' +
			'<md-toolbar class="default-toolbar bottom-fixed-toolbar" ng-if="$ctrl.hasSearchResults()" hide-gt-sm>' +
				'<div class="md-toolbar-tools" layout="row" layout-align="center ">' +
					'<md-button id="sidebar-trigger" class="button-with-icon layout-full-height" aria-label="{{::(\'nui.facets.title\' | translate)}}" (click)="$ctrl.showMobileFacets = !$ctrl.showMobileFacets">' +
						'<prm-icon ng-if="$ctrl.showMobileFacets" [icon-type]="::$ctrl.searchBoxIcons.filter.type" [svg-icon-set]="::$ctrl.searchBoxIcons.filter.iconSet" [icon-definition]="::$ctrl.searchBoxIcons.filter.icon"></prm-icon>' +
						'<prm-icon ng-if="!$ctrl.showMobileFacets" [icon-type]="::$ctrl.searchBoxIcons.filterClose.type" [svg-icon-set]="::$ctrl.searchBoxIcons.filterClose.iconSet" [icon-definition]="::$ctrl.searchBoxIcons.filterClose.icon"></prm-icon>' +
						'<span ng-if="$ctrl.showMobileFacets" translate="nui.facets.title"></span> ' +
						'<span ng-if="!$ctrl.showMobileFacets" translate="nui.facets.close"></span>' +
					'</md-button>' +
				'</div>' 
			+'</md-toolbar>' +
			'<prm-view-overlay ng-class="{\'visible\': viewOverlayVisible}" layout="row"><div class="prm-view-overlay-close-button" layout="column" layout-align="center center" ng-if="viewOverlayVisible" flex><md-button class="button-large" ng-click="viewOverlayVisible = false">Close</md-button></div><div class="prm-view-overlay-inner" ng-if="viewOverlayVisible"></div><div class="prm-view-overlay-backdrop" ng-if="viewOverlayVisible"></div></prm-view-overlay>' +
			'<prm-search-after parent-ctrl="$ctrl"></prm-search-after>' +
		'</div>');
		
		/*************************************************************
		
		prm-action-list 
		
		*************************************************************/
		
		$templateCache.put('components/search/actions/action-list.html',
		//visa inte action med sidoscroll utan bara som listade knappar på rad med ny rad om de inte får plats
		//Dummy navbar
		'<md-nav-bar aria-label="not in use" style="display:none"></md-nav-bar>' +
		'<div ng-class="{\'margin-left-medium\':!$ctrl.isFullView}" layout="row" layout-wrap>' +
			//Sortering reverse på index (new UI är av nån anledning tvärtom mot classic UI)
			//TODO Style in i CSS
			'<div layout="column" tabindex="-1" id="{{actionName}}" ng-class="{\'marg-nav-item\':$ctrl.requiredActionsList.length<8 && !$ctrl.isLeftScrollDisabled && !$ctrl.isRightScrollDisabled,\'safari-wrapper\':$ctrl.isSafariBrowse()}" ng-repeat="actionName in ::$ctrl.requiredActionsList | orderBy:\'$index\':true" name="{{actionName}}" ng-if="$ctrl.showMe(actionName)" ng-click="$ctrl.performAction(actionName)" translate-attr="{ \'aria-label\': \'nui.aria.action.nameTitle\'}" translate-values="{name: $ctrl.getActionTranslate(actionName), title:$ctrl.getRecordTitle()}">' +
				//Aria label
				'<md-button aria-label="{{actionName}}" class="kth-actionbuttontext _md-nav-button" style="margin:0;line-height: 1em;" layout="column">' +
					'<prm-icon style="z-index:1" icon-type="{{::$ctrl.actionIcons[$ctrl.actionIconNamesMap[actionName]].type}}" svg-icon-set="{{::$ctrl.actionIcons[$ctrl.actionIconNamesMap[actionName]].iconSet}}" icon-definition="{{::$ctrl.actionIcons[$ctrl.actionIconNamesMap[actionName]].icon}}"></prm-icon>' +
					'<span style="font-size: 10px;font-weight: 600;letter-spacing: .03em;" class="button-text" translate="{{::(\'fulldisplay.command.\'+$ctrl.actionLabelNamesMap[actionName])}}"></span>' +
				'</md-button>' +
			'</div>' +
		'</div>' +
		'<prm-action-container style="width:100%" (close-tabs-event)="$ctrl.closeAllTabs()" [item]="::$ctrl.item" [action-name]="$ctrl.selectedAction" [on-toggle]="::$ctrl.onToggle"></prm-action-container>' +
		'<div layout-align="center center" ng-if="::$ctrl.showMe(actionName) && !$ctrl.isFullView">' +
			'<md-button (keydown)="$ctrl.keydownSupport($event)" class="accessible-close button-link" (click)="$ctrl.closeModalActions($event)" aria-label="{{::(\'nui.aria.close_actions\' | translate)}}" style="margin: 0 0 1em 0">' +
				'<span translate="nui.aria.fulldisplay.closeButton.short"></span>' +
			'</md-button>' +
		'</div>' +
		/*
		'<md-nav-bar md-selected-nav-item="$ctrl.activeAction">' +
			'<div tabindex="-1" class="container-nav-controls" ng-if="!$ctrl.isSafariBrowse()">' +
				'<md-button tabindex="-1" aria-label="{{\'nui.aria.vbrowse.previous\' | translate}}" ng-if="$ctrl.isLeftScrollDisabled" ng-keypress="$ctrl.previous($event)" ng-mousedown="$ctrl.scrollLeftMouseDown();$event.stopPropagation()" ng-mouseup="$ctrl.scrollLeftMouseUp();$event.stopPropagation()" class="nav-control nav-left">' +
					'<md-tooltip><span ng-bind-html="\'virtualbrowse.button.previous\' | translate"></span></md-tooltip>' +
					'<prm-icon icon-type="svg" svg-icon-set="primo-ui" icon-definition="chevron-left" aria-label="{{\'nui.aria.vbrowse.previous\' | translate}}"></prm-icon>' +
				'</md-button>' +
			'</div>' +
			'<div layout="row" layout-align="space-between center" class="scroll-hidden" id="scrollActionList">' +
				'<md-nav-item layout="column" tabindex="-1" id="{{actionName}}" ng-class="{\'marg-nav-item\':$ctrl.requiredActionsList.length<8 && !$ctrl.isLeftScrollDisabled && !$ctrl.isRightScrollDisabled,\'safari-wrapper\':$ctrl.isSafariBrowse()}" ng-repeat="actionName in ::$ctrl.requiredActionsList" name="{{actionName}}" ng-if="$ctrl.showMe(actionName)" md-nav-click="$ctrl.performAction(actionName)" translate-attr="{ \'aria-label\': \'nui.aria.action.nameTitle\'}" translate-values="{name: $ctrl.getActionTranslate(actionName), title:$ctrl.getRecordTitle()}">' +
					'<div layout="column">' +
						'<prm-icon style="z-index:1" icon-type="{{::$ctrl.actionIcons[$ctrl.actionIconNamesMap[actionName]].type}}" svg-icon-set="{{::$ctrl.actionIcons[$ctrl.actionIconNamesMap[actionName]].iconSet}}" icon-definition="{{::$ctrl.actionIcons[$ctrl.actionIconNamesMap[actionName]].icon}}"></prm-icon>' +
						'<span class="button-text" translate="{{::(\'fulldisplay.command.\'+$ctrl.actionLabelNamesMap[actionName])}}"></span>' +
					'</div>' +
				'</md-nav-item>' +
			'</div>' +
			'<div tabindex="-1" class="container-nav-controls" ng-if="!$ctrl.isSafariBrowse()">' +
				'<md-button tabindex="-1" aria-label="{{\'nui.aria.vbrowse.next\' | translate}}" ng-if="$ctrl.isRightScrollDisabled" ng-keypress="$ctrl.next($event)" ng-mousedown="$ctrl.scrollRightMouseDown()" ng-mouseup="$ctrl.scrollRightMouseUp()" class="nav-control nav-right">' +
					'<md-tooltip><span ng-bind-html="\'virtualbrowse.button.next\' | translate"></span></md-tooltip>' +
					'<prm-icon icon-type="svg" svg-icon-set="primo-ui" icon-definition="chevron-right" aria-label="{{\'nui.aria.vbrowse.next\' | translate}}"></prm-icon>' +
				'</md-button>' +
			'</div>' +
		'</md-nav-bar>' +
		'<md-button ng-if="::!$ctrl.isFullView && $ctrl.displayCloseIcon" class="close-action-menu md-icon-button more-options-button" aria-label="{{::(\'nui.aria.moreActions\' | translate)}}" (click)="$ctrl.closeModalActions($event)" hide-xs>' +
			'<prm-icon aria-label="{{::(\'nui.aria.actions.hide\' | translate)}}" [icon-type]="::$ctrl.actionsIcons.closeActions.type" class="close-icon" [svg-icon-set]="::$ctrl.actionsIcons.closeActions.iconSet" [icon-definition]="::$ctrl.actionsIcons.closeActions.icon"></prm-icon>' +
		'</md-button>' +
		'<prm-action-container (close-tabs-event)="$ctrl.closeAllTabs()" [item]="::$ctrl.item" [action-name]="$ctrl.selectedAction" [on-toggle]="::$ctrl.onToggle"></prm-action-container>' +
		'<div layout="row" layout-align="center center" ng-if="::$ctrl.showMe(actionName) && !$ctrl.isFullView">' +
			'<md-button (keydown)="$ctrl.keydownSupport($event)" class="accessible-close button-link" (click)="$ctrl.closeModalActions($event)" aria-label="{{::(\'nui.aria.close_actions\' | translate)}}" style="margin: 0 0 1em 0">' +
				'<span translate="nui.aria.fulldisplay.closeButton.short"></span>' +
			'</md-button>' +
		'</div>' +
		*/
		'<prm-action-list-after parent-ctrl="$ctrl"></prm-action-list-after>');

		
		/***********************************************************
		
		//Kiosk 
		prm-search-result-availability-line
		
		***********************************************************/
		$templateCache.put('components/search/searchResult/searchResultAvailability/searchResultAvailabilityLine.html',
			'<div ng-repeat="availability in $ctrl.displayedAvailability track by $index" layout="row" layout-align="start start">' +
				'<prm-icon ng-if="$ctrl.isOnline($index,availability)" availability-type icon-type="{{::$ctrl.availabilityLineIcons.onlineMaterial.type}}" svg-icon-set="{{::$ctrl.availabilityLineIcons.onlineMaterial.iconSet}}" icon-definition="{{::$ctrl.availabilityLineIcons.onlineMaterial.icon}}"></prm-icon>' +
				'<prm-icon ng-if="$ctrl.isPhysical($index,availability)" availability-type icon-type="{{::$ctrl.availabilityLineIcons.physicalMaterial.type}}" svg-icon-set="{{::$ctrl.availabilityLineIcons.physicalMaterial.iconSet}}" icon-definition="{{::$ctrl.availabilityLineIcons.physicalMaterial.icon}}"></prm-icon>' +
				
				//Kiosk Bort med klickmöjlighet till fulltext
				//lagt till en button med villkor
				'<md-button prm-brief-internal-button-marker ng-if="$ctrl.isPhysical($index,availability)" ng-click="$ctrl.handleAvailability($index, $event);$event.preventDefault();" class="neutralized-button arrow-link-button" title="{{::$ctrl.getTranslatedLine(\'delivery.code.\'+availability)}}">' +
				//'<md-button prm-brief-internal-button-marker ng-click="$ctrl.handleAvailability($index, $event);$event.preventDefault();" class="neutralized-button arrow-link-button" title="{{::$ctrl.getTranslatedLine(\'delivery.code.\'+availability)}}">' +
					'<span class="button-content">' +
						'<span class="availability-status {{availability}}" translate="delivery.code.{{availability}}" translate-values="$ctrl.getPlaceHolders($ctrl.result)" translate-compile></span>' +
						'<span ng-if="$ctrl.showDisplayOtherLocations() && $ctrl.isPhysical($index)" translate="delivery.and.other.locations"></span>' +
						'<prm-icon ng-if="$ctrl.isDirectLink($index)" external-link icon-type="{{$ctrl.availabilityLineIcons.externalLink.type}}" svg-icon-set="{{$ctrl.availabilityLineIcons.externalLink.iconSet}}" icon-definition="{{$ctrl.availabilityLineIcons.externalLink.icon}}" aria-label="{{\'nui.externalLink\' | translate}}"></prm-icon>' +
					'</span>' +
					'<prm-spinner class="inline-loader display-inline dark-on-light half-transparent" ng-if="$ctrl.result.rtaInProgress"></prm-spinner>' +
					'<prm-icon link-arrow icon-type="{{::$ctrl.availabilityLineIcons.arrowRight.type}}" svg-icon-set="{{::$ctrl.availabilityLineIcons.arrowRight.iconSet}}" icon-definition="{{::$ctrl.availabilityLineIcons.arrowRight.icon}}"></prm-icon>' +
				'</md-button>' +
				'<md-button prm-brief-internal-button-marker ng-if="$ctrl.isOnline($index,availability)" ng-click="$ctrl.noaccess();$event.preventDefault();" class="neutralized-button arrow-link-button" title="{{::$ctrl.getTranslatedLine(\'delivery.code.\'+availability)}}">' +
				//'<md-button prm-brief-internal-button-marker ng-click="$ctrl.handleAvailability($index, $event);$event.preventDefault();" class="neutralized-button arrow-link-button" title="{{::$ctrl.getTranslatedLine(\'delivery.code.\'+availability)}}">' +
					'<span class="button-content">' +
						'<span class="availability-status {{availability}}" translate="delivery.code.{{availability}}" translate-values="$ctrl.getPlaceHolders($ctrl.result)" translate-compile></span>' +
						'<span ng-if="$ctrl.showDisplayOtherLocations() && $ctrl.isPhysical($index)" translate="delivery.and.other.locations"></span>' +
						//'<prm-icon ng-if="$ctrl.isDirectLink($index)" external-link icon-type="{{$ctrl.availabilityLineIcons.externalLink.type}}" svg-icon-set="{{$ctrl.availabilityLineIcons.externalLink.iconSet}}" icon-definition="{{$ctrl.availabilityLineIcons.externalLink.icon}}" aria-label="{{\'nui.externalLink\' | translate}}"></prm-icon>' +
					'</span>' +
					'<prm-spinner class="inline-loader display-inline dark-on-light half-transparent" ng-if="$ctrl.result.rtaInProgress"></prm-spinner>' +
					'<prm-icon link-arrow icon-type="{{::$ctrl.availabilityLineIcons.arrowRight.type}}" svg-icon-set="{{::$ctrl.availabilityLineIcons.arrowRight.iconSet}}" icon-definition="{{::$ctrl.availabilityLineIcons.arrowRight.icon}}"></prm-icon>' +
				'</md-button>' +
			'</div>' +
			'<prm-search-result-availability-line-after parent-ctrl="$ctrl"></prm-search-result-availability-line-after>');

		
		/*************************************************************
		prm-brief-result-container 
		
		//det här är varje post i träfflistan
		//byt ut favoritikon till hjärta, visa actions till share
		//Egna tillägg till actionmenyn
		*************************************************************/
		
		$templateCache.put('components/search/briefResult/briefResultContainer.html',
		//'<div ng-if="$ctrl.isPc()">' +
		//lagt till selectable-text(se directive)
		//ng-click?? (visa ej dialog)
		//lagt till $ctrl.isFullView så att det inte ska gå att klicka i full view
		// januari 2019 release id="SEARCH_RESULT_RECORDID_{{::$ctrl.recordId}}"
		// januari 2019 release selectable(se directive ovan) genererar fel
		'<div ng-click="$ctrl.isFullView || $ctrl.handleDetails($ctrl.item,$event, true)" class="list-item-primary-content result-item-primary-content" ng-class="::{\'has-checkbox\': $ctrl.isfavorites, \'new-result-item\' : ($ctrl.index && $ctrl.newMetalibItem())}" data-recordid="{{::$ctrl.recordId}}" id="SEARCH_RESULT_RECORDID_{{::$ctrl.recordId}}" layout="row">' +
			'<span class="list-item-count">' +
				'<span>{{::$ctrl.index}}</span>' +
				'<md-tooltip ng-if="::($ctrl.index && $ctrl.newMetalibItem())"><span translate="brief.New_Result"></span></md-tooltip>' +
			'</span>' +
			'<md-checkbox ng-if="::$ctrl.isfavorites" flex="5" aria-label="{{::(\'nui.aria.brief.select\' | translate)}}{{::$ctrl.index}}" (click)="$event.stopPropagation(); $event.preventDefault();" ng-model="$ctrl.isChosen"></md-checkbox>' +
			'<div class="result-item-image" layout="column" ng-if="!$ctrl.mediaQueries.xs">' +
				'<div class="media-content-images">' +
					//Gör omslagen stora vid klick
					'<div class="media-thumbnail" ng-click="$event.stopPropagation();$event.preventDefault();$ctrl.largeimage($event);">' +
						'<a tabindex="-1" ng-href="{{::$ctrl.getDeepLinkPath()}}" class="a-tag-as-wrapper">' +
							// Ta bort "multiple ikon" i thumbnail-directive?
							'<prm-search-result-thumbnail-container class="media-content-images" ng-class="::{\'dedup-images-holder\' : $ctrl.isMultipleVersions() && !$ctrl.isFavoriteState()}" [item]="::$ctrl.item" [links]="$ctrl.links" [frbr]="::$ctrl.isMultipleVersions()" [is-frbr-generic]="::$ctrl.isFrbrGeneric()"></prm-search-result-thumbnail-container>' +
						'</a>' +
					'</div>' +
				'</div>' +
			'</div>' +
			'<div class="text-selector-spacer"></div>' +
			'<div class="result-item-text" layout="column" layout-fill flex>' +
				'<div class="media-content-type align-self-start">' +
					'<span ng-if="::$ctrl.showItemType" translate="{{::$ctrl.getResourceTypeForDisplay()}}"></span>' +
					'<span ng-if="::($ctrl.isPc() && !$ctrl.isfavorites && $ctrl.isMultipleVersions() && !$ctrl.isFavoriteForDisplayFrbr)">' +
						//ta bort texten "multiple sources exist see all" på varje post i träfflistan??
						//vilka är kriterierna för att den visas?
						//'<prm-search-result-frbr-line [result]="::$ctrl.item" [is-full-view]="::$ctrl.isFullView"></prm-search-result-frbr-line>' +
					'</span>' +
				'</div>' +
				'<div class="isMultipleVersions" ng-if="::(!$ctrl.isPc() && !$ctrl.isFrbrGeneric() && !$ctrl.isfavorites && $ctrl.isMultipleVersions() && !$ctrl.isFavoriteForDisplayFrbr)">' +
					//"X versions exists. View all"
					'<prm-search-result-frbr-line [result]="::$ctrl.item" [is-full-view]="::$ctrl.isFullView"></prm-search-result-frbr-line>' +
				'</div>' +
				'<prm-brief-result class="result-item-details" [item]="::$ctrl.item" [resource-type-for-display]="::$ctrl.getResourceTypeForDisplay()" [deep-link]="::$ctrl.getDeepLinkPath()" [is-full-view]="::$ctrl.isFullView" layout="column"></prm-brief-result>' +
				//february 2018 release
				'<prm-snippet [record]="::$ctrl.item"></prm-snippet>' +
				//november 2018
				'<prm-search-result-journal-indication-line ng-if="$ctrl.isSuprima" [item]="::$ctrl.item"></prm-search-result-journal-indication-line>' +
				'<div ng-if="$ctrl.isDBSearch()" class="item-detail" style="z-index:100">{{$ctrl.getDescription()}}</div>' +
				'<div ng-if="::(!$ctrl.isSuprima && ($ctrl.isPeerDocument || $ctrl.isOpenAccessDocument))" class="badges" layout="row" layout-align="start start">' +
					'<div class="peer-reviewed-mark" ng-if="::$ctrl.isPeerDocument"><prm-icon class="peer-reviewed-mark-icon" icon-type="{{$ctrl.actionsIcons.peerreviewed.type}}" svg-icon-set="{{$ctrl.actionsIcons.peerreviewed.iconSet}}" icon-definition="{{$ctrl.actionsIcons.peerreviewed.icon}}"></prm-icon><span translate="fulldisplay.constants.peer_reviewed_icon"><md-tooltip><span>{{\'fulldisplay.constants.peer_reviewed_tooltip\' | translate}}</span></md-tooltip></span></div>' +
					//'<div class="open-access-mark" ng-if="::$ctrl.isOpenAccessDocument"><span class="icon-after-icon" ng-if="::$ctrl.isPeerDocument"></span><prm-icon class="open-access-mark-icon" icon-type="{{$ctrl.actionsIcons.openaccess.type}}" svg-icon-set="{{$ctrl.actionsIcons.openaccess.iconSet}}" icon-definition="{{$ctrl.actionsIcons.openaccess.icon}}"></prm-icon><span translate="fulldisplay.constants.open_access_icon"><md-tooltip><span>{{\'fulldisplay.constants.open_access_tooltip\' | translate}}</span></md-tooltip></span></div>' +
				'</div>' +
				//slut november 2018
				'<div class="search-result-availability-line-wrapper">' +
					'<prm-search-result-availability-line ng-if="($ctrl.delivery &&(!$ctrl.isGenericRecord() || $ctrl.isPc()))" tabindex="-1" [result]="::$ctrl.item" [is-full-view]="::$ctrl.isFullView" [is-overlay-full-view]="$ctrl.isOverlayFullView" [collection-discovery-data]="::$ctrl.collectionDiscoveryData" ng-click="$event.stopPropagation()" (open-full-display-with-getit1)="$ctrl.handleDetails($ctrl.item, $event, false);"></prm-search-result-availability-line>' +
				'</div>' +
				'<prm-search-result-frbr-line [result]="::$ctrl.item" [is-full-view]="::$ctrl.isFullView" [index]="::$ctrl.index" ng-if="::($ctrl.isFrbrGeneric() && !$ctrl.isfavorites && $ctrl.isMultipleVersions() && !$ctrl.isPc() && !$ctrl.isFavoriteForDisplayFrbr)"></prm-search-result-frbr-line>' +
				//book chapters may 2019
				'<prm-chapters-results-line ng-click="$event.stopPropagation()" tabindex="-1" [item]="::$ctrl.item" ng-if="$ctrl.hasRelatedItems () && ($ctrl.isFullViewOverlayOpen || $ctrl.isFullView)"></prm-chapters-results-line>' +
				'<prm-favorites-record-labels [item]="::$ctrl.item" ng-if="::$ctrl.isfavorites"></prm-favorites-record-labels>' +
			'</div>' +
		'</div>' +
		'<div ng-if="::(!$ctrl.isGenericRecord() || $ctrl.isPc())" class="result-item-actions" layout="row" ng-keydown="$ctrl.keyDownSupport($event)">' +
			'<prm-citation-trails-indication-container ng-if="::($ctrl.isShowCitationTrails() && !$ctrl.isFullView)" [record]="::$ctrl.item"></prm-citation-trails-indication-container>' +
			//Action buttons original(dolda via css)
			'<md-button aria-label="{{::(\'nui.aria.upFrontActions.action\' | translate: {action: $ctrl.getActionLabel(action)} )}}" ng-if="::(!$ctrl.isFullView)" ng-repeat="action in ::$ctrl.upFrontActions" class="md-icon-button custom-button prm-primary" data-custom-button="action" (click)="$ctrl.openTab($event, action)" hide-xs>' +
				'<md-tooltip md-delay="400"><span translate="{{::(\'fulldisplay.command.\'+$ctrl.getActionLabel(action))}}"></span></md-tooltip>' +
				'<prm-icon aria-label="{{::(\'nui.aria.upFrontActions.action\' | translate:{action: $ctrl.getActionLabel(action)})}}" class="md-icon-button-custom" icon-type="{{::$ctrl.actionsIcons[$ctrl.getActionIconName(action)].type}}" svg-icon-set="{{::$ctrl.actionsIcons[$ctrl.getActionIconName(action)].iconSet}}" icon-definition="{{::$ctrl.actionsIcons[$ctrl.getActionIconName(action)].icon}}"></prm-icon>' +
			'</md-button>' +
			//Kiosk inga favoriter/actions
			/*
			//Favourites
			'<div aria-live="assertive" ng-if="::(!$ctrl.isfavorites  && $ctrl.showBookmark())" class="pin-button">' + 
				'<md-button ng-if="!$ctrl.showPin()" ng-class="{\'pinned\':!$ctrl.showPin()}" class="md-icon-button custom-button pin-button" aria-label="{{::(\'nui.aria.favorites.pin\' | translate:\'{index: \\\'\'+$ctrl.index +\'\\\'}\')}}" (click)="$ctrl.updateFavorites($event);$event.stopPropagation();">' +
					'<md-tooltip md-delay="400"><span translate="nui.favorites.add.tooltip"></span></md-tooltip>' +
					//KTHB hjärta
					'<prm-icon aria-label="{{::(\'nui.aria.favorites.pin\' | translate:\'{index: \\\'\'+ $ctrl.index+\'\\\'}\')}}" [icon-type]="::$ctrl.actionsIcons.pin.type" svg-icon-set="action" icon-definition="ic_favorite_outline_24px"></prm-icon>' +
				'</md-button>' +
				'<md-button ng-if="$ctrl.showPin()" ng-class="{\'unpinned\':$ctrl.showPin()}" class="md-icon-button custom-button unpin-button" aria-label="{{::(\'nui.aria.favorites.unpin\' | translate:\'{index: \\\'\'+ $ctrl.index+\'\\\'}\')}}" (click)="$ctrl.updateFavorites();$event.stopPropagation();">' +
					'<md-tooltip md-delay="400"><span translate="nui.favorites.remove.tooltip"></span></md-tooltip>' +
					//KTHB hjärta
					'<prm-icon aria-label="{{::(\'nui.aria.favorites.unpin\' | translate:\'{index: \\\'\'+ $ctrl.index+\'\\\'}\')}}" [icon-type]="::$ctrl.actionsIcons.unPin.type" svg-icon-set="action" icon-definition="ic_favorite_24px"></prm-icon>' +
				'</md-button>' +
				'<div ng-init="messageAdded = (\'nui.aria.favorites.in\' | translate) ;messageRemoved = (\'nui.aria.favorites.out\' | translate)" class="accessible-only" aria-label="{{$ctrl.showPin() ? messageAdded : messageRemoved}}" aria-live="assertive">' +
					'{{$ctrl.showPin() ? messageAdded : messageRemoved}}' +
				'</div>' +
			'</div>' +
			//om favoriteslistan/sidan visas
			'<md-button ng-if="::($ctrl.isfavorites  && $ctrl.showBookmark())" class="md-icon-button custom-button prm-primary" aria-label="{{::(\'nui.aria.favorites.unpin\' | translate:\'{index: \\\'\'+($ctrl.index)+\'\\\'}\')}}" (click)="$ctrl.unpinFavorites();$event.stopPropagation();">' +
				'<md-tooltip md-delay="400">{{::("nui.favorites.remove.tooltip" | translate)}}</md-tooltip>' +
				'<prm-icon aria-label="{{::(\'nui.aria.favorites.unpin\' | translate:\'{index: \\\'\'+($ctrl.index)+\'\\\'}\')}}" class="" [icon-type]="::$ctrl.actionsIcons.unPin.type" svg-icon-set="action" icon-definition="ic_favorite_24px"></prm-icon>' +
			'</md-button>' + 
			'<md-button id="briefResultMoreOptionsButton" ng-if="::!$ctrl.isFullView" class="md-icon-button more-options-button" aria-label="{{::(\'eshelf.send_to.tooltip\' | translate)}}" (click)="$ctrl.closeOpenTabs($event);$ctrl.toggleItemMenu($event);$event.stopPropagation();" hide-xs>' +
				'<md-tooltip md-delay="800" md-autohide="true"><span translate="eshelf.send_to.tooltip"></span></md-tooltip>' +
				//KTHB Share icon
				'<prm-icon aria-label="{{::(\'nui.aria.actions.show\' | translate)}}" [icon-type]="::$ctrl.actionsIcons.moreActions.type" class="open-icon" svg-icon-set="social" icon-definition="ic_share_24px"></prm-icon>' +
				'<prm-icon aria-label="{{::(\'nui.aria.actions.hide\' | translate)}}" [icon-type]="::$ctrl.actionsIcons.closeActions.type" class="close-icon" [svg-icon-set]="::$ctrl.actionsIcons.closeActions.iconSet" [icon-definition]="::$ctrl.actionsIcons.closeActions.icon"></prm-icon>' +
			'</md-button>' +
			*/
		'</div>' +
		'<div class="action-list-content" ng-style="{\'padding-top\': $ctrl.itemHeight}" ng-if="!$ctrl.isFullView" ng-keydown="$ctrl.keyDownSupport($event)">' +
			'<md-content ng-if="$ctrl.isExpanded" ng-class="::{\'secondary-content-holder\': !$ctrl.isFullView}">' +
				'<md-divider></md-divider>' +
				//ingen selected action()
				//'{{$ctrl.selectedAction}}' +
				//visa inte action med sidoscroll utan bara som listade knappar på rad med ny rad om de inte får plats
				'<prm-action-list layout="row" layout-wrap ng-if="$ctrl.isExpanded2 && !$ctrl.isGenericRecord() || $ctrl.isPc()" ng-class="{ \'visible\': $ctrl.isExpanded3 }" [display-all]="true" [display-close-icon]="false" [item]="::$ctrl.item" [(selected-action)]="\'nothing\'" (close-modal)="$ctrl.closeOpenTabs($event);$ctrl.toggleItemMenu($event);$event.stopPropagation();$ctrl.focusOnXButton()"></prm-action-list>' +
			'</md-content>' +
		'</div>' +
		'<prm-brief-result-container-after parent-ctrl="$ctrl"></prm-brief-result-container-after>'
	//'</div>'
		);

		/**************************************
		
		prm-search-result-thumbnail-container 
		
		***************************************/
		$templateCache.put('components/search/searchResult/searchResultThumbnail/search-result-thumbnail-container.html',
		'<div>' +
			//'<img class="fallback-img fallback-static" ng-if="!$ctrl.selectedThumbnailLink.linkURL" ng-src="{{::$ctrl.defaultThumbnailLink.linkURL}}"/>' +
			'<img class="fallback-img" ng-if="!$ctrl.isMultipleVersions() && !$ctrl.selectedThumbnailLink.linkURL && !!$ctrl.defaultThumbnailLink.linkURL && !$ctrl.isVirtualBrowse" ng-src="{{::$ctrl.defaultThumbnailLink.linkURL}}"/>' +
			'<img class="main-img fan-img-1" 1ng-class="{\'fan-img\' : $ctrl.isMultipleVersions() &&  !$ctrl.isFavoriteState() && $ctrl.selectedThumbnailLink.linkURL}" ng-if="$ctrl.selectedThumbnailLink.linkURL" ng-src="{{$ctrl.selectedThumbnailLink.linkURL}}" aria-label="{{$ctrl.getResourceTypeForDisplay() | translate}}{{\' \'}}{{\'nui.mediatype.image\' | translate}}" alt="{{$ctrl.getResourceTypeForDisplay() | translate}}{{\' \'}}{{\'nui.mediatype.image\' | translate}}"/>' +
			//'<img class="fan-img fan-img-2" aria-hidden="true" ng-if="$ctrl.isMultipleVersions() &&  !$ctrl.isFavoriteState() && $ctrl.selectedThumbnailLink.linkURL" ng-src="{{$ctrl.selectedThumbnailLink.linkURL}}" alt="{{$ctrl.getResourceTypeForDisplay() | translate}}{{\' \'}}{{\'nui.mediatype.image\' | translate}}"/>' +
			//'<img class="fan-img fan-img-3" aria-hidden="true" ng-if="$ctrl.isMultipleVersions() && !$ctrl.isFavoriteState() && $ctrl.selectedThumbnailLink.linkURL" ng-src="{{$ctrl.selectedThumbnailLink.linkURL}}" alt="{{$ctrl.getResourceTypeForDisplay() | translate}}{{\' \'}}{{\'nui.mediatype.image\' | translate}}"/>' +
		'</div>' +
		//november release
		'<div ng-if="$ctrl.links" ng-init="$ctrl.go()"></div>' +
		'<prm-search-result-thumbnail-container-after parent-ctrl="$ctrl"></prm-search-result-thumbnail-container-after>');

		/****** prm-no-search-result ******/
		$templateCache.put('components/search/searchResult/searchResultList/noSearchResult.html',
		'<md-card class="default-card zero-margin">' +
			'<md-card-title><md-card-title-text><span translate class="md-headline">nui.noresults.title</span></md-card-title-text></md-card-title>' +
			'<md-card-content>' +
				'<p><span translate="nui.noresults.description" translate-value-term="{{$ctrl.term}}"></span></p>' +
				'<p><span translate class="bold-text">nui.noresults.suggestions</span></p>' +
				'<ul>' +
					'<li translate>nui.noresults.suggestions1</li>' +
					'<li translate>nui.noresults.suggestions2</li>' +
					'<li translate>nui.noresults.suggestions3</li>' +
					//Kiosk inga länkar!
					'<li translate>nui.noresults_kiosk.suggestions4</li>' +
					'<li translate>nui.noresults_kiosk.suggestions5</li>' +
				'</ul>' +
			'</md-card-content>' +
		'</md-card>' +
		'<prm-no-search-result-after parent-ctrl="$ctrl"></prm-no-search-result-after>');
		
		/*******************
		
		prm-full-view 
		
		*******************/
		$templateCache.put('components/search/fullView/full-view.html',
		//villkor att det alltid ska vara layout-row vare sig det är dialog eller vanlig sida i full bredd
		//'<div ng-class="{\'\': $ctrl.isOverlayFullView , \'layout-row\': !$ctrl.isOverlayFullView && $ctrl.mediaQueries.gtsm, \'layout-column\': !$ctrl.isOverlayFullView && $ctrl.mediaQueries.sm}">' + 
		'<div ng-class="{\'layout-row\': !$ctrl.mediaQueries.sm , \'layout-column\': $ctrl.mediaQueries.sm}">' + 
		//'<div class="layout-row">' + 
			'<div class="full-view-container" layout-xs="column" layout-sm="column" layout-gt-sm="row" id="full-view-container" flex>' + 
				'<div class="full-view-inner-container" flex>' + 
					'<div class="services-index-under" hide-xs role="navigation">' + 
						'<div id="services-index" layout="column" layout-align="start start" sticky offset="35">' + 
							'<div ng-if="!$ctrl.isOverlayFullView" style="height: 2em">' + 
							'</div>' + 
							//Bort med "serviceknappar" och stängkrysset
							/*
							'<md-button aria-label="{{service.title|translate}}" class="zero-margin button-right-align button-link" ng-repeat="service in $ctrl.services track by $index" ng-click="$ctrl.scrollToElementIdWithBeacon(service.scrollId)" ng-if="!service.isDisabled">' +
								'<span translate="{{service.title}}"></span>' +
							'</md-button>' +
							'<md-button ng-if="::$ctrl.isOverlayFullView" class="accessible-close zero-margin button-link" (click)="$ctrl.closeDialog()" aria-label="{{::(\'nui.aria.fulldisplay.closeButton\' | translate)}}">' +
								'<span translate="nui.aria.fulldisplay.closeButton.short"></span>' +
							'</md-button>' +
							*/
						'</div>' + 
					'</div>' + 
					'<div ng-attr-id="{{$ctrl.services[0].scrollId}}">' + 
						'<prm-full-view-service-container [load-additional-services]="$ctrl.loadFullViewAdditionalServices || !$ctrl.isOverlayFullView" [item]="::$ctrl.item" [isfavorites]="$ctrl.isfavorites" [service]="$ctrl.services[0]">' +
						'</prm-full-view-service-container>' + 
					'</div>' + 
					//villkor att inte visa citationTrails här, Visa inte heller "May be requested"
					//Kiosk visa inte actions , villkor tillagt
					'<div class="full-view-section" ng-repeat="service in $ctrl.services.slice(1) track by $index" ng-attr-id="{{service.scrollId}}" ng-if="!service.isDisabled && service.scrollId!=\'citationTrails\' && service.scrollId!=\'tags\' && service.scrollId!=\'action_list\'">' + 
						'<div class="full-view-section-content" ng-if="$ctrl.showConditionalService(service)">' + 
							//Visa en generell för samtliga "may be requested"...(ng-if="service.title!=\'nui.getit.alma_tab1_nofull\' && service.title!=\'nui.getit.alma_tab1_nofulltextlinktorsrc\'")
							//ANVÄNDS INTE FÖR TILLFÄLLET!
							'<prm-full-view-service-container ngs-if="service.title!=\'nui.getit.alma_tab1_nofull\' && service.title!=\'nui.getit.alma_tab1_nofulltextlinktorsrc\'" [load-additional-services]="$ctrl.loadFullViewAdditionalServices || !$ctrl.isOverlayFullView" [item]="::$ctrl.item" [service]="service" [index]="::$index">' + 
							'</prm-full-view-service-container>' +
							/*							
							'<div ng-if="service.title==\'nui.getit.alma_tab1_nofull\' || service.title==\'nui.getit.alma_tab1_nofulltextlinktorsrc\'" class="loc-altemtrics">' +
								'<h4 class="section-title md-title light-text" translate="nui.getit.alma_tab1_nofull"></h4>' +
								'<md-divider flex="" class="md-primoExplore-theme flex"></md-divider>' +
								'<div translate="nui.getit.kth_nomatch"></div>' +
								'<div translate="nui.getit.kth_youmayrequest" class="clearfix"></div>' +
								'<div style="margin: 0.5em 0 0.3em 0;" class="clearfix requestOptionNoHoldings">' +
									'<a translate="nui.getit.kth_requestorsuggest" id="openRSRequest1" class="submitAsLink popout" type="submit" ng-click="$ctrl.openurl()" style="color: tomato"></a>' +
								'</div>' +
								'<div style="margin: 0.5em 0 0.3em 0;" class="clearfix requestOptionNoHoldings">' +
									'<a translate="nui.getit.kth_searchlibris" id="openRSRequest2" class="submitAsLink popout" type="submit" onclick="window.open(\'http://libris.kb.se/hitlist?q=linkisxn:9780511782350\',\'_newTab\')"></a>' +
								'</div>' +
								'<div class="clearfix">' +
									'<a ng-if="$ctrl.kth_language == \'en_US\'" translate="nui.getit.kth_askus" href="https://www.kth.se/en/kthb/besok-och-kontakt/kontakta/fraga-oss-1.546631" target="_blank"></a>' +
									'<a ng-if="$ctrl.kth_language == \'sv_SE\'" translate="nui.getit.kth_askus" href="https://www.kth.se/kthb/besok-och-kontakt/kontakta/fraga-oss-1.546631" target="_blank"></a>' +
								'</div>' +
							'</div>' +
							*/
						'</div>' +
					'</div>' +
				'</div>' + 
				//inte recommendations här
				//'<div ng-if="::($ctrl.bxdisplay && $ctrl.isOverlayFullView)" class="full-view-aside" flex-md="25" flex-lg="25" flex-xl="20" flex>' + 
					//'<prm-recomendations [item]="::$ctrl.item" [(bxdisplay)]="$ctrl.bxdisplay"></prm-recomendations>' + 
				//'</div>' + 
				//bort med layoutdivar
				//'<div ng-if="::($ctrl.bxdisplay && $ctrl.isOverlayFullView)" flex-xl="20" ng-class="{\'flex-lgPlus-15\': $ctrl.mediaQueries.lgPlus}"></div>' + 
				//'<div class="full-view-spacer" ng-if="::(!$ctrl.bxdisplay  && $ctrl.isOverlayFullView)" flex="0" flex-md="0" flex-lg="20" flex-xl="30" ng-class="{\'flex-lgPlus-25\': $ctrl.mediaQueries.lgPlus}"></div>' + 
			'</div>' +
			//'<div ng-if="::($ctrl.bxdisplay && !$ctrl.isOverlayFullView)" flex-md="25" flex-lg="25" flex-xl="20" flex>' +
				//'<prm-recomendations [item]="::$ctrl.item" [bxenable]="::$ctrl.bxenable" [(bxdisplay)]="::$ctrl.bxdisplay"></prm-recomendations>' +
			//'</div>' +
			
			//visa citationTrails/recommendations här istället med villkor
			'<div flex-md="30" flex-lg="30" flex-xl="30">' +
				'<div flex ng-repeat="service in $ctrl.services.slice(1) track by $index" ng-attr-id="{{service.scrollId}}" ng-if="($ctrl.showConditionalService(service) && !service.isDisabled && service.scrollId==\'citationTrails\')">' + 
					'<div class="full-view-section-content" ng-if="$ctrl.showConditionalService(service) && service.scrollId==\'citationTrails\'">' +
						//sätt load-additional-services = true
						'<prm-full-view-service-container [load-additional-services]="true" [item]="::$ctrl.item" [service]="service" [index]="::$index">' + 
						'</prm-full-view-service-container>' + 
					'</div>' +
					//Metrics
					'<prm-full-view-after parent-ctrl="$ctrl">' + 
					'</prm-full-view-after>' +
				'</div>' + 
				//Kiosk inga recommendations
				/*
				'<div flex ng-if="::($ctrl.bxdisplay)" >' + 
					'<prm-recomendations [item]="::$ctrl.item" [bxenable]="::$ctrl.bxenable" [(bxdisplay)]="::$ctrl.bxdisplay"></prm-recomendations>' + 
				'</div>' + 
				*/
			'</div>' + 
			//bort med layoutdiv
			//'<div ng-if="::($ctrl.bxdisplay && !$ctrl.isOverlayFullView)" flex="0" flex-gt-md="5" flex-xl="20" ng-class="{\'flex-lgPlus-10\': $ctrl.mediaQueries.lgPlus}"></div>' +
			//visa bara när full view inte är i "md-dialog"
			//'<div class="full-view-spacer" ng-if="::(!$ctrl.bxdisplay  && !$ctrl.isOverlayFullView)" flex="0" flex-md="0" flex-lg="20" flex-xl="30" ng-class="{\'flex-lgPlus-25\': $ctrl.mediaQueries.lgPlus}"></div>' + 
		'</div>' + 
		'<prm-full-view-after-kth parent-ctrl="$ctrl">' + 
		'</prm-full-view-after-kth>'
		);
		
		/****** prm-recomendations ******/
		$templateCache.put('components/search/fullView/recomendation/recomendations.html',
		'<div class="recommendations-wrapper" layout="column" layout-align="start start" ng-if="$ctrl.bxenable">'+
			'<div class="section-head" layout="column" layout-align="start start">'+
				'<h2 class="section-title md-title light-text" translate="nui.suggestions.header"></h2>' + 
				//divider tillagd
				'<md-divider flex="" class="md-primoExplore-theme flex"></md-divider>' +
				'<p class="section-description"><span translate="nui.suggestions.tooltip"></span></p>' +
			'</div>' +
		'</div>' +
		'<div class="recommendations-list">' +
			'<div class="recommendations-item animate-opacity-and-scale" layout="row" ng-repeat="pnx in $ctrl.recommendations.docs | limitTo:$ctrl.quantity">' +
				'<prm-recomendation-item [item]="::pnx"></prm-recomendation-item>' +
			'</div>' +
		'</div>' + 
		'<md-button class="button-link prm-alt-link" ng-if="$ctrl.more" ng-click="$ctrl.moreSuggestions()">' + 
			'<span translate="nui.suggestions.more"></span>' +
		'</md-button>' +
		'<prm-recomendations-after parent-ctrl="$ctrl"></prm-recomendations-after>');
		
		
		/****** prm-full-view-dialog-template ******/
		//Här visas fulla posten i en md-dialog
		
		$templateCache.put('components/search/fullView/full-view-dialog-template.html', 
		'<md-dialog flex-md="80" flex-lg="70" flex-xl="60" style="max-height: 80%;f1lex: 1 1 60%;m1ax-width: 60%;" id="kth_fulldetail" aria-label="List dialog">' +
			'<md-toolbar class="_md _md-toolbar-transitions">' +
				'<div class="md-toolbar-tools">' +
					'<h2 flex class="md-truncate">{{$ctrl.item.pnx.display.title[0]}}</h2>' +
					//'<span flex class="flex"></span>' +
					//augustirelease 2018 gå till föregående post
					'<md-button aria-label="{{::(\'nui.aria.fulldisplay.goToPreviousButton\' | translate)}}" class="md-icon-button md-button md-ink-ripple close-button full-view-navigation" ng-if="$ctrl.mediaQueries.gtsm && !$ctrl.isFirstRecord()" ng-click="$ctrl.getPreviousRecord()" style=""><md-tooltip md-direction="top"><span translate="nui.results.previous.tooltip"></span></md-tooltip><prm-icon icon-type="svg" svg-icon-set="primo-ui" icon-definition="chevron-left"></prm-icon></md-button>' +
					'<md-button class="md-icon-button" (click)="$ctrl.$mdDialog.hide();" aria-label="{{\'nui.aria.fulldisplay.closeButton\' | translate}}">' +
						'<prm-icon icon-type="svg" svg-icon-set="primo-ui" icon-definition="close">'+ 
							'<md-icon md-svg-icon="primo-ui:close" aria-label="icon-close" class="md-primoExplore-theme" aria-hidden="true">' +
							'</md-icon>' +
						'</prm-icon>' +
					'</md-button>' +
					//augustirelease 2018 gå till nästa post
					'<md-button aria-label="{{::(\'nui.aria.fulldisplay.goToNextButton\' | translate)}}" class="md-icon-button md-button md-ink-ripple close-button full-view-navigation" ng-if="$ctrl.mediaQueries.gtsm && !$ctrl.isLastRecordByState() " ng-click="$ctrl.getNextRecord()" style=""><md-tooltip md-direction="{{$ctrl.getPageWidgetDirection()}}"><span translate="nui.results.next.tooltip"></span></md-tooltip><prm-icon icon-type="svg" svg-icon-set="primo-ui" icon-definition="chevron-right"></prm-icon></md-button>' +
				'</div>' +
			'</md-toolbar>' +
			'<md-dialog-content>'+
				'<div class="md-dialog-content">' + 
					//'<prm-full-view flex="100" ng-if="$ctrl.dialogOpened.val" [load-full-view-additional-services]="$ctrl.loadFullViewAdditionalServices.val" [is-overlay-full-view]="true" [isfavorites]="$ctrl.isfavorites" [item]="::$ctrl.item" [focus-id]="$ctrl.focusId" [originator]="$ctrl.originator" id="fullView" tabindex="-1" role="contentinfo" ng-class="{\'padding-top-medium\':$ctrl.mediaQueries.xs}">' +
					//'</prm-full-view>' + 
					//augustirelease 2018 
					'<prm-full-view flex="100" ng-repeat="item in $ctrl.currentStateResults()" ng-if="$ctrl.dialogOpened.val && $index === $ctrl.currentResultIndex()" [load-full-view-additional-services]="$ctrl.loadFullViewAdditionalServices.val" [is-overlay-full-view]="true" [isfavorites]="$ctrl.isfavorites" [item]="::item" [focus-id]="$ctrl.getFocusId()" [originator]="$ctrl.originator" id="fullView" tabindex="-1" role="contentinfo" [is-first-item]="$ctrl.isFirstRecord()" [is-last-item]="$ctrl.isLastRecordByState()" ng-class="{\'padding-top-medium\':$ctrl.mediaQueries.xs}"></prm-full-view>' +
				'</div>' +
			'</md-dialog-content>' +
		'</md-dialog>');
		
		/********** prm-view-online ****************/
		//Kiosk ingen online-länk!
		$templateCache.put('components/search/fullView/getit/viewOnline/viewOnline.html',
		'<div ng-repeat="link in $ctrl.getLinks()">' +
			'<span class="arrow-link" href="{{link.link}}" target="_blank">' +
			//'<a class="arrow-link" href="{{link.link}}" target="_blank">' +
				'<span ng-if="link.link.length>0" translate="nui.kth_noaccesstext"></span>' +
				//'<span ng-if="link.link.length>0" translate-default="{{link.hyperlinkText}}" translate="nui.getit_full.{{link.hyperlinkText}}"></span>' +
				//'<prm-icon ng-if="link.link.length>0" external-link icon-type="{{$ctrl.availabilityLineIcons.externalLink.type}}" svg-icon-set="{{$ctrl.availabilityLineIcons.externalLink.iconSet}}" icon-definition="{{$ctrl.availabilityLineIcons.externalLink.icon}}"></prm-icon>' +
				//'<prm-icon ng-if="link.link.length>0" link-arrow icon-type="{{$ctrl.availabilityLineIcons.arrowRight.type}}" svg-icon-set="{{$ctrl.availabilityLineIcons.arrowRight.iconSet}}" icon-definition="{{$ctrl.availabilityLineIcons.arrowRight.icon}}"></prm-icon>' +
			//'</a>' +
			'</span>' +
		'</div>' +
		'<prm-view-online-after parent-ctrl="$ctrl"></prm-view-online-after>');

		/****** prm-full-view-container ******/
		//Här visas fulla posten i en vanlig sida
		$templateCache.put('components/search/fullView/full-view-container.html',
		'<div layout="column" layout-fill class="header topbar-wrapper">' +
			'<prm-topbar></prm-topbar>' +
			'<prm-search-bar ng-if="::($ctrl.showSearch  && !$ctrl.isJournalsSearch)" (search-event)="$ctrl.onSearchBarSearchEvent($event)"></prm-search-bar>' +
			'<prm-journals-search-bar ng-if="::($ctrl.showSearch  && $ctrl.isJournalsSearch)" (search-event)="$ctrl.onSearchBarSearchEvent($event)"></prm-journals-search-bar></div>' +
		'<prm-back-to-search-results-button></prm-back-to-search-results-button><div ng-if="$ctrl.displayBorInfoAlert()"><prm-alert-bar flex [alert-object]="$ctrl.borInfoAlert"></prm-alert-bar></div><md-content layout="row" layout-fill class="padded-container"><div flex="0" flex-md="0" flex-lg="10" ng-class="{\'flex-lgPlus-15\': $ctrl.mediaQueries.lgPlus}" flex-xl="20"></div><div layout="row" flex><div flex="0"></div>' +
		'<prm-full-view id="fullView" ng-if="$ctrl.item" [item]="$ctrl.item" flex></prm-full-view>' +
		'<div flex="0"></div></div></md-content><prm-full-view-cont-after parent-ctrl="$ctrl"></prm-full-view-cont-after>');

		/****** prm-full-view-service-container	******/
		//varje "service" för den fulla posten
		$templateCache.put('components/search/fullView/fullViewServiceContainer/full-view-service-container.html',
		'<div class="section-head">' +
			//'<prm-service-header ng-if="$ctrl.service.serviceName!==\'brief\'" [title]="$ctrl.service.title"></prm-service-header>' +
			//filtrera bort vissa services?
			'<prm-service-header ng-if="$ctrl.service.serviceName!==\'tags\' && $ctrl.service.serviceName!==\'brief\'" [title]="$ctrl.service.title"></prm-service-header>' +
			//'<prm-service-header ng-if="$ctrl.service.serviceName!==\'brief\'  && $ctrl.service.serviceName!==\'display\'" [title]="$ctrl.service.title"></prm-service-header>' +
		'</div>' +
		'<div class="section-body">' +
			'<prm-brief-result-container ng-if="$ctrl.service.serviceName===\'brief\'" [is-full-view]="true" [is-favorite-for-display-frbr]="$ctrl.isfavorites" [item]="$ctrl.item" [links]="$ctrl.item.delivery.link"></prm-brief-result-container>' +
			//lägg till kontakta oss-avdelning, före save/send(actions)
			'<prm-contact-us parent-ctrl="$ctrl" ng-if="$ctrl.service.serviceName===\'action_list\'"></prm-contact-us>' +
			'<prm-action-list ng-if="$ctrl.service.serviceName===\'action_list\'" [is-full-view]="true" [display-all]="true" [item]="::$ctrl.item" [selected-action]="\'none\'" class="list-item-secondary-content result-item-secondary-content visible" ng-style="{\'padding-top\': $ctrl.itemHeight}"></prm-action-list>' +
			'<div ng-if="$ctrl.loadAdditionalServices">' +
				//"logga in för att reservera"
				//Kiosk Visa inte knapp
				//'<prm-login-alma-mashup ng-if="$ctrl.service.serviceName===\'activate\'" [item]="::$ctrl.service" [index]="::$ctrl.index"></prm-login-alma-mashup>' +
				//ingen margin bottom
				'<prm-alma-mashup ng-if="$ctrl.service.serviceName===\'activate\' && $ctrl.isMashupLink()" [links-array]="$ctrl.service.linkElement.links" class="1margin-bottom-large display-block"></prm-alma-mashup>' +
				'<prm-alma-more-inst ng-if="$ctrl.service.serviceName===\'activate\' && $ctrl.isMoreAlmaInst() && $ctrl.isAlmaGetit()" [item]="::$ctrl.item"></prm-alma-more-inst>' +
				//vad visas i view-online?
				//Kiosk visa inte online
				'<prm-view-online ng-if="$ctrl.service.serviceName===\'display\' " [item]="::$ctrl.service"></prm-view-online>' +
				'<prm-alma-viewit ng-if="$ctrl.service.serviceName===\'Viewit\'" [item]="::$ctrl.item"></prm-alma-viewit>' +
				'<prm-opac ng-if="$ctrl.service.serviceName===\'ovp\' || $ctrl.service.serviceName===\'ovl\'" [item]="$ctrl.item" [service-mode]="::$ctrl.service.serviceName"></prm-opac>' +
				'<alma-htgi-svc ng-if="$ctrl.service.serviceName===\'howovp\' " [item]="$ctrl.item"></alma-htgi-svc>' +
				'<prm-service-details ng-if="$ctrl.service.serviceName===\'details\'" [item]="::$ctrl.item"></prm-service-details>' +
				//inga tags
				//'<prm-tags-list ng-if="$ctrl.service.serviceName===\'tags\'" [item]="::$ctrl.item" [tagslist]="$ctrl.recordNonUserTags" [usertagslist]="$ctrl.recordUserTags" [editable]="true" [is-full-display]="true"></prm-tags-list>' +
				'<prm-service-links ng-if="$ctrl.service.serviceName===\'links\'" [item]="::$ctrl.item"></prm-service-links>' +
				'<prm-virtual-browse ng-if="$ctrl.service.serviceName===\'virtualBrowse\'" [item]="$ctrl.item"></prm-virtual-browse>' +
				'<prm-citation-trails-fullview-link ng-if="$ctrl.service.serviceName === \'citationTrails\'" [record]="$ctrl.item"></prm-citation-trails-fullview-link>' +
				'<prm-search-within-journal ng-if="$ctrl.service.serviceName===\'searchWithinJournal\'" [item]="$ctrl.item"></prm-search-within-journal>' +
			'</div>' +
		'</div>' +
		'<prm-full-view-service-container-after parent-ctrl="$ctrl"></prm-full-view-service-container-after>');


		/****** prm-citation-trails-fullview-link ******/
		$templateCache.put('components/search/citationTrails/citation-trails-fullview-link.html',
		//layoutdiv
		'<div>' +
			//ta bort ett villkor så det ska passa med labels/texter ""källor i Primo som är citerade här"
			//'<span ng-if="$ctrl.hasCitedby() && $ctrl.hasCiting()" aria-label="{{\'nui.citation_trail.link.or\' | translate}}" translate="{{::(\'nui.citation_trail.link.or\'+$ctrl.getActionLabel(action))}}"></span>' +
			'<span ng-if="$ctrl.hasCiting()" aria-label="{{\'nui.citation_trail.link.or\' | translate}}" translate="{{::(\'nui.citation_trail.link.or\'+$ctrl.getActionLabel(action))}}"></span>' +
			'<prm-citation-trails-indication ng-if="$ctrl.hasCiting()" [record]="::$ctrl.record" [is-full-view]="true" type="citing" class="margin-left-small"></prm-citation-trails-indication>' +
		'</div>' +
		//lägg till villkor
		'<span ng-if="$ctrl.hasCitedby()" translate="{{\'nui.citation_trail.link.Find\' + $ctrl.getActionLabel(action)}}"></span> ' +
		'<span ng-if="$ctrl.hasCitedby()" translate="{{\'nui.citation_trail.link.sources\' + $ctrl.getActionLabel(action)}}"></span>' +
		'<prm-citation-trails-indication ng-if="$ctrl.hasCitedby()" [record]="::$ctrl.record" [is-full-view]="true" type="cited_by" class="margin-left-small"></prm-citation-trails-indication>' +
		'<div class="margin-bottom-small"></div>' + 
		//Web of science citations
		//Visa laddningsikon
		'<div ng-if="$ctrl.wosisLoading" layout="column" layout-align="center"><div layout="row" layout-align="center"><md-progress-circular md-diameter="20px" style="stroke:#106cc8" md-mode="indeterminate"></md-progress-circular></div></div>' + 
		'<div ng-if="$ctrl.wostimesCited!==\'\'">' +
			//Kiosk ingen länk
			'<span class="wostimesCited">{{$ctrl.wostimesCited}}</span> <span translate="{{\'nui.citation_trail.link.citedExternal\'}}"></span> Web of Science&trade;' +
		'</div>' +
		//scopus citations
		'<div ng-if="$ctrl.scopustimesCited!==\'\'">' +
			//class="wostimesCited
			//Kiosk ingen länk
			'<span class="wostimesCited">{{$ctrl.scopustimesCited}} </span><span translate="{{\'nui.citation_trail.link.citedExternal\'}}" "></span> Scopus&trade;' +
		'</div>' +
		//ta bort Ex Libris egna wos/focus länkar
		//'<prm-times-cited ng-if="$ctrl.shouldDisplayTimesCited" [item]="$ctrl.record"></prm-times-cited>' +
		'<prm-citation-trails-fullview-link-after parent-ctrl="$ctrl"></prm-citation-trails-fullview-link-after>');
		

		/****** prm-alma-mashup	******/
		$templateCache.put('components/search/fullView/getit/almaMashup/almaMashup.html',
		//iframe end tag tillagd(annars visades inte prm-alma-mashup-after, felaktig HTML?)
		//visa inte iframe för tryckt material
		//&& !$ctrl.almap
		//'<div>' +
		'<iframe iframe-onload="{{::$ctrl.iframeResize()}}" class="mashup-iframe" ng-src="{{$ctrl.getLink()}}" style="width:100%;border:none" ng-if="::$ctrl.isLinkAvailable()"></iframe>' +
		//'</div>' +
		'<prm-alma-mashup-after parent-ctrl="$ctrl"></prm-alma-mashup-after>');
		
		/****** prm-login-alma-mashup	******/
		$templateCache.put('components/search/fullView/fullViewServiceContainer/login-alma-mashup.html',
		//alma print som villkor för att visa login, ingen alertbar eller center align
		'<div ng-if="!$ctrl.isLoggedIn() && $ctrl.loginalmap" class="" layout="row" layout-align="">' +
		//'<div ng-if="!$ctrl.isLoggedIn() && $ctrl.index == $ctrl.getIndexFullView()" class="bar alert-bar" layout="row" layout-align="center center">' +
			//bort med texten för knappen, den är istället på prm-authentication
			//'<span translate="getit.signin_link.sign_in" class="margin-right-small"></span>' +
			'<prm-authentication [is-logged-in]="$ctrl.userName().length > 0"></prm-authentication>' +
		'</div>' +
		'<prm-login-alma-mashup-after parent-ctrl="$ctrl"></prm-login-alma-mashup-after>');

		/******	prm-add-query-to-saved-searches	******/
		$templateCache.put('components/search/savedQueries/addQueryToSavedSearches/add-query-to-saved-searches.html',
		'<md-button class="button-as-link link-alt-color zero-margin" (click)="$ctrl.add()">' +
			'<md-tooltip><span translate="nui.savesearch.tooltip"></span></md-tooltip>' +
			//hjärta
			'<prm-icon class="pin-icon" aria-label="{{\'nui.aria.favorites.pin\' | translate:\'{index: \\\'\'+($ctrl.index)+\'\\\'}\'}}" [icon-type]="::$ctrl.actionsIcons.pin.type" svg-icon-set="action" icon-definition="ic_favorite_outline_24px"></prm-icon>' +
			'<span class="bold-text" translate="results.savequery"></span>' +
		'</md-button>' +
		'<prm-add-query-to-saved-searches-after parent-ctrl="$ctrl"></prm-add-query-to-saved-searches-after>');

		
		/****** personalize-results-button ******/
		$templateCache.put('components/search/personalization/personalizationButton/personalize-results-button.html',
		//Lagt till style (padding)
		'<md-button style="padding: 0;" ng-if="$ctrl.personalizationEnabled && !$ctrl.displayDialog()" class="button-as-link button-switch zero-margin" ng-click="$ctrl.doPersonalization()" ng-class="$ctrl.enable ? \'toggled\' : \'link-alt-color\'">' +
			'<md-tooltip ng-if="!$ctrl.enable">' +
				'<span translate="nui.pyr.icon.tooltip.inactive"></span>' +
			'</md-tooltip>' +
			'<md-tooltip ng-if="$ctrl.enable">' +
				'<span translate="nui.pyr.icon.tooltip.active"></span>' +
			'</md-tooltip>' +
			
			//byt till checkbox (md-checkbox)
			'<md-checkbox ng-model="$ctrl.enable" tabindex="-1" md-no-ink aria-label="Personalize" class="tiny-switch zero-margin">' +
			//'<md-switch ng-model="$ctrl.enable" tabindex="-1" md-no-ink aria-label="Personalize" class="tiny-switch zero-margin">' +
				//inte bold
				'<span class="1bold-text" ng-if="!$ctrl.enable" translate="nui.pyr.icon.label.inactive"></span> ' +
				'<span class="1bold-text" ng-if="$ctrl.enable" translate="nui.pyr.icon.label.active"></span>' +
			//'</md-checkbox>' +
			'</md-switch>' +
		'</md-button>' +
		'<prm-personalize-results-button-after parent-ctrl="$ctrl"></prm-personalize-results-button-after>');
		
		/******	prm-facet	******/
		
		$templateCache.put('components/search/facet/facet.html',
		//inte scroll/sticky
		'<div tabindex="-1" class="primo-scrollbar" 1sticky offset="24" sticky-class="is-stuck" disabled-sticky="!$ctrl.mediaQueries.gtsm" ng-if="$ctrl.showFacetSection() " ng-class="$ctrl.activeMultipleFacets ? \'multifacets-active\' : \'\'">' +
			'<div tabindex="-1" class="sidebar-inner-wrapper" layout="column">' +
				'<div ng-if="$ctrl.isShowFetchMoreResultButton()" class="sidebar-section compensate-padding-left margin-bottom-large">' +
					'<h2 class="sidebar-title" translate="nui.facets.remote.title"></h2>' +
					'<p translate="nui.facets.remote.description"></p>' +
					'<md-button (click)="$ctrl.fetchMoreResults()" translate="nui.facets.remote.button" class="zero-margin button-confirm button-large"></md-button>' +
				'</div>' +
				//Valda facetter(active filters)
				//ändra till "margin-bottom-medium"??
				'<div ng-class="{\'up-z-index\': $ctrl.showUIBlocker}" tabindex="-1" ng-if="($ctrl.selectedFacets).length || $ctrl.isFiltered()" class="sidebar-section filtered-facets-section animate-chip-section margin-bottom-large">' +
					'<prm-breadcrumbs tabindex="-1"></prm-breadcrumbs>' +
				'</div>' +
				//Personalize AUGUSTIRELEASE Visa inte här!
				/*
				'<div ng-if="$ctrl.showPersonalizationSection() && $ctrl.notLocal() && $ctrl.personalizationToggled()">' +
					'<div tabindex="-1" class="sidebar-section compensate-padding-left margin-bottom-large personalization-section" ng-class="{\'is-active\':$ctrl.personalizationToggled()}">' +
						'<h2 class="sidebar-title prm-personalization" translate="nui.pyr.search.label"></h2>' +
						'<div class="section-content">' +
							'<md-checkbox ng-model="$ctrl.recentness">' +
								'<span translate="nui.pyr.search.recent_date"></span>' +
							'</md-checkbox>' +
							'<ul class="sidebar-list margin-bottom-zero margin-top-small" layout="column" layout-align="start start" tabindex="-1">' +
								'<li ng-repeat="discipline in $ctrl.getPersonalization()" layout="row" layout-align="start center">' +
									'<strong title="{{discipline}}">{{\'pyr.discipline.\'+discipline | translate}} </strong>' +
									'<span class="button-container">' +
										'<md-button class="md-icon-button" ng-click="$ctrl.removeDiscipline(discipline)" aria-label="{{\'pyr.discipline.removeDiscipline\' | translate}}{{\' \'}}{{\'pyr.discipline.\'+discipline | translate}}">' +
											'<prm-icon icon-type="svg" svg-icon-set="navigation" icon-definition="ic_close_24px"></prm-icon>' +
											'<md-tooltip md-delay="400">' +
												'<span translate="{{\'pyr.discipline.removeDiscipline\' | translate}}{{\' \'}}{{\'pyr.discipline.\'+discipline | translate}}"></span>' +
											'</md-tooltip>' +
										'</md-button>' +
									'</span>' +
								'</li>' +
							'</ul>' +
							'<md-button class="button-as-link link-alt-color zero-margin" ng-click="$ctrl.edit()">' +
								'<b translate="nui.pyr.search.edit"></b>' +
							'</md-button>' +
						'</div>' +
					'</div>' +
				'</div>' +
				*/
				//Rubrik för user settings(visa även om sökresultat = 0
				'<div tabindex="-1" ng-if="$ctrl.totalResults > -1 || $ctrl.isFiltered()" class="kth_settings sidebar-section 1margin-top-small margin-bottom-large compensate-padding-left">' +
					'<h2 class="sidebar-title" translate="nui.kth_settings"></h2>' +
					//Sortering
					'<div ng-if="$ctrl.totalResults > 1" class="sidebar-section margin-bottom-small 1compensate-padding-left" layout="row">' +
						'<div layout="row" layout-align="start center" class="section-title">' +
							'<prm-icon class="pin-icon" aria-label="{{\'nui.aria.favorites.pin\' | translate:\'{index: \\\'\'+($ctrl.index)+\'\\\'}\'}}" [icon-type]="::$ctrl.actionsIcons.pin.type" svg-icon-set="content" icon-definition="ic_sort_24px"></prm-icon>' +
							'<h3 class="section-title-header"><span translate="nui.results.sortby" translate-attr-title="nui.results.sortby.tooltip"></span></h3>' +
							'<prm-search-result-sort-by (sort-by-change)="$ctrl.sortByChange.emit(null)"></prm-search-result-sort-by>' +
						'</div>' +
					'</div>' +
					
					/**Personalize AUGUSTIRELEASE **/
					//newer material DÖLJ
					/*
					'<div style="padding-bottom: 10px;">' +
					'<md-checkbox ng-model="$ctrl.recentness">' +
						'<span translate="nui.pyr.search.recent_date"></span>' +
					'</md-checkbox>' +
					'</div>' +
					*/
					//flyttad hit från "prm-search-result-list"
					//Av och på
					'<prm-personalize-results-button ng-if="!$ctrl.isCitationState() && !$ctrl.isJournalSearch() && !$ctrl.isBrowsHeaderResults() && $ctrl.notLocal()"></prm-personalize-results-button>' +
					
					//rankningsval AUGUSTIRELEASE
					//'<div ng-if="$ctrl.showPersonalizationSection() && $ctrl.notLocal() && $ctrl.personalizationToggled()">' +
						//'<md-button class="button-as-link link-alt-color zero-margin" ng-click="$ctrl.edit()">' +
						'<md-button ng-if="$ctrl.showPersonalizationSection() && $ctrl.notLocal() && $ctrl.personalizationToggled()" class="kth-button" ng-click="$ctrl.edit()">' +
							'<b style="font-weight: normal !important" translate="nui.pyr.search.edit"></b>' +
						'</md-button>' +
					//'</div>' +
					// EGEN DUMMY "Add/change subject ranking"
					/*
					'<div tabindex="-1" class="sidebar-section margin-bottom-small 1compensate-padding-left">' +
						'<a ng-model="$ctrl.pcAvailability" ng-change="$ctrl.changePcAvailability()" aria-label="{{\'expandresults\' | translate}}">' +
							'<prm-icon class="pin-icon" aria-label="{{\'nui.aria.favorites.pin\' | translate:\'{index: \\\'\'+($ctrl.index)+\'\\\'}\'}}" [icon-type]="::$ctrl.actionsIcons.pin.type" svg-icon-set="primo-ui" icon-definition="tune"></prm-icon>' +
							'<span translate="">Add/change subject ranking</span>' +
						'</a>' +
					'</div>' +
					*/
					
					//material utanför bibblan
					//Kiosk inget utanför(visa just nu iaf)
					'<div tabindex="-1" ng-if="$ctrl.showPcAvailability" class="sidebar-section 1margin-top-small 1margin-bottom-small 1compensate-padding-left">' +
						'<md-checkbox ng-model="$ctrl.pcAvailability" ng-change="$ctrl.changePcAvailability()" aria-label="{{\'expandresults\' | translate}}">' +
							'<span translate="expandresults"></span>' +
						'</md-checkbox>' +
					'</div>' +
				'</div>' +
				
				//antal sökträffar användaren vill visa, sparad i localstorage
				//används inte för tillfället
				/*
				'<div tabindex="-1" class="sidebar-section compensate-padding-left">' +
					'<div layout="row" layout-align="start center" class="section-title">' +
						'<h3 class="section-title-header"><span translate="" translate-attr-title="nui.results.sortby.tooltip">Antal sökträffar</span></h3>' +
					'</div>' +
					'<md-radio-group layout="row" ng-model="$ctrl.kthb_primo_resultsBulkSizedata.group1" ng-change="$ctrl.savekthb_primo_resultsBulkSize($ctrl.kthb_primo_resultsBulkSizedata.group1)">' +
						'<md-radio-button value="10" class="md-primary">10</md-radio-button>' +
						'<md-radio-button value="20">20</md-radio-button>' +
						'<md-radio-button value="50">50</md-radio-button>' +
					'</md-radio-group>' +
				'</div>' +
				*/
				//om användaren vill ha infinite scroll, sparad i localstorage
				//används inte för tillfället
				/*
				'<div tabindex="-1" class="sidebar-section margin-top-small compensate-padding-left">' +
					//'<div layout="row" layout-align="start center" class="section-title">' +
						//'<h3 class="section-title-header"><span translate="" translate-attr-title="nui.results.sortby.tooltip">Infinite scroll</span></h3>' +
					//'</div>' +
					'<md-checkbox ng-model="$ctrl.kthb_primo_infinitescroll" ng-change="$ctrl.savekthb_primo_infinitescroll($ctrl.kthb_primo_infinitescroll)" aria-label="{{\'expandresults\' | translate}}">' +
						'<span translate="">Infinite scroll</span>' +
					'</md-checkbox>' +
				'</div>' +
				*/
				//Rubrik(tweak my results)
				//'<div ng-click="$ctrl.togglefacets()" style="display:flex" tabindex="-1" ng-if="$ctrl.totalResults > 1 || $ctrl.isFiltered()" class="sidebar-section margin-top-small compensate-padding-left">' +
					//'<h2 flex="90" class="sidebar-title margin-bottom-zero" translate="nui.facets.title"></h2>' +
					//'<md-button aria-label="{{::(\'\' | translate)}}" ng-click="$ctrl.togglefacets()" class="zero-margin" ng-class="!ctrl.mediaQueries.xs ? \'md-icon-button\' : \'button-with-icon\' ">' +
						//'<prm-icon class="pointer" ng-click="$ctrl.togglefacets()" flex="10" ng-if="!ctrl.isExpandAll" icon-type="svg" svg-icon-set="primo-ui" icon-definition="expand-list" aria-label="Expand all items"></prm-icon>' +
					//'</md-button>' +
				//'</div>' +
				//Aria label
				'<md-button aria-label="show/collapse facets" ng-click="$ctrl.togglefacets()" style="display:flex" tabindex="-1" ng-if="$ctrl.totalResults > 1 || $ctrl.isFiltered()" class="section-title sidebar-section margin-top-small compensate-padding-left">' +
					'<h2 flex="90" class="sidebar-title margin-bottom-zero" translate="nui.facets.title" style="font-size: 1.6em;text-align:left" ></h2>' +
					//veckla ut/ihop facetter, text i st f ikkonen?
					'<span ng-if="$ctrl.allfacetscollapsed">Expand all</span>' +
					'<span ng-if="!$ctrl.allfacetscollapsed">Collapse all</span>' +
					'<prm-icon style="align-self: flex-end;padding-left: 5px" icon-type="svg" svg-icon-set="primo-ui" icon-definition="expand-list" class="rotate-180"></prm-icon>' +
					//'<prm-icon style="align-self: flex-end;"icon-type="svg" svg-icon-set="primo-ui" icon-definition="chevron-up" ng-class="{\'rotate-180\': $ctrl.allfacetscollapsed}"></prm-icon>' +
				'</md-button>' +
				//Själva facetterna
				//alltid aktiva checkboxar AUGUSTIRELEASE
				'<div ng-if="$ctrl.totalResults > 1" class="sidebar-section available-facets multiselect-facet-group" ng-repeat="facetGroup in $ctrl.facets" ng-class="$ctrl.activeMultipleFacets ? \'multiselect-active\' : \'multiselect-active\'">' +
					//visa inte top level facets
					'<prm-facet-group ng-if="facetGroup.name!=\'tlevel\'" [facet-group]="::facetGroup" [displayed-type]="::facetGroup.displayedType"></prm-facet-group>' +
				'</div>' +
				'<div ng-if="$ctrl.totalResults == 1 && $ctrl.isFiltered()">' +
					'<span translate="nui.facets.nofacets"></span>' +
				'</div>' +
			'</div>' +
			//AUGUSTIRELEASE
			'<div ng-if="($ctrl.totalResults > 1) && $ctrl.activeMultipleFacets" class="multiselect-submit" ng-class="{\'is-active\': $ctrl.activeMultipleFacets}">' +
				'<div flex-md="25" flex-lg="20" class="multiselect-submit-inner" layout="row" ng-class="{\'flex-lgPlus-20\': $ctrl.mediaQueries.lgPlus, \'flex-xl-20\': $ctrl.mediaQueries.xl, \'flex-xl-25\': $ctrl.mediaQueries}">' +
					'<md-button ng-click="$ctrl.clearMultiFacets()">' +
						'<span translate="nui.facets.clear"></span>' +
					'</md-button>' +
					'<md-button class="md-primary button-large md-button md-ink-ripple" ng-click="$ctrl.applyMultiFacets()">' +
						'<span translate="nui.facets.applyfilters"></span>' +
					'</md-button>' +
				'</div>' +
			'</div>' +
		'</div>' +
		'<prm-facet-after parent-ctrl="$ctrl"></prm-facet-after>');
		
		/******	prm-saved-searches-group-actions ******/
		$templateCache.put('components/favorites/favoritesToolBar/saved-searches-group-actions/saved-searches-group-actions.html',
		'<div layout="row">' +
			'<div ng-if="!$ctrl.showSearchHistoryActions()" class="toolbar-item animate-enter-leave-scale-bounce staggered">' +
				'<md-button class="md-icon-button unpin-button" (click)="$ctrl.removeSelectedSearches()">'	+
					'<md-tooltip md-delay="400"><span translate="nui.favorites.search.unpin.multiple.tooltip"></span></md-tooltip>' +
					//KTHB hjärta
					'<prm-icon ng-if="!item.alert" icon-type="svg" svg-icon-set="action" icon-definition="ic_favorite_24px" aria-label="unpin" class="custom-button" ng-class="{\'disabledFavTool\':$ctrl.disable()}"></prm-icon>' +
					//'<prm-icon ng-if="!item.alert" icon-type="svg" svg-icon-set="primo-ui" icon-definition="prm_unpin" aria-label="unpin" class="custom-button" ng-class="{\'disabledFavTool\':$ctrl.disable()}"></prm-icon>' +
				'</md-button>' +
			'</div>' +
			'<div ng-if="$ctrl.isLoggedIn() && $ctrl.showSearchHistoryActions()" class="toolbar-item animate-enter-leave-scale-bounce staggered">' +
				'<md-button class="md-icon-button" (click)="$ctrl.saveSelectedSearchHistoryItemsToSavedSearches()">' +
					'<md-tooltip md-delay="400"><span translate="nui.favorites.search.save.single.tooltip"></span></md-tooltip>' +
					//KTHB hjärta
					'<prm-icon icon-type="svg" svg-icon-set="action" icon-definition="ic_favorite_outline_24px" aria-label="Remove" class="custom-button" ng-class="{\'disabledFavTool\':$ctrl.disable()}"></prm-icon>' +
					//'<prm-icon icon-type="svg" svg-icon-set="primo-ui" icon-definition="prm_pin" aria-label="Remove" class="custom-button" ng-class="{\'disabledFavTool\':$ctrl.disable()}"></prm-icon>' +
				'</md-button>'+
			'</div>' +
			'<div ng-if="$ctrl.isLoggedIn() && $ctrl.showSearchHistoryActions()" class="toolbar-item animate-enter-leave-scale-bounce staggered">' +
				'<md-button class="md-icon-button" (click)="$ctrl.removeSelectedSearchHistoryItemFromSavedSearches()">' +
					'<md-tooltip md-delay="400"><span translate="nui.favorites.search.unpin.single.tooltip"></span></md-tooltip>' +
					//KTHB hjärta
					'<prm-icon icon-type="svg" svg-icon-set="action" icon-definition="ic_favorite_24px" aria-label="Remove" class="custom-button" ng-class="{\'disabledFavTool\':$ctrl.disable()}"></prm-icon>' +
					//'<prm-icon icon-type="svg" svg-icon-set="primo-ui" icon-definition="prm_unpin" aria-label="Remove" class="custom-button" ng-class="{\'disabledFavTool\':$ctrl.disable()}"></prm-icon>' +
				'</md-button>' +
			'</div>' +
			'<div ng-if="$ctrl.showSearchHistoryActions()" class="toolbar-item animate-enter-leave-scale-bounce staggered">' +
				'<md-button class="md-icon-button" (click)="$ctrl.removeSearchHistorySelectedItems()">' +
					'<md-tooltip md-delay="400"><span translate="nui.favorites.search.remove.single.tooltip"></span></md-tooltip>' +
					'<prm-icon icon-type="svg" svg-icon-set="action" icon-definition="ic_delete_24px" aria-label="Remove" class="custom-button" ng-class="{\'disabledFavTool\':$ctrl.disable()}"></prm-icon>' +
				'</md-button>' +
			'</div>' +
		'</div>' +
		'<prm-saved-searches-group-actions-after parent-ctrl="$ctrl"></prm-saved-searches-group-actions-after>');

		
		/******	prm-favorites-tool-bar	******/
		$templateCache.put('components/favorites/favoritesToolBar/favorites-tool-bar.html',
				
		'<md-toolbar class="default-toolbar" sticky sticky-class="is-stuck" ng-class="{\'is-visible\': !$ctrl.mediaQueries.gtxs && ($ctrl.showButtons() || $ctrl.showSavedSearchesActions()) }">' +
			'<div class="md-toolbar-tools" layout="row">' +
				'<div flex="0" flex-md="0" flex-lg="10" flex-xl="20" ng-class="{\'flex-lgPlus-15\':$ctrl.mediaQueries.lgPlus}"></div>' +
				//lagt till knapp för att gå tillbaks till sökning
				//gotosearch finns inte i detta directive(lägg till en egen i "prm-favorites-tool-bar-after")
					'<md-button aria-label="{{\'nui.aria.account.back\' | translate}}"  class="back-button" ng-click="$ctrl.goToSearch()" id="backtosearchfromfavorites" role="link">' +
						'<md-tooltip md-delay="400"><span translate="nui.aria.account.back"></span></md-tooltip>' +
						'<prm-icon aria-label="{{\'nui.aria.account.back\' | translate}}" icon-type="svg" svg-icon-set="primo-ui" icon-definition="back-to-search"></prm-icon>' +
					'</md-button>' +
				'<span translate="nui.favorites.header" class="toolbar-title" ng-hide="$ctrl.showButtons() && !$ctrl.mediaQueries.gtxs"></span>' +
				'<md-divider class="toolbar-divider" ng-class="{\'visible\':true || $ctrl.showSavedSearchesActions()}"></md-divider>' +
				'<div layout="row">' +
					'<div class="toolbar-item animate-enter-leave-scale-bounce staggered" ng-if="$ctrl.showSearchHistoryActions() || ($ctrl.showSavedSearchesActions() && $ctrl.getUser())">' +
						'<prm-saved-searches-group-actions></prm-saved-searches-group-actions>' +
					'</div>' +
					'<div class="toolbar-item animate-enter-leave-scale-bounce staggered" ng-if="$ctrl.isFavorites() && $ctrl.getUser()">' +
						'<prm-favorites-edit-labels-menu [disable]="!$ctrl.showButtons()" [is-section]="true"></prm-favorites-edit-labels-menu>' +
					'</div>' +
					'<div class="toolbar-item animate-enter-leave-scale-bounce staggered" ng-if="$ctrl.isFavorites()">' +
						'<md-button class="md-icon-button unpin-button" aria-label="{{$ctrl.isChosenFav() | translate}}" (click)="$ctrl.unpinFromFavorites()">' +
							'<md-tooltip md-delay="400"><span translate="nui.favorites.unpin.tooltip"></span></md-tooltip>' +
							//KTHB hjärta
							'<prm-icon ng-class="{\'disabledFavTool\':!$ctrl.showButtons()}" aria-label="{{::(\'nui.aria.favorites.unpin\' | translate:\'{index: \\\'\'+ $ctrl.index+\'\\\'}\')}}" [icon-type]="::$ctrl.actionsIcons.unPin.type" svg-icon-set="action" icon-definition="ic_favorite_24px"></prm-icon>' +
							//'<prm-icon class="h-flipped-25-icon" ng-class="{\'disabledFavTool\':!$ctrl.showButtons()}" icon-type="{{::$ctrl.favoritesIcons.unPin.type}}" svg-icon-set="{{::$ctrl.favoritesIcons.unPin.iconSet}}" icon-definition="{{::$ctrl.favoritesIcons.unPin.icon}}"></prm-icon>' +
						'</md-button>' +
					'</div> ' +
					'<div class="toolbar-item animate-enter-leave-scale-bounce staggered" ng-if="$ctrl.isFavorites()">' +
						'<md-button class="md-icon-button has-bottom-arrow" ng-class="$ctrl.showPushtoActions ? \'arrow-showing\' : \'\' " aria-label="{{$ctrl.isChosenActions() | translate}}" (click)="$ctrl.switchShowPushtoActions($event);$ctrl.closeOpenTabs($event);$event.stopPropagation()">' +
							'<md-tooltip md-delay="400"><span translate="nui.favorites.pushto.tooltip"></span></md-tooltip>' +
							'<prm-icon icon-type="{{::$ctrl.favoritesIcons.favoriteActionsList.type}}" ng-class="{\'disabledFavTool\':!$ctrl.showButtons()}" svg-icon-set="{{::$ctrl.favoritesIcons.favoriteActionsList.iconSet}}" icon-definition="{{::$ctrl.favoritesIcons.favoriteActionsList.icon}}"></prm-icon>' +
						'</md-button>' +
					'</div>' +
				'</div>' +
			'</div>' +
		'</md-toolbar>' +
		'<div class="favorites-action-list" ng-if="$ctrl.showPushtoActions && $ctrl.showButtons()" sticky offset="64" sticky-class="is-stuck">' +
			'<div class="action-list-content" ng-keydown="$ctrl.keyDownSupport($event)">' +
				'<md-content layout="row">' +
					'<div flex="0" flex-md="0" flex-lg="10" flex-xl="20" ng-class="{\'flex-lgPlus-15\': $ctrl.mediaQueries.lgPlus}"></div>' +
					'<prm-action-list [display-all]="false" displaymode="favorites" [item]="$ctrl.selectedItems()" [display-close-icon]="true" flex style="margin: 8px" (close-modal)="$ctrl.switchShowPushtoActions()"></prm-action-list>' +
					'<div flex="0" flex-md="25" flex-lg="25" flex-xl="30" ng-class="{\'flex-lgPlus-30\': $ctrl.mediaQueries.lgPlus}"></div>' +
				'</md-content>' +
			'</div>' +
		'</div>' +
		'<prm-favorites-tool-bar-after parent-ctrl="$ctrl"></prm-favorites-tool-bar-after>');
		
		
		/******	prm-loan	******/
		$templateCache.put('components/account/loans/loan.html',
		'<div class="md-list-item-text" layout="row" layout-wrap flex aria-live="assertive">' +
			'<span class="item-index">{{$ctrl.index}}</span>' +
			'<div flex="40" flex-xs="100">' +
				'<h3 ng-if="::$ctrl.item.title">{{::$ctrl.item.title}}</h3>' +
				'<h4 ng-class="{\'loans-brief-display\':!$ctrl.isExpanded}">' +
					'<span translate="nui.loan.brief.1"></span>{{::($ctrl.item.getBriefDisplayLine(1))}}' +
				'</h4>' +
			'</div>' +
			'<div flex="40" flex-xs="100" class="weak-text">' +
				'<div ng-if="::$ctrl.item.isActiveLoan()">' +
					'<p class="normal-text" ng-style="$ctrl.item.isDueAlert() && {\'color\':\'tomato\'}">' +
						'<prm-icon ng-if="::$ctrl.item.isDueAlert()" class="alert-red" aria-label="{{::(\'nui.aria.account.loans.alert\' | translate)}}" icon-type="{{::$ctrl.accountIcons.timerIcon.type}}" svg-icon-set="{{::$ctrl.accountIcons.timerIcon.iconSet}}" icon-definition="{{::$ctrl.accountIcons.timerIcon.icon}}"></prm-icon>' +
						//ta bara med yyyy-mm-dd från duedate
						'<span translate="{{$ctrl.item.getCodeAlert()}}"></span>: {{($ctrl.item.getDateForBriefDisplay().substring(0, 10))}}. ' +
						'<span ng-if="::($ctrl.item.isFine())">' +
							'<span translate="nui.loan.fine"></span>: {{::$ctrl.item.fine}}' +
						'</span>' +
					'</p>' +
				'</div>' +
				'<div ng-if="::(!$ctrl.item.isActiveLoan())">' +
					'<span translate="loans.return_date"></span> {{::($ctrl.item.getDateForBriefDisplay())}}' +
				'</div>' +
				'<p class="normal-text" ng-class="{\'loans-brief-display\':!$ctrl.isExpanded}">' +
					//
					'<span translate="nui.loan.brief.2"></span> {{ ::($ctrl.item.getBriefDisplayLine(2))}}' +
				'</p>' +
				'<div ng-if="$ctrl.isExpanded">' +
					//lagt till villkor vilka som ska visas 
					'<p ng-repeat="line in ::$ctrl.item.fullDisplayValues" ng-if="line.key!=\'year\' && line.key!=\'main_location_name\' && line.key!=\'secondary_location_name\' && line.key!=\'item_category_code\' && line.key!=\'ils_institution_code\' && line.key!=\'ils_institution_name\'" class="normal-text">' +
						'<span translate="loans.{{::line.key}}"></span> {{::line.value}}' +
					'</p>' +
				'</div>' +
			'</div>' +
			'<div layout-align="end center" layout="row" flex="20" flex-xs="100" ng-class="{\'not-clickable\': $ctrl.renewAllInProgress}" class="list-item-actions">' +
				'<div ng-if="$ctrl.isRenewable && !$ctrl.isRenewed && !$ctrl.renewInProgress">' +
					'<md-button class="button-with-icon zero-margin button-link" (click)="$ctrl.renewLoan()" aria-label="{{\'nui.loans.renew\' | translate}}">' +
						'<prm-icon class="h-flipped" icon-type="{{::$ctrl.accountIcons.renewLoanIcon.type}}" svg-icon-set="{{::$ctrl.accountIcons.renewLoanIcon.iconSet}}" icon-definition="{{::$ctrl.accountIcons.renewLoanIcon.icon}}"></prm-icon>' +
						'<span translate="nui.loans.renew"></span>' +
					'</md-button>' +
				'</div>' +
				'<prm-spinner class="inline-loader half-transparent no-text" layout="row" layout-align="center center" ng-if="$ctrl.renewInProgress"></prm-spinner>' +
				'<div class="item-respond" ng-if="$ctrl.isRenewed">' +
					'<span ng-style="$ctrl.renewResponse.renewed === \'N\' && {\'color\':\'tomato\'} || $ctrl.renewResponse.renewed === \'Y\' && {\'color\':\'green\'}">' +
						'<span translate="{{$ctrl.renewResponse.response || \'loans.renewed.\' + $ctrl.renewResponse.renewed}}"></span>' +
					'</span>' +
				'</div>' +
			'</div>' +
		'</div>' +
		'<div class="align-self-stretch" flex-xs="100">' +
			'<md-button class="item-expand-button" aria-label="{{\'nui.aria.account.requests.expandcollapse\' | translate:\'{title: $ctrl.item.title}\'}}" (click)="$ctrl.toggleDisplayMode()">' +
				'<prm-icon ng-class="{\'rotate-180\':$ctrl.isExpanded}" icon-type="{{::$ctrl.accountIcons.expandIcon.type}}" svg-icon-set="{{::$ctrl.accountIcons.expandIcon.iconSet}}" icon-definition="{{::$ctrl.accountIcons.expandIcon.icon}}" aria-label="{{\'nui.aria.account.requests.expandcollapse\' | translate:\'{title: $ctrl.item.title}\'}}"></prm-icon>' +
			'</md-button>' +
			'<div ng-init="messageAdded = \'open\' ;\r\n                      messageRemoved = \'close\' " class="accessible-only" aria-label="{{$ctrl.isExpanded ? messageAdded : messageRemoved}}" aria-live="assertive">' +
				'{{$ctrl.isExpanded ? messageAdded : messageRemoved}}' +
			'</div>' +
		'</div>' +
		'<prm-loan-after parent-ctrl="$ctrl"></prm-loan-after>');

		/******	prm-loans-overview	******/
		$templateCache.put('components/account/overview/loansOverview/loans-overview.html',
		'<div class="tiles-grid-tile">' +
			'<div class="tile-content" layout="column">' +
				'<div class="tile-header" layout="column">' +
					'<div layout="row" layout-align="space-between">' +
						'<h2 class="header-link light-text" ng-click="$ctrl.triggerLinkToLoansSection()" tabindex="0">' +
							'<span translate="nui.loans.header"></span><prm-icon class="arrow-icon" icon-type="{{$ctrl.accountIcons.arrowRightIcon.type}}" svg-icon-set="{{$ctrl.accountIcons.arrowRightIcon.iconSet}}" icon-definition="{{$ctrl.accountIcons.arrowRightIcon.icon}}"></prm-icon>' +
						'</h2>' +
						'<md-button ng-if="$ctrl.hasRenewableLoans()" class="button-link" (click)="$ctrl.triggerLinkToLoansSection(); $ctrl.renewAllLoans()" aria-label="{{::(\'nui.loans.renewall\' | translate)}}">' +
							'<prm-icon class="h-flipped" icon-type="{{$ctrl.accountIcons.renewLoanIcon.type}}" svg-icon-set="{{$ctrl.accountIcons.renewLoanIcon.iconSet}}" icon-definition="{{$ctrl.accountIcons.renewLoanIcon.icon}}" aria-label="{{::(\'nui.loans.renewall\' | translate)}}"></prm-icon><span translate="nui.loans.renewall"></span>' +
						'</md-button>' +
					'</div>' +
				'</div>' +
				'<md-list layout="column"><prm-spinner ng-if="$ctrl.inProgress" class="default-loader dark-on-light overlay-cover no-text" layout="row" layout-align="center center"></prm-spinner><md-list-item class="md-3-line" ng-repeat="item in $ctrl.loansOverviewDisplay" ng-click="$ctrl.triggerLinkToLoansSection(item.loanid)"><span class="item-index">{{$index + 1}}</span><div class="md-list-item-text"><h3 ng-if="item.title">{{item.title}}</h3><h4 class="loans-brief-display" ng-if="item.getBriefDisplayLine(1)"><span translate="nui.loan.brief.1"></span> {{item.getBriefDisplayLine(1)}}</h4><p class="no-wrap-line" ng-class="{\'has-icon-on-left prm-warn\': item.isDueAlert()}" ng-if="item.isActiveLoan()"><prm-icon ng-if="item.isDueAlert()" aria-label="Due alert icon" icon-type="{{$ctrl.accountIcons.timerIcon.type}}" svg-icon-set="{{$ctrl.accountIcons.timerIcon.iconSet}}" icon-definition="{{$ctrl.accountIcons.timerIcon.icon}}"></prm-icon>' +
				//ta bara med yyyy-mm-dd från duedate
				'<span translate="{{item.getCodeAlert()}}"></span>: {{item.getDateForBriefDisplay().substring(0, 10)}}</p><p class="normal-text loans-brief-display no-wrap-line weak-text"><span translate="nui.loan.brief.2"></span> {{item.getBriefDisplayLine(2)}}</p></div><div ng-if="!item.isActiveLoan()"><span translate="loans.return_date"></span>: <span>{{item.getDateForBriefDisplay()}}</span></div><div class="tile-item-arrow"><prm-icon aria-label="right arrow Icon" icon-type="{{$ctrl.accountIcons.arrowRightIcon.type}}" svg-icon-set="{{$ctrl.accountIcons.arrowRightIcon.iconSet}}" icon-definition="{{$ctrl.accountIcons.arrowRightIcon.icon}}"></prm-icon></div></md-list-item></md-list><div ng-if="!$ctrl.numOfLoans || $ctrl.numOfLoans === \'0\'" ng-cloak class="message-with-icon" layout="column" layout-align="center center" layout-padding layout-margin><prm-icon class="giant-icon bg-icon" icon-type="{{$ctrl.accountIcons.beer.type}}" svg-icon-set="{{$ctrl.accountIcons.beer.iconSet}}" icon-definition="{{$ctrl.accountIcons.beer.icon}}"></prm-icon><div><span translate="nui.overview.noloans"></span></div></div><md-button class="button-with-icon overflow-visible" layout="row" layout-align="center center" ng-if="$ctrl.numOfLoans > 3" (click)="$ctrl.triggerLinkToLoansSection()" aria-label="view all loans button"><span translate="nui.overview.loans.viewall" translate-values="$ctrl.getViewAllPlaceHolder()"></span><prm-icon aria-label="arrow right" class="arrow-icon" icon-type="{{$ctrl.accountIcons.arrowRightIcon.type}}" svg-icon-set="{{$ctrl.accountIcons.arrowRightIcon.iconSet}}" icon-definition="{{$ctrl.accountIcons.arrowRightIcon.icon}}"></prm-icon></md-button></div></div>' +
		'<prm-loans-overview-after parent-ctrl="$ctrl"></prm-loans-overview-after>');
		
		//språkinställning om det finns i URL ("lang=sv_SE" eller "prefLang=sv_SE") default = en_US
		
		$rootScope.$on('$translateChangeSuccess', function () {
			vm.absUrl = $location.absUrl();
			if ((vm.absUrl.indexOf("lang=sv_SE")!== -1 || vm.absUrl.indexOf("prefLang=sv_SE")!== -1) && $translate.use()=="en_US") {
				$translate.use("sv_SE");
			}
		});
		
		//Citation Styles(men var är dessa egentligen konfigurerade?? Hittar inte i primo BO, men hämtas här: /primo_library/libweb/webservices/rest/v1/configuration/46KTH_VU1_L)
		//Lägg även in dem i Primo BO för att få rätt namn/översättning (exvis default.citation.labels.vancouver)
		
		//Ta bort de vi inte vill ha
		for(var i = window.appConfig['mapping-tables']['Citation styles'].length - 1; i >= 0; i--) {
			//if(window.appConfig['mapping-tables']['Citation styles'][i].target === "apa") {
			  // window.appConfig['mapping-tables']['Citation styles'].splice(i, 1);
			//}
		}
		//Lägg till de vi saknar
		window.appConfig['mapping-tables']['Citation styles'].push({ source1: '10', target: 'vancouver' });
		window.appConfig['mapping-tables']['Citation styles'].push({ source1: '11', target: 'ieee' });
		//window.appConfig['mapping-tables']['Citation styles'].push({ source1: '12', target: 'oscola' });
	});
	

	/*****************************************
	
	KTHB Primo rubrik
		
	*****************************************/
	app.component('prmLogoAfter', {
			bindings: {parentCtrl: '<'},
			controller: 'prmLogoAfterController',
			//Kiosk
			//template: '<div><a href="{{$ctrl.parentCtrl.kthb_link}}"><span class="kth-sitenameheader" translate="nui.header.sitename"></span> <span class="kth-sitenameheader">{{$ctrl.parentCtrl.kthb_kioskheader}}</span></a></div>'
			template: '<div><a href="{{$ctrl.parentCtrl.kthb_link}}"><span class="kth-sitenameheader">{{$ctrl.parentCtrl.kthb_kioskheader}}</span></a></div>'
	});
	
	app.controller('prmLogoAfterController',function ($scope, $translate, $timeout, $rootScope) { 
		var vm = this;

		//Se till att länken anpassas till valt språk
		//engelska default?
		//Kiosk gå till primo i st f kth, lägg till "sökdator" i rubriken
		vm.parentCtrl.kthb_link = "/primo-explore/search?vid=" + kth_vid;
		vm.parentCtrl.kthb_kioskheader = "KTH Library - Search Computer";
		if($translate.use() == 'sv_SE') {
			vm.parentCtrl.kthb_link = "/primo-explore/search?vid=" + kth_vid + "&lang=sv_SE";
			vm.parentCtrl.kthb_kioskheader = "KTH Biblioteket - Sökdator";
		}
	});
	
	
	/*****************************************************************
	
	Service som lagrar 
	currentURL() 
	
	*****************************************************************/
	app.service('kth_currenturl', function() {
		
		var data = [];
		this.addData = function (d) {
			data = d;
		};
		
		this.getData = function () {
			return data;
		};
	});
	
	/*****************************************************************
	
	Service som lagrar 
	allfacetscollapsed
	
	*****************************************************************/
	app.factory('kth_facetdata', function () {

		var data = {
			allfacetscollapsed: true//True default
		};

		return {
			getallfacetscollapsed: function () {
				return data.allfacetscollapsed;
			},
			setallfacetscollapsed: function (allfacetscollapsed) {
				data.allfacetscollapsed = allfacetscollapsed;
			}
		};
	});
	
	/*****************************************************************
	
	Service som lagrar 
	loginservice så den blir tillgänglig överallt
	
	Exempelvis kan login då anropas
	(loginService.handleLoginClick()) 
	
	*****************************************************************/
	app.service('kth_loginservice', function() {
		
		var data = [];
		this.addData = function (d) {
			data = d;
		};
		
		this.getData = function () {
			return data;
		};
	});
	
	/*****************************************************************
	
	Service som lagrar session
	
	*****************************************************************/
	app.service('kth_session', function() {
		
		var data = [];
		this.addData = function (d) {
			data = d;
		};
		
		this.getData = function () {
			return data;
		};
	});
	
	/*****************************************
	prm-authentication-after
	Username under inloggningknappen
	Spara loginservice, session
		
	*****************************************/
	app.component('prmAuthenticationAfter', {
			bindings: {parentCtrl: '<'},
			controller: 'AuthenticationAfterController',
			//template: '<div>AuthenticationAfterController</div>' + 
			//'<md-button ng-click="$ctrl.endsession()">End Session</md-button>'
	});
	
	app.controller('AuthenticationAfterController', function ($scope, $http, $rootScope, kth_loginservice, kth_session,Idle) {
        var vm = this;
		vm.parentCtrl.requestlogin = false;
		var data = vm.parentCtrl;
		var session = vm.parentCtrl.primolyticsService.userSessionManagerService;	
		//är det en loginruta för alma-p så gör om den till ickegul etc
		if (typeof $scope.$parent.$parent.$parent.$ctrl != 'undefined'){
			if ($scope.$parent.$parent.$parent.$ctrl.loginalmap) {
				vm.parentCtrl.requestlogin = true;
			}
		}

		//spara loginfunktion i service som sen kan hämtas från controllers
		kth_loginservice.addData(data);
		$rootScope.$broadcast('logindataAdded', data);
		
		//spara sesssion i service som sen kan hämtas från controllers
		kth_session.addData(session);
		$rootScope.$broadcast('sessiondataAdded', session);
	});
	
	
	/*****************************************
	
	prm-user-area-after
		
	*****************************************/
	app.component('prmUserAreaAfter', {
		bindings: {parentCtrl: '<'},
		controller: 'prmUserAreaAfterController',
		template: ''
	});
	
	app.controller('prmUserAreaAfterController', function ($scope,$rootScope,$timeout,$translate, $mdDialog) {
		var vm = this;
		vm.vid = vm.parentCtrl.primolyticsService.userSessionManagerService.vid;
		vm.parentCtrl.goToHELP = goToHELP;
		vm.parentCtrl.goToKTHDatabases = goToKTHDatabases;
		//Kiosk
		vm.parentCtrl.goToLibraryAccountApplication = goToLibraryAccountApplication;
		vm.parentCtrl.goToLibraryMap = goToLibraryMap;
		//Anpassa länkar till valt språk
		vm.kth_language = $translate.use();	
		if(vm.kth_language == 'sv_SE') {
			vm.parentCtrl.kth_databaseurl = 'https://www.kth.se/biblioteket/soka-vardera/sok-information/databaser-och-soktjanster-1.851404';
		} else {
			vm.parentCtrl.kth_databaseurl = 'https://www.kth.se/en/biblioteket/soka-vardera/sok-information/databaser-och-soktjanster-1.851404';
		}

		function goToHELP() {
			if(vm.kth_language == 'sv_SE') {
				window.open('https://www.kth.se/biblioteket/soka-vardera/sok-information/primo-hjalp-1.863377', 'Help', 'height=800,width=600');
			} else {
				window.open('https://www.kth.se/en/biblioteket/soka-vardera/sok-information/primo-hjalp-1.863377', 'Help', 'height=800,width=600');
			}
		}

		function goToKTHDatabases() {
			if(vm.kth_language == 'sv_SE') {
				location.href = 'https://www.kth.se/biblioteket/soka-vardera/sok-information/databaser-och-soktjanster-1.851404';
			} else {
				location.href = 'https://www.kth.se/en/biblioteket/soka-vardera/sok-information/databaser-och-soktjanster-1.851404';
			}
		}
		
		//Kiosk egen dialogruta för hjälp och wagnerkarta och biliotekskontosansökan
		//ANVÄNDS INTE
		if(vm.kth_language == 'sv_SE') {
			vm.helpdialogurl = 'custom/' + kth_vid + '/html/helpkiosk_sv_SE.html'
			vm.librarymapdialogurl = 'http://web.wagnerguide.com/2.1/KTHlibrary.aspx?Lang=sv&Extern=true'
			vm.librarymapdialogheader = 'Bibliotekskarta'
			vm.librarycarddialogurl = 'http://apps.lib.kth.se/forms/registeralmauser/almaadduserform_kiosk_nui.php?formlanguage=sv'
			vm.librarycarddialogheader = 'Ansökan om biblitekskonto'
		} else {
			vm.helpdialogurl = 'custom/' + kth_vid + '/html/helpkiosk_en_US.html'
			vm.librarymapdialogurl = 'http://web.wagnerguide.com/2.1/KTHlibrary.aspx?Lang=en&Extern=true'
			vm.librarymapdialogheader = 'Library Map'
			vm.librarycarddialogurl = 'http://apps.lib.kth.se/forms/registeralmauser/almaadduserform_kiosk_nui.php?formlanguage=en'
			vm.librarycarddialogheader = 'Library Account Application'
		}
		//Kiosk
		/*
		function goToLibraryAccountApplication() {
			if(vm.kth_language == 'sv_SE') {
				location.href = 'http://apps.lib.kth.se/forms/registeralmauser/almaadduserform_kiosk_nui.php?formlanguage=sv';
			} else {
				location.href = 'http://apps.lib.kth.se/forms/registeralmauser/almaadduserform_kiosk_nui.php?formlanguage=en';
			}
		}
		*/
		function goToLibraryAccountApplication() {
			$mdDialog.show({
				controller: function controller() {
					return {
						hide: function hide() {
							$mdDialog.hide();
						},
						cancel: function cancel() {
							$mdDialog.cancel();
						}
					};
				},
				controllerAs: '$ctrl',
				template:'<md-dialog id="noaccessdialog" aria-label="No access dialog">' +
							'<md-toolbar class="_md _md-toolbar-transitions">' +
								'<div class="md-toolbar-tools">' +
									'<h2>' + vm.librarycarddialogheader +'</h2>' +
									'<span flex="" class="flex"></span>' +
									'<button class="md-icon-button md-button md-ink-ripple" type="button" ng-click="$ctrl.cancel()">' +
										'<prm-icon icon-type="svg" svg-icon-set="primo-ui" icon-definition="close">'+ 
											'<md-icon md-svg-icon="primo-ui:close" aria-label="icon-close" class="md-primoExplore-theme" aria-hidden="true">' +
											'</md-icon>' +
										'</prm-icon>' +
									'</button>' +
								'</div>' +
							'</md-toolbar>' +
							'<md-dialog-content>'+
								'<div class="md-dialog-content">' + 
									'<div class="md-dialog-content">' +
										'<iframe frameborder="0" width="1300" height="1000" src="' + vm.librarycarddialogurl + '"></iframe>' +
									'</div>' + 
								'</div>' +
							'</md-dialog-content>' +
						'</md-dialog>',
				clickOutsideToClose: true,fullscreen: false,escapeToClose: true,focusOnOpen: false
			});
		}
		//Kiosk
		/*
		function goToLibraryMap() {
			if(vm.kth_language == 'sv_SE') {
				location.href = 'http://web.wagnerguide.com/2.1/KTHlibrary.aspx?Lang=sv&Extern=true';
			} else {
				location.href = 'http://web.wagnerguide.com/2.1/KTHlibrary.aspx?Lang=en&Extern=true';
			}
		}
		vm.parentCtrl.librarymapdialog = librarymapdialog;
		*/
		
		vm.parentCtrl.helpdialog = helpdialog;
		function helpdialog() {
			$mdDialog.show({
				controller: function controller() {
					return {
						hide: function hide() {
							$mdDialog.hide();
						},
						cancel: function cancel() {
							$mdDialog.cancel();
						}
					};
				},
				controllerAs: '$ctrl',
				templateUrl: vm.helpdialogurl,
				clickOutsideToClose: true,fullscreen: false,escapeToClose: true,focusOnOpen: false
			});
		}
		
		function goToLibraryMap() {
			$mdDialog.show({
				controller: function controller() {
					return {
						hide: function hide() {
							$mdDialog.hide();
						},
						cancel: function cancel() {
							$mdDialog.cancel();
						}
					};
				},
				controllerAs: '$ctrl',
				template:'<md-dialog id="noaccessdialog" aria-label="No access dialog">' +
							'<md-toolbar class="_md _md-toolbar-transitions">' +
								'<div class="md-toolbar-tools">' +
									'<h2>' + vm.librarymapdialogheader +'</h2>' +
									'<span flex="" class="flex"></span>' +
									'<button class="md-icon-button md-button md-ink-ripple" type="button" ng-click="$ctrl.cancel()">' +
										'<prm-icon icon-type="svg" svg-icon-set="primo-ui" icon-definition="close">'+ 
											'<md-icon md-svg-icon="primo-ui:close" aria-label="icon-close" class="md-primoExplore-theme" aria-hidden="true">' +
											'</md-icon>' +
										'</prm-icon>' +
									'</button>' +
								'</div>' +
							'</md-toolbar>' +
							'<md-dialog-content>'+
								'<div class="md-dialog-content">' + 
									'<div class="md-dialog-content">' +
										'<iframe frameborder="0" width="1300" height="1000" src="' + vm.librarymapdialogurl + '"></iframe>' +
									'</div>' + 
								'</div>' +
							'</md-dialog-content>' +
						'</md-dialog>',
				clickOutsideToClose: true,fullscreen: false,escapeToClose: true,focusOnOpen: false
			});
		}
		
		

		
	});
	
	/*****************************************
	
	prm-facet-after
	
	Egenskaper vid ny sökning, fler resultat(exempelvis alla utfällda eller inte vid refresh eller ny sökning)
		
	*****************************************/
	app.component('prmFacetAfter', {
		bindings: {parentCtrl: '<'},
		controller: 'prmFacetAfterController',
		template: ''
	});
	
	app.controller('prmFacetAfterController', function ($scope, kth_facetdata) {
        var vm = this;
		//hämta parameter från factory kth_facetdata för defaultvärde
		vm.parentCtrl.allfacetscollapsed = kth_facetdata.getallfacetscollapsed()
		
		//Definiera funktion som togglar facetter(ut- eller ihopfällda) så den kan anropas från knapp/rubrik i prm-facet
		vm.parentCtrl.togglefacets = togglefacets
		function togglefacets() {
			if (kth_facetdata.getallfacetscollapsed()) {
				vm.parentCtrl.allfacetscollapsed = false;
				kth_facetdata.setallfacetscollapsed(false);
			} else {
				vm.parentCtrl.allfacetscollapsed = true;
				kth_facetdata.setallfacetscollapsed(true);
			}
			vm.parentCtrl.facets.forEach(
				function(item, index) {
					if (vm.parentCtrl.allfacetscollapsed) {
						item.facetGroupCollapsed = true;
					} else {
						item.facetGroupCollapsed = false;
					}
				}
			);
		}
	});
	
	/*****************************************
	
	prm-facet-exact-after
	Se till att egenskaper sätts för respektive facett
		
	*****************************************/
	app.component('prmFacetExactAfter', {
		bindings: {parentCtrl: '<'},
		controller: 'prmFacetExactAfterController',
		template: ''
	});
	
	/*****************************************
	
	prm-facet-range-after (för year-facett)
	Ange samma controller som prm-facet-exact-after
		
	*****************************************/
	app.component('prmFacetRangeAfter', {
		bindings: {parentCtrl: '<'},
		controller: 'prmFacetExactAfterController',
		template: ''
	});
	
	app.controller('prmFacetExactAfterController', function ($scope, kth_facetdata) {
        var vm = this;
		//hämta parameter från factory kth_facetdata
		if(kth_facetdata.getallfacetscollapsed()) {
			vm.parentCtrl.facetGroup.facetGroupCollapsed = true;
		} 
		else {
			vm.parentCtrl.facetGroup.facetGroupCollapsed = false;
		}
	});
	
	/*****************************************
	
	prm-search-after
		
	*****************************************/
	app.component('prmSearchAfter', {
			bindings: {parentCtrl: '<'},
			controller: 'prmSearchAfterController'
	});
	
	app.controller('prmSearchAfterController', function ($scope,$location,$rootScope,kth_currenturl,kth_loginservice,$timeout,$templateCache, $translate, $http, $sce) {
		var vm = this;
		vm.parentCtrl.kthinfotext = '0';
		
		/******************************************************
		
		kthinfotext som ska visas vid fel eller annan info
		
		******************************************************/
		$translate('nui.kth_infotext').then(function (translation) {
			vm.parentCtrl.kthinfotext = translation;
			vm.kthinfotext = "bla bla bla bla";
		});
		
		/****************************
		
		Antal sökträffar
		Används här??
		*****************************/
		vm.parentCtrl.kthb_primo_resultsBulkSize = localStorage.getItem("kthb_primo_resultsBulkSize");
		vm.parentCtrl.kthb_primo_resultsBulkSizedata = {
			group1 : +localStorage.getItem("kthb_primo_resultsBulkSize"),
		};
		
		/**********************************
		
		för att kolla om man är inloggad etc
		
		**********************************/
		vm.parentCtrl.kthisoncampus = false;
		$scope.$watch(function() { 
			return vm.parentCtrl.primolyticsService.jwtUtilService.getDecodedToken().onCampus; }, function(onCampus) {
			//console.log(' watch oncampus: ' + onCampus);
			//vm.parentCtrl.kthisoncampus = onCampus;
		});
		
		vm.parentCtrl.userName_kth = vm.parentCtrl.primolyticsService.userSessionManagerService.jwtUtilService.getDecodedToken().userName;
		/***************************************************************** 
		Använd getDecodedToken().onCampus istället??
		Anpassning för att kolla om man sitter på campus via ipadress 
		Primo Home > Ongoing Configuration Wizards > Institution Wizard > Edit IPs for "46KTH Royal Institute of Technology"
		Client IP hämtas via php-script på KTHB apps-server
		lägg in text i nui.kth_notoncampus, Primo BO
		
		******************************************************************/
		function check_if_in_iprange(fromipaddress, toipaddress, ipaddress) {
			var x = ipaddress.split('.');
			var fromarr = fromipaddress.split('.');
			var toarr = toipaddress.split('.');
			var response = false;
			if (+x[0] >= fromarr[0] && +x[0] <= toarr[0]) {
				if (+x[1] >= fromarr[1] && +x[1] <= toarr[1]) {
					if (+x[2] >= fromarr[2] && +x[2] <= toarr[2]) {
						if (+x[3] >= fromarr[3] && +x[3] <= toarr[3]) {
							response = true;
						}
					}
				}
			} else {
			}
			return response;
		}
		
		var client_ip;
		getclientip();
		function getclientip() {
			var method = 'GET';
			var url = "https://apps.lib.kth.se/primo/ip.php";
			$http.defaults.headers.post["Content-Type"] = "text/plain";
			$http({method: method, url: url}).
			then(function(response) {
				client_ip = response.data.ip;
				//Kolla mot alla ipintervall som är uppsatta i Primo BO
				if(check_if_in_iprange('130.237.202.0', '130.237.203.255', client_ip)) {
					vm.parentCtrl.kthisoncampus = true;
				} 
				else if(check_if_in_iprange('130.229.128.0', '130.229.159.255', client_ip)) {
					vm.parentCtrl.kthisoncampus = true;
				} 
				else if(check_if_in_iprange('130.237.206.0', '130.237.206.255', client_ip)) {
					vm.parentCtrl.kthisoncampus = true;
				} 
				else if(check_if_in_iprange('130.237.1.0', '130.237.84.255', client_ip)) { 
					vm.parentCtrl.kthisoncampus = true;
				}
				else if(check_if_in_iprange('130.237.209.0', '130.237.216.255', client_ip)) {
					vm.parentCtrl.kthisoncampus = true;
				} 
				else if(check_if_in_iprange('130.237.218.0', '130.237.236.255', client_ip)) {
					vm.parentCtrl.kthisoncampus = true;
				} 
				else if(check_if_in_iprange('130.237.238.0', '130.237.238.255', client_ip)) {
					vm.parentCtrl.kthisoncampus = true;
				} 
				else if(check_if_in_iprange('130.237.250.0', '130.237.251.255', client_ip)) {
					vm.parentCtrl.kthisoncampus = true;
				} 
				else if(check_if_in_iprange('192.16.124.0', '192.16.125.255', client_ip)) {
					vm.parentCtrl.kthisoncampus = true;
				} 
				else if(check_if_in_iprange('192.16.127.0', '192.16.127.255', client_ip)) {
					vm.parentCtrl.kthisoncampus = true;
				} 
				else if(check_if_in_iprange('193.10.156.0', '193.10.159.255', client_ip)) {
					vm.parentCtrl.kthisoncampus = true;
				} 
				else if(check_if_in_iprange('193.10.37.0', '193.10.39.255', client_ip)) {
					vm.parentCtrl.kthisoncampus = true;
				} 
				else if(check_if_in_iprange('90.152.114.170', '90.152.114.170', client_ip)) {
					vm.parentCtrl.kthisoncampus = true;
				}
				else {
					vm.parentCtrl.kthisoncampus = false;
				}
			});
		};
		
		/****************************************************************
		
		Spara dismiss-statusar(att dölja alerten) i rootscope 
		så meddelandet inte visas förrän vid en "refresh"
		
		****************************************************************/
		vm.parentCtrl.dismisscampusmessage = dismisscampusmessage;
		vm.parentCtrl.showcampusmessage = $rootScope.showcampusmessage;
		function dismisscampusmessage() {
			$rootScope.showcampusmessage = false;
			vm.parentCtrl.showcampusmessage = $rootScope.showcampusmessage;
		}
		vm.parentCtrl.dismisskthinfo = dismisskthinfo;
		vm.parentCtrl.showkthinfomessage = $rootScope.showkthinfomessage;
		function dismisskthinfo() {
			$rootScope.showkthinfomessage = false;
			vm.parentCtrl.showkthinfomessage = $rootScope.showkthinfomessage;
		}
	});	
	
	/*****************************************
	
	prm-login-alma-mashup-after
	
	*****************************************/
	
	app.component('prmLoginAlmaMashupAfter', {
			bindings: {parentCtrl: '<'},
			controller: 'prmLoginAlmaMashupAfterController',
			template: ''
	});
	
	app.controller('prmLoginAlmaMashupAfterController',function ($scope) {
		var vm = this;
		/************************************
		
		Kolla om det är tryckt material så anpassningar kan göras för login
		
		************************************/
		if ($scope.$parent.$parent.$parent.$parent.$ctrl.service.linkElement.category == "Alma-P") {
			vm.parentCtrl.loginalmap = true;
		}
	});
	
	/*****************************************
	
	prm-Search-Result-List-After
	
	Före träfflistan(ordningen omvänd flex)
	Egen facettmeny
	
	*****************************************/
	app.component('prmSearchResultListAfter', {
			bindings: {parentCtrl: '<'},
			controller: 'prmSearchResultListAfterController',
			template: 
			'<div ng-if="!$ctrl.isfavorites && $ctrl.showfacets">' +
				'<div id="facettmenudiv">' + 
					'<ul id="facettmenu">' + 
						'<li ng-if="$ctrl.physical_item_enabled"><a href="{{$ctrl.absUrl + $ctrl.physical_item}}" translate="facets.facet.tlevel.physical_item"></a>&nbsp;<span ng-if="$ctrl.physical_item_enabled">({{$ctrl.physical_item_nr}})</span></li>' + 
						'<li ng-if="!$ctrl.physical_item_enabled" translate="facets.facet.tlevel.physical_item"></li>&nbsp;|&nbsp;' + 
						'<li ng-if="$ctrl.online_resources_enabled"><a href="{{$ctrl.absUrl + $ctrl.online_resources}}" translate="facets.facet.tlevel.online_resources"></a>&nbsp;<span ng-if="$ctrl.online_resources_enabled">({{$ctrl.online_resources_nr}})</span></li>' +
						'<li ng-if="!$ctrl.online_resources_enabled" translate="facets.facet.tlevel.online_resources"></li>&nbsp;|&nbsp;' +
						'<li ng-if="$ctrl.books_enabled"><a ng-if="$ctrl.books_enabled" href="{{$ctrl.absUrl + $ctrl.books}}" translate="facets.facet.facet_rtype.books"></a>&nbsp;<span ng-if="$ctrl.books_enabled">({{$ctrl.books_nr}})</span></li>' + 
						'<li ng-if="!$ctrl.books_enabled" translate="facets.facet.facet_rtype.books"></li>&nbsp;|&nbsp;' + 
						'<li ng-if="$ctrl.journals_enabled"><a href="{{$ctrl.absUrl + $ctrl.journals}}" translate="facets.facet.facet_rtype.journals"></a>&nbsp;<span ng-if="$ctrl.journals_enabled">({{$ctrl.journals_nr}})</span></li>' +
						'<li ng-if="!$ctrl.journals_enabled" translate="facets.facet.facet_rtype.journals"></li>&nbsp;|&nbsp;' +
						'<li ng-if="$ctrl.bibldbfasett_enabled"><a href="{{$ctrl.absUrl + $ctrl.bibldbfasett}}" translate="facets.facet.facet_rtype.bibldbfasett"></a>&nbsp;<span ng-if="$ctrl.bibldbfasett_enabled">({{$ctrl.bibldbfasett_nr}})</span></li>' +
						'<li ng-if="!$ctrl.bibldbfasett_enabled" translate="facets.facet.facet_rtype.bibldbfasett"></li>&nbsp;|&nbsp;' +
						'<li ng-if="$ctrl.articles_enabled"><a href="{{$ctrl.absUrl + $ctrl.articles}}" translate="facets.facet.facet_rtype.articles"></a>&nbsp;<span ng-if="$ctrl.articles_enabled">({{$ctrl.articles_nr}})</span></li>' +
						'<li ng-if="!$ctrl.articles_enabled" translate="facets.facet.facet_rtype.articles"></li>' +
					'</ul>' +
				'</div>' +
			'</div>'
	});
	
	app.controller('prmSearchResultListAfterController', function ($scope,$location,$rootScope,kth_currenturl,kth_loginservice,$timeout,$mdMedia) {
		
		var vm = this;

		/***********************************
		
		för att visa "utöka" vid 0 träffar
		som förslag på små skärmar
		
		***********************************/
		//exempel "reactive oxygen species as agents of fatigue"
		vm.searchObject = $location.search();
		if(typeof(vm.searchObject.pcAvailability) == 'undefined') {
			vm.parentCtrl.pcAvailability = false;
		} else {
			vm.searchObject.pcAvailability == 'true' ? vm.parentCtrl.pcAvailability=true: vm.parentCtrl.pcAvailability=false;
		}
		vm.parentCtrl.expandsearchoutsidelibrary = expandsearchoutsidelibrary;
		
		//Kolla om skärmen är liten.
		$scope.$watch(function() { return $mdMedia('max-width: 960px'); }, function(small) {
			vm.parentCtrl.screenIsSmall = small;
		});
		
		function expandsearchoutsidelibrary() {
			let mode = vm.parentCtrl.pcAvailability ? 'true': 'false';
			//"$location.search" ändrar parametrar i URL:en
			$location.search('pcAvailability', mode);
		}
		
		/******************************************
		
		 "Log in to save query"
		
		******************************************/
		vm.isfavorites = vm.parentCtrl.isFavorites;
		if (!vm.isfavorites) {
			//hämta loginfunktion
			//$scope.$on('logindataAdded', function(event, data) {
				vm.data = kth_loginservice.getData();
			//});
		}
		vm.loggain = loggain;
		vm.parentCtrl.loggain = loggain;
		function loggain () {
			vm.data.handleLogin();
		}
		
		/*********************************************
		
		Egen topfacettmeny
		
		*********************************************/
		vm.absUrl = $location.absUrl();
		vm.showfacets = false;
		$scope.$on('urldataAdded', function(event, data) {
			$timeout(function(){
				vm.facetservice_results = vm.parentCtrl.facetService.results;
				vm.physical_item_enabled = false;
				vm.online_resources_enabled = false;
				vm.books_enabled = false;
				vm.journals_enabled = false;
				vm.bibldbfasett_enabled = false;
				vm.articles_enabled = false;
				vm.physical_item_nr = 0;
				vm.online_resources_nr = 0;
				vm.books_nr = 0;
				vm.journals_nr = 0;
				vm.bibldbfasett_nr = 0;
				vm.articles_nr = 0;
				vm.isfavorites = vm.parentCtrl.isFavorites;
				//gå igenom alla facetter
				//hittas en facett här så är den alltså aktiv och möjlig att begränsa resultatet med
				vm.parentCtrl.facetService.results.forEach( 
					function (item, index) {
						if (item.name=='tlevel') {
							item.values.forEach( 
								function (value,valueindex) {
									if (value.value == 'physical_item') {
										vm.physical_item_enabled = true;
										vm.physical_item_nr = value.count.toLocaleString();
									}
									if (value.value == 'online_resources') {
										vm.online_resources_enabled = true;
										vm.online_resources_nr = value.count.toLocaleString();
									}
									if (value.value == 'peer_reviewed') {
										vm.articles_enabled = true;
										vm.articles_nr = value.count.toLocaleString();
									}
								}
							)
						}
						if (item.name=='rtype') {
							item.values.forEach( 
								function (value,valueindex) {
									if (value.value == 'books') {
										vm.books_enabled = true;
										vm.books_nr = value.count.toLocaleString();
									}
									if (value.value == 'journals') {
										vm.journals_enabled = true;
										vm.journals_nr = value.count.toLocaleString();
									}
									if (value.value == 'bibldbfasett') {
										vm.bibldbfasett_enabled = true;
										vm.bibldbfasett_nr = value.count.toLocaleString();
									}
								}
							)
						}
						
					}
				);
				vm.physical_item = "";
				vm.online_resources = "";
				vm.books = "";
				vm.journals = "";
				vm.bibldbfasett = "";
				vm.articles = "";

				if (vm.absUrl.indexOf("facet=tlevel,include,physical_item")=== -1) {
					vm.physical_item = "&facet=tlevel,include,physical_item";
				}
				if (vm.absUrl.indexOf("facet=tlevel,include,online_resources")=== -1) {
					vm.online_resources = "&facet=tlevel,include,online_resources";
				}
				if (vm.absUrl.indexOf("facet=tlevel,include,peer_reviewed")=== -1) {
					vm.articles = "&facet=tlevel,include,peer_reviewed";
				}
				if (vm.absUrl.indexOf("facet=rtype,include,books")=== -1) {
					vm.books = "&facet=rtype,include,books";
				}
				if (vm.absUrl.indexOf("facet=rtype,include,journals")=== -1) {
					vm.journals = "&facet=rtype,include,journals";
				}
				if (vm.absUrl.indexOf("facet=rtype,include,bibldbfasett")=== -1) {
					vm.bibldbfasett = "&facet=rtype,include,bibldbfasett";
				}
				vm.showfacets = true;
			},2000); //slut timeout
		});
	
	});	
	

	/*****************************************
	
	prm-top-bar-after
	
	*****************************************/
	app.component('prmTopbarAfter', {
			bindings: {parentCtrl: '<'},
			controller: 'TopbarAfterController'
	});	

	app.controller('TopbarAfterController', function ($scope, $http, $rootScope,$timeout) {
        var vm = this;
		//Hämta username att visa i översta sidhuvudet
        vm.parentCtrl.username = $rootScope.$$childTail.$ctrl.userSessionManagerService.getUserName();
    });
	
	/*****************************************
	
	prm-faourites-toolbar-after
	
	*****************************************/
	app.component('prmFavoritesToolBarAfter', {
			bindings: {parentCtrl: '<'},
			controller: 'prmFavoritesToolBarAfterController',
			template: ''
	});
	
	app.controller('prmFavoritesToolBarAfterController', function ($scope,$location,$timeout) {
		var vm = this;
		vm.backtosearch = backtosearch;
		vm.isFavorites = vm.parentCtrl.isFavorites;
		vm.parentCtrl.goToSearch = backtosearch;
		$timeout(function(){
			//hämta href-attribut från originalfavoritikonen
			var myEl = angular.element(document.querySelector('prm-search-bookmark-filter a'));
			vm.absUrl = myEl.attr('href');
			//lägg till favorites som class på "prm-search-bar"
			//var myEl = angular.element(document.querySelector('prm-search-bar'));
			//myEl.addClass('kth_nodisplay');
		},0);
		
		function backtosearch() {
			location.href = vm.absUrl;
		}
	});
	
	/**************************************************
	
	prm-full-view-after
	
	*************************************************/
	
	app.component('prmFullViewAfter', {
			bindings: {parentCtrl: '<'},
			controller: 'FullViewAfterController',
			template: 
				'<div ng-if="$ctrl.orciddata" class="loc-altemtrics margin-bottom-medium">' +
                    '<div class="layout-full-width">' +
						'<div layout="column" layout-align="">' +
							'<h4 translate="nui.kth_contributors" class="section-title md-title light-text"></h4>' +
							'<md-divider flex></md-divider>' +
							//ORCID
							'<div class="" ng-if="$ctrl.orcid_id">' +
								'<div class="section-body" layout="row" layout-align="">' +
									'<div class="spaced-rows" layout="column">' +
										//inga bilder
										//Kiosk inga länkar
										'<div>{{$ctrl.orcid_name}} at ORCID <!--img style="width:48px" src="custom/' + kth_vid + '/img/orcid-logo.png"--></div>' +
										//'<div>{{$ctrl.orcid_name}} at <a target="_new" href="{{$ctrl.orcid_url}}">ORCID <!--img style="width:48px" src="custom/' + kth_vid + '/img/orcid-logo.png"--></a></div>' +
										'<div ng-if="$ctrl.kthprofile_url">{{$ctrl.orcid_name}} at KTH <!--img style="width:20px" src="custom/' + kth_vid + '/img/KTH_Logotyp_RGB_2013-2.svg"--></div>' +
										//'<div ng-if="$ctrl.kthprofile_url">{{$ctrl.orcid_name}} at <a target="_new" href="{{$ctrl.kthprofile_url}}">KTH <!--img style="width:20px" src="custom/' + kth_vid + '/img/KTH_Logotyp_RGB_2013-2.svg"--></a></div>' +
									'</div>' +
								'</div>' +
							'</div>' +
						'</div>' +
					'</div>' +
				'</div>' +
				'<div ng-if="$ctrl.doi || $ctrl.issn" class="loc-altemtrics margin-bottom-medium">' +
					'<div class="layout-full-width">' +
						'<div layout="column" layout-align="">' +
							'<h2 translate="nui.kth_metrics" class="section-title md-title light-text"></h2>' +
							'<md-divider flex></md-divider>' +
						'</div>' +
					'</div>' +
					//JCR
					'<div ng-if="$ctrl.issn">' +
						//Kiosk ingen länk
						'<span translate="nui.kth_JCR"></span> JCR' +
					'</div>' +
					//Altmetrics
					'<div class="" ng-if="$ctrl.doi">' +
						'<div class="section-body" layout="row" layout-align="">' +
							'<div class="spaced-rows" layout="column">' +
								//Kiosk ingen länk
								'<div ng-if="$ctrl.almetricsscore > 0"><span translate="nui.kth_altmetrics1">Attention score</span> <span class="wostimesCited">{{$ctrl.almetricsscore}}</span> <span translate="nui.kth_altmetrics2">in</span> Altmetrics</span>&trade;</div>' +
							'</div>' +
						'</div>' +
					'</div>' +
				'</div>'
	});
	
	app.controller('FullViewAfterController', function (angularLoad, $http, kth_loginservice) {
        var vm = this;
		vm.data = kth_loginservice.getData();
		/**************************************************
		
		Hämta olika metricsdata
		Altmetrics, orcid, oaDOI etc
		
		**************************************************/
		vm.almetricsscore = 0;
		if(vm.parentCtrl.item.pnx.addata.doi) {
			vm.doi = vm.parentCtrl.item.pnx.addata.doi[0] || '';
		}
		
		if(vm.parentCtrl.item.pnx.addata.issn) {
			vm.issn = vm.parentCtrl.item.pnx.addata.issn[0] || '';
		} else if (vm.parentCtrl.item.pnx.addata.eissn) {
			vm.issn = vm.parentCtrl.item.pnx.addata.eissn[0] || '';
		}
		
		if(vm.parentCtrl.item.pnx.addata.orcidid) {
			vm.orcid_id = vm.parentCtrl.item.pnx.addata.orcidid[0] || '';
			//hämta info från orcid API
			getorcidinfo(vm.orcid_id);
		}

        vm.$onInit = function () {
            //hämta info från altmetrics API
			getaltmetrics(vm.doi);
        };
		
		function getaltmetrics(doi) {
			vm.parentCtrl.altmetricsisLoading = true;
			vm.altmetricsdata = "";
			var method = 'GET';
			var url = 'https://api.altmetric.com/v1/doi/' + doi;
			$http({method: method, url: url}).
				then(function(response) {
					var status = response.status;
					var data = response.data;
					vm.almetricsscore = response.data.score;
					vm.almetricsdetails_url = response.data.details_url;
				}, function(response) {
					vm.doi = false;
				});
		}
				
		function getorcidinfo(orcid) {
			vm.parentCtrl.orcidisLoading = true;
			vm.orciddata = false;
			var method = 'GET';
			var url = 'https://pub.orcid.org/v2.0/' + orcid;
			$http({
					method: method, 
					url: url, 
					headers: {
						"X-From-ExL-API-Gateway": undefined,
						"Accept": "application/json"
					}
					,
				}).
				then(function(response) {
					vm.orciddata = true;
					var status = response.status;
					var data = response.data;
					if (data.person.name) {
						vm.orcid_name = data.person.name["given-names"]["value"] + ' ' + data.person.name["family-name"]["value"];
					} else {
						vm.orcid_name = 'Unknown '
					}
					if (data.person["researcher-urls"]["researcher-url"]["0"].url.value.indexOf("kth.se/profile")!== -1) {
						//var kthprofile_url = data.person.researcher-urls["researcher-url"]["0"].url; 
						//if (kthprofile_url.indexOf("kth.se/profile")!== -1) {
							vm.kthprofile_url = data.person["researcher-urls"]["researcher-url"]["0"].url.value;
						//}
					}
					vm.orcid_url = data["orcid-identifier"].uri;
				}, function(response) {

				});
		}
		
    });
	
	/***************************************
	
	Egen fullviewafter
	
	***************************************/
	app.component('prmFullViewAfterKth', {
			bindings: {parentCtrl: '<'},
			controller: 'FullViewAfterKthController',
			template: ''
	});
	
	app.controller('FullViewAfterKthController', function (angularLoad, $http) {
        var vm = this;
    });

	/********************************************************
	
	prm-brief-result-container-after
	
	*******************************************************/
	app.component('prmBriefResultContainerAfter', { 
		bindings: {
			parentCtrl: '<',
			data: '<'
		},
		controller: 'BriefResultAfterController',
		template: ''
		//ORCID: {{$ctrl.orcid_id}}
	});
	
	app.controller('BriefResultAfterController', function($scope, $rootScope, $http,kth_currenturl,$location,$timeout,$mdDialog,$sce,$templateCache) {
		var vm = this;
		var self = this;
		//visa orcid_id
		if(vm.parentCtrl.item.pnx.addata.orcidid) {
			vm.orcid_id = vm.parentCtrl.item.pnx.addata.orcidid[0] || '';
		}
		
		//toggla storlek på omslag vid klick
		vm.parentCtrl.largeimage = function(event) {
			if (angular.element(event.currentTarget).hasClass('largeimage')) {
				angular.element(event.currentTarget).removeClass('largeimage')
			} else {
				angular.element(event.currentTarget).addClass('largeimage')
			}
		}

		//kod för att spara url vid facettändringar
		kth_currenturl.addData($location.absUrl());
		$rootScope.$broadcast('urldataAdded', $location.absUrl());

	});
	
	/*****************************************************************
	
	Service för oadoi
	
	*****************************************************************/
	app.factory('kth_oadoi', function ($http) {

		var data = {
		};
		
		//Exempelsökning: "postprandial oxytocin"
		data.getoaDOI = function(doi) {
			var method = 'GET';
			var url = 'https://api.oadoi.org/v2/' + doi + '?email=ask-kthb@kth.se';
			return $http({method: method, url: url, headers: {"X-From-ExL-API-Gateway": undefined},});
		};

		return data;
	});
	
	/*****************************************
	
	prm-search-result-availability-line
		
	*****************************************/
	app.component('prmSearchResultAvailabilityLineAfter', {
		bindings: {parentCtrl: '<'},
		controller: 'prmFullViewServiceContainerAfterController',
		template: '<div ng-if="$ctrl.showOA">' +
					'<div class="">' +
						'<div class="section-body" layout="row" layout-align="">' +
							'<div class="spaced-rows" layout="column">' +
								//Kiosk ingen länk
								'<div>' +
									//'<a style="color: #0f7d00" target="_new" href="{{$ctrl.best_oa_location_url}}">' +
										'Online open access' +
										'<img style="width:14px;position: relative;top: 2px;" src="custom/' + kth_vid + '/img/open-access-icon.png"></img>' +
										'<prm-icon external-link="" icon-type="svg" svg-icon-set="primo-ui" icon-definition="open-in-new" aria-label="externalLink">' +
										'</prm-icon>' +
									//'</a>' +
								'</div>' +
							'</div>' +
						'</div>' +
					'</div>' +
					'</div>'
	});
	
	/*****************************************
	
	prm-full-view-service-container-after
	
	*****************************************/
	
	app.component('prmFullViewServiceContainerAfter', {
			bindings: {parentCtrl: '<'},
			controller: 'prmFullViewServiceContainerAfterController',
			//visa endast på alma-service!
			template: '<div ng-if="$ctrl.parentCtrl.service.title.indexOf(\'alma\')> -1">' +
						'<div class="layout-full-width" ng-if="$ctrl.showOA">' +
							'<div layout="column" layout-align="">' +
								//TODO in i code table i Primo BO(översättning)
								'<h4 class="section-title md-title light-text">' +
									'Open Access' +
								'</h4>' +
								'<md-divider flex></md-divider>' +
							'</div>' +
						'</div>' +
						'<div class="" ng-if="$ctrl.showOA">' +
							'<div class="section-body" layout="row" layout-align="">' +
								'<div class="spaced-rows" layout="column">' +
									//Kiosk ingen länk
									'<div>' +
										//'<a style="color: #0f7d00" target="_new" href="{{$ctrl.best_oa_location_url}}">' +
											'Online open access' +
											'<img style="width:14px;position: relative;top: 2px;" src="custom/' + kth_vid + '/img/open-access-icon.png"></img>' +
											'<prm-icon external-link="" icon-type="svg" svg-icon-set="primo-ui" icon-definition="open-in-new" aria-label="externalLink">' +
											'</prm-icon>' +
										//'</a>' +
									'</div>' +
								'</div>' +
							'</div>' +
						'</div>' +
					  '</div>'
	});

	
	app.controller('prmFullViewServiceContainerAfterController', function ($scope,$mdDialog, $http, kth_oadoi) {
        var vm = this;
		vm.parentCtrl.noaccess = noaccess;
				
		
		function noaccess() {
			$mdDialog.show({
				controller: function controller() {
					return {
						hide: function hide() {
							$mdDialog.hide();
						},
						cancel: function cancel() {
							$mdDialog.cancel();
						}
					};
				},
				controllerAs: '$ctrl',
				template:'<md-dialog id="noaccessdialog" aria-label="No access dialog">' +
							'<md-toolbar class="_md _md-toolbar-transitions">' +
								'<div class="md-toolbar-tools">' +
									'<h2 translate="nui.kth_noaccessheader"></h2>' +
									'<span flex="" class="flex"></span>' +
									'<button class="md-icon-button md-button md-ink-ripple" type="button" ng-click="$ctrl.cancel()">' +
										'<prm-icon icon-type="svg" svg-icon-set="primo-ui" icon-definition="close">'+ 
											'<md-icon md-svg-icon="primo-ui:close" aria-label="icon-close" class="md-primoExplore-theme" aria-hidden="true">' +
											'</md-icon>' +
										'</prm-icon>' +
									'</button>' +
								'</div>' +
							'</md-toolbar>' +
							'<md-dialog-content>'+
								'<div class="md-dialog-content">' + 
									'<div class="md-dialog-content" translate="nui.kth_noaccesstext">' +
									'</div>' + 
								'</div>' +
							'</md-dialog-content>' +
						'</md-dialog>',
				clickOutsideToClose: true,fullscreen: false,escapeToClose: true,focusOnOpen: false
			});
		}
		
		vm.showOA = false;
		//Bevaka (watch) eftersom värdet inte alltid hunnit sättas.
		//träfflista
		if (typeof(vm.parentCtrl.result) != "undefined") {
			$scope.$watch(function() { return vm.parentCtrl.result.delivery; }, function(delivery) {
				if (typeof(delivery) != "undefined") {
					if (typeof(vm.parentCtrl.result.pnx.addata.doi) == "undefined") {
					} else { //visa bara för de som inte har full text(unpaywall önskar max 100 000 uppslag per dag)
						//viewit_NFT – View It services are available, but there is no full text.
						//viewit_getit_NFT – View It and Get It services are available, but there is no full text.
						if (vm.parentCtrl.result.delivery.displayedAvailability == "no_fulltext" || vm.parentCtrl.result.delivery.displayedAvailability == "viewit_NFT" || vm.parentCtrl.result.delivery.displayedAvailability == "viewit_getit_NFT" ) {
							vm.doi = vm.parentCtrl.result.pnx.addata.doi[0] || '';
						}
					}
					if(vm.doi) {	
						kth_oadoi.getoaDOI(vm.doi).then(function(data, status) {
							if (data.data.best_oa_location) {
								vm.best_oa_location_url = data.data.best_oa_location.url;
								vm.best_oa_location_evidence = data.data.best_oa_location.evidence;
								vm.showOA = true;
							} else {
								vm.doi = false;
							}
						});
					}
				}
			});
		}
		//fullpost/servicesida
		if (typeof(vm.parentCtrl.item) != "undefined") {
			//Bara för "almaframen"
			$scope.$watch(function() { return vm.parentCtrl.service; }, function(service) {
				if(service.title.indexOf('alma')>-1 && vm.parentCtrl.service.scrollId.indexOf('getit_link2')<0) {
					$scope.$watch(function() { return vm.parentCtrl.item.delivery; }, function(delivery) {
						if (typeof(delivery) != "undefined") {
							if (typeof(vm.parentCtrl.item.pnx.addata.doi) == "undefined") {
							} else {
								//Visa även för de som har fulltext
								//if (vm.parentCtrl.item.delivery.displayedAvailability == "no_fulltext" || vm.parentCtrl.item.delivery.displayedAvailability == "viewit_NFT" || vm.parentCtrl.item.delivery.displayedAvailability == "viewit_getit_NFT" ) {
									vm.doi = vm.parentCtrl.item.pnx.addata.doi[0] || '';
								//}
							}
							if(vm.doi) {
								kth_oadoi.getoaDOI(vm.doi).then(function(data, status) {
									if (data.data.best_oa_location) {
										vm.best_oa_location_url = data.data.best_oa_location.url;
										vm.best_oa_location_evidence = data.data.best_oa_location.evidence;
										vm.showOA = true;
									} else {
										vm.doi = false;
									}
								});	
							}
						}
					});
				}
			});
		}	
	});
	
	/**********************************************************

	prm-citation-trails-fullview-link-after

	***********************************************************/
	app.component('prmCitationTrailsFullviewLinkAfter', {
		bindings: { parentCtrl: '<'},
		controller: 'prmCitationTrailsFullviewLinkAfterController',
		template: 	''
	});
	
	app.controller('prmCitationTrailsFullviewLinkAfterController',  ['$scope', '$http', function($scope, $http) {
		//Init
		var vm = this;
		
		/********************************************** 
		
		Hämta citations från WOS och Scopus(Elsevier)
		
		**********************************************/
		vm.parentCtrl.wostimesCited = "";
		vm.parentCtrl.scopustimesCited = "";
		
		if(vm.parentCtrl.record.pnx.addata.doi) {
			vm.doi = vm.parentCtrl.record.pnx.addata.doi[0] || '';
			getwos(vm.doi,'wos');
			getwos(vm.doi,'elsevier');
		}
		
		function getwos(doi, source) {
			vm.parentCtrl.wosisLoading = true;
			vm.wosdata = "";
			var method = 'GET';
			var url = 'https://apps.lib.kth.se/alma/wos/wosapi.php?doi=' + doi + '&source=' + source;
			$http({method: method, url: url}).
				then(function(response) {
					var status = response.status;
					var data = response.data;
					if(source == "wos") {
						vm.parentCtrl.wostimesCited = data.wos.timesCited; 
						vm.parentCtrl.woscitingArticlesURL = data.wos.citingArticlesURL;
						vm.parentCtrl.wossourceURL = data.wos.sourceURL;
					} else if (source == "elsevier") {
						vm.parentCtrl.scopustimesCited = data.elsevier.timesCited; 
						vm.parentCtrl.scopuscitingArticlesURL = data.elsevier.citingArticlesURL;
						vm.parentCtrl.scopussourceURL = data.elsevier.sourceURL;
					}
					vm.parentCtrl.wosisLoading = false;
				}, function(response) {
				});
		}
	}]);
	
	/*********************
	
	prm-personal-info-after
	
	*********************/
	
	app.component('prmPersonalInfoAfter', {
		bindings: { parentCtrl: '<'},
		controller: 'prmPersonalInfoAfterController',
		template: 	''
	});
	
	app.controller('prmPersonalInfoAfterController',  ['$scope', '$http', function($scope, $http) {
		var vm = this;
		//Ta bort SMS från personal info (bevaka arrayen och ta bort aktuellt index)
		$scope.$watch(function() { return vm.parentCtrl.phoneNumberSection; }, function(phoneNumberSection) {
			phoneNumberSection.forEach(
				function(item, index) {
					if (item[0].name == "sms_number") {
						phoneNumberSection.splice(index,1);
					}
					if (item[0].name == "sms_authorized") {
						phoneNumberSection.splice(index,1);
					}
				}
			);
		});
	}]);
	
	/*******************
	
	Google Analytics
	
	********************/
	
	(function(i,s,o,g,r,a,m){i['GoogleAnalyticsObject']=r;i[r]=i[r]||function(){
		(i[r].q=i[r].q||[]).push(arguments)},i[r].l=1*new Date();a=s.createElement(o),
		m=s.getElementsByTagName(o)[0];a.async=1;a.src=g;m.parentNode.insertBefore(a,m)
	})(window,document,'script','https://www.google-analytics.com/analytics.js','ga');

	ga('create', 'UA-58303056-2', 'auto');
	ga('send', 'pageview');
	
})();

/****************************
	 
Övriga funktioner 

****************************/

/****************************** 

Skapa en lyssnare för message från frames på sidan.
Använd timeout för att fungera med primos egen.

******************************/
setTimeout(function(){
	window.addEventListener("message", receiveMessagefromalma, false);
}, 2000);

function receiveMessagefromalma(event)
{
	if (event.origin == "https://eu01.alma.exlibrisgroup.com") {
		setTimeout(function(){
			msg = event.data;
			if(msg.type == "licensinfo" && msg.action == "show"){
				//skapa ett licenselement under "primo-explore" och sätt properties för layout etc
				var s = document.createElement('div');
				s.id = "licensinfo_KTH";
				licelement = document.querySelector("primo-explore");
				licelement.appendChild(s).innerHTML=msg.html;
				licelement.appendChild(s).style.padding="10px";
				licelement.appendChild(s).style.borderRadius="10px";
				licelement.appendChild(s).style.color="white";
				licelement.appendChild(s).style.backgroundColor="grey";
				licelement.appendChild(s).style.display="block";
				licelement.appendChild(s).style.position="fixed";
				var x = (msg.screenX) - window.screenX + 20 + 'px', y = (msg.screenY) - window.screenY - 100 + 'px';
				licelement.appendChild(s).style.top= y;
				licelement.appendChild(s).style.left= x;
				licelement.appendChild(s).style.zIndex="9999";
			}else if(msg.type == "licensinfo" && msg.action == "remove"){
				var element = document.getElementById("licensinfo_KTH");
				element.parentNode.removeChild(element);
			}
		}, 50);
	}
}