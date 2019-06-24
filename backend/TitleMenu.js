const Game = require('./Game.js');
const TimeAttack = require('./TimeAttack.js');
const { play } = require('./util.js');

const GAME_TIME = 5; // seconds
const GAMES = [
  { game: TimeAttack, title: '30びょう タイムアタック' }
];

class TitleMenu extends Game {
  constructor(io) {
    super(io);
    this.bgmFile = 'assets/bgm/game_maoudamashii_5_town15_volume.mp3';
    this.state = {
      selected: 0,
      games: GAMES
    };
    this.startLedState = 0;
    this.ledTimer = setInterval(() => {
      const led = this.getLedPin(0);
      this.startLedState = this.startLedState === 0 ? 1 : 0;
      led.digitalWrite(this.startLedState);
    }, 1000);
  }

  start() {
    super.start();
    this.emitState();
  }
  end(nextGame) {
    clearInterval(this.timer);
    clearInterval(this.ledTimer);
    super.end(nextGame);
  }

  onPushed(pin) {
    if (pin === 0) this.state.selected++;
    else if (pin === 1) this.state.selected--;
    else if (pin === 2) {
      this.end();
    }
    else return;

    if (this.state.selected === -1) this.state.selected = GAMES.length - 1;
    else if (this.state.selected >= GAMES.length) this.state.selected = 0;

    play('assets/sound/button25.wav');
    this.emitState();
  }
}

module.exports = TitleMenu;
