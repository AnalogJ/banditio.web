angular.module('banditApp.controllers', [ 'banditApp.services','btford.socket-io'])
    //Panel Controllers
    .controller('roomCtrl', function ($scope, socket) {
        socket.forward('message', $scope);
        scope.$on('socket:message', function (ev, data) {
            //$scope.theData = data;
            console.log('MESSAGE FROM INSIDE CONTROLLER: '+ data)
        });
    })