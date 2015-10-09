/**
*	This is to get the data from the temporary json files
*/
(function() {
	'use strict';

	angular.module('zumata')
		.factory('searchService', searchService);

	searchService.$inject = ['$http', '$q'];

	function searchService($http, $q) {

		return {
			getDefaultValues : getDefaultValues,
			getValues : getValues
		}

		function getValues(keyWord) {

			if (!keyWord) keyWord = '';
			var url = '';
			if (keyWord.indexOf('sin') > -1) {
				url = '/zumata/assets/data/auto_complete-sin.json';	
			} else if (keyWord.indexOf('kuala') > -1) {
				url = '/zumata/assets/data/auto_complete-kuala.json';
			}

			var defer = $q.defer();
			if (url.length > 0) {
				$http.get(url).then(function(data) {
					defer.resolve(data.data);
				}, defer.reject);
			} else {
				defer.resolve([]);
			}

			return defer.promise;
		}

		function getDefaultValues() {
			return $http.get('/zumata/assets/data/Recent-Popular-search-(default).json');
		}
	}
})();