/**
*	This is a custom directive written for the purpose of stopping the event propagation
*	Author : P Hentry Martin
*	Date : 16/Sep/2015
*/

(function() {
	'use strict';

	angular.module('zumata')
		.directive('stopProp', stopProp);

		function stopProp() {
			return {
				restrict : 'A',
				link : function(scope, elem, attr) {

					scope.init = function() {
						$(elem).click(function(event) {
							event.stopPropagation();
						});
					};

					scope.init();
				}
			}
		}
})();