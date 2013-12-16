angular.module('banditApp.controllers', [ 'banditApp.services','btford.socket-io'])
    // Nav Controller (Top bar and Left Menu)
    .controller('navCtrl', function($scope,$routeParams,socket,banditdb){
        //Global variables
        $scope.room_id = $routeParams.room_id
        $scope.current_page_name = 'Dashboard'

        socket.forward('message', $scope);
        $scope.$on('socket:message', function (ev, data) {
            //$scope.theData = data;
            banditdb.handleSocketMessage(data)
            console.log('MESSAGE FROM INSIDE NAV Controller: '+ data)
        });



    })
    //Panel Controllers
    .controller('roomCtrl', function ($scope,$routeParams, socket, banditdb) {

        $scope.room_id = $routeParams.room_id
        console.log('im in the room ctrl');
        $scope.resources = {};
        $scope.resource_times = [];


        //Logic for current table

        // toggle selection for a given fruit by name
        $scope.current_resource_selection = []
        $scope.toggleCurrentSelection = function (resource_id) {
            console.log('clicked on, ', resource_id, $scope.current_resource_selection )
            var idx = $scope.current_resource_selection.indexOf(resource_id);

            // is currently selected
            if (idx > -1) {
                $scope.current_resource_selection.splice(idx, 1);
            }

            // is newly selected
            else {
                $scope.current_resource_selection.push(resource_id);
            }
        };



        //Logic for previous table
        $scope.prev_resource_selection = {};
        $scope.loading_prev_resources = true;
        banditdb.getPreviousResources(5)
            .then(function(resp){
                $scope.loading_prev_resources = false;
                $scope.prev_resources = resp;

                $scope.prev_resource_times = [];
                for(var resource_id in resp){
                    console.log(resource_id)
                    $scope.prev_resource_times.push({
                        'resource_id': resource_id,
                        'request_start_time': resp[resource_id].request.request_start_time
                    })
                }
                console.log($scope.prev_resource_times.length)

            }).catch(function(err){
                $scope.loading_prev_resources = false;
            });


        $scope.showDelete = function(){
            for(var prop in $scope.prev_resource_selection){
                if($scope.prev_resource_selection[prop]){
                    return true;
                }
            }
            return false;
        }

        $scope.clickDelete = function(){
            //delete all selected values.
            for(var resource_id in $scope.prev_resource_selection){
                if($scope.prev_resource_selection[resource_id]){
                    banditdb.deleteResource(resource_id).then(function(data){
                        var resource_id = data['id']
                        delete $scope.prev_resource_selection[resource_id];

                        for(ndx in $scope.prev_resource_times){
                            if($scope.prev_resource_times[ndx].resource_id == resource_id){
                                $scope.prev_resource_times.splice(ndx,1);
                            }
                        }

                    })
                }
            }

            console.log('selection = ', $scope.prev_resource_selection)
        }
        $scope.clickClear = function(){
            for(var resource_id in $scope.prev_resource_selection){
                delete $scope.prev_resource_selection[resource_id];
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
    .controller('resourceCtrl', function ($scope,$routeParams, socket, banditdb) {


        console.log('im in the room ctrl');
        $scope.resources = {};
        socket.forward('message', $scope);
        $scope.$on('socket:message', function (ev, data) {
            //$scope.theData = data;
            parseMessage(data)
            console.log('MESSAGE FROM INSIDE Resource Controller: '+ data)
        });

        function parseMessage(data){
            if(data.resource_id){
                //initialize if empty
                $scope.resources[data.resource_id] = $scope.resources[data.resource_id] || {request: {}, response: {}};
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
                    //TODO:store the response and request data in a pouchdb attachment.
                    //banditdb.saveAttachment(data.resource_id,data.message_type,data.payload,$scope.resources[data.resource_id].response.info['content_type']).catch(function(err){
                    //    console.log('err',err)
                    //})
                    $scope.resources[data.resource_id].response.data = data.payload
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

        $scope.room_id =$routeParams.room_id;
        $scope.resource_id = $routeParams.resource_id;
        $scope.selected = 'REQUEST'
        $scope.setSelected = function(selected){
            if($scope.selected != selected){
                $scope.selected = selected;
            }
            else{
                $scope.selected = '';
            }
        }

        console.log($routeParams.resource_id);
        banditdb.db.get($routeParams.resource_id).then(function(data){
            console.log(data);
            $scope.resource = data;
        }).catch(function(err){
                console.log(err)
            });
    })


