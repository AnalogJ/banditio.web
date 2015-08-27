
/**
 * Module dependencies.
 */

var express = require('express');

var http = require('http');
var app = express();
app.set('port', process.env.PORT || 4000);
app.use(express.static(__dirname));
var server = http.createServer(app);
server.listen(app.get('port'), function(){
  console.log('Express server listening on port ' + app.get('port'));
});
