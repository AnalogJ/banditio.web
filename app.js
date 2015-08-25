
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
app.set('port', process.env.PORT || 4000);
app.set('views', __dirname + '/views');
app.set('view engine', 'ejs');
app.use(express.favicon());
app.use(express.logger('dev'));
app.use(express.bodyParser());
app.use(express.methodOverride());
app.use(express.cookieParser('2a167c71-0d7b-4fc4-a2da-b2f4fcdef090')); //unique and must stay constant to decrypt previously created cookies.
app.use(express.session());
app.use(app.router);
//bootstrap-less configuration.
var bootstrapPath = path.join(__dirname, 'public','components', 'metro-vibes-less','less','bootstrap');
var metroVibesPath = path.join(__dirname, 'public','components', 'theme');
app.use(require('less-middleware')({
    src: __dirname + '/public',
    paths  : [metroVibesPath, bootstrapPath]
    //compress: true
}));
app.use(express.static(path.join(__dirname, 'public')));
app.use('/devtools', express.static(path.join(__dirname, 'devtools')));

// development only
if ('development' == app.get('env')) {
  app.use(express.errorHandler());
}

var server = http.createServer(app);

server.listen(app.get('port'), function(){
  console.log('Express server listening on port ' + app.get('port'));
});

//APPLICATION ROUTES
app.get('/partials/:name', routes.partials);
app.post('/example_request', routes.example_request);

//ANGULARJS ROUTES
app.get('/', routes.wildcard);
app.get('/home', routes.wildcard);
app.get('/capture/:room_id?/:opt?', routes.wildcard); //view currently active messages.
app.get('/about', routes.wildcard);

/*
//SOCKETIO ROUTES
io.sockets.on('connection', function (socket) {
    socket.on('join', function(data) {
        socket.join(data);
        socket.emit('message', 'joined a private room: ' + data);
        socket.emit('message', 'there are ' + io.sockets.clients(data).length + ' clients in this room')
    });

    socket.on('message', function (data) {
        io.sockets.in(data.room_id).emit('message',  data);
    });
});

*/