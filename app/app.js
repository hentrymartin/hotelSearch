/**
*	This is the application config file 
*	In this application, I am following the best practices 
*	from john papa angular practice guide
*	https://github.com/johnpapa/angular-styleguide [Refer to this site for more details]	
*	Author : Hentry Martin
*	Date : 15/Sep/2015
*/
(function() {

	'use strict';
	angular.module('zumata', ['ui.router'])
	.config(configurator);

	configurator.$inject = ['$stateProvider', '$urlRouterProvider'];

	function configurator($stateProvider, $urlRouterProvider) {

		$stateProvider
			.state('home', {
				url : '/home',
				templateUrl : 'app/partials/home.html',
				controller : 'HomeController'
			});

			$urlRouterProvider.otherwise('/home');
	}


})();