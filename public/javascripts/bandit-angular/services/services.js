angular.module('banditApp.services', ['pouchdb'])

    .factory('banditdb', function(pouchdb) {
        var banditdb = pouchdb.create('banditdb')

        function saveResource(resource_id, payload){
            /*
            return banditdb.put(payload).then(function(document){
                console.log(document)
            }).catch(function(err){
                    console.log('err,', err)
                })
                */
            payload['_id'] = resource_id
            banditdb.get(resource_id).then(function(document){
                //resource found, update it.
                return banditdb.put($.extend(document, payload))

            }).catch(function(){
                //resourece not found, save it.
                    return banditdb.put(payload)
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
            saveResource : saveResource,
            saveAttachment: saveAttachment,
            getPreviousResources: getPreviousResources
        };
    })