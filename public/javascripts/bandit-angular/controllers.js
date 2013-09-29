angular.module('banditApp.controllers', [ 'banditApp.services','btford.socket-io','ui.bootstrap'])
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

        function parseMessage(message){
            console.log(message)
            if(message.resource_id){
                //initialize if empty
                $scope.resources[message.resource_id] = $scope.resources[message.resource_id] || {};
            }
            switch (message.message_type) {
                case "REQUEST_HEADER":
                    $scope.resources[message.resource_id].request_header = message.payload;
                    break;
                case "REQUEST_BODY":
                    break;
                case "RESPONSE_HEADER":
                    $scope.resources[message.resource_id].response_header = message.payload.response_header;
                    $scope.resources[message.resource_id].response_info = message.payload.response_info;
                    break;
                case "RESPONSE_BODY":
                    $scope.resources[message.resource_id].response_body = message.payload;
                    break;
                case "RES_CONSOLE_MESSAGE":
                    break;
                case "RES_CONSOLE_COMMAND":
                    break;
                case "RES_DISCONNECTED":
                    break;
                default:
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
    .controller('ModalDemoCtrl',function ($scope, $modal, $log) {

        $scope.items = ['item1', 'item2', 'item3'];

        $scope.open = function () {

            var modalInstance = $modal.open({
                templateUrl: 'myModalContent.html',
                controller: 'ModalInstanceCtrl',
                resolve: {
                    items: function () {
                        return $scope.items;
                    }
                }
            });

            modalInstance.result.then(function (selectedItem) {
                $scope.selected = selectedItem;
            }, function () {
                $log.info('Modal dismissed at: ' + new Date());
            });
        };
    })
    .controller('ModalInstanceCtrl',function ($scope, $modalInstance, items) {

        $scope.items = items;
        $scope.selected = {
            item: $scope.items[0]
        };

        $scope.ok = function () {
            $modalInstance.close($scope.selected.item);
        };

        $scope.cancel = function () {
            $modalInstance.dismiss('cancel');
        };
    })    ;