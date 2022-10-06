var kth_vid = "46KTH_INST:46KTH_VU1_B"
console.log(kth_vid);

(function () {
    'use strict';
    var app = angular.module('viewCustom', ['angularLoad','ngSanitize','ngMaterial','primo-explore.config']);
	
    /****************************************************************************************************/

        /*In case of CENTRAL_PACKAGE - comment out the below line to replace the other module definition*/

        /*var app = angular.module('centralCustom', ['angularLoad']);*/

    /****************************************************************************************************/
	
	// LIBKEY / BROWZINE
	window.browzine = {
		api: "https://public-api.thirdiron.com/public/v1/libraries/279",
		apiKey: "c4295afb-1990-4c5f-8616-5b11989c19c9",
	
		journalCoverImagesEnabled: true,
	
		journalBrowZineWebLinkTextEnabled: true,
		journalBrowZineWebLinkText: "View Journal Contents",
	
		articleBrowZineWebLinkTextEnabled: true,
		articleBrowZineWebLinkText: "View Issue Contents",
	
		articlePDFDownloadLinkEnabled: true,
		articlePDFDownloadLinkText: "Download PDF",
	
		articleLinkEnabled: true,
		articleLinkText: "Read Article",
	
		printRecordsIntegrationEnabled: true,
		
		showFormatChoice: false,
		showLinkResolverLink: true,
	
		unpaywallEmailAddressKey: "system-kthb@kth.se",
		
		articlePDFDownloadViaUnpaywallEnabled: true,
		articlePDFDownloadViaUnpaywallText: "Download PDF (via Unpaywall)",
	
		articleLinkViaUnpaywallEnabled: true,
		articleLinkViaUnpaywallText: "Read Article (via Unpaywall)",
	
		articleAcceptedManuscriptPDFViaUnpaywallEnabled: true,
		articleAcceptedManuscriptPDFViaUnpaywallText: "Download PDF (Accepted Manuscript via Unpaywall)",
	
		articleAcceptedManuscriptArticleLinkViaUnpaywallEnabled: true,
		articleAcceptedManuscriptArticleLinkViaUnpaywallText: "Read Article (Accepted Manuscript via Unpaywall)",
	  };
	
	  browzine.script = document.createElement("script");
	  browzine.script.src = "https://s3.amazonaws.com/browzine-adapters/primo/browzine-primo-adapter.js";
	  document.head.appendChild(browzine.script);

	  
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
	
	app.controller('prmExploreMainAfterController', function ($translate) {
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

		
		vm.$onInit = function () {
			console.log("oninit")

			var lang = $translate.use()

			/***
			 * Egen chattkonfig/knapp
			 */

			var chat_kth_kundo = document.getElementById("chat_kth_kundo")
			if(chat_kth_kundo) {
				chat_kth_kundo.remove()
			}

				var startchatt_text = "Chat with us"
				if(typeof(lang) !== 'undefined') {
					if (lang.indexOf('sv') != -1) {
						lang = 'sv'
						startchatt_text = "Chatta med oss"
					} else {
						lang = 'en'
					}
				} else {
					lang = 'en'
				}
				let chathtml = `
						<div style="position: fixed;right: 16px;bottom: 16px;z-index: 10000;border-radius: 40px">
							<button class="kundo-chat-widget__start-button kundo-chat-widget__start-button--with-transition" aria-label="chatt" class="button-with-icon zero-margin" onclick="startChat('${lang}')">
								<svg xmlns="http://www.w3.org/2000/svg" aria-hidden="true" width="18" height="18" viewBox="0 0 18 18" class="kundo-chat-widget__start-button-icon"><path d="M5.195 11.895h-.043c.017.911.227 1.808.616 2.634a6.156 6.156 0 0 1-3.5 1.32c-.124 0-.364-.116-.364-.238a.438.438 0 0 1 .123-.36 4.932 4.932 0 0 0 1.233-2.635A6.02 6.02 0 0 1 0 7.466C0 3.871 3.506 1 7.974 1c4.227 0 7.61 2.634 7.974 5.988a7.897 7.897 0 0 0-3.747-.959c-3.863 0-7.006 2.634-7.006 5.866zM12.2 7.221c3.26 0 5.799 2.157 5.799 4.668a4.549 4.549 0 0 1-2.416 3.832c.069.712.365 1.384.845 1.918.123.123.123.123 0 .239 0 .122-.124.122-.24.122a4.617 4.617 0 0 1-3.143-1.558c-.364 0-.617.122-.968.122-3.26 0-5.799-2.157-5.799-4.669.124-2.633 2.656-4.668 5.916-4.668l.006-.006z" fill-rule="nonzero" fill="currentColor"></path></svg>
								<span id="chat_start_text">${startchatt_text}</span>
							</button>
						</div>
					`
				var s = document.createElement('div');
				s.id = "chat_kth_kundo";
				let primoexploreelement = document.querySelector("body");
				primoexploreelement.appendChild(s).innerHTML=chathtml;

				let onlineFlows = {}
				document.addEventListener("kundo-chat:flow-available", function(event) {
					onlineFlows[event.detail.flow] = true
				})
				document.addEventListener("kundo-chat:flow-unavailable", function(event) {
					onlineFlows[event.detail.flow] = false
				})
	
		}
		
		angular.element(document).ready(function() {
			
			
			
		})

	});

	/*****************************************************
	 * 
	 * New 1811XX
	 * 
	 * Egna cirkelknappar
	 * 
	 ****************************************************/

	 app.component('prmLanguageSelectionAfter', {
		'bindings': { 'parentCtrl': '<' },
		'controller': function controller($rootScope) {
		  $rootScope.languageSelectionCtrl = this.parentCtrl;
		}
	  }); 

	app.component('prmSearchBookmarkFilterAfter', {
		bindings: {parentCtrl: '<'},
		controller: 'prmSearchBookmarkFilterAfterController',
		template: `<prm-language-selection style="display: none"></prm-language-selection>
					<!--button class="user-button md-button md-primoExplore-theme md-ink-ripple" type="button" id="kth-langbtn" ng-click="$ctrl.switchLang()" aria-label="">
						<span>Engelska</span>
					</button-->
					<button class="md-icon-button hide-sm button-over-dark md-button md-primoExplore-theme md-ink-ripple" id="lang-icon" ng-click="$ctrl.switchLang()">
						<!--prm-icon class="rotate-20" icon-type="svg" svg-icon-set="primo-ui" icon-definition="earth"></prm-icon-->
						<div id="kth_langbutton" ng-if="$ctrl.lang=='sv'" ng-class="$ctrl.getClass()">EN</div>
						<div id="kth_langbutton" ng-if="$ctrl.lang=='en'" ng-class="$ctrl.getClass()">SV</div>
					</button>`,
		bindings : { 'parentCtrl': '<' }
		
	});

	app.controller('prmSearchBookmarkFilterAfterController', function ($translate, $rootScope) {
		var vm = this;

		vm.lang = $translate.use();
		var otherLanguage = $translate.use() === 'sv' ? 'en' : 'sv';
		vm.switchLang = function () {
			if (!$rootScope.languageSelectionCtrl) {
			return false;
			}
			return $rootScope.languageSelectionCtrl.changeLanguage(otherLanguage);
		};
		vm.getClass = function () {
			return $translate.use() === 'sv' ? 'lang-en' : 'lang-se';
		};

     	 var swedish = $translate.use() === 'sv' ? true : false;

		angular.element(document).ready(function() {
			var langIcon = document.querySelector('#lang-icon')
			var langLabel = swedish ? 'Change language to English' : 'Byt språk till svenska'
			var showTooltip = function(e) {
				var position = e.target.getBoundingClientRect();
				var tooltip = document.createElement('md-tooltip');
				tooltip.className = 'kthb-tooltip md-panel md-tooltip md-primoExplore-theme md-origin-bottom';
				tooltip.setAttribute('role', 'tooltip');
				tooltip.innerHTML = '<span>' + e.target.getAttribute('aria-label') + '</span>';
				tooltip.style.top = position.top + e.target.offsetHeight + 0 + 'px';
				document.body.appendChild(tooltip);
				setTimeout(function() {
					tooltip.classList.add('md-panel-is-showing');
					tooltip.style.left = position.left - (tooltip.offsetWidth - e.target.offsetWidth) / 2 +  'px';
					var xxx = "xxx"
				}, 500);
			}
			var hideTooltip = function(e) {
				var tp = document.querySelectorAll('.kthb-tooltip');
				if (tp.length) {
				Array.prototype.forEach.call(tp, function(el) {
					el.parentElement.removeChild(el);
				})
				}
			}
			var setListeners = function(el) {
				el.addEventListener('mouseenter', showTooltip, false);
				el.addEventListener('focus', showTooltip, false);
				el.addEventListener('mouseleave', hideTooltip, false);
				el.addEventListener('focusout', hideTooltip, false);
				el.addEventListener('click', hideTooltip, false);
			};
			if (langIcon) {
				langIcon.setAttribute('aria-label', langLabel);
				langIcon.setAttribute('lang', $translate.use() === 'sv' ? 'en' : 'sv');
				//var langButton = document.querySelector('#lang-icon') 
				//langButton.innerHTML = ""
				setListeners(langIcon);
			}
		});

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
		  element.innerHTML = '<md-icon md-svg-icon="primo-ui:' + icon + '" alt="" class="heart md-primoExplore-theme" aria-hidden="true">' + icons[icon] + '</md-icon>';
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
				`<div>
					<a href="{{$ctrl.parentCtrl.kthb_link}}">
						<span class="kth-sitenameheader" translate="nui.header.sitename"></span>
						<span style="color:salmon" ng-if="$ctrl.kth_vid==\'46KTH_VU1_B\'">B!</span>
						<span style="color:red" ng-if="$ctrl.kth_vid==\'46KTH_VU1_New\'">NEW!!!</span>
					</a>
				</div>`
	});
	
	app.controller('prmLogoAfterController',function ($scope, $translate,$timeout,$location) { 
		var vm = this;
		vm.kth_vid = kth_vid;

		//Se till att länken anpassas till valt språk
		vm.parentCtrl.kthb_link = "https://www.kth.se/en/biblioteket";
		if($translate.use() == 'sv') {
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
		this.addData = function (directive,d) {
			data[directive] = d;
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

	
	/**************************************************
	
	prm-full-view-after
	
	*************************************************/
	
	app.component('1prmFullViewAfter', {
			bindings: {parentCtrl: '<'},
			controller: 'FullViewAfterController',
			template:
			`
			<div class="full-view-section" id="kth_metrics">
				<div ng-if="$ctrl.show_KTH_metrics">
					<div class="section-head">
						<div>
							<div style="flex-direction: column;align-items: stretch;align-content: stretch;" layout="row" layout-align="center center" class="layout-align-center-center layout-row">
								<h4 class="section-title md-title light-text">KTH Metrics</h4>
								<md-divider flex="" class="md-primoExplore-theme flex"></md-divider>
							</div>
						</div>
					</div>
					<div class="section-body ">
						<div>
							<div>
								<div ng-if="$ctrl.doi || $ctrl.issn" class="loc-altemtrics margin-bottom-medium">
									<div ng-if="$ctrl.issn">
										<span translate="nui.kth_JCR"></span> <a target="_new" href="http://focus.lib.kth.se/login?url=http://gateway.webofknowledge.com/gateway/Gateway.cgi?GWVersion=2&amp;SrcAuth=KTH&amp;SrcApp=KTH_Primo&amp;KeyISSN=0169-555X&amp;DestApp=IC2JCR" class="md-primoExplore-theme">JCR</a>
									</div>
									<div id="kth_altmetrics">
										<div ng-if="$ctrl.altmetricsisLoading" layout="column" layout-align="center">
											<div layout="row" layout-align="center">
												<md-progress-circular md-diameter="20px" style="stroke:#106cc8" md-mode="indeterminate"></md-progress-circular>
											</div>
										</div>
										<div class="" ng-if="$ctrl.doi">
											<div class="section-body layout-align-start-stretch layout-row" layout="row" layout-align="">
												<div class="spaced-rows layout-column" layout="column">
													<div ng-if="$ctrl.almetricsscore > 0">
														<span translate="nui.kth_altmetrics1">Attention score</span> <span class="wostimesCited">{{$ctrl.almetricsscore}}</span> <span translate="nui.kth_altmetrics2">in</span> <a target="_new" href="{{$ctrl.almetricsdetails_url}}"><span translate="nui.kth_altmetrics3">Altmetrics</span>&trade;</a>
													</div>
												</div>
											</div>
										</div>
									</div>
								</div>
							</div>
						</div>
					</div>
				</div>
			</div>
			`
	});
	
	app.controller('FullViewAfterController', function ($window, $document, $element, angularLoad, $http, kth_loginservice, $scope, $timeout) {
        var vm = this;
		this.$http = $http;
    	this.$element = $element;
    	this.$scope = $scope;
    	this.$window = $window;
		/**************************************************
		
		Hämta olika metricsdata
		Altmetrics, orcid, oaDOI etc

		Labels definierade i "Full Display Labels"
		
		**************************************************/
		vm.almetricsscore = 0;

		vm.show_KTH_metrics = false
		
		if(vm.parentCtrl.item.pnx.addata.issn) {
			vm.issn = vm.parentCtrl.item.pnx.addata.issn[0] || '';
		} else if (vm.parentCtrl.item.pnx.addata.eissn) {
			vm.issn = vm.parentCtrl.item.pnx.addata.eissn[0] || '';
		}

		function waitForElm(selector) {
			return new Promise(resolve => {
				if (document.querySelector(selector)) {
					return resolve(document.querySelector(selector));
				}
		
				const observer = new MutationObserver(mutations => {
					if (document.querySelector(selector)) {
						resolve(document.querySelector(selector));
						observer.disconnect();
					}
				});
		
				observer.observe(document.body, {
					childList: true,
					subtree: true
				});
			});
		}

        vm.$onInit = function () { 
            vm.parentElement = this.$element.parent()[0];
			try {
				vm.doi = vm.parentCtrl.item.pnx.addata.doi[0] || '';
			} catch (e) {
				return;
			}

			var unbindWatcher2 = $scope.$watch(function () {
				return vm.parentElement.querySelector('.full-view-inner-container');
			}, function (newVal, oldVal) {
				if (newVal) {
					newVal.appendChild(vm.parentElement.querySelector('prm-full-view-after .full-view-section'))
					vm.show_KTH_metrics = true
					unbindWatcher2()
				}
			});
			
			if (vm.doi) {
				vm.altmetricsisLoading = true;
				vm.altmetricsdata = "";
				console.log("vm.doi: " + vm.doi)
				$http.get('https://api.altmetric.com/v1/doi/' + vm.doi).then(function (response) {
					try {
						vm.almetricsscore = response.data.score;
						vm.almetricsdetails_url = response.data.details_url;
						vm.altmetricsisLoading = false;
					} catch (e) {
						return;
					}
				}).catch(function (e) {
					vm.altmetricsisLoading = false;
					return;
				});
			}	
		};
    });
	
	/*****************************************
	 * 
	 * prm-alma-viewit-items-after
	 * 
	 * 
	 *
	 ******************************************/
	 
	 app.component('1prmAlmaViewitItemsAfter', {
		bindings: {parentCtrl: '<'},
		controller: 'prmAlmaViewitItemsAfterController',
		template: `
		<md-list-item ng-repeat="item in $ctrl.parentCtrl.getServices() track by $index">
		<md-button ng-if="item.licenceExist===\'true\'" class="button-link"
                        prm-aria-label="{{\'nui.aria.almaViewitItems.license\' | translate}}"
                        (click)="$ctrl.parentCtrl.getLicense(item,$event)" aria-label="license">S</md-button>
			<p (click)="$ctrl.disableClick($event)" ng-if="item.toggleLicense" class="ng-scope license" style="padding: 1em 1.5em">
				<span class="ng-binding ng-scope" ng-repeat="line in item.licence track by $index" ng-bind-html="line+\'<br/>\'"></span>
			</p>
		</md-list-item>`

		/*
		<md-list-item ng-repeat="item in $ctrl.parentCtrl.getServices() track by $index"
		
			<p (click)="$ctrl.disableClick($event)" ng-if="item.toggleLicense" class="ng-scope license"
				style="padding: 1em 1.5em"><span class="ng-binding ng-scope"
					ng-repeat="line in item.licence track by $index" ng-bind-html="line+\'<br/>\'"></span>
			</p>
		</md-list-item>
		*/
					
	});

	app.controller('prmAlmaViewitItemsAfterController', function ($scope, $http) {
		var vm = this;
		console.log(vm.parentCtrl.getServices())

		

		$scope.$watch(function() { 
			return vm.parentCtrl.getServices(); 
			}, function(item) {
				try {
					console.log(item)
				  } catch(e) {
					  console.log(e)
				  }
		});
	})
	
	/*****************************************
	
	
	prm-alma-viewit-after
	Full text knapparnas text
	
	*****************************************/
	app.component('prmAlmaViewitAfter', {
		bindings: {parentCtrl: '<'},
		controller: 'prmAlmaViewitAfterController'
					
	});

	app.controller('prmAlmaViewitAfterController', function ($scope, $http) {
		var vm = this;

		//Lägg till "Full text - "på alla knappar som leder till leverantörer
		$scope.$watch(function() { 
			return vm.parentCtrl.item.delivery.electronicServices; 
			}, function(electronicServices) {
				try {
					electronicServices.forEach(function(i) {
						if (i.packageName.indexOf('Contact the KTH Library') === -1 && i.packageName.indexOf('Kontakta') === -1) {
							//getlicence(i.packageName)
							i.packageName = 'Full text - ' + i.packageName;
						}
					});
				  } catch(e) {
					  return
				  }
		});

		function getlicence(packagename) {
			var method = 'GET';
			var url = `https://apps.lib.kth.se/alma/primo/getlicenceve.php?packageName=${packagename}`;
			var data = $http({method: method, url: url})
			.then(function(response) {
				console.log(response)
			});

		}

		vm.getlic = getlic

		function getlic() {
			
			console.log(vm.parentCtrl.item)
			var method = 'GET';
			var url = '/almaws/internalRest/uresolver/customerId/2455/institutionId/2456/licenseId/2050559730002456/language/sv';
			var data = $http({method: method, url: url})
			.then(function(response) {
				//console.log(response)
			});

			var url = '/almaws/internalRest/uresolver/customerId/2455/institutionId/2456/licenseId/2050559730002456/language/sv';
			var data3 = $http({method: method, url: vm.parentCtrl.item.delivery.electronicServices[0].serviceUrl})
			.then(function(response) {
				console.log(response)
			});

			console.log(vm.parentCtrl.item.delivery.electronicServices[0].licenceExist)
			//var urlcollection = "https://api-eu.hosted.exlibrisgroup.com/almaws/v1/electronic/e-collections/" + packageid
			if (vm.parentCtrl.item.delivery.electronicServices[0].licenceExist == "true") {
				var url = vm.parentCtrl.item.delivery.electronicServices[0].licenceUrl + ""
				//'/view/action/uresolver.do?operation=resolveService&package_service_id=22990811200002456&institutionId=2456&customerId=2455&VE=true'
				var data2 = $http({method: method, url: url})
				.then(function(response) {
					console.log(response)
				});
			}
			

			///view/action/uresolver.do?operation=resolveService&package_service_id=22990811200002456&institutionId=2456&customerId=2455&VE=true
			///almaws/internalRest/uresolver/customerId/2455/institutionId/2456/licenseId/2050559730002456/language/sv
		}
	});

	/***************************************
	
	prm-opac-after
	
	Egen lösning för att visa tryckt material
	Används inte i nuläget. Men kanske kan delar komma att tas i bruk?
	***************************************/
	app.component('1prmOpacAfter', {
			bindings: {parentCtrl: '<'},
			controller: 'prmOpacAfterController',
			template: `<div style="padding-bottom:20px" ng-repeat="holding in $ctrl.kthb_holdings.holdings">
							<div style="display:flex">
								<span class="kthb-custom-holdings-container">
									<div ng-if="holding.mainLocation" class="kthb-custom-holdings-mainLocation">{{holding.mainLocation}}</div>
									<div translate="delivery.code.{{holding.availabilityStatus}}" class="kthb-custom-holdings-{{holding.availabilityStatus}}"></div>
									<div>
										<span ng-if="$ctrl.lang == 'en'">Location:</span><span ng-if="$ctrl.lang == 'sv'">Placering:</span> <span ng-if="holding.subLocation" class="kthb-custom-holdings-subLocation">{{holding.subLocation}}</span>
									</div>
									<div>
										<span ng-if="$ctrl.lang == 'en'">Shelf:</span><span ng-if="$ctrl.lang == 'sv'">Hylla:</span> <span ng-if="holding.callNumber" class="kthb-custom-holdings-callNumber">{{holding.callNumber}}</span>
									</div>
								</span>
								<span ng-if="holding.stackMapUrl" class="kthb-custom-holdings-map" style="margin-left: auto;">
									<a href="{{holding.stackMapUrl}}" target="_blank"><md-icon md-svg-icon="maps:ic_place_24px" role="presentation" class="md-primoExplore-theme"><svg width="100%" height="100%" viewBox="0 0 24 24" id="ic_place_24px_cache634" y="1152" xmlns="http://www.w3.org/2000/svg" fit="" preserveAspectRatio="xMidYMid meet" focusable="false"><path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z"></path></svg></md-icon><span translate="nui.locations.locate"></span></a>
								</span>
							</div>
							<table class="table-responsive-stack" ng-if="$ctrl.kthb_holdings.apidata[holding.holdId].records.length > 0" id="TABLE_DATA_item_list" cellspacing="0" cellpadding="0" border="0" summary="Items List">
								<thead>
									<tr>
										<th ng-if="$ctrl.lang == 'sv'" scope="col">Streckkod</th>
										<th ng-if="$ctrl.lang == 'en'" scope="col">Barcode</th>
										<th ng-if="$ctrl.lang == 'sv'" scope="col">Materialtyp</th>
										<th ng-if="$ctrl.lang == 'en'" scope="col">Material type</th>
										<th ng-if="$ctrl.lang == 'sv'" scope="col">Policy</th>
										<th ng-if="$ctrl.lang == 'en'" scope="col">Policy</th>
										<th ng-if="$ctrl.lang == 'sv'" scope="col">Beskrivning</th>
										<th ng-if="$ctrl.lang == 'en'" scope="col">Description</th>
										<th ng-if="$ctrl.lang == 'sv'" scope="col">Status</th>
										<th ng-if="$ctrl.lang == 'en'" scope="col">Status</th>
										<!--th ng-if="$ctrl.lang == 'sv'" scope="col">Karta</th>
										<th ng-if="$ctrl.lang == 'en'" scope="col">Map</th-->
									</tr>
								</thead>
								<tbody>
									<tr ng-repeat="item in $ctrl.kthb_holdings.apidata[holding.holdId].records" class="odd">
										<td style="cursor: default;"><span class="itemBarcode"><span ng-if="item.barcode">{{item.barcode}}</span>&nbsp;</span></td>
										<td style="cursor: default;"><span class="itemMaterialType"><span ng-if="item.physical_material_type">{{item.physical_material_type}}</span>&nbsp;</span></td>
										<td style="cursor: default;">
											<div style="white-space: nowrap;">
												<span ng-if="item.policy">{{item.policy}}</span>
												<div onmouseout="togglepolicy(this)" onmouseover="togglepolicy(this)" style="vertical-align: middle; position: relative;display: inline-block;overflow: visible;white-space: initial;">
													<div class="tooltiptext" style="white-space: initial;visibility: hidden;width: 330px;background-color: #8e8e8e;color: #fff;text-align: left;border-radius: 6px;padding: 10px 10px;position: absolute;z-index: 1;bottom: 125%;left: -25px;opacity: 0;transition: opacity 0.4s;">
														<div>{{item.policyinformation}}</div>
													</div>
													<svg style="color: #888888;fill: CURRENTCOLOR;" width="20px" height="20px" viewBox="0 0 24 24" id="ic_info_24px" y="1368" xmlns="http://www.w3.org/2000/svg" fit="" preserveAspectRatio="xMidYMid meet" focusable="false"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-6h2v6zm0-8h-2V7h2v2z"></path></svg>
												</div>
											</div>
										</td>
										<td style="cursor: default;">
											<span class="nextLine itemAltCallNumber"><span ng-if="item.shelf">{{item.shelf}}</span>&nbsp;</span>
										</td>
										<td style="cursor: default;">
											<span class="itemStatus">
												<span ng-if="item.loan_status">
													<div ng-if="item.loan_status=='inplace'">
														<span ng-if="$ctrl.lang == 'en'">Item in place</span>
														<span ng-if="$ctrl.lang == 'sv'">Exemplar på plats</span>
													</div>
													<div ng-if="item.loan_status=='onloan'" style="white-space: nowrap">
														<span ng-if="$ctrl.lang == 'en'">On loan until</span>
														<span ng-if="$ctrl.lang == 'sv'">Utlånad till</span>
														 {{item.due_date}}
													</div>
												</span>
											</span>
										</td>
										<!--td>
											<span ng-if="holding.stackMapUrl" class="kthb-custom-holdings-map">
												<a href="{{holding.stackMapUrl}}" target="_blank"><md-icon md-svg-icon="maps:ic_place_24px" role="presentation" class="md-primoExplore-theme"><svg width="100%" height="100%" viewBox="0 0 24 24" id="ic_place_24px_cache634" y="1152" xmlns="http://www.w3.org/2000/svg" fit="" preserveAspectRatio="xMidYMid meet" focusable="false"><path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z"></path></svg></md-icon><span translate="nui.locations.locate"></span></a>
											</span>
											<span ng-if="!holding.stackMapUrl" class="kthb-custom-holdings-map">
												<span>-</a>
											</span>
										</td-->
									</tr>
								</tbody>
							</table>
							<div ng-if="$ctrl.kthb_holdings.apidata[holding.holdId].holding_info.length > 0 && !$ctrl.kthb_holdings.apidata[holding.holdId].records.length">
								<div ng-if="$ctrl.lang == 'sv'">
									Vi har:
								</div>
								<div ng-if="$ctrl.lang != 'sv'">
									We have:
								</div>
								<div style="color:green" ng-repeat="item in $ctrl.kthb_holdings.apidata[holding.holdId].holding_info">
									{{item.text}}
								</div>
							</div>
						</div>`
	});
	
	app.controller('prmOpacAfterController', function ($scope, $http, $translate) {
		var vm = this;

		vm.lang = $translate.use();
		console.log(vm.lang)
		vm.kthb_holdings = {
			"holdings":[],
			"apidata":[{
				"holdId": {},
				"records": []
			}]
		}

		vm.kthb_holdings.holdings = vm.parentCtrl.item.delivery.holding
		console.log(vm.kthb_holdings)
		if (vm.kthb_holdings.holdings) {
			vm.kthb_holdings.holdings.length > 0 ? vm.show=true : vm.show=false

			for(var i = 0;i < vm.kthb_holdings.holdings.length;i++) {
				var method = 'GET';
				var url = 'https://apps.lib.kth.se/alma/primo/almagetpolicy.php?mmsid=&holdingsid=' + vm.kthb_holdings.holdings[i].holdId + '&lang=sv&ssandbox=true';
				$http({
					method: method, 
					url: url, 
					headers: {'Content-Type': 'application/json'}
				})
				.then(function(response) {
					var apidata = {
						"holdId": response.data.holdingId,
						"records": response.data.records,
						"holding_info": response.data.holding_info
					}
					if(apidata.loan_status == "onloan") {
						apidata.due_date = "Utlånad";
					} else {
						apidata.due_date = "På plats"
					}
					vm.kthb_holdings.apidata[response.data.holdingId] = apidata
				});
				
			}
		}
    });

	/********************************************************
	
	prm-recomendations-after
	
	*******************************************************/
	app.component('prmRecomendationsAfter', { 
		bindings: {parentCtrl: '<'},
		controller: 'prmRecomendationsAfterController',
		template:
			`
			<div class="full-view-section" id="kth_metrics2">
				<div>
					<div class="section-head">
						<div>
							<div style="flex-direction: column;align-items: stretch;align-content: stretch;" layout="row" layout-align="center center" class="layout-align-center-center layout-row">
								<h4 class="section-title md-title light-text">Metrics</h4>
								<md-divider flex="" class="md-primoExplore-theme flex"></md-divider>
							</div>
						</div>
					</div>
					<div class="section-body ">
						<div>
							<div>
								<div ng-if="$ctrl.doi || $ctrl.issn" class="loc-altemtrics margin-bottom-medium">
									<div ng-if="$ctrl.issn">
										<span translate="nui.kth_JCR"></span> <a target="_new" href="http://focus.lib.kth.se/login?url=http://gateway.webofknowledge.com/gateway/Gateway.cgi?GWVersion=2&amp;SrcAuth=KTH&amp;SrcApp=KTH_Primo&amp;KeyISSN=0169-555X&amp;DestApp=IC2JCR" class="md-primoExplore-theme">JCR</a>
									</div>
									<div id="kth_altmetrics">
										<div ng-if="$ctrl.altmetricsisLoading" layout="column" layout-align="center">
											<div layout="row" layout-align="center">
												<md-progress-circular md-diameter="20px" style="stroke:#106cc8" md-mode="indeterminate"></md-progress-circular>
											</div>
										</div>
										<div class="" ng-if="$ctrl.doi">
											<div class="section-body layout-align-start-stretch layout-row" layout="row" layout-align="">
												<div class="spaced-rows layout-column" layout="column">
													<div ng-if="$ctrl.almetricsscore > 0">
														<span translate="nui.kth_altmetrics1">Attention score</span> <span class="wostimesCited">{{$ctrl.almetricsscore}}</span> <span translate="nui.kth_altmetrics2">in</span> <a target="_new" href="{{$ctrl.almetricsdetails_url}}"><span translate="nui.kth_altmetrics3">Altmetrics</span>&trade;</a>
													</div>
												</div>
											</div>
										</div>
									</div>
								</div>
							</div>
						</div>
					</div>
				</div>
				<div ng-if="$ctrl.showcitations">
					<!--div class="section-head">
						<div>
							<div style="flex-direction: column;align-items: stretch;align-content: stretch;" layout="row" layout-align="center center" class="layout-align-center-center layout-row">
								<h4 class="section-title md-title light-text" translate="citation_trail.link.citations"></h4>
								<md-divider flex="" class="md-primoExplore-theme flex"></md-divider>
							</div>
						</div>
					</div-->
					<div class="section-body ">
						<div>
							<div>
								<div ng-if="$ctrl.doi || $ctrl.issn" class="loc-altemtrics margin-bottom-medium">
									<div id="kth_citations">
										<div ng-if="$ctrl.wosisLoading" layout="column" layout-align="center">
											<div layout="row" layout-align="center">
												<md-progress-circular md-diameter="20px" style="stroke:#106cc8" md-mode="indeterminate"></md-progress-circular>
											</div>
										</div>
										<div>
											<div class="section-body layout-align-start-stretch layout-column" layout="column" layout-align="">
												<div ng-if="$ctrl.wostimesCited!==\'\'">
													<!--span class="wostimesCited">{{$ctrl.wostimesCited}}</span-->
													<span translate="nui.citation.multicited" translate-values="{'idx_0' : $ctrl.wostimesCited}"></span>
													<a target="_new" href="{{$ctrl.wossourceURL}}"> Web of Science&trade;</a>
												</div>
												<div ng-if="$ctrl.scopustimesCited!==\'\'">
													<!--span class="wostimesCited">{{$ctrl.scopustimesCited}}</span-->
													<span translate="nui.citation.multicited" translate-values="{'idx_0' : $ctrl.scopustimesCited}"></span>
													<a target="_new" href="{{$ctrl.scopussourceURL}}"> Scopus&trade;</a>
												</div>
											</div>
										</div>
									</div>
								</div>
							</div>
						</div>
					</div>
				</div>
			</div>
			`
	});
	
	app.controller('prmRecomendationsAfterController', function($scope, $rootScope, $http) {
		var vm = this;
		vm.almetricsscore = 0;

		vm.showcitations = false

		vm.show_KTH_metrics = false
		
		if(vm.parentCtrl.item.pnx.addata.issn) {
			vm.issn = vm.parentCtrl.item.pnx.addata.issn[0] || '';
		} else if (vm.parentCtrl.item.pnx.addata.eissn) {
			vm.issn = vm.parentCtrl.item.pnx.addata.eissn[0] || '';
		}

		vm.$onInit = function () { 
            //vm.parentElement = this.$element.parent()[0];
			try {
				vm.doi = vm.parentCtrl.item.pnx.addata.doi[0] || '';
			} catch (e) {
				return;
			}
			
			if (vm.doi) {
				vm.altmetricsisLoading = true;
				vm.altmetricsdata = "";
				console.log("vm.doi: " + vm.doi)
				$http.get('https://api.altmetric.com/v1/doi/' + vm.doi).then(function (response) {
					try {
						vm.almetricsscore = response.data.score;
						vm.almetricsdetails_url = response.data.details_url;
						vm.altmetricsisLoading = false;
					} catch (e) {
						return;
					}
				}).catch(function (e) {
					vm.altmetricsisLoading = false;
					return;
				});

				/********************************************** 
		
				Hämta citations från WOS och Scopus(Elsevier)
				
				**********************************************/
				
				getwos(vm.doi,'wos');
				getwos(vm.doi,'elsevier');
			}
			
			/*
			var unbindWatcher = $scope.$watch(function () {
				return document.querySelector('prm-times-cited');
			}, function (newVal, oldVal) {
				if (newVal) {
					document.querySelector('prm-recomendations-after').appendChild(newVal)
					unbindWatcher()
				}
			});
			*/

			function getwos(doi, source) {
				vm.wosisLoading = true;
				vm.wosisLoading = true;
				vm.wosdata = "";
				var method = 'GET';
				var url = 'https://apps.lib.kth.se/alma/wos/wosapi.php?doi=' + doi + '&source=' + source;
				$http({method: method, url: url}).
					then(function(response) {
						var status = response.status;
						var data = response.data;
						if(source == "wos") {
							vm.wostimesCited = data.wos.timesCited; 
							vm.woscitingArticlesURL = data.wos.citingArticlesURL;
							vm.wossourceURL = data.wos.sourceURL;
							console.log("vm.wostimesCited: " + vm.wostimesCited)
						} else if (source == "elsevier") {
							vm.scopustimesCited = data.elsevier.timesCited; 
							vm.scopuscitingArticlesURL = data.elsevier.citingArticlesURL;
							vm.scopussourceURL = data.elsevier.sourceURL;
							console.log("vm.scopustimesCited: " + vm.scopustimesCited)
						}
						
						if (vm.scopustimesCited > 0 || vm.wostimesCited > 0) {
							vm.showcitations = true
						}
						vm.wosisLoading = false;
						vm.wosisLoading = false;
					}, function(response) {
					});
			}
		};
	});

	/**********************************************************
	
	prm-search-result-availability-line Träfflista

	Denna är dold i fullposten.
	
	**********************************************************/
	app.component('prmSearchResultAvailabilityLineAfter', {
		bindings: {parentCtrl: '<'},
		controller: 'prmSearchResultAvailabilityLineAfterController',
		template: `<div ng-if="$ctrl.onlinelink">
						<div>
							<span class="">
								<a style="color: #0f7d00" target="_new" href="{{$ctrl.onlinelink}}">
									<img alt="BrowZine PDF Icon" src="https://assets.thirdiron.com/images/integrations/browzine-article-link-icon.svg" class="browzine-pdf-icon" style="margin-bottom: -3px; margin-right: 4.5px;" aria-hidden="true" width="12" height="16">
									<span>Online</span>
									<prm-icon external-link="" icon-type="svg" svg-icon-set="primo-ui" icon-definition="open-in-new" aria-label="externalLink">
									</prm-icon>
								</a>
							</span>
						</div>
					</div>
					<ul ng-if="$ctrl.show">
						<li ng-repeat="holding in $ctrl.kthb_holdings.holdings" class="kthb-custom-holdings-{{holding.availabilityStatus}}">
							<img alt="" src="https://assets.thirdiron.com/images/integrations/browzine-open-book-icon.svg" class="browzine-pdf-icon" style="margin-bottom: -3px; margin-right: 4.5px;" aria-hidden="true" width="12" height="16">
							<span class="kthb-custom-holdings-container">
								<span ng-if="holding.mainLocation" class="kthb-custom-holdings-mainLocation"><strong>{{holding.mainLocation}}</strong></span>
								<span ng-if="holding.subLocation" class="kthb-custom-holdings-subLocation">{{holding.subLocation}}</span>
								<span ng-if="holding.callNumber" class="kthb-custom-holdings-callNumber">{{holding.callNumber}}</span>
							</span>
							<span translate="delivery.code.{{holding.availabilityStatus}}" class="kthb-custom-holdings-{{holding.availabilityStatus}}"></span>
							<span ng-if="holding.stackMapUrl" class="kthb-custom-holdings-map">
								<a href="{{holding.stackMapUrl}}" target="_blank">
									<md-icon md-svg-icon="maps:ic_place_24px" role="presentation" class="md-primoExplore-theme">
										<svg width="100%" height="100%" viewBox="0 0 24 24" id="ic_place_24px_cache634" y="1152" xmlns="http://www.w3.org/2000/svg" fit="" preserveAspectRatio="xMidYMid meet" focusable="false">
											<path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z"></path>
										</svg>
									</md-icon>
									<span translate="nui.locations.locate"></span>
								</a>
							</span>
							<br ng-if="holding.subLocationCode===\'STACKS\' || holding.subLocationCode===\'STACKS_REF\'" />
							<span ng-if="holding.subLocationCode===\'STACKS\' || holding.subLocationCode===\'STACKS_REF\'" class="kthb-custom-holdings-stacks-info" translate="delivery.code.in_stacks"></span>
							<br ng-if="holding.callNumber.indexOf(\'Tidskr\') > -1 && holding.libraryCode==\'O\'" />
							<span ng-if="holding.callNumber.indexOf(\'Tidskr\') > -1 && holding.libraryCode==\'O\'" class="kthb-custom-holdings-journal-info" translate="delivery.code.journal_shelf_main_library"></span>
							<div ng-repeat="item in $ctrl.kthb_holdings.apidata[holding.holdId].records" class="kthb-custom-holdings-{{holding.availabilityStatus}}">
								{{item.barcode}}, {{item.policy}}
							</div>
						</li>
					</ul>`
	
		
	});

	app.controller('prmSearchResultAvailabilityLineAfterController',function ($scope, $timeout, $http, $document) {
		//LIBKEY / BROWZINE
		window.browzine.primo.searchResult($scope);

		var vm = this;

		vm.kthb_holdings = {
			"holdings":[],
			"apidata":[{
				"holdId": {},
				"records": []
			}]
		}

		vm.kthb_holdings.holdings = vm.parentCtrl.result.delivery.holding

		vm.onlinelinkwatch = vm.parentCtrl.directLinkService.getDirectLinkURL(vm.parentCtrl.result)
		
		$scope.$watch(function() { 
			return vm.onlinelinkwatch.$$state.value; 
		}, function(onlinelink) {
			vm.onlinelink = onlinelink;
		});

		if (vm.kthb_holdings.holdings) {
			vm.kthb_holdings.holdings.length > 0 ? vm.show=true : vm.show=false
		}
		
	});
	
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
	
	Matomo Analytics

	ENDAST FÖR PRODUKTIONSVYER! (VU1_L och Kiosk)
	
	********************/
	/*
	var _paq = window._paq = window._paq || [];
	_paq.push(['trackPageView']);
	_paq.push(['enableLinkTracking']);
	(function() {
		var u="https://analytics.sys.kth.se/";
		_paq.push(['setTrackerUrl', u+'matomo.php']);
		_paq.push(['setSiteId', '5']);
		var d=document, g=d.createElement('script'), s=d.getElementsByTagName('script')[0];
		g.async=true; g.src=u+'matomo.js'; s.parentNode.insertBefore(g,s);
	})();

	*/

	
	
})();

/********************
 *
 * Kundo Chat
 * 
 * Skapa script och gör disable på default och använd en egen knapp istället
 *
 *******************/

(function () {
	var x = document.createElement("script");
	x.id = "primo_kundo"
	x.type = "text/javascript";
	x.async = true;
	x.src = (document.location.protocol === "https:" ? "https://" : "http://") + "static-chat.kundo.se/chat-js/org/1199/widget.js";
	document.body.appendChild(x);
})();


(function(w){
	w.$kundo_chat=w.$kundo_chat||{};
	window.$kundo_chat.disable_widget = true
}(this));

function startChat(lang) {
	if (lang.indexOf('sv') != -1) {
		lang = 'sv';
		window.$kundo_chat.start_chat("kth-bibliotek-03b3q6zo")
	} else {
		window.$kundo_chat.start_chat("kth-library-2ja5nukh")
	}
}


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

function togglepolicy(element) {
	if (element.querySelector(".tooltiptext").style.visibility == "hidden") {
		element.querySelector(".tooltiptext").style.visibility = "visible";
		element.querySelector(".tooltiptext").style.opacity = "1";
	} else {
		element.querySelector(".tooltiptext").style.visibility = "hidden";
		element.querySelector(".tooltiptext").style.opacity = "0";
	}
}
