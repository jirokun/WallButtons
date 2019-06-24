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

    this.state = {
      mode: 'GAME',
      remainSeconds: GAME_TIME,
      score: 0,
    };
    this.startTime = new Date().getTime();
    this.seconds = 0;
    this.timer = setInterval(async () => {
      const now = new Date().getTime();
      const seconds = parseInt((now - this.startTime) / 1000);
      if (this.seconds !== seconds) {
        if (GAME_TIME === seconds) {
          clearInterval(this.timer);
          this.state.mode = 'SHOW_SCORE';
          this.emitState();
          await wait(5000);
          this.end();
        }
        this.seconds = seconds;
        this.state.remainSeconds = GAME_TIME - seconds;
        this.emitState();
      }
    }, 100);
  }
  end() {
    super.end();
    clearInterval(this.timer);
  }

  onPushed(pin) {
    this.player.play('assets/sound/se_maoudamashii_system46.wav');
    this.state.score++;
    this.emitState();
  }
}

module.exports = TimeAttack;
