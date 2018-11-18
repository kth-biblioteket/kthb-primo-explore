var kth_vid = "46KTH_VU1_New"
console.log(kth_vid);

(function () {
    'use strict';
    var app = angular.module('viewCustom', ['angularLoad','ngSanitize','ngMaterial','primo-explore.config']);
	
    /****************************************************************************************************/

        /*In case of CENTRAL_PACKAGE - comment out the below line to replace the other module definition*/

        /*var app = angular.module('centralCustom', ['angularLoad']);*/

    /****************************************************************************************************/
	
	
	/*******************************************************************
	
	Directive som gör att text kan markeras/kopieras på de element som
	har onclick (ange selectable-text på de elementen)
	
	********************************************************************/
	app.directive('selectableText', function($window, $timeout) {
        var i = 0;      
        return {
          restrict: 'A',
          priority:  1,
          compile: function (tElem, tAttrs) {
            var fn = '$$clickOnNoSelect' + i++,
                _ngClick = tAttrs.ngClick;
              
            tAttrs.ngClick = fn + '($event)';
  
            return function(scope) {
              var lastAnchorOffset, lastFocusOffset, timer;
                
              scope[fn] = function(event) {
                var selection    = $window.getSelection(),
                    anchorOffset = selection.anchorOffset,
                    focusOffset  = selection.focusOffset;
  
                if(focusOffset - anchorOffset !== 0) {
                  if(!(lastAnchorOffset === anchorOffset && lastFocusOffset === focusOffset)) {
                    lastAnchorOffset = anchorOffset;
						lastFocusOffset  = focusOffset;
                    if(timer) {
                      $timeout.cancel(timer);
                      timer = null;
                    }
                    return;
                  }
                }
                lastAnchorOffset = null;
                lastFocusOffset  = null;
                timer = $timeout(function() {
                  scope.$eval(_ngClick, {$event: event});  
                  timer = null;
                }, 250);
              };
            };
          }
        };
    });
	
	//Ändra de timeouts som ExLibris har satt
	//Numera parameter i BO
	//Starting from the Primo November 2017 Release, New UI users can define the Session Timeout per view via the Views Wizard General Views Attributes page
	
	app.config(['KeepaliveProvider', 'IdleProvider','$translateProvider', function(KeepaliveProvider, IdleProvider, $translateProvider) {
		//KTHB Primo 60 minuter(eller ska vi ha nån timeout alls??)
		//ingen timeout om man inte är inloggad låter mest logiskt.	
		IdleProvider.idle(3600); //Idle är hur länge man kan vara inaktiv, efter x sekunder visas ExLibris "session upphör..."
		IdleProvider.timeout(3600); //Styr hur lång tid användaren har på sig efter att ha blivit "idle" (att klicka på "håll mig inloggad")
		KeepaliveProvider.interval(7200);
	}]);
	
	/*****************************************
	
	prmExploreMainAfter
		
	*****************************************/
	app.component('prmExploreMainAfter', {
			bindings: {parentCtrl: '<'},
			controller: 'prmExploreMainAfterController',
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
	
	app.controller('prmExploreMainAfterController', function ($compile, $scope, $http,$rootScope,$timeout,$templateCache, $element,Idle,$location,$translate) {
        var vm = this;
		//Citation Styles(men var är dessa egentligen konfigurerade?? 
		//Hittar inte i primo BO, men hämtas här: /primo_library/libweb/webservices/rest/v1/configuration/46KTH_VU1_L)
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
	

	/*****************************************************
	 * 
	 * New 1811XX
	 * 
	 * Egen meny
	 * 
	 ****************************************************/

	app.component('prmSearchBookmarkFilterAfter', {
		bindings: {parentCtrl: '<'},
		controller: 'prmSearchBookmarkFilterAfterController',
		template: 
		'<div layout="row">' +
			//Hjälp
			'<div>' +
				'<md-button aria-label="{{$ctrl.getLibraryCardAriaLabel() | translate}}" class="button-with-icon zero-margin" ng-click="$ctrl.goToHELP()">' +
					'<md-icon class="md-primoExplore-theme" aria-hidden="true" style="">' + 
						'<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" version="1.1" id="Capa_1" width="100%" height="100%" viewBox="0 0 70 70" xml:space="preserve"><path d="M50.859,45.206c-4.799-1.713-9.594-3.426-14.394-5.14c-0.292-1.569-0.567-3.153-0.774-4.741c0.135-0.559,0.188-1.146,0.141-1.75c-0.591-7.523-4.064-13.958-5.971-16.979c2.425-0.926,4.966-2.099,7.619-3.535c0.84-0.455,1.406-1.287,1.525-2.235c0.116-0.947-0.229-1.894-0.938-2.54L29.93,0.812c-1.201-1.104-3.072-1.025-4.175,0.177c-1.104,1.202-1.025,3.071,0.178,4.175l4.987,4.581c-3.637,1.68-6.948,2.751-9.881,3.193c-0.286,0.043-0.548,0.138-0.797,0.253c-0.226,0.001-0.454,0.021-0.683,0.076c-3.2,0.777-6.406,0.337-8.58-1.176C9.445,11.022,8.555,9.51,8.332,7.597c-0.19-1.621-1.657-2.785-3.277-2.594C3.434,5.193,2.272,6.66,2.461,8.28c0.421,3.617,2.198,6.611,5.14,8.66c2.454,1.71,5.604,2.605,8.912,2.605c0.716,0,1.44-0.043,2.165-0.128c0.172,0.743,0.491,1.463,0.98,2.111c0.044,0.06,4.434,6.041,4.975,12.923c0.002,0.026,0.011,0.051,0.014,0.077c-2.554,2.882-4.527,6.245-4.483,10.237c0.053,4.796,3.879,8.294,7.742,10.473c3.988,2.249,7.562-3.878,3.578-6.125c-1.631-0.918-3.997-2.236-4.228-4.348c-0.195-1.77,0.826-3.422,2.022-4.825c0.15,0.865,0.307,1.729,0.459,2.586c0.46,2.604,2.144,3.414,4.402,4.222c4.942,1.767,9.888,3.53,14.828,5.295C53.292,53.587,55.133,46.733,50.859,45.206z"/><circle cx="18.086" cy="5.554" r="5.554"/></svg>' + 
					'</md-icon>' + 
					'<md-tooltip md-delay="">' +
						'<span translate="mainmenu.help"></span>' +
					'</md-tooltip>' + 
					'<span translate="mainmenu.label.help"></span>' +
				'</md-button>' + 
			'</div>' +
			//Databaslistan
			'<div>' +
				'<a class="md-button" aria-label="DB" target="_new" href="{{$ctrl.kth_databaseurl}}">' +
					'<md-icon class="md-primoExplore-theme" aria-hidden="true" style="">' +
						'<svg viewBox="-50 0 1100 1100"><g><path d="M436.7,379.5c229.3,0,415.1-82.7,415.1-184.8C851.8,92.7,666,10,436.7,10C207.4,10,21.6,92.7,21.6,194.8C21.6,296.8,207.4,379.5,436.7,379.5L436.7,379.5z M436.7,571.5c6.1,0,12-0.3,18.1-0.4c39.2-84.7,124.7-143.6,224.2-143.6c48.7,0,93.9,14.3,132.2,38.6c25.8-24.1,40.6-50.9,40.6-79.3V245.4c0,102.1-185.8,184.8-415.1,184.8c-229.3,0-415.1-82.7-415.1-184.8v141.3C21.6,488.8,207.4,571.5,436.7,571.5L436.7,571.5z M436.7,763.4c3.9,0,7.7-0.2,11.6-0.3c-10.6-27.5-16.6-57.2-16.6-88.4c0-18.1,2.1-35.6,5.7-52.6c-0.3,0-0.5,0-0.8,0c-229.3,0-415.1-82.7-415.1-184.8v141.3C21.6,680.8,207.4,763.4,436.7,763.4L436.7,763.4z M610.3,911.9c-56.1-16.2-104.1-51.4-136.1-98.6c-12.4,0.5-24.9,0.8-37.5,0.8c-229.3,0-415.1-82.7-415.1-184.8v141.3c0,102.1,185.8,184.8,415.1,184.8c64.1,0,124.4-6.7,178.6-18.3c-3.4-6.9-5.3-14.5-5.3-22.5C610,913.7,610.2,912.8,610.3,911.9L610.3,911.9z M969.2,913.2L840.4,784.5c-1.2-1.2-2.5-2.3-3.9-3.3c20.7-31.6,32.7-69.3,32.7-109.8c0-110.7-90.1-200.8-200.8-200.8c-110.7,0-200.8,90.1-200.8,200.8c0,110.7,90.1,200.8,200.8,200.8c36.2,0,70.2-9.7,99.6-26.5c1.3,2.3,2.9,4.3,4.8,6.2l128.7,128.7c14.7,14.7,41.8,11.6,60.4-7.1C980.7,955,983.9,927.9,969.2,913.2L969.2,913.2z M523.6,671.5c0-79.9,65-144.8,144.8-144.8c79.9,0,144.9,65,144.9,144.8s-65,144.8-144.9,144.8C588.6,816.3,523.6,751.3,523.6,671.5L523.6,671.5z"></path></g></svg>' +
					'</md-icon>' + 
					'<md-tooltip md-delay="">' +
						'<span translate="mainmenu.tooltip.hitta_mer"></span>' +
					'</md-tooltip>' + 
					'<span translate="mainmenu.label.find_db"></span>'+
				'</a>' + 
			'</div>' +
			//Favoriter/search
			'<div>' +
				'<md-button class="button-with-icon zero-margin" ng-if="!$ctrl.parentCtrl.isFavorites" id="favorites-button" aria-label="Go to my favorites" ng-click="$ctrl.goToFavorites()">' +
					'<prm-icon aria-label="Go to my favorites" icon-type="svg" svg-icon-set="action" icon-definition="ic_favorite_outline_24px">' + 
						'<prm-icon-after parent-ctrl="ctrl"></prm-icon-after>' + 
					'</prm-icon>' + 
					'<md-tooltip md-delay="">' +
						'<span translate="nui.favorites.goFavorites.tooltip"></span>' +
					'</md-tooltip>' + 
					'<span translate="nui.favorites.header"></span>' + 
				'</md-button>' +
				'<md-button class="button-with-icon zero-margin" ng-if="$ctrl.parentCtrl.isFavorites" id="search-button" aria-label="Go to search" ng-click="$ctrl.goToSearch()">' +
					'<prm-icon aria-label="Go to Search" icon-type="svg" svg-icon-set="primo-ui" icon-definition="magnifying-glass">' +  
						'<prm-icon-after parent-ctrl="ctrl"></prm-icon-after>' + 
					'</prm-icon>' + 
					'<md-tooltip md-delay="">' +
						'<span translate="nui.favorites.goSearch.tooltip"></span>' +
					'</md-tooltip>' + 
					'<span translate="nui.search">Search</span>' + 
				'</md-button>' +
			'</div>' +
			//Mitt konto
			'<prm-library-card-menu></prm-library-card-menu>' +
			//Logga in/ut
			'<prm-authentication layout="flex" [is-logged-in]="$ctrl.userName.length > 0"></prm-authentication>' + 
		'</div>'
	});

	app.controller('prmSearchBookmarkFilterAfterController', function ($translate, $rootScope, $location) {
		var vm = this;
		console.log(vm.parentCtrl.isFavorites);

		vm.userName = $rootScope.$$childTail.$ctrl.userSessionManagerService.getUserName();
		
		vm.goToFavorites = goToFavorites;
		function goToFavorites() {
			$location.path( "/favorites" );
		}

		vm.goToSearch = goToSearch;
		function goToSearch() {
			$location.path( "/search" );
		}

		//Anpassa länkar till valt språk
		vm.kth_language = $translate.use();	
		if(vm.kth_language == 'sv_SE') {
			vm.kth_databaseurl = 'https://www.kth.se/kthb/sokverktyg/databaser-och-soktjanster-1.546373';
		} else {
			vm.kth_databaseurl = 'https://www.kth.se/en/kthb/sokverktyg/databaser-och-soktjanster-1.546373';
		}

		vm.goToHELP = goToHELP;
		function goToHELP() {
			if(vm.kth_language == 'sv_SE') {
				window.open('https://www.kth.se/kthb/sokverktyg/sokguider/primo-help-1.614252', 'Help', 'height=800,width=600');
			} else {
				window.open('https://www.kth.se/en/kthb/sokverktyg/sokguider/primo-help-1.614252', 'Help', 'height=800,width=600');
			}
		}

		vm.goToKTHDatabases = goToKTHDatabases;
		function goToKTHDatabases() {
			if(vm.kth_language == 'sv_SE') {
				location.href = 'https://www.kth.se/kthb/sokverktyg/databaser-och-soktjanster-1.546373';
			} else {
				location.href = 'https://www.kth.se/en/kthb/sokverktyg/databaser-och-soktjanster-1.546373';
			}
		}
	});

	/*****************************************************
	 * 
	 * New 1811XX
	 * 
	 * Eget minisidhuvud
	 * 
	 * Språkbyte
	 * 
	 ****************************************************/
	app.component('prmTopBarBefore', {
		bindings: {parentCtrl: '<'},
		controller: 'prmTopBarBeforeController',
		template: 
		//Visa vem som är inloggad / språkbyte
		//skapa tomrummet på sidorna och linjera till höger
		'<div flex="15" flex-md="0" flex-sm="0" flex-xs="0" class="flex-xs-0 flex-sm-0 flex-md-0 flex-15"></div>' +
		'<div flex layout="row" layout-align="end center" ng-if="$ctrl.kth_language == \'en_US\'">' +
			'<div style="padding-bottom: .1em;">Logged in as: {{$ctrl.username}}&nbsp</div>' +
			'<a class="kth_link" ng-click="changelang(\'sv_SE\')">' +
				'<span>Svenska&nbsp</span><svg xmlns="http://www.w3.org/2000/svg" width="20" height="12.5" viewBox="0 0 16 10"><rect width="16" height="10" fill="#005293"/><rect width="2" height="10" x="5" fill="#FECB00"/><rect width="16" height="2" y="4" fill="#FECB00"/></svg>' +
			'</a>' +
		'</div>' +
		'<div flex layout="row" layout-align="end center" ng-if="$ctrl.kth_language == \'sv_SE\'">' +
			'<div style="padding-bottom: .1em;">Inloggad som: {{$ctrl.username}}&nbsp</div>' +
			'<a class="kth_link" ng-click="changelang(\'en_US\')">' +
				'English&nbsp<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 50 30" width="20" height="12"><clipPath id="t"><path d="M25,15 h25 v15 z v15 h-25 z h-25 v-15 z v-15 h25 z"/></clipPath><path d="M0,0 v30 h50 v-30 z" fill="#00247d"/><path d="M0,0 L50,30 M50,0 L0,30" stroke="#fff" stroke-width="6"/><path d="M0,0 L50,30 M50,0 L0,30" clip-path="url(#t)" stroke="#cf142b" stroke-width="4"/><path d="M25,0 v30 M0,15 h50" stroke="#fff" stroke-width="10"/><path d="M25,0 v30 M0,15 h50" stroke="#cf142b" stroke-width="6"/></svg>' +
			'</a>' +
		'</div>' +
		'<div flex="15" flex-md="0" flex-sm="0" flex-xs="0" class="flex-xs-0 flex-sm-0 flex-md-0 flex-15"></div>'
	});

	app.controller('prmTopBarBeforeController', function ($rootScope, $scope, $translate) {
		var vm = this;
		
		//Hämta username att visa i översta sidhuvudet
		vm.username = $rootScope.$$childTail.$ctrl.userSessionManagerService.getUserName();

		//Funktion för att ändra språk 
		vm.kth_language = $translate.use();	
		$scope.changelang = function (langKey) {
			$translate.use(langKey).then((la) => {
				vm.kth_language = la;
			});
		};
	});

	/*****************************************************
	 * 
	 * New 1811XX
	 * 
	 * Byt ut lite ikkonen
	 * 
	 ****************************************************/
	app.component('prmIconAfter', {
		'bindings': { 'parentCtrl': '<' },
		'controller': 'IconAfterController'
	});

	app.controller('IconAfterController', [function() {
		var vm = this;
		// Byt ut pin ikkonen till hjärta.
		var icon = vm.parentCtrl.iconDefinition;
		if (icon === 'prm_pin' || icon === 'prm_unpin') {
		  var icons = {
			'prm_pin': '<svg width="100%" height="100%" viewBox="0 0 24 24" y="1056" xmlns="http://www.w3.org/2000/svg" fit="" preserveAspectRatio="xMidYMid meet" focusable="false"><path d="M16.5 3c-1.74 0-3.41.81-4.5 2.09C10.91 3.81 9.24 3 7.5 3 4.42 3 2 5.42 2 8.5c0 3.78 3.4 6.86 8.55 11.54L12 21.35l1.45-1.32C18.6 15.36 22 12.28 22 8.5 22 5.42 19.58 3 16.5 3zm-4.4 15.55l-.1.1-.1-.1C7.14 14.24 4 11.39 4 8.5 4 6.5 5.5 5 7.5 5c1.54 0 3.04.99 3.57 2.36h1.87C13.46 5.99 14.96 5 16.5 5c2 0 3.5 1.5 3.5 3.5 0 2.89-3.14 5.74-7.9 10.05z"></path></svg>',
			'prm_unpin': '<svg width="100%" height="100%" viewBox="0 0 24 24" y="1032" xmlns="http://www.w3.org/2000/svg" fit="" preserveAspectRatio="xMidYMid meet" focusable="false"><path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"></path></svg>'
		  };
		  var element = vm.parentCtrl.$element[0];
		  element.innerHTML = '<md-icon md-svg-icon="primo-ui:' + icon + '" alt="" class="md-primoExplore-theme" aria-hidden="true">' + icons[icon] + '</md-icon>';
		}
		//Byt ut open actions more-ikkonen till "share"
		if (icon === 'ic_more_horiz_24px') {
			var icons = {
			  'ic_share_24px': '<svg width="100%" height="100%" viewBox="0 0 24 24" id="ic_share_24px" x="120" y="72" xmlns="http://www.w3.org/2000/svg" fit="" preserveAspectRatio="xMidYMid meet" focusable="false"><path d="M18 16.08c-.76 0-1.44.3-1.96.77L8.91 12.7c.05-.23.09-.46.09-.7s-.04-.47-.09-.7l7.05-4.11c.54.5 1.25.81 2.04.81 1.66 0 3-1.34 3-3s-1.34-3-3-3-3 1.34-3 3c0 .24.04.47.09.7L8.04 9.81C7.5 9.31 6.79 9 6 9c-1.66 0-3 1.34-3 3s1.34 3 3 3c.79 0 1.5-.31 2.04-.81l7.12 4.16c-.05.21-.08.43-.08.65 0 1.61 1.31 2.92 2.92 2.92 1.61 0 2.92-1.31 2.92-2.92s-1.31-2.92-2.92-2.92z"></path></svg>'
			};
			var element = vm.parentCtrl.$element[0];
			element.innerHTML = '<md-icon md-svg-icon="social:ic_share_24px" alt="" class="md-primoExplore-theme" aria-hidden="true">' + icons['ic_share_24px'] + '</md-icon>';
		  }
	}]);

	/*****************************************
	
	KTHB Primo rubrik
		
	*****************************************/
	app.component('prmLogoAfter', {
			bindings: {parentCtrl: '<'},
			controller: 'prmLogoAfterController',
			template: 
				'<div>' +
					'<a href="{{$ctrl.parentCtrl.kthb_link}}"><span class="kth-sitenameheader" translate="nui.header.sitename"></span><span ng-if="$ctrl.kth_vid==\'46KTH_VU1_B\'">BETA!!!</span><span style="color:red"> !!!New!!!</span></a>' +
				'</div>'
	});
	
	app.controller('prmLogoAfterController',function ($scope, $translate,$timeout) { 
		var vm = this;
		vm.kth_vid = kth_vid;

		//Se till att länken anpassas till valt språk
		vm.parentCtrl.kthb_link = "https://www.kth.se/en/kthb";
		if($translate.use() == 'sv_SE') {
			vm.parentCtrl.kthb_link = "https://www.kth.se/kthb";
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

	/*****************************************************************
	
	Service för loggning
	
	*****************************************************************/
	app.factory('kth_logg', function ($http) {

		var data = {
		};
		
		data.kthlogg = function(type,info) {
			var method = 'POST';
			var url = 'https://apps.lib.kth.se/webservices/primo/api/v1/systemlog';
			return $http({
				method: method, 
				url: url, 
				headers: {"X-From-ExL-API-Gateway": undefined, 'Content-Type': 'application/json'},
				data: {type: type, info: info}
			});
		};

		return data;
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
	
	app.controller('AuthenticationAfterController', function ($scope, $http, $rootScope, kth_loginservice, kth_session, Idle) {
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
	
	/*****************************************************
	 * 
	 * New 1811XX
	 * 
	 * prm-facet-after
	 * 
	 * Flyttat personalize hit.
	 * 
	 * Egenskaper vid ny sökning, fler resultat(exempelvis 
	 * alla utfällda eller inte vid refresh eller ny sökning)
	 * 
	 *****************************************************/

	app.component('prmFacetAfter', {
		bindings: {parentCtrl: '<'},
		controller: 'prmFacetAfterController',
		template: '<h2 class="sidebar-title" translate="nui.kth_settings"></h2>'
		/*
		//Sortering
		'<div ng-if="$ctrl.parentCtrl.totalResults > 1" class="sidebar-section margin-bottom-small 1compensate-padding-left" layout="row">' +
			'<div layout="row" layout-align="start center" class="section-title">' +
				'<prm-icon class="pin-icon" aria-label="{{\'nui.aria.favorites.pin\' | translate:\'{index: \\\'\'+($ctrl.index)+\'\\\'}\'}}" [icon-type]="::$ctrl.parentCtrl.actionsIcons.pin.type" svg-icon-set="content" icon-definition="ic_sort_24px"></prm-icon>' +
				'<h3 class="section-title-header"><span translate="nui.results.sortby" translate-attr-title="nui.results.sortby.tooltip"></span></h3>' +
				'<prm-search-result-sort-by (sort-by-change)="$ctrl.sortByChange.emit(null)"></prm-search-result-sort-by>' +
			'</div>' +
		'</div>' +
		*/
		//'<prm-personalize-results-button></prm-personalize-results-button>'
		/*
		//material utanför bibblan
		'<div tabindex="-1" ng-if="$ctrl.parentCtrl.showPcAvailability" class="sidebar-section 1margin-top-small 1margin-bottom-small 1compensate-padding-left">' +
		'<md-checkbox ng-model="$ctrl.parentCtrl.pcAvailability" ng-change="$ctrl.parentCtrl.changePcAvailability()" aria-label="{{\'expandresults\' | translate}}">' +
			'<span translate="expandresults"></span>' +
		'</md-checkbox>' +
		'</div>'
		*/
	});
	
	app.controller('prmFacetAfterController', function ($scope, $timeout, kth_facetdata) {
		var vm = this;

		angular.element(document).ready(function() {
			/*********
				 * 
				 * 
				 * Flytta personalize till ovan facetter
				 * 
				 */
				
				var persbutton = document.querySelector('prm-personalize-results-button');
				var facet = document.querySelector('prm-facet .sidebar-inner-wrapper');
				console.log(persbutton);
				console.log(facet);
				facet.appendChild(persbutton);
		});

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
		$scope.$watch(function() { return vm.parentCtrl.primolyticsService.jwtUtilService.getDecodedToken().onCampus; }, function(onCampus) {
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
		
		

		 /**********************************
		
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
			$scope.$watch(function() { return vm.parentCtrl.facetService.results; }, function(facetServiceresults) {
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
				facetServiceresults.forEach( 
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
			}); //slut watch
		});
	
	});	
	
	
	/*****************************************
	
	prm-favorites-toolbar-after
	
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
										'<div>{{$ctrl.orcid_name}} at <a target="_new" href="{{$ctrl.orcid_url}}">ORCID <!--img style="width:48px" src="custom/' + kth_vid + '/img/orcid-logo.png"--></a></div>' +
										'<div ng-if="$ctrl.kthprofile_url">{{$ctrl.orcid_name}} at <a target="_new" href="{{$ctrl.kthprofile_url}}">KTH <!--img style="width:20px" src="custom/' + kth_vid + '/img/KTH_Logotyp_RGB_2013-2.svg"--></a></div>' +
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
						'<span translate="nui.kth_JCR"></span> <a target="_new" href="http://focus.lib.kth.se/login?url=http://gateway.webofknowledge.com/gateway/Gateway.cgi?GWVersion=2&SrcAuth=KTH&SrcApp=KTH_Primo&KeyISSN={{$ctrl.issn}}&DestApp=IC2JCR">JCR</a>' +
					'</div>' +
					//Altmetrics
					'<div class="" ng-if="$ctrl.doi">' +
						'<div class="section-body" layout="row" layout-align="">' +
							'<div class="spaced-rows" layout="column">' +
								'<div ng-if="$ctrl.almetricsscore > 0"><span translate="nui.kth_altmetrics1">Attention score</span> <span class="wostimesCited">{{$ctrl.almetricsscore}}</span> <span translate="nui.kth_altmetrics2">in</span> <a target="_new" href="{{$ctrl.almetricsdetails_url}}"><span translate="nui.kth_altmetrics3">Altmetrics</span>&trade;</a></div>' +
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

	/**********************************************************
	
	prm-search-result-availability-line Träfflista
	
	**********************************************************/
	app.component('prmSearchResultAvailabilityLineAfter', {
		bindings: {parentCtrl: '<'},
		controller: 'prmFullViewServiceContainerAfterController',
		template: '<div ng-if="$ctrl.showOA">' +
					'<div class="">' +
						'<div class="section-body" layout="row" layout-align="">' +
							'<div class="spaced-rows" layout="column">' +
								'<div>' +
									'<a style="color: #0f7d00" target="_new" href="{{$ctrl.best_oa_location_url}}">' +
										'<span>Online open access</span>' +
										'<span ng-if="$ctrl.gold">(Gold/Bronze)</span>' +
										'<span ng-if="$ctrl.greenpublished">(Green published)</span>' +
										'<span ng-if="$ctrl.greenaccepted">(Green accepted)</span>' +
										'<span ng-if="$ctrl.greensubmittedVersion">(Green submitted)</span>' +
										'<img style="width:14px;position: relative;top: 2px;" src="custom/' + kth_vid + '/img/open-access-icon.png"></img>' +
										'<prm-icon external-link="" icon-type="svg" svg-icon-set="primo-ui" icon-definition="open-in-new" aria-label="externalLink">' +
										'</prm-icon>' +
									'</a>' +
									'<span class="tooltip">' +
										'<svg width="20px" height="20px" viewBox="0 0 24 24" id="ic_info_24px" y="1368" xmlns="http://www.w3.org/2000/svg" fit="" preserveAspectRatio="xMidYMid meet" focusable="false"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-6h2v6zm0-8h-2V7h2v2z"></path></svg>' +
										'<span class="tooltiptext tooltip-top">' +
											'<div>Text som möjligen Tage kan ha skrivit!</div>' +
											'<div style="padding-top:10px">{{$ctrl.unpaywalljson | json}}</div>' +
										'</span>' +
									'</span>' +
								'</div>' +
							'</div>' +
						'</div>' +
					'</div>' +
				  '</div>'
});

/*****************************************

prm-full-view-service-container-after Fullpost

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
								'<div>' +
									'<a style="color: #0f7d00" target="_new" href="{{$ctrl.best_oa_location_url}}">' +
										'<span>Online open access</span>' +
										'<span ng-if="$ctrl.gold">(Gold/Bronze)</span>' +
										'<span ng-if="$ctrl.greenpublished">(Green published)</span>' +
										'<span ng-if="$ctrl.greenaccepted">(Green accepted)</span>' +
										'<span ng-if="$ctrl.greensubmittedVersion">(Green submitted)</span>' +
										'<img style="width:14px;position: relative;top: 2px;" src="custom/' + kth_vid + '/img/open-access-icon.png"></img>' +
										'<prm-icon external-link="" icon-type="svg" svg-icon-set="primo-ui" icon-definition="open-in-new" aria-label="externalLink">' +
										'</prm-icon>' +
									'</a>' +
									'<span style="white-space: nowrap;">' + 
										'<div class="tooltip" ng-mouseout="$ctrl.togglepolicy(this)" ng-mouseover="$ctrl.togglepolicy(this)" style="vertical-align: middle; position: relative;display: inline-block;overflow: visible;white-space: initial;">' +
											'<div class="tooltiptext" style="white-space: initial;visibility: hidden;width: 330px;background-color: #8e8e8e;color: #fff;text-align: left;border-radius: 6px;padding: 10px 10px;position: absolute;z-index: 1;bottom: 125%;left: -25px;opacity: 0;transition: opacity 0.4s;">' +
												'<div>Text som möjligen Tage kan ha skrivit!</div>' +
											'</div>' +
											'<svg width="20px" height="20px" viewBox="0 0 24 24" id="ic_info_24px" y="1368" xmlns="http://www.w3.org/2000/svg" fit="" preserveAspectRatio="xMidYMid meet" focusable="false"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-6h2v6zm0-8h-2V7h2v2z"></path></svg>' +
										'</div>' +
									'</span>' +
								'</div>' +
							'</div>' +
						'</div>' +
					'</div>' +
				'</div>'
});

app.controller('prmFullViewServiceContainerAfterController',function ($scope, $http, kth_oadoi, kth_logg) {
	var vm = this;
	vm.unpaywalljson = "";
	vm.showOA = false;
	vm.gold = false;
	vm.greenpublished = false;
	vm.greenaccepted = false;

	vm.togglepolicy = togglepolicy;
	function togglepolicy(element) {
		if (element.querySelector(".tooltiptext").style.visibility == "hidden") {
			element.querySelector(".tooltiptext").style.visibility = "visible";
			element.querySelector(".tooltiptext").style.opacity = "1";
		} else {
			element.querySelector(".tooltiptext").style.visibility = "hidden";
			element.querySelector(".tooltiptext").style.opacity = "0";
		}
	}
	//Bevaka (watch) eftersom värden inte alltid hunnit sättas.
	//träfflista
	if (typeof(vm.parentCtrl.result) != "undefined") {
		$scope.$watch(function() { return vm.parentCtrl.result.delivery; }, function(delivery) {
			if (typeof(delivery) != "undefined") {
				if (typeof(vm.parentCtrl.result.pnx.addata.doi) == "undefined") {
				} else { //visa bara för de som inte har full text(unpaywall önskar max 100 000 uppslag per dag, vi verkar generera ca 15-25000 per dag)
					//viewit_NFT – View It services are available, but there is no full text.
					//viewit_getit_NFT – View It and Get It services are available, but there is no full text.
					//if (vm.parentCtrl.result.delivery.displayedAvailability == "no_fulltext" || vm.parentCtrl.result.delivery.displayedAvailability == "viewit_NFT" || vm.parentCtrl.result.delivery.displayedAvailability == "viewit_getit_NFT" ) {
						vm.doi = vm.parentCtrl.result.pnx.addata.doi[0] || '';
					//}
				}
				if(vm.doi) {
					kth_logg.kthlogg("oaDOIfromunpaywall", vm.doi);	
					kth_oadoi.getoaDOI(vm.doi).then(function(data, status) {
						if (data.data.best_oa_location) {
							vm.unpaywalljson = data.data.best_oa_location;
							vm.best_oa_location_url = data.data.best_oa_location.url;
							vm.best_oa_location_evidence = data.data.best_oa_location.evidence;
							//Hantera att OA kan ha lite olika typer av publicerat material
								//guld/bronze villkor:
									//best_oa_location.host_type = publisher
								//"grön" villkor
								//acceptedVersion
									//best_oa_location.host_type == repository && version = acceptedVersion
								//publishedVersion
									//best_oa_location.host_type == repository && version = publishedVersion
								//submittedVersion
									//best_oa_location.host_type == repository && version = submittedVersion
							
							if(data.data.best_oa_location.host_type == 'publisher') {
								vm.gold = true;
							}
							if(data.data.best_oa_location.host_type == "repository" && data.data.best_oa_location.version == 'publishedVersion') {
								vm.greenpublished = true;
							}
							if(data.data.best_oa_location.host_type == "repository" && data.data.best_oa_location.version == 'acceptedVersion') {
								vm.greenaccepted = true;
							}
							if(data.data.best_oa_location.host_type == "repository" && data.data.best_oa_location.version == 'submittedVersion') {
								vm.greensubmittedVersion = true;
							}
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
							kth_logg.kthlogg("oaDOIfromunpaywall", vm.doi);
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
		//Ta bort SMS från personal info (bevaka arrayen och ta bort aktuella index)
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