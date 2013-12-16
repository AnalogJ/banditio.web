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
        'hljs'
    ]).
    config(['$routeProvider', '$locationProvider', function($routeProvider, $locationProvider) {
        $routeProvider.when('/snoop/:room_id', {templateUrl: '/partials/room_template', controller: 'roomCtrl'});
        $routeProvider.when('/snoop/:room_id/:resource_id', {templateUrl: '/partials/resource_template', controller: 'resourceCtrl'});
        $routeProvider.when('/settings', {templateUrl: '/partials/settings_template', controller: 'settingsCtrl'});
        $routeProvider.when('/about', {templateUrl: '/partials/coming_soon_template'});
        $routeProvider.when('/files', {templateUrl: '/partials/files_template'});
        $routeProvider.when('/meddle/:room_id', {templateUrl: '/partials/meddle_template', controller: 'meddleCtrl'});

        $routeProvider.otherwise({redirectTo: '/snoop/default'});
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
    .config(function (socketProvider) {
        var mySocket = io.connect('http://localhost:5000');
        //var mySocket = io.connect('http://proxy.bandit.io:5000');
        //
        // do stuff with mySocket
        mySocket.on('connect', function() {
            mySocket.emit('join', '123');//ROOM_ID);
        })
//        mySocket.on('message', function(msg) {
//            console.log('[BANDIT-WEB]: '+ msg)
//
//            //Parse the message, checking for message types that are important to us. This parsing will be done by Angular in the future.
//        });

        socketProvider.ioSocket(mySocket);
    });