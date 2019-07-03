const util = require('util');
const exec = util.promisify(require('child_process').exec);
const Game = require('./Game.js');
const TitleMenu = require('./TitleMenu.js');
const { play } = require('./util.js');

class AudioSetting extends Game {
  constructor(io, buttons, leds) {
    super(io, buttons, leds);
    this.bgmFile = 'assets/bgm/ukiukilalala_volume.mp3';
    this.state = {
      volume: null,
    };
  }
  async init() {
    this.startLedState = 0;
    this.ledTimer = setInterval(() => {
      this.startLedState = this.startLedState === 0 ? 1 : 0;
      this.getLedPin(0).digitalWrite(this.startLedState);
      this.getLedPin(1).digitalWrite(this.startLedState);
      this.getLedPin(2).digitalWrite(this.startLedState);
    }, 1000);
    const result = await exec(`/usr/bin/amixer get Speaker`);
    const volume = parseInt(result.stdout.match(/(\d+)%/)[1], 10);
    this.state.volume = volume;
    this.emitState();
  }

  destroy() {
    super.destroy();
    clearInterval(this.ledTimer);
  }

  async onPushed(pin) {
    if (pin === 2) {
      if (this.state.volume === 0) {
        play('assets/sound/button68.wav');
        return;
      }
      this.state.volume = this.state.volume - 10;
      if (this.state.volume < 0) this.state.volume = 0;
      this.emitState();
      await exec(`/usr/bin/amixer set Speaker ${this.state.volume}%`);
      play('assets/sound/button25.wav');
    } else if (pin === 0) {
      if (this.state.volume === 100) {
        play('assets/sound/button68.wav');
        return;
      }
      this.state.volume = this.state.volume + 10;
      if (this.state.volume > 100) this.state.volume = 100;
      this.emitState();
      await exec(`/usr/bin/amixer set Speaker ${this.state.volume}%`);
      play('assets/sound/button25.wav');
    } else if (pin === 1) {
      play('assets/sound/button25.wav');
      this.end();
    } else {
      play('assets/sound/button62.mp3');
    }
  }
}

module.exports = AudioSetting;
