angular.module('banditApp.services', ['pouchdb' ])

    .factory('banditdb', function($q,pouchdb) {
        var banditdb = pouchdb.create('banditdb')

        var cache = {};

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

        function saveAttachment(resource_id, resource){
            //attachment will only come in one at a time, either the requst data or response data, not both
            if(resource.request.data){
                var doc = new Blob([resource.request.data]);
                var content_type = resource.request.content_type || 'text/plain'
                return banditdb.putAttachment(resource_id,'request_data',resource['_rev'], doc, content_type).then(function(){
                    console.log('saved attachment')
                    delete resource.request.data
                    return resource;
                })
            }
            if(resource.response.data){
                var doc = new Blob([resource.response.data]);
                var content_type = resource.response.content_type || 'text/plain'
                return banditdb.putAttachment(resource_id,'response_data',resource['_rev'], doc, content_type).then(function(){
                    console.log('saved attachment')
                    delete resource.response.data
                    return resource;
                })
            }

            return resource;

            /*
            return banditdb.get(resource_id).then(function(document){
                //resource found, update it
                var doc = new Blob(['sdfsdf']);
                console.log(resource_id, type, null, doc, 'text/plain')

            });
            */
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

        function getPreviousResources(number, startkey){

            /*function map(doc){
                //console.log(doc)
                if(doc.request && doc.request.request_start_time){
                    emit(doc.request.request_start_time, doc);
                }
            }
            number = (number || 10);
            return banditdb.query({map: map},{reduce: false}).then(function(data){
                var sub_data = data.rows.slice(Math.max(data.rows.length-number, 0), data.rows.length);
                var resp = {}
                for(var ndx in sub_data){
                    resp[sub_data[ndx]['id']] = sub_data[ndx].value
                }
                console.log(resp)



                return resp;

            });
            */

            return banditdb.allDocs({'startkey': startkey, 'include_docs': true}).then(function(data){

                var page_end = Math.min(number, data.rows.length )
                var data_page = data.rows.slice(0, page_end); //get the first x objects
                var resp_data_page = {}
                for(var ndx in data_page){
                    resp_data_page[data_page[ndx]['id']] = data_page[ndx].doc
                }

                var next_start_key = -1
                if(data.rows.length > number){
                    //there are more rows left to display.
                    next_start_key = data.rows[number].key;
                }
                var resp = {
                    'data_left' : data.rows.length,
                    'data_page' : resp_data_page,
                    'next_start_key' : next_start_key
                }
                return resp;

            })

        }


        return {
            db : banditdb,
            handleSocketMessage: function(){},
            saveResource : saveResource,
            deleteResource: deleteResource,
            saveAttachment: saveAttachment,
            getPreviousResources: getPreviousResources
        };
    })