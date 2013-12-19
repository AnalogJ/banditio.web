angular.module('banditApp.controllers', [ 'banditApp.services','btford.socket-io','infinite-scroll'])
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
                    if(!$scope.currentPage('capture')){
                        $scope.missed_requests +=0.25; //TODO: fix stupid hack because requests have 4 updates... sigh.
                    }

                })
        });


        $scope.currentPage = function(check_page){
            var currentRoute = $location.path().substring(1) || 'capture';
            return currentRoute.lastIndexOf(check_page, 0) === 0;
        }


    })
    //Panel Controllers
    .controller('roomCtrl', function ($scope,$routeParams, socket,cfpLoadingBar, banditdb) {
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
        $scope.prev_resources = {}
        var next_start_key =null;
        $scope.resources_left = 0;
        $scope.getPreviousResources = function(){
            if($scope.loading_prev_resources || next_start_key == -1){
                return;
            }
            $scope.loading_prev_resources = true;
            cfpLoadingBar.start();
            banditdb.getPreviousResources(5,next_start_key)
                .then(function(resp){
                    $scope.loading_prev_resources = false;
                    cfpLoadingBar.complete();
                    next_start_key = resp.next_start_key;


                    $.extend($scope.prev_resources, resp.data_page);

                    $scope.prev_resource_times = $scope.prev_resource_times || [];
                    //debugger;
                    for(var resource_id in resp.data_page){
                        $scope.prev_resource_times.push({
                            'resource_id': resource_id,
                            'request_start_time': resp.data_page[resource_id].request.request_start_time
                        })
                    }
                    $scope.resources_left = $scope.prev_resource_times.length +  resp.data_left
                }).catch(function(err){
                    $scope.loading_prev_resources = false;
                    cfpLoadingBar.complete()
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
    .controller('resourceCtrl', function ($scope,$routeParams, socket,cfpLoadingBar, banditdb) {


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
        cfpLoadingBar.start();
        banditdb.db.get($routeParams.resource_id).then(function(data){
            console.log(data);
            $scope.resource = data;
            return data;

        }).then(function(){
                return banditdb.db.getAttachment($routeParams.resource_id, 'response_data').then(function(data){
                    var reader = new FileReader();
                    reader.onloadend = function() {
                        $scope.resource.response.data = reader.result;
                    };
                    reader.readAsText(data);
                },function(err){
                    console.log(err)
                })
            })
            .then(function(){
                return banditdb.db.getAttachment($routeParams.resource_id, 'request_data').then(function(data){
                    var reader = new FileReader();
                    reader.onloadend = function() {
                        $scope.resource.request.data = reader.result;
                    };
                    reader.readAsText(data);
                },function(err){
                    console.log(err)
                })
            })
            ['finally'](function(){
                cfpLoadingBar.complete();
            })




    })
    .controller('meddleCtrl', function ($scope,$routeParams,$sce, socket,cfpLoadingBar, banditdb) {
        $scope.room_id = $routeParams.room_id || window.ROOM_ID;
        console.log('meddle')
        $scope.loadingFinished = function(){
            $scope.loadingDebugger = false;
            cfpLoadingBar.complete();
        }
        $scope.loadingDebugger = true;
        cfpLoadingBar.start();

        $scope.debuggerUrl = $sce.trustAsResourceUrl('https://trigger.io/catalyst/client/#'+($scope.room_id || 'default'));

    })


