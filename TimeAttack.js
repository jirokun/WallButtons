const Game = require('./game.js');
const gpio = require('rpi-gpio')
const gpiop = gpio.promise;

const GAME_TIME = 5; // seconds

class TimeAttack extends Game {
  constructor() {
    this.bgmFile = 'assets/bgm/game_maoudamashii_5_town15.mp3';
  }

  start() {
    super.start();

    this.startTime = new Date().getTime();
    this.seconds = 0;
    this.timer = setInterval(() => {
      const now = new Date().getTime();
      const seconds = parseInt((now - this.startTime) / 1000);
      if (this.seconds !== seconds) {
        console.log(GAME_TIME - seconds);
        if (GAME_TIME === seconds) {
          this.end();
        }
        this.seconds = seconds;
      }
    }, 100);
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

module.exports = TimeAttack;
