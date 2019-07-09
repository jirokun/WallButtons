const mp3Player = require('play-sound')(opts = { player: 'mpg123' })
const wavPlayer = require('play-sound')(opts = { player: 'aplay' })

class Game {
  constructor(io, buttons, leds) {
    this.io = io;
    this.bgmFile = null;
    this.bgmProcess = null;
    this.playBgmForever = false;
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
  destroy() {
    this.stopBgm();
  }
  async playBgm(fname) {
    this.playBgmForever = true;
    while (this.playBgmForever) {
      await this.play(fname, true);
    }
  }
  stopBgm() {
  }
  async play(fname, bgm = false) {
    return new Promise(resolve => {
      let proc;
      if (fname.match(/\.wav$/)) {
        proc = wavPlayer.play(fname, () => {
          resolve();
        });
      } else {
        proc = mp3Player.play(fname, () => {
          resolve();
        });
      }
      if (bgm) this.bgmProcess = proc;
    });
  }
  stopBgm() {
    this.playBgmForever = false;
    if (this.bgmProcess) this.bgmProcess.kill();
    this.bgmProcess = null;
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
