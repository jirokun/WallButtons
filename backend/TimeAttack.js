const Game = require('./Game.js');
const { wait } = require('./util.js');
const GAME_TIME = 30; // seconds

class TimeAttack extends Game {
  constructor(io, buttons, leds) {
    super(io, buttons, leds);
    this.state = {
      remainSeconds: GAME_TIME,
      score: 0,
      mode: 'PLAYING',
      nextIndex: this.getNextIndex()
    };
  }

  async init() {
    await wait(1000);
    await this.play('assets/sound/info-girl1-youi2.mp3');
    await wait(1000);
    this.play('assets/sound/info-girl1-don1.mp3');
    this.playBgm('assets/bgm/tw045_volume.mp3');
    this.getLedPin(this.state.nextIndex).digitalWrite(1);
    this.startTime = new Date().getTime();
    this.seconds = 0;
    this.timer = setInterval(async () => {
      const now = new Date().getTime();
      const seconds = parseInt((now - this.startTime) / 1000);
      const remainSeconds = GAME_TIME - seconds;
      if (this.seconds !== seconds) {
        if (GAME_TIME <= seconds || seconds < 0) {
          this.clearLeds();
          this.state.remainSeconds = remainSeconds;
          this.state.mode = 'SHOW_SCORE';
          this.stopBgm();
          this.emitState();
          clearInterval(this.timer);
          await this.play('assets/sound/info-girl1-zero1.mp3');
          await this.play('assets/sound/info-girl1-sokomade1.mp3');
          await wait(500);
          await this.play('assets/sound/jingle-jazz.mp3');
          this.playBgm('assets/bgm/何を作っているのかな？_volume.mp3');
          await this.waitForAnyButtonPushed();
          this.end();
          return;
        }
        if (remainSeconds === 10) this.play('assets/sound/info-girl1-zyuu1.mp3');
        if (remainSeconds === 9) this.play('assets/sound/info-girl1-kyuu1.mp3');
        if (remainSeconds === 8) this.play('assets/sound/info-girl1-hachi1.mp3');
        if (remainSeconds === 7) this.play('assets/sound/info-girl1-nana1.mp3');
        if (remainSeconds === 6) this.play('assets/sound/info-girl1-roku1.mp3');
        if (remainSeconds === 5) this.play('assets/sound/info-girl1-go1.mp3');
        if (remainSeconds === 4) this.play('assets/sound/info-girl1-yon1.mp3');
        if (remainSeconds === 3) this.play('assets/sound/info-girl1-san1.mp3');
        if (remainSeconds === 2) this.play('assets/sound/info-girl1-ni1.mp3');
        if (remainSeconds === 1) this.play('assets/sound/info-girl1-ichi1.mp3');
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
    if (this.state.mode !== 'PLAYING') return;
    if (pin !== this.state.nextIndex) {
      this.play('assets/sound/button62.mp3');
      return;
    }
    this.play('assets/sound/button25.wav');
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
