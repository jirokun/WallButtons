const Gpio = require("pigpio").Gpio;
const { playBgm, stopBgm } = require("./util.js");

const LED_PINS = [2, 3, 4, 17, 27, 22, 10, 9, 11, 0];
const SWITCH_PINS = [15, 18, 23, 24, 25, 8, 7, 1, 12, 16];
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
      socket.emit("state", this.state);
    } else {
      this.io.emit("state", this.state);
    }
  }
  async start() {
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
      button.on("alert", this.onChange);
      this.buttons.push(button);
      console.log(`SETUP ${pin}`);
    });
    this.playBgm();
    this.emitState();
    return new Promise(resolve => {
      this.init();
      this.resolve = resolve;
    });
  }
  init() {
    // please override
  }
  end(nextGame = null) {
    this.resolve(nextGame);
  }
  async playBgm() {
    while (this.isBgmContinue) {
      await playBgm(this.bgmFile);
    }
  }
  destroy() {
    this.destroyEvent();
    this.stopBgm();
  }
  destroyEvent() {
    this.buttons.forEach(button => button.off("alert", this.onChange));
  }
  stopBgm() {
    stopBgm();
    this.isBgmContinue = false;
  }
  async waitForAnyButtonPushed() {
    return new Promise(resolve => {
      this.waitForAnyButtonPressResolve = resolve;
    });
  }
  getLedPin(index) {
    return this.leds[index];
  }
  getSwitchPin(index) {
    return SWITCH_PINS[index];
  }
  onKeydown(channel) {
    if (this.waitForAnyButtonPressResolve) this.waitForAnyButtonPressResolve();
    this.onPushed(channel);
  }
  _onChange(level) {
    if (level !== 0) return;
    if (this.waitForAnyButtonPressResolve) this.waitForAnyButtonPressResolve();
    this.onPushed();
  }
  onPushed(channel) {
    // please override
  }
}

module.exports = Game;
