/**
 * Created with JetBrains WebStorm.
 * User: Jason
 * Date: 9/21/13
 * Time: 11:13 PM
 * To change this template use File | Settings | File Templates.
 */
'use strict';
// Declare app level module which depends on filters, and services
angular.module('banditApp', ['banditApp.controllers',
        'banditApp.services',
        'ngRoute',
        'ui.bootstrap',
        'chieffancypants.loadingBar',
        'ngAnimate'
    ]).
    config(['$routeProvider', '$locationProvider', function($routeProvider, $locationProvider) {
        $routeProvider.when('/capture/:room_id', {templateUrl: '/views/capture.html', controller: 'roomCtrl'});
        $routeProvider.when('/about', {templateUrl: '/views/about.html'});
        $routeProvider.when('/home', {templateUrl: '/views/home.html'});

        $routeProvider.otherwise({redirectTo: '/home'});
        $locationProvider.hashPrefix('!');
        $locationProvider.html5Mode(true);
    }])