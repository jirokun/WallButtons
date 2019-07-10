const exec = require('child_process').exec;
const Game = require('./Game.js');
const TitleMenu = require('./TitleMenu.js');

class Exit extends Game {
  constructor(io, buttons, leds) {
    super(io, buttons, leds);
    this.state = {
      selected: 0,
    };
  }
  init() {
    this.play('assets/sound/info-girl1-areremouowaccyauno1.mp3');
    this.startLedState = 0;
    this.ledTimer = setInterval(() => {
      this.startLedState = this.startLedState === 0 ? 1 : 0;
      this.getLedPin(0).digitalWrite(this.startLedState);
      this.getLedPin(1).digitalWrite(this.startLedState);
      this.getLedPin(2).digitalWrite(this.startLedState);
    }, 1000);
  }

  destroy() {
    super.destroy();
    clearInterval(this.ledTimer);
  }

  async onPushed(pin) {
    if (pin === 2) {
      this.state.selected++;
      if (this.state.selected === 2) this.state.selected = 0;
      this.emitState();
      this.play('assets/sound/button25.wav');
    } else if (pin === 0) {
      this.state.selected--;
      if (this.state.selected === -1) this.state.selected = 1;
      this.emitState();
      this.play('assets/sound/button25.wav');
    } else if (pin === 1) {
      if (this.state.selected === 0) {
        this.end();
      } else {
        await this.play('assets/sound/info-girl1-syuuryoushimasu1.mp3');
        exec('/sbin/halt');
      }
      return;
    } else {
      this.play('assets/sound/button62.mp3');
    }
  }
}

module.exports = Exit;
