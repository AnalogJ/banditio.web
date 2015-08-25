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
        'banditApp.directives',
        'btford.socket-io',
        'ngRoute',
        'ui.bootstrap',
        'hljs',
        'chieffancypants.loadingBar',
        'ngAnimate'
    ]).
    config(['$routeProvider', '$locationProvider', function($routeProvider, $locationProvider) {
        $routeProvider.when('/capture/:room_id', {templateUrl: '/partials/capture_template', controller: 'roomCtrl'});
        $routeProvider.when('/about', {templateUrl: '/partials/coming_soon_template'});
        $routeProvider.when('/home', {templateUrl: '/partials/home_template'});

        $routeProvider.otherwise({redirectTo: '/home'});
        $locationProvider.hashPrefix('!');
        $locationProvider.html5Mode(true);
    }])
    .run(function (socket) {
        socket.forward('error');
    })
    .config(function($httpProvider, socketProvider){
        //http://stackoverflow.com/questions/16661032/http-get-is-not-allowed-by-access-control-allow-origin-but-ajax-is
        delete $httpProvider.defaults.headers.common['X-Requested-With'];

    })