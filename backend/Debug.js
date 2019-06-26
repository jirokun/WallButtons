const Game = require('./Game.js');
const TimeAttack = require('./TimeAttack.js');
const { play } = require('./util.js');

class Debug extends Game {
  constructor(io, buttons, leds) {
    super(io, buttons, leds);
    this.bgmFile = 'assets/bgm/dozikkomarch_volume.mp3';
    this.state = {
      enabledLedPinIndex: 0,
      pushedPinIndex: null
    };
  }
  init() {
    this.state.enabledLedPinIndex = 0;
    this.ledTimer = setInterval(() => {
      const oldLed = this.getLedPin(this.state.enabledLedPinIndex++);
      oldLed.digitalWrite(0);
      if (this.getLedPinLength() == this.state.enabledLedPinIndex) this.state.enabledLedPinIndex = 0;
      const newLed = this.getLedPin(this.state.enabledLedPinIndex);
      newLed.digitalWrite(1);
      this.emitState();
    }, 1000);
  }

  destroy() {
    super.destroy();
    clearInterval(this.ledTimer);
  }

  onPushed(pin) {
    play('assets/sound/button25.wav');
    if (this.state.pushedPinIndex === 0 && pin === 0) {
      this.end();
    } else {
      this.state.pushedPinIndex = pin;
      this.emitState();
    }
  }
}

module.exports = Debug;
