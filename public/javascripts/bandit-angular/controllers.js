angular.module('banditApp.controllers', [ 'banditApp.services','btford.socket-io'])
    // Nav Controller (Top bar and Left Menu)
    .controller('navCtrl', function($scope,$routeParams,$location,socket,banditdb){
        //Global variables
        $scope.room_id = $routeParams.room_id || window.ROOM_ID
        $scope.missed_requests = 0;

        socket.forward('message', $scope);
        $scope.$on('socket:message', function (ev, data) {
            //$scope.theData = data;
            banditdb.handleSocketMessage(data)
                .then(function(resource){
                    $scope.$broadcast('updated_resource', resource);
                    if(!$scope.currentPage('snoop')){
                        $scope.missed_requests +=0.25; //TODO: fix stupid hack because requests have 4 updates... sigh.
                    }

                })
        });


        $scope.currentPage = function(check_page){
            var currentRoute = $location.path().substring(1) || 'snoop';
            return currentRoute.lastIndexOf(check_page, 0) === 0;
        }


    })
    //Panel Controllers
    .controller('roomCtrl', function ($scope,$routeParams, socket, banditdb) {
        $scope.room_id = $routeParams.room_id || window.ROOM_ID


        ////////////////////////////////////////////////////////////////////////////////////////////////////////////////
        //Logic for current table
        $scope.current_resource_selection = {}
        $scope.resources = {};
        $scope.resource_times = [];

        var cleanUpResourceListener = $scope.$on('updated_resource',
            function(event, resource) {
                if(!$scope.resources[resource['_id']]){
                    //object is seen for the first time. add resource_times obj
                    $scope.resource_times.push({'resource_id': resource['_id'], 'request_start_time': resource.request.request_start_time});
                }
                $scope.resources[resource['_id']] = resource;

            });
        $scope.$on('$destroy', function() {
            cleanUpResourceListener();
        })



        ////////////////////////////////////////////////////////////////////////////////////////////////////////////////
        //Logic for previous table
        $scope.prev_resource_selection = {};

        $scope.getPreviousResources = function(){
            if($scope.loading_prev_resources){
                return;
            }
            $scope.loading_prev_resources = true;
            banditdb.getPreviousResources(5)
                .then(function(resp){
                    $scope.loading_prev_resources = false;
                    $scope.prev_resources = resp;

                    $scope.prev_resource_times = [];
                    for(var resource_id in resp){
                        $scope.prev_resource_times.push({
                            'resource_id': resource_id,
                            'request_start_time': resp[resource_id].request.request_start_time
                        })
                    }

                }).catch(function(err){
                    $scope.loading_prev_resources = false;
                });
        }
        $scope.getPreviousResources();


        ////////////////////////////////////////////////////////////////////////////////////////////////////////////////
        // Event Handlers
        $scope.showDelete = function(){
            for(var prop in $scope.prev_resource_selection){
                if($scope.prev_resource_selection[prop]){
                    return true;
                }
            }
            for(var prop in $scope.current_resource_selection){
                if($scope.current_resource_selection[prop]){
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
            for(var resource_id in $scope.current_resource_selection){
                if($scope.current_resource_selection[resource_id]){
                    banditdb.deleteResource(resource_id).then(function(data){
                        var resource_id = data['id']
                        delete $scope.current_resource_selection[resource_id];

                        for(ndx in $scope.resource_times){
                            if($scope.resource_times[ndx].resource_id == resource_id){
                                $scope.resource_times.splice(ndx,1);
                            }
                        }

                    })
                }
            }

        }
        $scope.clickClear = function(){
            for(var resource_id in $scope.prev_resource_selection){
                delete $scope.prev_resource_selection[resource_id];
            }
            for(var resource_id in $scope.current_resource_selection){
                delete $scope.current_resource_selection[resource_id];
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

        $scope.room_id =$routeParams.room_id|| window.ROOM_ID
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
    .controller('meddleCtrl', function ($scope,$routeParams, socket, banditdb) {
        $scope.room_id = $routeParams.room_id || window.ROOM_ID;
        console.log('meddle')
        $scope.loadingFinished = function(){
            $scope.loadingDebugger = false;
            console.log('finsihed loading.')
        }
        $scope.loadingDebugger = true;

        var debuggerUrl = 'https://trigger.io/catalyst/client/#'+($scope.room_id || '991842F0-9862-4628-97F5-ACA0C1EA71C5');
        $scope.debuggerUrl = debuggerUrl

    })


