
var request = require('request')
    , Hashids = require("hashids")
    , hashids = new Hashids("BanditIOSalt")


/*
exports.capture = function(req, res){
    res.render('capture', { room_id: req.params.room_id });
}
//sets the content for the javascript file that will be injected on each html page.
exports.meddle = function(req, res){
    res.header("Content-Type", "application/javascript");
    res.render('meddle',{room_id: req.params.room_id})
}
*/

exports.example_request = function(req, res){
    request.get('http://www.example.com/', {'proxy':'http://'+req.body.room_id+':X@proxy.bandit.io:8080'});
    res.end()
}

exports.partials = function (req, res) {
    var name = req.params.name;
    res.render('partials/' + name);
};

//Angular Requests.
exports.wildcard = function(req, res){
    var room_id = null;
    if(req.params.room_id){
        console.log('found room_id in params')
        room_id = req.params.room_id;
    }
    else if(req.cookies.room_id){
        console.log('found room_id in cookie')
        room_id = req.cookies.room_id;
    }
    else{
        var timestamp = new Date().getTime();
        var randomizer = Math.ceil(Math.random()*100);
        room_id = hashids.encrypt(timestamp, randomizer);
    }
    res.cookie('room_id', room_id, { maxAge: 60*60*1000 }) //expires in 60 minutes
    //check roomid parameter, then check cookie, then generate room_id.
    res.render('angular', { room_id: room_id });
}