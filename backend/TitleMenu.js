const Game = require('./Game.js');
const { play } = require('./util.js');

const GAME_TIME = 5; // seconds

class TitleMenu extends Game {
  constructor(io) {
    super(io);
    this.bgmFile = 'assets/bgm/game_maoudamashii_5_town15_volume.mp3';
    this.state = {
      mode: 'WAIT_PUSH_BUTTON'
    };
  }

  start() {
    super.start();
    this.emitState();
  }
  end() {
    super.end();
    clearInterval(this.timer);
  }

  onPushed(pin) {
    play('assets/sound/button25.wav');
    this.state.mode = 'MENU_LIST';
    this.emitState();
  }
}

module.exports = TitleMenu;
