const express = require('express');
const app = express();
const http = require('http').createServer(app);
const io = require('socket.io')(http);
const player = require('play-sound')(opts = { player: 'mpg123' })
const TitleMenu = require('./TitleMenu.js');

let game = new TitleMenu(io);

app.use(express.static('public'));
app.get('/', function(req, res) {
  res.sendFile(__dirname + '/index.html');
});

io.on('connection', function(socket) {
  console.log('a user connected');
  socket.emit('game', game.constructor.name);
  socket.on('disconnect', function() {
    console.log('user disconnected');
  });
  socket.on('requestState', function(socket) {
    game.emitState(socket);
  });
});

http.listen(3000, function(){
  console.log('listening on *:3000');
});

(async () => {
  console.log('START');
  await game.start();
  console.log('END');
})();

