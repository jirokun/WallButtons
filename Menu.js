const Game = require('./game.js');
const gpio = require('rpi-gpio')
const gpiop = gpio.promise;

const GAME_TIME = 5; // seconds

class Menu extends Game {
  constructor() {
    super();
    this.bgmFile = 'assets/bgm/game_maoudamashii_5_town15.mp3';
  }

  start() {
    super.start();
  }
  end() {
    super.end();
    clearInterval(this.timer);
  }

  onPushed(pin) {
    console.log(pin);
    this.player.play('assets/sound/se_maoudamashii_system46.wav');
  }
}

module.exports = Menu;
