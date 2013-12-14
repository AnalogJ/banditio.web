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

        return {
            saveResource : saveResource,
            saveAttachment: saveAttachment
        };
    })