const Game = require('./Game.js');
const gpio = require('rpi-gpio')
const gpiop = gpio.promise;
const { play } = require('./util.js');

const GAME_TIME = 5; // seconds

class Menu extends Game {
  constructor(io) {
    super(io);
    this.bgmFile = 'assets/bgm/game_maoudamashii_5_town15_volume.mp3';
    this.state = {
      game: 'Menu',
      mode: 'WAIT_PUSH_BUTTON'
    };
  }

  start() {
    super.start();
    this.emitState();
  }
  end() {
    super.end();
    clearInterval(this.timer);
  }

  onPushed(pin) {
    play('assets/sound/button25.wav');
  }
}

module.exports = Menu;
