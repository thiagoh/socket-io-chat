var app = require('express')();
var bodyParser = require('body-parser')
var ejs = require('ejs');
var fs = require('fs');
var http = require('http').Server(app);
var io = require('socket.io')(http);


// set the view engine to ejs
app.set('view engine', 'ejs');

app.use(bodyParser.json()); // to support JSON-encoded bodies
app.use(bodyParser.urlencoded({ // to support URL-encoded bodies
  extended: true
}));

io.of('/chat')
  .on('connection', function(socket) {

    socket.on('joinroom', function(info) {
      console.log('new user entered in room ' + info.room);
      socket.join(info.room);
    });

    socket.on('chatmessage', function(data) {
      console.log('chat message: ', data);
      io.sockets.in(data.room).emit('receivemessage', data);
    });
  })
  .clients(function(error, clients) {
    if (error) throw error;
    console.log('/chat clients', clients); // => [PZDoMHjiu8PYfRiKAAAF, Anw2LatarvGVVXEIAAAD]
  });

app.get('/', function(req, res) {
    res.sendFile(__dirname + '/index.html');
  })
  .post('/chat', function(req, res) {

    res.render('chat', {
      room: req.body.room || '',
      nickname: req.body.nickname || '',
    });
  })
  .get('/:name', function(req, res) {
    res.sendFile(__dirname + '/' + req.params.name);
  });

http.listen(3000, function() {
  console.log('listening on *:3000');
});