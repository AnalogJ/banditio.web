angular.module('banditApp.services', ['pouchdb'])

    .factory('banditdb', function($q,pouchdb) {
        var banditdb = pouchdb.create('banditdb')

        var cache = {};

        function handleSocketMessage(socket_message){
            if (!socket_message.resource_id) {
                //resolve with error.
                throw "no resource_id sent";
            }
            //initialize if empty
            cache[socket_message.resource_id] = getResource(socket_message.resource_id, {request: {}, response: {}})
                .then(function (resource) {
                    //handle message
                    console.log('handing message:'+ socket_message.message_type)
                    switch (socket_message.message_type) {
                        case "REQUEST":
                            resource.request = socket_message.payload;
                            break;
                        case "REQUEST_BODY":
                            break;
                        case "RESPONSE":
                            resource.response = socket_message.payload;
                            resource.response.info.filesize = humanize.filesize(resource.response.headers['content-length']);
                            break;
                        case "RESPONSE_BODY":
                            //TODO:store the response and request data in a pouchdb attachment.
                            //banditdb.saveAttachment(data.resource_id,data.message_type,data.payload,$scope.resources[data.resource_id].response.info['content_type']).catch(function(err){
                            //    console.log('err',err)
                            //})
                            resource.response.data = socket_message.payload
                            break;
                        case "RES_CONSOLE_MESSAGE":
                            break;
                        case "RES_CONSOLE_COMMAND":
                            break;
                        case "RES_DISCONNECTED":
                            break;
                        case "PROXY_AUTHORIZED":
                            break;
                        default:
                            console.log('SWITCH FAILED', socket_message.resource_id, socket_message.message_type)
                            throw "switch failed."
                            break;
                    }
                    //store the data in the database
                    return resource;

                    //send message to any listeners that a message has been handled
                })
                .then(function(resource){
                    console.log('saving resource', resource);
                    return saveResource(socket_message.resource_id, resource);
                })

            return cache[socket_message.resource_id];
        }



        function getResource(resource_id, default_payload){
            if(cache[resource_id]){
                return cache[resource_id];
            }
            else{
                cache[resource_id] = banditdb
                    .get(resource_id)
                    .catch(function(err){
                        //resourece not found, save it.
                        console.log('file not found:'+resource_id,err);
                        default_payload = default_payload || {};
                        default_payload['_id'] = resource_id
                        return default_payload;
                    })
                return cache[resource_id]
            }
        }

        function saveResource(resource_id, payload){

            /*
             return banditdb.put(payload).then(function(document){
             console.log(document)
             }).catch(function(err){
             console.log('err,', err)
             })
             */
            //payload['_id'] = resource_id
            return banditdb.put(payload).then(function(data){
                payload['_rev'] = data.rev;
                return payload;
            })

            /* No longer needed since caching was implemented...? leaving code in place until caching is fully tested.
            //.catch(retry)

            function retry(err){
                //resourece could not be saved.
                console.log('resource could not be saved, attempt to get the resourece again',err)
                console.log('payload has current ref:' + payload['_rev']);
                return getResource(resource_id).then(function(resource){
                    console.log('stored resourece has ref:' + resource['_rev']);
                    delete payload['_rev']
                    $.extend(resource, payload);
                    console.log('new object has ref:', resource['_rev']);
                    return banditdb.put(resource).catch(retry)
                })

            }
            */
        }

        function deleteResource(resource_id){
            return getResource(resource_id)
                .then(function(resource){
                    console.log('deleteing',resource)
                    if(resource['_id']){
                        return banditdb.remove(resource)
                    }
                })
                .catch(function(err){
                    console.log(err)
                })
        }



        function saveAttachment(resource_id, type, payload, content_type){
            return banditdb.get(resource_id).then(function(document){
                //resource found, update it
                var doc = new Blob(['sdfsdf']);
                console.log(resource_id, type, null, doc, 'text/plain')
                return banditdb.putAttachment(resource_id,type,null, doc, 'text/plain')
            });
        }


        function getPreviousResources(number){

            function map(doc){
                //console.log(doc)
                if(doc.request && doc.request.request_start_time){
                    emit(doc.request.request_start_time, doc);
                }
            }
            number = number || 10;
            return banditdb.query({map: map},{reduce: false}).then(function(data){
                var sub_data = data.rows.slice(Math.max(data.rows.length-number, 0), data.rows.length);
                var resp = {}
                for(var ndx in sub_data){
                    resp[sub_data[ndx]['id']] = sub_data[ndx].value
                }
                console.log(resp)
                return resp;

            });


        }


        return {
            db : banditdb,
            handleSocketMessage: handleSocketMessage,
            saveResource : saveResource,
            deleteResource: deleteResource,
            saveAttachment: saveAttachment,
            getPreviousResources: getPreviousResources
        };
    })