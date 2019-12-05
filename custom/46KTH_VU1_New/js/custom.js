var kth_vid = "46KTH_VU1_New"
console.log(kth_vid);

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
	 * Egen meny(knappar)
	 * 
	 ****************************************************/

	app.component('prmSearchBookmarkFilterAfter', {
		bindings: {parentCtrl: '<'},
		controller: 'prmSearchBookmarkFilterAfterController',
		template: 
		'<div layout="row" class="kth_menu">' +
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
					'<!--md-tooltip md-delay="">' +
						'<span translate="nui.favorites.goFavorites.tooltip"></span>' +
					'</md-tooltip-->' + 
					'<span translate="nui.favorites.header"></span>' + 
				'</md-button>' +				
				'<md-button class="button-with-icon zero-margin" ng-if="$ctrl.parentCtrl.isFavorites" id="search-button" aria-label="Go to search" ng-click="$ctrl.goToSearch()">' +
					'<prm-icon aria-label="Go to Search" icon-type="svg" svg-icon-set="primo-ui" icon-definition="magnifying-glass">' +  
						'<prm-icon-after parent-ctrl="ctrl"></prm-icon-after>' + 
					'</prm-icon>' + 
					'<!--md-tooltip md-delay="">' +
						'<span translate="nui.favorites.goSearch.tooltip"></span>' +
					'</md-tooltip-->' + 
					'<span translate="nui.search">Search</span>' + 
				'</md-button>' +
			'</div>' +
			//Mitt konto
			'<prm-library-card-menu></prm-library-card-menu>' +
			//Logga in/ut
			'<prm-authentication layout="flex" [is-logged-in]="$ctrl.userName.length > 0"></prm-authentication>' + 
		'</div>'
	});

	app.controller('prmSearchBookmarkFilterAfterController', function ($translate, $rootScope, $location, $timeout, kth_searchurl) {
		var vm = this;

		vm.userName = $rootScope.$$childTail.$ctrl.userSessionManagerService.getUserName();
		
		vm.goToFavorites = goToFavorites;
		vm.goToHELP = goToHELP;
		vm.goToKTHDatabases = goToKTHDatabases;

		function goToFavorites() {
			$location.path( "/favorites")
		}

		vm.goToSearch = goToSearch;
		function goToSearch() {
			//$location.path( "/search" );
			location.href=kth_searchurl.getData();
		}

		//Anpassa länkar till valt språk
		vm.kth_language = $translate.use();	
		if(vm.kth_language == 'sv_SE') {
			vm.kth_databaseurl = 'https://www.kth.se/biblioteket/soka-vardera/sok-information/databaser-och-soktjanster-1.851404';
		} else {
			vm.kth_databaseurl = 'https://www.kth.se/en/biblioteket/soka-vardera/sok-information/databaser-och-soktjanster-1.851404';
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
			'<div style="padding-bottom: .1em;" ng-if="$ctrl.username.length > 0">Logged in as: {{$ctrl.username}}&nbsp</div>' +
			'<a class="kth_link" ng-click="changelang(\'sv_SE\')">' +
				'<span>Svenska&nbsp</span>' +
				//'<svg xmlns="http://www.w3.org/2000/svg" width="20" height="12.5" viewBox="0 0 16 10"><rect width="16" height="10" fill="#005293"/><rect width="2" height="10" x="5" fill="#FECB00"/><rect width="16" height="2" y="4" fill="#FECB00"/></svg>' +
				'<img style="position: relative;top: 2px;width: 16px" src="custom/' + kth_vid + '/img/globe-lang.svg"></img>' + 
			'</a>' +
		'</div>' +
		'<div flex layout="row" layout-align="end center" ng-if="$ctrl.kth_language == \'sv_SE\'">' +
			'<div style="padding-bottom: .1em;" ng-if="$ctrl.username.length > 0">Inloggad som: {{$ctrl.username}}&nbsp</div>' +
			'<a class="kth_link" ng-click="changelang(\'en_US\')">' +
				'<span>English&nbsp</span>' +
				//'<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 50 30" width="20" height="12"><clipPath id="t"><path d="M25,15 h25 v15 z v15 h-25 z h-25 v-15 z v-15 h25 z"/></clipPath><path d="M0,0 v30 h50 v-30 z" fill="#00247d"/><path d="M0,0 L50,30 M50,0 L0,30" stroke="#fff" stroke-width="6"/><path d="M0,0 L50,30 M50,0 L0,30" clip-path="url(#t)" stroke="#cf142b" stroke-width="4"/><path d="M25,0 v30 M0,15 h50" stroke="#fff" stroke-width="10"/><path d="M25,0 v30 M0,15 h50" stroke="#cf142b" stroke-width="6"/></svg>' +
				'<img style="position: relative;top: 2px;width: 16px" src="custom/' + kth_vid + '/img/globe-lang.svg"></img>' + 
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
	 * Log in to save query
	 * 
	 * Knapp att visa ovanför sökresultat 
	 * när användaren inte är inloggad
	 * 
	 * 
	 ****************************************************/

	app.component('prmPersonalizeResultsButtonAfter', {
		bindings: {parentCtrl: '<'},
		controller: 'prmPersonalizeResultsButtonAfterController',
		template: 
		'<div class="kth_loggain" ng-if="!$ctrl.userName.length > 0">' +
			//logga in för att spara fråga etc
			'<button class="button-as-link link-alt-color zero-margin md-button md-primoExplore-theme md-ink-ripple" type="button" (click)="$ctrl.loggain()" aria-label="">' +
				'<prm-icon class="pin-icon" aria-label="Välj register " [icon-type]="::$ctrl.actionsIcons.pin.type" svg-icon-set="action" icon-definition="ic_favorite_outline_24px">' +
				'</prm-icon>' +
				//nytt värde i FE code table i Primo BO
				'<span class="bold-text" translate="results.logintosavequery"></span>' +
				'<div class="md-ripple-container"></div>' +
			'</button>' +
		'</div>'
	});

	app.controller('prmPersonalizeResultsButtonAfterController', function (kth_loginservice,$rootScope) {
		var vm = this;

		try {
			vm.userName = $rootScope.$$childTail.$ctrl.userSessionManagerService.getUserName();
		} catch(error) {
			console.log("error: " + error);
		}
		vm.isfavorites = vm.parentCtrl.isFavorites;
		if (!vm.isfavorites) {
			//hämta loginfunktion
			vm.data = kth_loginservice.getData();
		}
		vm.loggain = loggain;
		function loggain() {
			vm.data.handleLogin();
		}
	});

	/*****************************************************
	 * 
	 * New 1811XX
	 * 
	 * Byt ut lite ikkonens
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

		//Byt ut my account-ikkonen till person
		if (icon === 'account-card-details') {
			var icons = {
			  'ic_person_24px': '<svg width="100%" height="100%" viewBox="0 0 24 24" id="ic_person_24px" x="96" xmlns="http://www.w3.org/2000/svg" fit="" preserveAspectRatio="xMidYMid meet" focusable="false"><path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"></path></svg>'
			};
			var element = vm.parentCtrl.$element[0];
			element.innerHTML = '<md-icon md-svg-icon="social:ic_person_24px" alt="" class="md-primoExplore-theme" aria-hidden="true">' + icons['ic_person_24px'] + '</md-icon>';
			
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
					'<a href="{{$ctrl.parentCtrl.kthb_link}}"><span class="kth-sitenameheader" translate="nui.header.sitename"></span><span style="color:salmon" ng-if="$ctrl.kth_vid==\'46KTH_VU1_B\'">BETA!!!</span><span style="color:red"> !!!New!!!</span></a>' +
				'</div>'
	});
	
	app.controller('prmLogoAfterController',function ($scope, $translate,$timeout,$location) { 
		var vm = this;
		vm.kth_vid = kth_vid;

		//Se till att länken anpassas till valt språk
		vm.parentCtrl.kthb_link = "https://www.kth.se/en/biblioteket";
		if($translate.use() == 'sv_SE') {
			vm.parentCtrl.kthb_link = "https://www.kth.se/biblioteket";
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
	
	Service som lagrar aktuell searchurl
	
	*****************************************************************/
	app.service('kth_searchurl', function() {
		
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
			allfacetscollapsed: true, //True default?
			currenttevelpeerreview: null
		};

		return {
			getallfacetscollapsed: function () {
				return data.allfacetscollapsed;
			},
			setallfacetscollapsed: function (allfacetscollapsed) {
				data.allfacetscollapsed = allfacetscollapsed;
			},
			getcurrenttevelpeerreview: function () {
				return data.currenttevelpeerreview;
			},
			setcurrenttevelpeerreview: function (currenttevelpeerreview) {
				data.currenttevelpeerreview = currenttevelpeerreview;
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
	
	Service för loggning till databas
	
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
			template:``
	});
	
	app.controller('AuthenticationAfterController', function ($rootScope, kth_loginservice, kth_session) {
        var vm = this;
		var session = vm.parentCtrl.primolyticsService.userSessionManagerService;	

		//spara loginfunktion i service som sen kan hämtas från controllers
		kth_loginservice.addData(vm.parentCtrl);
		$rootScope.$broadcast('logindataAdded', vm.parentCtrl);
		
		//spara session i service som sen kan hämtas från controllers
		kth_session.addData(session);
		$rootScope.$broadcast('sessiondataAdded', session);
	});

	

	/*****************************************************
	 * 
	 * New 1906XX
	 * 
	 * prmSearchResultSortByAfter
	 * 
	 * 
	 * Sticky facets/scrolla med sidan
	 * 
	 *  
	 *****************************************************/

	app.component('prmSearchResultSortByAfter', {
		bindings: {parentCtrl: '<'},
		controller: 'prmSearchResultSortByAfterController',
		/*template: `<md-checkbox ng-model="$ctrl.stickyfacets" ng-change="$ctrl.togglestickyfacets();" aria-label="{{\'stickyfacets\' | translate}}">
						<span translate="Sticky">Sticky</span>
					</md-checkbox>`*/
	});

	app.controller('prmSearchResultSortByAfterController', function (kth_facetdata) {
		var vm = this;
		vm.stickyfacets = false;
		vm.togglestickyfacets = togglestickyfacets;
		function togglestickyfacets() {
			if (vm.stickyfacets) {
				//Lägg till class så facetter scrollar med sidan
				var myEl = document.querySelector( 'prm-facet .primo-scrollbar' );
				myEl.classList.add("kth-facet-notsticky");
			} else {
				//Ta bort class så facetter inte scrollar med sidan
				var myEl = document.querySelector( 'prm-facet .primo-scrollbar' );
				myEl.classList.remove("kth-facet-notsticky");
			}
		}
	});
	
	/*****************************************************
	 * 
	 * prm-facet-after
	 * 
	 * 
	 *****************************************************/

	app.component('prmFacetAfter', {
		bindings: {parentCtrl: '<'},
		controller: 'prmFacetAfterController',
		/*template: `<md-button aria-label="show/collapse facets" ng-click="$ctrl.togglefacets()" style="display:flex;width: 100%;" tabindex="-1" class="section-title sidebar-section margin-top-small compensate-padding-left">
						<h2 flex="90" class="sidebar-title margin-bottom-zero" translate="nui.facets.title" style="font-size: 1.6em;text-align:left" ></h2>
						<!--veckla ut/ihop facetter, text i st f ikkonen?
						TODO in i code table i Primo BO(översättning)-->
						<span ng-if="$ctrl.allfacetscollapsed">Expand all facets</span>
						<span ng-if="!$ctrl.allfacetscollapsed">Collapse all facets</span>
						<prm-icon style="align-self: flex-end;padding-left: 5px" icon-type="svg" svg-icon-set="primo-ui" icon-definition="expand-list" class="rotate-180"></prm-icon>
						<!--prm-icon style="align-self: flex-end;"icon-type="svg" svg-icon-set="primo-ui" icon-definition="chevron-up" ng-class="{\'rotate-180\': $ctrl.allfacetscollapsed}"></prm-icon-->
					</md-button>`
					*/
	});
	
	app.controller('prmFacetAfterController', function ($scope, $timeout, kth_facetdata) {
		var vm = this;
		//hämta parameter från factory kth_facetdata för defaultvärde
		vm.allfacetscollapsed = kth_facetdata.getallfacetscollapsed()
		
		//Definiera funktion som togglar facetter(ut- eller ihopfällda) så den kan anropas från knapp/rubrik i prm-facet
		vm.togglefacets = togglefacets
		function togglefacets() {
			if (kth_facetdata.getallfacetscollapsed()) {
				vm.allfacetscollapsed = false;
				kth_facetdata.setallfacetscollapsed(false);
			} else {
				vm.allfacetscollapsed = true;
				kth_facetdata.setallfacetscollapsed(true);
			}
			vm.parentCtrl.facetService.results.forEach(
				function(item, index) {
					if (vm.allfacetscollapsed) {
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

		// Kollapsad eller inte (default = true?, exlibrisdefault = false)
		vm.parentCtrl.facetGroup.facetGroupCollapsed = false;

		//Spara undan värdet för tlevel-fasetten i factoryvariabel
		if(vm.parentCtrl.facetGroup.name == "tlevel") {
			kth_facetdata.setcurrenttevelpeerreview(vm.parentCtrl.facetGroup);
		}

		if(vm.parentCtrl.facetGroup.name == "rtype") {
			vm.parentCtrl.facetGroup.facetGroupCollapsed = false;
			vm.parentCtrl.facetGroup.values.forEach(function(element,index,object) {
				if(element.value == "articles") {
					//Ta bort article ur "Material Type"-fasetten
					object.splice(index, 1);
					kth_facetdata.getcurrenttevelpeerreview().values.forEach(function(element) {
						if(element.value == "peer_reviewed") {
							//Lägg till "peer reviewed" till "Material Type"-fasetten(rtype)
							vm.parentCtrl.facetGroup.values.push(element);
						};
					})
		
				};
			});
			//Sortera fasetten så den med högst count hamnar överst
			vm.parentCtrl.facetGroup.values.sort(function(a, b){return b.count - a.count});
		}
	});
	
	/*****************************************
	
	prm-search-bar-after
		
	*****************************************/
	app.component('prmSearchAfter', {
			bindings: {parentCtrl: '<'},
			controller: 'prmSearchAfterController',
			template: `<!--Infotext som vi själva lägger in i Primo BO
			hämta translate-texten i controller för prm-search-after för att användas som villkor?-->
			<div class="kth_alertbarwrapper" ng-class="!$ctrl.mediaQueries.xs  ? \'1kth_sidepadding\' : \'\' " ng-cloak ng-if="$ctrl.kthinfotext!=\'0\' && $ctrl.showkthinfomessage!=false">
				<div flex="15" flex-md="0" flex-sm="0" flex-xs="0"></div>
				<div style="display:flex" flex ng-cloak layout="column" layout-align="center start" class="bar alert-bar kthinfotext">
					<!--Texten nedan ändras via Primo BO: nui.kth_infotext-->
					<div layout="row" layout-align="center center">
						<span class="bar-text" translate="nui.kth_infotext"></span>
						<md-divider></md-divider>
						<md-button aria-label="{{::(\'nui.message.dismiss\' | translate)}}" (click)="$ctrl.dismisskthinfo()" class="dismiss-alert-button zero-margin" ng-class="ctrl.mediaQueries.xs ? \'md-icon-button\' : \'button-with-icon\' ">
							<prm-icon aria-label="{{::(\'nui.message.dismiss\' | translate)}}" icon-type="svg" svg-icon-set="navigation" icon-definition="ic_close_24px">
								<md-icon md-svg-icon="navigation:ic_close_24px" aria-label="{{::(\'nui.message.dismiss\' | translate)}}" class="md-primoExplore-theme" aria-hidden="true"><svg width="100%" height="100%" viewBox="0 0 24 24" id="ic_close_24px_cache52" y="240" xmlns="http://www.w3.org/2000/svg" fit="" preserveAspectRatio="xMidYMid meet" focusable="false"><path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z"></path></svg></md-icon>
							</prm-icon>
							<span translate="nui.message.dismiss" hide-xs></span>
						</md-button>
					</div>
				</div>
				<div flex="15" flex-md="0" flex-sm="0" flex-xs="0"></div>
			</div>
			<!--Avdelare mellan alerts (showcampusmessage = om man klickat på "dismiss")-->
			<md-divider ng-if="!$ctrl.userName_kth.length > 0 && $ctrl.kthinfotext!=\'0\' && $ctrl.showcampusmessage!=false && $ctrl.showkthinfomessage!=false"></md-divider>
			<!--inte på campus-->
			<!--ändra texten i BO "nui.kth_notoncampus"-->
			<!-- Använd BO signin-message och villkoren där istället. -->
			<!--div class="kth_alertbarwrapper" ng-class="!$ctrl.mediaQueries.xs  ? \'1kth_sidepadding\' : \'\' " ng-cloak ng-if="!$ctrl.kthisoncampus && !$ctrl.userName_kth.length > 0 && $ctrl.showcampusmessage!=false">
				<div flex="15" flex-md="0" flex-sm="0" flex-xs="0"></div>
				<div style="display:flex" flex ng-cloak layout="column" layout-align="center start" class="bar alert-bar">
					<div layout="row" layout-align="center center">
						<span ng-if="!$ctrl.kthisoncampus" class="bar-text" translate="nui.kth_notoncampus"></span>
						<prm-authentication [is-logged-in]="$ctrl.userName_kth.length > 0"></prm-authentication>
						<md-divider></md-divider>
						<md-button aria-label="{{::(\'nui.message.dismiss\' | translate)}}" (click)="$ctrl.dismisscampusmessage()" class="dismiss-alert-button zero-margin" ng-class="ctrl.mediaQueries.xs ? \'md-icon-button\' : \'button-with-icon\' ">
							<prm-icon aria-label="{{::(\'nui.message.dismiss\' | translate)}}" icon-type="svg" svg-icon-set="navigation" icon-definition="ic_close_24px">
								<md-icon md-svg-icon="navigation:ic_close_24px" aria-label="{{::(\'nui.message.dismiss\' | translate)}}" class="md-primoExplore-theme" aria-hidden="true"><svg width="100%" height="100%" viewBox="0 0 24 24" id="ic_close_24px_cache52" y="240" xmlns="http://www.w3.org/2000/svg" fit="" preserveAspectRatio="xMidYMid meet" focusable="false"><path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z"></path></svg></md-icon>
							</prm-icon>
							<span translate="nui.message.dismiss" hide-xs></span>
						</md-button>
					</div>
				</div>
				<div flex="15" flex-md="0" flex-sm="0" flex-xs="0"></div>
			</div-->`
	});
	
	app.controller('prmSearchAfterController', function ($scope,$location,$rootScope,kth_currenturl,kth_searchurl, kth_loginservice,$timeout,$templateCache, $translate, $http, $sce) {
		var vm = this;
		vm.kthinfotext = '0';
		
		/*****
		 * 
		 * Aktuell sökurl
		 */
		kth_searchurl.addData($location.absUrl());
		$rootScope.$broadcast('searchurldataAdded', $location.absUrl());

		/******************************************************
		 
		
		kthinfotext som ska visas vid fel eller annan info
		Lägg in i BO när det är aktuellt
		
		******************************************************/
		$translate('nui.kth_infotext').then(function (translation) {
			vm.kthinfotext = translation;
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
		vm.kthisoncampus = false;
		$scope.$watch(function() { 
				return $rootScope.$$childTail.$ctrl.jwtUtilService.getDecodedToken().onCampus; 
			}, function(onCampus) {
				//console.log(onCampus);
		});

		vm.userName_kth = $rootScope.$$childTail.$ctrl.userSessionManagerService.getUserName();
		/***************************************************************** 
		Använd getDecodedToken().onCampus istället??
		Anpassning för att kolla om man sitter på campus via ipadress 
		Primo Home > Ongoing Configuration Wizards > Institution Wizard > Edit IPs for "46KTH Royal Institute of Technology"
		Klientens IP-nummer hämtas via php-script på KTHB apps-server
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
		//Använd BO signin-message och villkoren där istället.
		//getclientip();
		function getclientip() {
			var method = 'GET';
			var url = "https://apps.lib.kth.se/primo/ip.php";
			$http.defaults.headers.post["Content-Type"] = "text/plain";
			$http({method: method, url: url}).
			then(function(response) {
				client_ip = response.data.ip;
				//Kolla mot alla ipintervall som är uppsatta i Primo BO
				if(check_if_in_iprange('130.237.202.0', '130.237.203.255', client_ip)) {
					vm.kthisoncampus = true;
				}
				//eduroam
				else if(check_if_in_iprange('130.229.128.0', '130.229.191.255', client_ip)) {
					vm.kthisoncampus = true;
				} 
				else if(check_if_in_iprange('130.237.206.0', '130.237.206.255', client_ip)) {
					vm.kthisoncampus = true;
				} 
				else if(check_if_in_iprange('130.237.1.0', '130.237.84.255', client_ip)) { 
					vm.kthisoncampus = true;
				}
				else if(check_if_in_iprange('130.237.209.0', '130.237.216.255', client_ip)) {
					vm.kthisoncampus = true;
				} 
				else if(check_if_in_iprange('130.237.218.0', '130.237.236.255', client_ip)) {
					vm.kthisoncampus = true;
				} 
				else if(check_if_in_iprange('130.237.238.0', '130.237.238.255', client_ip)) {
					vm.kthisoncampus = true;
				} 
				else if(check_if_in_iprange('130.237.250.0', '130.237.251.255', client_ip)) {
					vm.kthisoncampus = true;
				} 
				else if(check_if_in_iprange('192.16.124.0', '192.16.125.255', client_ip)) {
					vm.kthisoncampus = true;
				} 
				else if(check_if_in_iprange('192.16.127.0', '192.16.127.255', client_ip)) {
					vm.kthisoncampus = true;
				} 
				else if(check_if_in_iprange('193.10.156.0', '193.10.159.255', client_ip)) {
					vm.kthisoncampus = true;
				} 
				else if(check_if_in_iprange('193.10.37.0', '193.10.39.255', client_ip)) {
					vm.kthisoncampus = true;
				} 
				else if(check_if_in_iprange('90.152.114.170', '90.152.114.170', client_ip)) {
					vm.kthisoncampus = true;
				}
				else {
					vm.kthisoncampus = false;
				}
			});
		};
		
		/****************************************************************
		
		Spara dismiss-statusar(att dölja alerten) i rootscope 
		så meddelandet inte visas förrän vid en "refresh"
		
		****************************************************************/
		vm.dismisscampusmessage = dismisscampusmessage;
		vm.showcampusmessage = $rootScope.showcampusmessage;
		function dismisscampusmessage() {
			$rootScope.showcampusmessage = false;
			vm.showcampusmessage = $rootScope.showcampusmessage;
		}
		vm.dismisskthinfo = dismisskthinfo;
		vm.showkthinfomessage = $rootScope.showkthinfomessage;
		function dismisskthinfo() {
			$rootScope.showkthinfomessage = false;
			vm.showkthinfomessage = $rootScope.showkthinfomessage;
		}
	});
	
	/*****************************************
	
	prm-login-alma-mashup-after

		Kolla om det är tryckt material 
		så anpassningar kan göras för 
		login-banner på fullposten
	
	*****************************************/
	
	app.component('prmLoginAlmaMashupAfter', {
			bindings: {parentCtrl: '<'},
			controller: 'prmLoginAlmaMashupAfterController',
			template: 
			`<div ng-if="$ctrl.userName.length <= 0 && $ctrl.requestlogin">
				<md-button ng-click="$ctrl.loggain();" aria-label="{{\'eshelf.signin.title\' | translate}}" class="button-with-icon zero-margin">
					<prm-icon icon-type="svg" svg-icon-set="primo-ui" icon-definition="sign-in"></prm-icon>
					<span ng-if="!$ctrl.requestlogin" translate="eshelf.signin.title"></span>
					<span ng-if="$ctrl.requestlogin" translate="getit.signin_link.sign_in"></span>
				</md-button>
			</div>`
	});
	
	app.controller('prmLoginAlmaMashupAfterController',function ($rootScope, $scope, kth_loginservice) {
		var vm = this;
		if (typeof($rootScope.$$childTail.$ctrl.primolyticsService) != 'undefined') {
			vm.userName = $rootScope.$$childTail.$ctrl.primolyticsService.userSessionManagerService.getUserName();
		}
		if (typeof($rootScope.$$childTail.$ctrl.userSessionManagerService) != 'undefined') {
			vm.userName = $rootScope.$$childTail.$ctrl.userSessionManagerService.getUserName();
		}
		
		vm.requestlogin = false;
		
		vm.data = kth_loginservice.getData();
		vm.loggain = loggain;
		function loggain() {
			vm.data.handleLogin();
		}

		if ($scope.$parent.$parent.$parent.$parent.$ctrl.service.linkElement.category == "Alma-P") {
			vm.parentCtrl.loginalmap = true;
			vm.requestlogin = true;
		} else {
			var myEl = document.querySelector( 'prm-login-alma-mashup .alert-bar' );
			myEl.classList.add("kth-hide");
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
			`<div ng-if="!$ctrl.isfavorites && $ctrl.showfacets">
				<div id="facettmenudiv">
					<ul id="facettmenu">
						<li ng-if="$ctrl.physical_item_enabled">
							<a href="{{$ctrl.absUrl + $ctrl.physical_item}}" translate="facets.facet.tlevel.physical_item"></a>&nbsp;<span ng-if="$ctrl.physical_item_enabled">({{$ctrl.physical_item_nr}})</span>
							</li>
						<li ng-if="!$ctrl.physical_item_enabled" translate="facets.facet.tlevel.physical_item"></li>&nbsp;|&nbsp;
						<li ng-if="$ctrl.online_resources_enabled">
							<a href="{{$ctrl.absUrl + $ctrl.online_resources}}" translate="facets.facet.tlevel.online_resources"></a>&nbsp;<span ng-if="$ctrl.online_resources_enabled">({{$ctrl.online_resources_nr}})</span>
						</li>
						<li ng-if="!$ctrl.online_resources_enabled" translate="facets.facet.tlevel.online_resources"></li>&nbsp;|&nbsp;
						<li ng-if="$ctrl.books_enabled">
							<a ng-if="$ctrl.books_enabled" href="{{$ctrl.absUrl + $ctrl.books}}" translate="facets.facet.facet_rtype.books"></a>&nbsp;<span ng-if="$ctrl.books_enabled">({{$ctrl.books_nr}})</span>
						</li>
						<li ng-if="!$ctrl.books_enabled" translate="facets.facet.facet_rtype.books"></li>&nbsp;|&nbsp;
						<li ng-if="$ctrl.journals_enabled">
							<a href="{{$ctrl.absUrl + $ctrl.journals}}" translate="facets.facet.facet_rtype.journals"></a>&nbsp;<span ng-if="$ctrl.journals_enabled">({{$ctrl.journals_nr}})</span>
							</li>
						<li ng-if="!$ctrl.journals_enabled" translate="facets.facet.facet_rtype.journals"></li>&nbsp;|&nbsp;
						<li ng-if="$ctrl.bibldbfasett_enabled">
							<a href="{{$ctrl.absUrl + $ctrl.bibldbfasett}}" translate="facets.facet.facet_rtype.bibldbfasett"></a>&nbsp;<span ng-if="$ctrl.bibldbfasett_enabled">({{$ctrl.bibldbfasett_nr}})</span>
						</li>
						<li ng-if="!$ctrl.bibldbfasett_enabled" translate="facets.facet.facet_rtype.bibldbfasett"></li>&nbsp;|&nbsp;
						<li ng-if="$ctrl.articles_enabled">
							<a href="{{$ctrl.absUrl + $ctrl.articles}}" translate="facets.facet.facet_rtype.articles"></a>&nbsp;<span ng-if="$ctrl.articles_enabled">({{$ctrl.articles_nr}})</span>
						</li>
						<li ng-if="!$ctrl.articles_enabled" translate="facets.facet.facet_rtype.articles"></li>
					</ul>
				</div>
			</div>
			<div tabindex="-1" ng-if="$ctrl.parentCtrl.searchResults.length == 0 && $ctrl.screenIsSmall" class="margin-medium">
				<md-checkbox ng-model="$ctrl.pcAvailability" ng-change="$ctrl.expandsearchoutsidelibrary();" aria-label="{{\'expandresults\' | translate}}">
					<span translate="expandresults"></span>
				</md-checkbox>
			</div>`					
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
			vm.pcAvailability = false;
		} else {
			vm.searchObject.pcAvailability == 'true' ? vm.pcAvailability=true: vm.pcAvailability=false;
		}
		vm.expandsearchoutsidelibrary = expandsearchoutsidelibrary;
		
		//Kolla om skärmen är liten.
		$scope.$watch(function() { return $mdMedia('max-width: 960px'); }, function(small) {
			vm.screenIsSmall = small;
		});
		
		function expandsearchoutsidelibrary() {
			let mode = vm.pcAvailability ? 'true': 'false';
			//"$location.search" ändrar parametrar i URL:en
			$location.search('pcAvailability', mode);
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
									/*
									if (value.value == 'peer_reviewed') {
										vm.articles_enabled = true;
										vm.articles_nr = value.count.toLocaleString();
									}
									*/
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
									if (value.value == 'articles') {
										vm.articles_enabled = true;
										vm.articles_nr = value.count.toLocaleString();
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
				/*
				if (vm.absUrl.indexOf("facet=tlevel,include,peer_reviewed")=== -1) {
					vm.articles = "&facet=tlevel,include,peer_reviewed";
				}
				*/
				if (vm.absUrl.indexOf("facet=rtype,include,books")=== -1) {
					vm.books = "&facet=rtype,include,books";
				}
				if (vm.absUrl.indexOf("facet=rtype,include,journals")=== -1) {
					vm.journals = "&facet=rtype,include,journals";
				}
				if (vm.absUrl.indexOf("facet=rtype,include,bibldbfasett")=== -1) {
					vm.bibldbfasett = "&facet=rtype,include,bibldbfasett";
				}
				if (vm.absUrl.indexOf("facet=rtype,include,articles")=== -1) {
					vm.articles = "&facet=rtype,include,articles";
				}
				vm.showfacets = true;
			}); //slut watch
		});
	
	});	
	
	/*****************************************
	 
	prm-search-result-frbr-line-after

	Dölj "multiple sources exist"

	*****************************************/
	app.component('prmSearchResultFrbrLineAfter', {
		bindings: {parentCtrl: '<'},
		controller: 'prmSearchResultFrbrLineAfterController',
		template: ``
	});

	app.controller('prmSearchResultFrbrLineAfterController', function ($scope,$location,$timeout,$element) {
		var vm = this;
		if(vm.parentCtrl.result.context == "PC") {
			$element[0].parentElement.style.visibility = "hidden"
		}
	});

	/*****************************************
	
	prm-faourites-toolbar-after
	
	*****************************************/
	app.component('prmFavoritesToolBarAfter', {
		bindings: {parentCtrl: '<'},
		controller: 'prmFavoritesToolBarAfterController',
		template: ``
	});

	app.controller('prmFavoritesToolBarAfterController', function ($scope,$location,$timeout,$element,kth_searchurl) {
		var vm = this;
	});
	
	/**************************************************
	
	prm-full-view-after
	
	*************************************************/
	
	app.component('prmFullViewAfter', {
			bindings: {parentCtrl: '<'},
			controller: 'FullViewAfterController',
			template:
				'<div class="full-view-section">' +
					'<div ng-if="$ctrl.orciddata" class="loc-altemtrics margin-bottom-medium">' +
						'<div class="layout-full-width section-head">' +
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
						'<div class="layout-full-width section-head">' +
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
					'</div>' +
				'</div>'
	});
	
	app.controller('FullViewAfterController', function ($document, angularLoad, $http, kth_loginservice, $scope, $timeout) {
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
		angular.element($document).ready(function() {
			$timeout(function() {
						
			//	});
				/*********
				 * 
				 * 
				 * Flytta metrics/citations till höger full post
				 * 
				 */
				//Element som ska flyttas
				var citationTrails = document.querySelector('#citationTrails');
				var fullviewafter = document.querySelector('prm-full-view-after');

				var prmrecomendations = document.querySelector('prm-recomendations');
				//Sätt style för att flytta citation/metrics över premrecomendations i full-view(inte dialogview)
				if(typeof(prmrecomendations) != "undefined" && prmrecomendations != null) {
					prmrecomendations.parentNode.style.display = "flex";
					prmrecomendations.parentNode.style.flexDirection  = "column";
					prmrecomendations.parentNode.appendChild(citationTrails);
					prmrecomendations.parentNode.appendChild(fullviewafter);
				}
				//}
			},0);
		});
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
						vm.kthprofile_url = data.person["researcher-urls"]["researcher-url"]["0"].url.value;
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
		template: ``
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

	Denna är dold i fullposten.
	
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
										'<prm-icon external-link="" icon-type="svg" svg-icon-set="primo-ui" icon-definition="open-in-new" aria-label="externalLink">' +
										'</prm-icon>' +
									'</a>' +
									'<span class="tooltip">' +
										'<svg width="20px" height="20px" viewBox="0 0 24 24" id="ic_info_24px" y="1368" xmlns="http://www.w3.org/2000/svg" fit="" preserveAspectRatio="xMidYMid meet" focusable="false"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-6h2v6zm0-8h-2V7h2v2z"></path></svg>' +
										'<span class="tooltiptext tooltip-top">' +
											'<div ng-bind-html="$ctrl.infotext"></div>' +
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
											'<prm-icon external-link="" icon-type="svg" svg-icon-set="primo-ui" icon-definition="open-in-new" aria-label="externalLink">' +
											'</prm-icon>' +
										'</a>' +
										'<span class="tooltip">' +
											'<svg width="20px" height="20px" viewBox="0 0 24 24" id="ic_info_24px" y="1368" xmlns="http://www.w3.org/2000/svg" fit="" preserveAspectRatio="xMidYMid meet" focusable="false"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-6h2v6zm0-8h-2V7h2v2z"></path></svg>' +
											'<span class="tooltiptext tooltip-top">' +
												'<div ng-bind-html="$ctrl.infotext"></div>' +
											'</span>' +
										'</span>' +
									'</div>' +
								'</div>' +
							'</div>' +
						'</div>' +
					'</div>'
	});

	app.controller('prmFullViewServiceContainerAfterController',function ($scope, $http, kth_oadoi, kth_logg, $sce, $translate) {
		var vm = this;
		vm.unpaywalljson = "";
		vm.showOA = false;
		vm.gold = false;
		vm.greenpublished = false;
		vm.greenaccepted = false;
		vm.infotext = "";

		vm.kth_language = $translate.use();

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
						//kth_logg.kthlogg("oaDOIfromunpaywall", vm.doi);	
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
									if(vm.kth_language == 'sv_SE') {
										vm.infotext = "<p>Detta är den slutgiltiga publicerade versionen av artikeln, fritt tillgänglig (open access) på förlagets webbplats.</p>";
									} else {
										vm.infotext = "<p>This is the final published version of the article, freely available (open access) on the publisher's website.</p>";
									}
									
								} else if(data.data.best_oa_location.host_type == "repository" && data.data.best_oa_location.version == 'publishedVersion') {
									vm.greenpublished = true;
									if(vm.kth_language == 'sv_SE') {
										vm.infotext = "<p>Detta är den slutgiltiga publicerade versionen av artikeln, fritt tillgänglig i ett open access-arkiv.</p>"
									} else {
										vm.infotext = "<p>This is the final published version of the article, freely available in an open access archive.</p>";
									}
								} else if(data.data.best_oa_location.host_type == "repository" && data.data.best_oa_location.version == 'acceptedVersion') {
									vm.greenaccepted = true;
									if(vm.kth_language == 'sv_SE') {
										vm.infotext = "<p>Detta är en fritt tillgänglig postprint-version av artikeln i ett open access-arkiv. D.v.s. det är det accepterade och granskade manuskriptet, men ej den slutgiltiga publicerade artikeln.</p>"
									} else {
										vm.infotext = "<p>This is a free postprint version of the article available in an open access archive. I.e it is the accepted and reviewed manuscript, but not the final published article.</p>";
									}
								} else if(data.data.best_oa_location.host_type == "repository" && data.data.best_oa_location.version == 'submittedVersion') {
									vm.greensubmittedVersion = true;
									if(vm.kth_language == 'sv_SE') {
										vm.infotext = "<p>Detta är en fritt tillgänglig preprint-version av artikeln i ett open access-arkiv. D.v.s. det är det till tidskriften inskickade manuskriptet, ännu ej accepterat eller granskat och ej den slutgiltiga publicerade artikeln.</p>"
									} else {
										vm.infotext = "<p>This is a free preprint version of the article available in an open access archive. I.e. it is the manuscript as submitted to the journal, not yet accepted or reviewed and not the final published article.</p>";
									}
								} else {
									if(vm.kth_language == 'sv_SE') {
										vm.infotext = "<p>Versionsstatus för denna artikel är inte känd. Artikeln finns tillgänglig i ett open access-arkiv.</p>"
									} else {
										vm.infotext = "<p>Version status for this article is not known. The article is available in an open access archive.</p>";
									}
								}
								if(vm.kth_language == 'sv_SE') {
									vm.infotext = vm.infotext + "<p>Denna länk och information hämtas från <a href=\"http://unpaywall.org\">Unpaywall</a>. I vissa fall är det samma version som Online-länken ovan.</p>";
								} else {
									vm.infotext = vm.infotext + "<p>This link and information is retrieved from <a href=\"http://unpaywall.org\">Unpaywall</a>. In some cases, it is the same version as the Online link above.</p>";
								}
								//Varför blir det INTE utf-8kompatibelt ibland?
								vm.infotext = vm.infotext.replace(/å/g, "&aring;")
								vm.infotext = vm.infotext.replace(/ä/g, "&auml;")
								vm.infotext = vm.infotext.replace(/ö/g, "&ouml;")
								vm.infotext = vm.infotext.replace(/Å/g, "&Aring;")
								vm.infotext = vm.infotext.replace(/Ä/g, "&Auml;;")
								vm.infotext = vm.infotext.replace(/Ö/g, "&Ouml;")
								vm.infotext = $sce.trustAsHtml(vm.infotext);
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
				if (typeof(service) != "undefined") {
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
									//kth_logg.kthlogg("oaDOIfromunpaywall", vm.doi);
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
												if(vm.kth_language == 'sv_SE') {
													vm.infotext = "<p>Detta är den slutgiltiga publicerade versionen av artikeln, fritt tillgänglig (open access) på förlagets webbplats.</p>";
												} else {
													vm.infotext = "<p>This is the final published version of the article, freely available (open access) on the publisher's website.</p>";
												}
												
											} else if(data.data.best_oa_location.host_type == "repository" && data.data.best_oa_location.version == 'publishedVersion') {
												vm.greenpublished = true;
												if(vm.kth_language == 'sv_SE') {
													vm.infotext = "<p>Detta är den slutgiltiga publicerade versionen av artikeln, fritt tillgänglig i ett open access-arkiv.</p>"
												} else {
													vm.infotext = "<p>This is the final published version of the article, freely available in an open access archive.</p>";
												}
											} else if(data.data.best_oa_location.host_type == "repository" && data.data.best_oa_location.version == 'acceptedVersion') {
												vm.greenaccepted = true;
												if(vm.kth_language == 'sv_SE') {
													vm.infotext = "<p>Detta är en fritt tillgänglig postprint-version av artikeln i ett open access-arkiv. D.v.s. det är det accepterade och granskade manuskriptet, men ej den slutgiltiga publicerade artikeln.</p>"
												} else {
													vm.infotext = "<p>This is a free postprint version of the article available in an open access archive. I.e it is the accepted and reviewed manuscript, but not the final published article.</p>";
												}
											} else if(data.data.best_oa_location.host_type == "repository" && data.data.best_oa_location.version == 'submittedVersion') {
												vm.greensubmittedVersion = true;
												if(vm.kth_language == 'sv_SE') {
													vm.infotext = "<p>Detta är en fritt tillgänglig preprint-version av artikeln i ett open access-arkiv. D.v.s. det är det till tidskriften inskickade manuskriptet, ännu ej accepterat eller granskat och ej den slutgiltiga publicerade artikeln.</p>"
												} else {
													vm.infotext = "<p>This is a free preprint version of the article available in an open access archive. I.e. it is the manuscript as submitted to the journal, not yet accepted or reviewed and not the final published article.</p>";
												}
											} else {
												if(vm.kth_language == 'sv_SE') {
													vm.infotext = "<p>Versionsstatus för denna artikel är inte känd. Artikeln finns tillgänglig i ett open access-arkiv.</p>"
												} else {
													vm.infotext = "<p>Version status for this article is not known. The article is available in an open access archive.</p>";
												}
											}
											if(vm.kth_language == 'sv_SE') {
												vm.infotext = vm.infotext + "<p>Denna länk och information hämtas från <a href=\"http://unpaywall.org\">Unpaywall</a>. I vissa fall är det samma version som Online-länken ovan.</p>";
											} else {
												vm.infotext = vm.infotext + "<p>This link and information is retrieved from <a href=\"http://unpaywall.org\">Unpaywall</a>. In some cases, it is the same version as the Online link above.</p>";
											}
											//Varför blir det INTE utf-8kompatibelt ibland?
											vm.infotext = vm.infotext.replace(/å/g, "&aring;")
											vm.infotext = vm.infotext.replace(/ä/g, "&auml;")
											vm.infotext = vm.infotext.replace(/ö/g, "&ouml;")
											vm.infotext = vm.infotext.replace(/Å/g, "&Aring;")
											vm.infotext = vm.infotext.replace(/Ä/g, "&Auml;;")
											vm.infotext = vm.infotext.replace(/Ö/g, "&Ouml;")
											vm.infotext = $sce.trustAsHtml(vm.infotext);
											vm.showOA = true;
										} else {
											vm.doi = false;
										}
									});	
								}
							}
						});
					}
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
		template: 	//Web of science citations
		//Visa laddningsikon'
		'<div ng-if="$ctrl.wosisLoading" layout="column" layout-align="center">' +
			'<div layout="row" layout-align="center">' +
				'<md-progress-circular md-diameter="20px" style="stroke:#106cc8" md-mode="indeterminate"></md-progress-circular>' +
			'</div>' +
		'</div>' + 
		'<div ng-if="$ctrl.wostimesCited!==\'\'">' +
			'<span class="wostimesCited">{{$ctrl.wostimesCited}}</span> ' +
			'<span translate="{{\'nui.citation_trail.link.citedExternal\'}}"></span>' +
			'<a target="_new" href="{{$ctrl.wossourceURL}}"> Web of Science&trade;</a>' +
		'</div>' +
		//scopus citations
		'<div ng-if="$ctrl.scopustimesCited!==\'\'">' +
			//class="wostimesCited
			'<span class="wostimesCited">{{$ctrl.scopustimesCited}} </span><span translate="{{\'nui.citation_trail.link.citedExternal\'}}" "></span><a target="_new" href="{{$ctrl.scopussourceURL}}"> Scopus&trade;</a>' +
		'</div>'
	});
	
	app.controller('prmCitationTrailsFullviewLinkAfterController',  ['$scope', '$http', function($scope, $http) {
		//Init
		var vm = this;
		
		/********************************************** 
		
		Hämta citations från WOS och Scopus(Elsevier)
		
		**********************************************/
		vm.parentCtrl.wostimesCited = "";
		vm.parentCtrl.scopustimesCited = "";
		vm.wostimesCited = "";
		vm.scopustimesCited = "";
		
		if(vm.parentCtrl.record.pnx.addata.doi) {
			vm.doi = vm.parentCtrl.record.pnx.addata.doi[0] || '';
			getwos(vm.doi,'wos');
			getwos(vm.doi,'elsevier');
		}
		
		function getwos(doi, source) {
			vm.parentCtrl.wosisLoading = true;
			vm.wosisLoading = true;
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
						vm.wostimesCited = data.wos.timesCited; 
						vm.woscitingArticlesURL = data.wos.citingArticlesURL;
						vm.wossourceURL = data.wos.sourceURL;
					} else if (source == "elsevier") {
						vm.parentCtrl.scopustimesCited = data.elsevier.timesCited; 
						vm.parentCtrl.scopuscitingArticlesURL = data.elsevier.citingArticlesURL;
						vm.parentCtrl.scopussourceURL = data.elsevier.sourceURL;
						vm.scopustimesCited = data.elsevier.timesCited; 
						vm.scopuscitingArticlesURL = data.elsevier.citingArticlesURL;
						vm.scopussourceURL = data.elsevier.sourceURL;
					}
					vm.parentCtrl.wosisLoading = false;
					vm.wosisLoading = false;
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
					//om det inte finns något telnummer sparat så finns ett första item som inte har innehåll
					if (typeof(item[0]) != 'undefined') {
						if (item[0].name == "sms_number") {
							phoneNumberSection.splice(index,1);
						}
						if (item[0].name == "sms_authorized") {
							phoneNumberSection.splice(index,1);
						}
					}
				}
			);
		});
		//Ta bort address valid from (bevaka arrayen och ta bort aktuella index)
		$scope.$watch(function() { return vm.parentCtrl.addressSection; }, function(addressSection) {
			addressSection.forEach(
				function(item, index) {
					//om det inte finns något telnummer sparat så finns ett första item som inte har innehåll
					if (typeof(item[0]) != 'undefined') {
						if (item[0].name == "address_valid_from") {
							addressSection.splice(index,1);
						}
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
function getUrlVars() {
    var vars = {};
    var parts = window.location.href.replace(/[?&]+([^=&]+)=([^&]*)/gi, function(m,key,value) {
        vars[key] = value;
    });
    return vars;
}

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