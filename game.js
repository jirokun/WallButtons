const gpio = require('rpi-gpio');
const bgmPlayer = require('play-sound')(opts = { player: 'mpg123' });
const { play } = require('./util.js');

const LED_PINS = [
  3,
  5,
  7,
  11,
  13,
  15,
  19,
  21,
  23,
  29
];
const SWITCH_PINS = [
  10,
  12,
  16,
  18,
  22,
  24,
  26,
  28,
  32,
  36,
  38
];
class Game {
  constructor() {
    this.onChange = this._onChange.bind(this);
    this.lastChangedTimes = {};
    this.lastValues = {};
    this.bgmFile = null;
    this.bgmPlayerProcess = null;
    this.isBgmContinue = true;
  }
  start() {
    LED_PINS.forEach(pin => {
      gpio.setup(pin, gpio.DIR_OUT);
      console.log(`SETUP ${pin}`);
    });
    SWITCH_PINS.forEach(pin => {
      gpio.setup(pin, gpio.DIR_IN, gpio.EDGE_FALLING);
      console.log(`SETUP ${pin}`);
    });
    gpio.on('change', this.onChange);
    this.playBgm();
    return new Promise((resolve) => {
      this.resolve = resolve;
    });
  }
  end() {
    gpio.off('change', this.onChange);
    this.stopBgm();
    this.resolve();
  }
  async playBgm() {
    while (this.isBgmContinue) {
      await play(this.bgmFile);
    }
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
  _onChange(channel, value) {
    const now = new Date().getTime();
    const lastChangedTime = this.lastChangedTimes[channel];
    this.lastChangedTimes[channel] = now;
    if (isNaN(lastChangedTime) || now - lastChangedTime < 500) return;
    const lastValue = this.lastValues[channel];
    if (lastValue) {
      this.onPushed(channel);
    }
    this.lastValues[channel] = value;
  }
  onPushed(channel){
    // please override
  }
}

module.exports = Game;
