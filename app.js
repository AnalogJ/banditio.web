
/**
 * Module dependencies.
 */

var express = require('express');
var engine = require('ejs-locals')
var routes = require('./routes');

var http = require('http');
var path = require('path');

var app = express();
app.engine('ejs', engine);
// all environments
app.set('port', process.env.PORT || 3000);
app.set('views', __dirname + '/views');
app.set('view engine', 'ejs');
app.use(express.favicon());
app.use(express.logger('dev'));
app.use(express.bodyParser());
app.use(express.methodOverride());
app.use(express.cookieParser('your secret here'));
app.use(express.session());
app.use(app.router);
//bootstrap-less configuration.
var bootstrapPath = path.join(__dirname, 'public','components', 'bootstrap','less');
var cirrusPath = path.join(__dirname, 'public','components', 'bootstrap-theme-cirrus','less');
app.use(require('less-middleware')({
    src: __dirname + '/public',
    paths  : [cirrusPath, bootstrapPath],
    //compress: true
}));
app.use(express.static(path.join(__dirname, 'public')));

// development only
if ('development' == app.get('env')) {
  app.use(express.errorHandler());
}

var server = http.createServer(app);
var io = require('socket.io').listen(server);
server.listen(app.get('port'), function(){
  console.log('Express server listening on port ' + app.get('port'));
});

//APPLICATION ROUTES
app.get('/about', routes.about);
app.get('/', routes.index);
app.get('/snoop/:room_id', routes.snoop);

//ANGULARJS ROUTES
app.get('/partials/:name', routes.partials);

//SOCKETIO ROUTES
io.sockets.on('connection', function (socket) {
    socket.on('join', function(data) {
        socket.join(data);
        socket.emit('message', 'joined a private room: ' + data);
    });

    socket.on('message', function (data) {
        io.sockets.in('private_room').emit('message',  data);
    });
});

