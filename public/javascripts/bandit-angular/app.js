/**
 * Created with JetBrains WebStorm.
 * User: Jason
 * Date: 9/21/13
 * Time: 11:13 PM
 * To change this template use File | Settings | File Templates.
 */
'use strict';
// Declare app level module which depends on filters, and services
angular.module('banditApp', ['banditApp.controllers','banditApp.services','btford.socket-io']).
    config(['$routeProvider', '$locationProvider', function($routeProvider, $locationProvider) {
        $routeProvider.when('/snoop/:room_id', {templateUrl: '/partials/room_template', controller: 'roomCtrl'});

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
        var mySocket = io.connect('http://localhost');
        // do stuff with mySocket
        mySocket.on('connect', function() {
            mySocket.emit('join', ROOM_ID);
        })
       // mySocket.on('message', function(msg) {
       //     console.log('[BANDIT-WEB]: '+ msg)
       //
       //     //Parse the message, checking for message types that are important to us. This parsing will be done by Angular in the future.
       // });

        socketProvider.ioSocket(mySocket);
    });