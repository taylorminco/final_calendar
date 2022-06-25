'use strict';

var calendarController = angular.module('calendarController', []);
var calendarFilters = angular.module('calendarFilters', []);


calendarController.controller('monthCtrl', function($scope, $http, $routeParams, $filter, $location) {
	
	$scope.months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];

    
	$scope.twoDigit = function(num) {
		return ('0' + num).slice(-2);
	}
	
    $scope.getNumber = function(num) {
		if (num<0) num=0;
        return new Array(num);
    }
    
	
	$scope.currentMonth = $routeParams.month;
	$scope.currentYear = $routeParams.year;
	
	$scope.firstDay = new Date($scope.currentYear, $scope.currentMonth - 1, 1).getDay();
	$scope.firstDay =($scope.firstDay==0)?7:$scope.firstDay;
	$scope.remainingDays = 7 - (new Date($scope.currentYear, $scope.currentMonth, 0).getDay());
	$scope.remainingDays = ($scope.remainingDays>6)?0:$scope.remainingDays;
	
    var daysInMonth =  new Date($routeParams.year, $routeParams.month, 0).getDate();
    $scope.totalDays = parseInt(daysInMonth, 10);
    $scope.yearMonth = $routeParams.year + '-' + $scope.twoDigit($routeParams.month) + '-';
	
});

calendarController.controller('dayCtrl', function($scope, $http, $filter, $location) {
    $scope.day = $scope.date.split('-').slice(-1)[0].replace(/\b0(?=\d)/g, ''); // Get the day from the date and remove leading 0s
    
    $http.get('/tasks/date/' + $scope.date).
    success(function(data, status, headers, config) {
		$scope.dayTasks = data;
    });
});

calendarController.controller('ViewTaskCtrl', function($scope, $http, $routeParams, $location) {

    $scope.newUser = '';
	
    $http.get('/tasks/id/' + $routeParams.taskId).
    success(function(data, status, headers, config) {
		$scope.task = data;
    });
	
	$scope.todoSave = function (form) {
		if (form.$valid){
			if (typeof $routeParams.date !=='undefined') {
				$http.post('/tasks/new/', $scope.task).
				success(function(data, status, headers, config) {
					$location.path('/');
				});
			}
			else {
				$http.put('/tasks/'+$routeParams.taskId, $scope.task).
					success(function(data, status, headers, config) {
					$location.path('/');
				});
			}		
		}
    };
	
//	$scope.timeOptions = {
//		showMeridian: false
//	};
//	
//	// For the datepicker
//	$scope.open = function($event, el) {
//		$event.preventDefault();
//		$event.stopPropagation();
//		$scope.opened = [];
//		$scope.opened[el] = true;
//	 };
});

calendarFilters.filter('num', function() {
    return function(input) {
      return parseInt(input, 10);
    };
});

