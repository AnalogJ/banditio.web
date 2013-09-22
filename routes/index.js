var uuid = require('node-uuid');

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
    res.redirect('/snoop/'+ uuid.v4());
};

exports.snoop = function(req, res){
    res.render('snoop', { room_id: req.params.room_id });
}

exports.partials = function (req, res) {
    var name = req.params.name;
    res.render('partials/' + name);
};