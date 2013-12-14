
var request = require('request')
    , bases = require('bases')
/*
 * GET Marketing pages.
 */
exports.about = function(req, res){
    res.render('about', { title: 'Express' });
};

/*
 * GET home page.
 */
exports.index = function(req, res){
    res.redirect('/snoop/'+ bases.toBase36('123'));
};

exports.snoop = function(req, res){
    res.render('snoop', { room_id: req.params.room_id });
}
//sets the content for the javascript file that will be injected on each html page.
exports.meddle = function(req, res){
    res.header("Content-Type", "application/javascript");
    res.render('meddle',{room_id: req.params.room_id})
}

exports.example_request = function(req, res){
    request.get('http://www.example.com/', {'proxy':'http://'+req.body.room_id+':X@proxy.bandit.io:8080'});
    res.end()
}

exports.partials = function (req, res) {
    var name = req.params.name;
    res.render('partials/' + name);
};