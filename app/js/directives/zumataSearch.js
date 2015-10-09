/**
*	This is a custom directive written for the purpose of search component
*	This directive is restricted in terms of element or attribute
*	The usage of this directives is as like,
*	<zumata-search></zumata-search> or <div zumata-search></div>
*	As of now a new isolated scope with no parameters are created. 
*	In future we may also use this isolated scope to get the options from the controller
*	Author : P Hentry Martin
*	Date : 16/Sep/2015
*/
(function() {
	
	'use strict';
	angular.module('zumata')
		.directive('zumataSearch', zumataSearch);

		zumataSearch.$inject = ['$compile', 'searchService', '$sce', '$timeout'];	//Dependency injection

		function zumataSearch($compile, searchService, $sce, $timeout) {
			return {
				restrict : 'EA',
				replace : true,
				scope : true,
				template : '<div class="zumata-search"><input type="text" data-ng-model="searcher.selectedItem" data-ng-click="constructSearchBox()" class="form-control question" placeholder="Where you want to go?"/><i class="fa fa-search zumata-search-icon"></i></div>',
				link : function(scope, elem, attr) {


					var body = $('html');

					/**
					*	This is to get the class names dynamically based on the item type
					*/
					scope.getAppropriateIcon = function(item) {

						var iconClass = 'fa-building-o';
						switch(item.data.type) {
						    case 'museums':
						        iconClass = 'fa-building-o';
						        break;
						    case 'city':
						    	iconClass = 'fa-map-marker';
						        break;
						    case 'hotel':
						    	iconClass = 'fa-building-o';
						        break;
						    case 'monument':
						    	iconClass = 'fa-university';
						        break;
						    case 'skiing':
						    	iconClass = 'fa-building-o';
						        break;
						}

						return iconClass;
					};
					
					/**
					*	This is to clear the values in the input box on clicking cross button
					*/
					scope.clearInputValue = function() {
						scope.searcher.searchInput = '';
						$('.search-field').focus();
					};

					/**
					*	This will progressively change the opacity so that it looks pleasant
					*/
					function opacityTimeout() {
						$('.search-overlay').css({opacity:1});
					}

					/**
					*	This function will do the sliding animation for the list
					*/
					function heightTimeout() {
						$('.default-wrapper').css({'max-height':80 + '%', 'overflow-y' : 'auto'});
					}

					/**
					*
					*/
					scope.selectThisRow = function(item) {
						scope.searcher.selectedItem = item.term;
						scope.removeThis();
					};

					/**
					*	This construct the search box in the body
					*/
					scope.constructSearchBox = function() {

						scope.searcher.searchInput = scope.searcher.selectedItem;

						var searchBox = '<div class="search-overlay" data-ng-click="removeThis()">' + 
							'<div class="search-holder" stop-prop><input type="text" data-ng-model="searcher.searchInput" class="search-field form-control"/><i class="fa fa-arrow-left zumata-back-arrow" data-ng-click="removeThis()"></i><i data-ng-click="clearInputValue()" class="fa fa-times zumata-clear-icon" data-ng-if="searcher.searchInput.length > 0"></i></div>' +
							'<div class="default-wrapper" stop-prop>' +
								'<div class="default-vals" data-ng-if="!searcher.searchVals.results">' + '<div class="group-header">Recent search</div>' +
									'<li class="list-unstyled" data-ng-repeat="recentVal in searcher.defaultVals.recent"><i class="fa fa-clock-o"></i><span>{{recentVal.name}}</span></li>' +
								'</div>' +
								'<div class="default-vals" data-ng-if="!searcher.searchVals.results">' + '<div class="group-header">Popular search</div>' +
									'<li class="list-unstyled" data-ng-repeat="popularVal in searcher.defaultVals.popular"><i class="fa fa-star"></i><span>{{popularVal.name}}</span></li>' +
								'</div>' +
							'</div>' +
							'<div class="searched-vals" stop-prop data-ng-if="searcher.searchVals.results"><div data-ng-repeat="(key, value) in searcher.searchVals.results"><li class="list-unstyled" data-ng-repeat="items in value | filter:searcher.searchInput" data-ng-click="selectThisRow(items)"><span class="fa" data-ng-class="getAppropriateIcon(items)"></span><span class="name" data-ng-class="{\'cityname\' : items.data.type == \'city\'}" ng-bind-html="highlight(items.term, searcher.searchInput)"></span><span class="bottom-block" data-ng-class="{\'overrideLeft\': items.data.type == \'monument\'}" data-ng-if="items.data.type != \'city\'">{{items.data.city}}, {{items.data.country}}</span></li></div>' +
							'</div>' +
						'</div>';
						body.append($compile(searchBox)(scope));

						$timeout(opacityTimeout,10);
						$timeout(heightTimeout, 350);
						$('.search-field').focus();
					};

					/**
					*	This is for highlighting the typed phrase in the list items
					*/
					scope.highlight = function(text, search) {
					    if (!search) {
					        return $sce.trustAsHtml(text);
					    }
					    return $sce.trustAsHtml(text.replace(new RegExp(search, 'gi'), '<span class="highlightedText">$&</span>'));
					};

					/**
					*	This is to remove the constructed overlay from the body
					*/
					scope.removeThis = function() {
						scope.searcher.searchInput = '';
						$('.search-overlay').remove();
					};

					/**
					*	This is to get the default values like recent searches and popular searches
					*/
					function getDefaultVals() {
						searchService.getDefaultValues().then(function(data) {
							scope.searcher.defaultVals = data.data;
						});
					}

					/**
					*	This is to load the values from the json file based on the input typed
					*/
					function loadValues(keyWord) {
						searchService.getValues(keyWord).then(function(data) {
							scope.searcher.searchVals = data;
						});
					}

					/**
					*	Initiaize the watches for the directive
					*/
					function initializeWatcher() {
						scope.$watch('searcher.searchInput', function(newVal, oldVal) {
							if (oldVal == newVal) return;
							loadValues(newVal);
						});
					}
					
					/**
					*	Initialize the directive
					*/
					scope.init = function() {
						scope.searcher = {};

						scope.searcher.defaultVals = [];
						scope.searcher.searchVals = {};
						scope.searcher.searchVals.results = undefined;
						scope.searcher.searchInput = '';
						scope.searcher.selectedItem = '';
						getDefaultVals();
						initializeWatcher();
					};

					scope.init(); //Directive functionality initialized here
				}
			}
		}
})();