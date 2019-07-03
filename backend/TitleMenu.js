const Game = require('./Game.js');
const TimeAttack = require('./TimeAttack.js');
const Debug = require('./Debug.js');
const AudioSetting = require('./AudioSetting.js');
const Exit = require('./Exit.js');
const { play } = require('./util.js');

const GAME_TIME = 5; // seconds
const GAMES = [
  { game: TimeAttack, title: 'タイムアタック' },
  { game: Debug, title: 'デバッグ用' },
  { game: AudioSetting, title: 'おんりょうせってい' },
  { game: Exit, title: 'しゅうりょう' },
];

class TitleMenu extends Game {
  constructor(io, buttons, leds) {
    super(io, buttons, leds);
    this.bgmFile = 'assets/bgm/game_maoudamashii_5_town15_volume.mp3';
    this.state = {
      selected: 0,
      games: GAMES
    };
  }
  init() {
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
    clearInterval(this.timer);
    clearInterval(this.ledTimer);
  }

  onPushed(pin) {
    if (pin === 2) this.state.selected++;
    else if (pin === 0) this.state.selected--;
    else if (pin === 1) {
      this.end(new GAMES[this.state.selected].game(this.io, this.buttons, this.leds));
      return;
    } else {
      play('assets/sound/button62.mp3');
      return;
    }

    if (this.state.selected === -1) this.state.selected = GAMES.length - 1;
    else if (this.state.selected >= GAMES.length) this.state.selected = 0;

    play('assets/sound/button25.wav');
    this.emitState();
  }
}

module.exports = TitleMenu;
