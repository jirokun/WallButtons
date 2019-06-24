const Game = require('./Game.js');
const { wait, play } = require('./util.js');
const GAME_TIME = 5; // seconds

class TimeAttack extends Game {
  constructor(io) {
    super(io);
    this.bgmFile = 'assets/bgm/tw045_volume.mp3';
    this.state = {
      remainSeconds: GAME_TIME,
      score: 0,
      mode: 'PLAYING',
    };
  }

  init() {
    this.startTime = new Date().getTime();
    this.seconds = 0;
    this.timer = setInterval(async () => {
      const now = new Date().getTime();
      const seconds = parseInt((now - this.startTime) / 1000);
      if (this.seconds !== seconds) {
        if (GAME_TIME === seconds) {
          clearInterval(this.timer);
          this.state.remainSeconds = GAME_TIME - seconds;
          this.state.mode = 'SHOW_SCORE';
          this.emitState();
          await this.waitForAnyButtonPushed();
          this.end();
        }
        this.seconds = seconds;
        this.state.remainSeconds = GAME_TIME - seconds;
        this.emitState();
      }
    }, 100);
  }
  destroy() {
    super.destroy();
    clearInterval(this.timer);
  }

  onPushed(pin) {
    play('assets/sound/button25.wav');
    this.state.score++;
    this.emitState();
  }
}

module.exports = TimeAttack;
