const Game = require('./Game.js');
const { wait, play } = require('./util.js');
const GAME_TIME = 10; // seconds

class TimeAttack extends Game {
  constructor(io, buttons, leds) {
    super(io, buttons, leds);
    this.bgmFile = 'assets/bgm/tw045_volume.mp3';
    this.state = {
      remainSeconds: GAME_TIME,
      score: 0,
      mode: 'PLAYING',
      nextIndex: this.getNextIndex()
    };
  }

  init() {
    this.getLedPin(this.state.nextIndex).digitalWrite(1);
    this.startTime = new Date().getTime();
    this.seconds = 0;
    this.timer = setInterval(async () => {
      const now = new Date().getTime();
      const seconds = parseInt((now - this.startTime) / 1000);
      if (this.seconds !== seconds) {
        if (GAME_TIME === seconds) {
          clearInterval(this.timer);
          this.clearLeds();
          this.state.remainSeconds = GAME_TIME - seconds;
          this.state.mode = 'SHOW_SCORE';
          this.stopBgm();
          this.emitState();
          await play('assets/sound/st025_volume.mp3');
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
    if (this.state.mode !== 'PLAYING') return;
    if (pin !== this.state.nextIndex) return;
    this.getLedPin(this.state.nextIndex).digitalWrite(0);
    this.state.nextIndex = this.getNextIndex();
    this.getLedPin(this.state.nextIndex).digitalWrite(1);
    this.state.score++;
    this.emitState();
  }

  getNextIndex() {
    while (true) {
      const nextIndex = Math.floor(Math.random() * 10);
      if (!this.state || (this.state.nextIndex !== nextIndex)) return nextIndex;
    }
  }
}

module.exports = TimeAttack;
