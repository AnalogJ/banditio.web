angular.module('banditApp.controllers', [ 'banditApp.services','btford.socket-io'])
    //Panel Controllers
    .controller('roomCtrl', function ($scope, socket, banditdb) {


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
            else{
                return;
            }
            switch (data.message_type) {
                case "REQUEST":
                    $scope.resources[data.resource_id].request = data.payload;
                    break;
                case "REQUEST_BODY":
                    break;
                case "RESPONSE":
                    $scope.resources[data.resource_id].response = data.payload;
                    $scope.resources[data.resource_id].response.info.filesize = humanize.filesize($scope.resources[data.resource_id].response.headers['content-length']);
                    //$scope.resources[data.resource_id].response.headers = data.payload.response_header;
                    //$scope.resources[data.resource_id].response_info = data.payload.response_info;
                    break;
                case "RESPONSE_BODY":
                    banditdb.saveAttachment(data.resource_id,data.message_type,data.payload,$scope.resources[data.resource_id].response.info['content_type']).catch(function(err){
                        console.log('err',err)
                    })
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

            //store the data in the database
            banditdb.saveResource(data.resource_id, $scope.resources[data.resource_id])


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