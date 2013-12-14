angular.module('banditApp.controllers', [ 'banditApp.services','btford.socket-io'])
    //Panel Controllers
    .controller('roomCtrl', function ($scope, socket) {


        console.log('im in the room ctrl');
        $scope.resources = {};
        socket.forward('message', $scope);
        $scope.$on('socket:message', function (ev, data) {
            //$scope.theData = data;
            parseMessage(data)
            console.log('MESSAGE FROM INSIDE CONTROLLER: '+ data)
        });

        function parseMessage(data){
            if(data.resource_id){
                //initialize if empty
                $scope.resources[data.resource_id] = $scope.resources[data.resource_id] || {};
            }
            switch (data.message_type) {
                case "REQUEST_HEADER":
                    $scope.resources[data.resource_id].request_header = data.payload;
                    break;
                case "REQUEST_BODY":
                    break;
                case "RESPONSE_HEADER":
                    $scope.resources[data.resource_id].response_header = data.payload.response_header;
                    $scope.resources[data.resource_id].response_info = data.payload.response_info;
                    break;
                case "RESPONSE_BODY":
                    $scope.resources[data.resource_id].response_body = data.payload;
                    break;
                case "RES_CONSOLE_MESSAGE":
                    break;
                case "RES_CONSOLE_COMMAND":
                    break;
                case "RES_DISCONNECTED":
                    break;
                default:
                    console.log('SWITCH FIALED', data.resource_id)
                    break;
            }



        }


    })
    .controller('headerCtrl', function ($scope,$route, $routeParams, $http) {

        $scope.example_request = function(){
           console.log($routeParams.room_id)
            var data = {room_id: $routeParams.room_id};
            $http({
                method: 'POST',
                url: '/example_request',
                data: data,
                headers: {'Content-Type': 'application/json'}
            })
        }


    })