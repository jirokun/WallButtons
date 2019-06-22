const Gpio = require('pigpio').Gpio;
const bgmPlayer = require('play-sound')(opts = { player: 'mpg123' });
const { play } = require('./util.js');

const LED_PINS = [
  2,
  3,
  4,
  17,
  27,
  22,
  10,
  9,
  11,
  0
];
const SWITCH_PINS = [
  15,
  18,
  23,
  24,
  25,
  8,
  7,
  1,
  12,
  16
];
class Game {
  constructor(io) {
    this.io = io;
    this.onChange = this._onChange.bind(this);
    this.lastChangedTimes = {};
    this.lastValues = {};
    this.bgmFile = null;
    this.bgmPlayerProcess = null;
    this.isBgmContinue = true;
    this.buttons = [];
    this.leds = [];
  }
  emitState(socket) {
    if (socket) {
      socket.emit('state', this.state);
    } else {
      this.io.emit('state', this.state);
    }
  }
  start() {
    LED_PINS.forEach(pin => {
      const led = new Gpio(pin, { mode: Gpio.OUTPUT });
      led.digitalWrite(0);
      this.leds.push(led);
    });
    SWITCH_PINS.forEach(pin => {
      const button = new Gpio(pin, {
        mode: Gpio.INPUT,
        pullUpDown: Gpio.PUD_UP,
        alert: true
      });
      button.glitchFilter(10000);
      button.on('alert', this.onChange);
      this.buttons.push(button);
      console.log(`SETUP ${pin}`);
    });
    this.playBgm();
    return new Promise((resolve) => {
      this.resolve = resolve;
    });
  }
  end() {
    this.destroyEvent();
    this.stopBgm();
    this.resolve();
  }
  async playBgm() {
    while (this.isBgmContinue) {
      await play(this.bgmFile);
    }
  }
  destroyEvent() {
    this.buttons.forEach(button => button.off('alert', this.onChange));
  }
  stopBgm() {
    if (this.bgmPlayerProcess) this.bgmPlayerProcess.kill();
    this.isBgmContinue = false;
  }
  getLedPin(index) {
    return LED_PINS[index];
  }
  getSwitchPin(index) {
    return SWITCH_PINS[index];
  }
  _onChange(level) {
    if (level !== 0) return;
    this.onPushed();
  }
  onPushed(channel){
    // please override
  }
}

module.exports = Game;
