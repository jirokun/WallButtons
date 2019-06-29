const { playBgm, stopBgm } = require("./util.js");

class Game {
  constructor(io, buttons, leds) {
    this.io = io;
    this.bgmFile = null;
    this.bgmPlayerProcess = null;
    this.isBgmContinue = true;
    this.buttons = buttons;
    this.leds = leds;
    this.clearLeds();
  }
  clearLeds() {
    this.leds.forEach(led => led.digitalWrite(0));
  }
  emitState(socket) {
    if (socket) {
      socket.emit("state", this.state);
    } else {
      this.io.emit("state", this.state);
    }
  }
  async start() {
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
    // bgmFileが指定されていない場合は再生しない
    if (!this.bgmFile) return;
    while (this.isBgmContinue) {
      await playBgm(this.bgmFile);
    }
  }
  destroy() {
    this.stopBgm();
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
  getLedPinLength() {
    return this.leds.length;
  }
  onPushedInner(channel) {
    if (this.waitForAnyButtonPressResolve) this.waitForAnyButtonPressResolve();
    this.onPushed(channel);
  }
  onPushed(channel) {
    // please override
  }
}

module.exports = Game;
