/**
*	This controller holds the functionality deals with home page
*	Author : P Hentry Martin
*	Date : 16/Sep/2015
*/
(function() {

	'use strict';

	angular.module('zumata')
		.controller('HomeController', homeController);

		homeController.$inject = ['$scope'];	//Dependency injection

		function homeController($scope) {

			$scope.init = function() {
				//For later use, if needed
			};

			$scope.init();
		}
})();