const app = require('express')();
const http = require('http').createServer(app);
const io = require('socket.io')(http);
const gpio = require('rpi-gpio')
const gpiop = gpio.promise;
const player = require('play-sound')(opts = { player: 'mpg123' })
const Menu = require('./Menu.js');

let game = new Menu(io);

app.get('/', function(req, res){
	  res.sendFile(__dirname + '/index.html');
});

io.on('connection', function(socket){
  console.log('a user connected');
  game.emitState();
  socket.on('disconnect', function(){
    console.log('user disconnected');
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

