const Gpio = require("pigpio").Gpio;
const express = require('express');
const app = express();
const http = require('http').createServer(app);
const io = require('socket.io')(http);
const player = require('play-sound')(opts = { player: 'mpg123' })
const TitleMenu = require('./TitleMenu.js');

const LED_PINS = [22, 2, 10, 3, 9, 4, 11, 17, 0, 27];
const SWITCH_PINS = [7, 16, 1, 12, 8, 24, 13, 25, 18, 23];
const buttons = [];
const leds = [];

function onChange(buttonIndex) {
  return (level) => {
    if (level !== 0) return;
    if (this.waitForAnyButtonPressResolve) this.waitForAnyButtonPressResolve();
    game.onPushedInner(buttonIndex);
  }
}

LED_PINS.forEach(pin => {
  const led = new Gpio(pin, { mode: Gpio.OUTPUT });
  led.digitalWrite(0);
  leds.push(led);
});
SWITCH_PINS.forEach((pin, index) => {
  const button = new Gpio(pin, {
    mode: Gpio.INPUT,
    pullUpDown: Gpio.PUD_UP,
    alert: true
  });
  button.glitchFilter(20000);
  button.on("alert", onChange(index));
  buttons.push(button);
  console.log(`SETUP ${pin}`);
});

let game = new TitleMenu(io, buttons, leds);

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
  socket.on('keydown', index => {
    game.onPushedInner(index);
  });
});

http.listen(3000, function(){
  console.log('listening on *:3000');
});

(async () => {
  while(true) {
    console.log('START');
    const nextGame = await game.start();
    console.log('DESTROY');
    game.destroy();
    if (nextGame) game = nextGame;
    else game = new TitleMenu(io, buttons, leds);
    io.emit('game', game.constructor.name);
    console.log('END');
  }
})();

