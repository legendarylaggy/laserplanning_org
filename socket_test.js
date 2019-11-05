var express = require('express')
var app = require('express')();
var http = require('http').Server(app);
var io = require('socket.io')(http);
var path = require("path")

app.get('/', function(req, res){
    res.sendFile(__dirname + '/index.html');
  });

app.use(express.static(path.join(__dirname,'public')));

io.on('connection', function(socket){
    console.log('a user connected');

    socket.on('disconnect', function () {console.log('a user disconnected'); });
  });
// io.on('disconnect', function(socket){
//     console.log('a user disconnected');
//   });
// io.on('BYE', function(msg){
//     console.log('message: ' + msg);
// });
  

http.listen(80, function(){
  console.log('listening');
});