const Game = require('./Game.js');
const { wait } = require('./util.js');
const GAME_TIME = 30; // seconds

class TimeAttack extends Game {
  /** コンストラクタ */
  constructor(io, buttons, leds) {
    super(io, buttons, leds);
    // stateはコンストラクタで設定する
    this.state = {
      remainSeconds: GAME_TIME,
      score: 0,
      mode: 'PLAYING',
      nextIndex: this.getNextIndex()
    };
  }


  /** 初期化処理 */
  async init() {
    await wait(1000);
    await this.play('assets/sound/info-girl1-youi2.mp3');
    await wait(1000);
    this.play('assets/sound/info-girl1-don1.mp3');
    this.playBgm('assets/bgm/tw045_volume.mp3');
    this.getLedPin(this.state.nextIndex).digitalWrite(1);
    this.startTime = new Date().getTime();
    this.seconds = 0;
    this.timer = setInterval(this.loop.bind(this), 100);
  }
  /** 終了時処理 */
  destroy() {
    super.destroy();
    clearInterval(this.timer);
  }
  /** 100ms毎に呼ばれる */
  async loop() {
    const now = new Date().getTime();
    const seconds = parseInt((now - this.startTime) / 1000);
    const remainSeconds = GAME_TIME - seconds;
    if (this.seconds !== seconds) {
      // 残り時間が0になった、または時刻がntpのせいでずれ残り時間がマイナスあるいはゲーム時間よりも多くなった場合は終了する
      if (remainSeconds === 0 || remainSeconds < 0 || remainSeconds > GAME_TIME) {
        this.clearLeds();
        this.state.remainSeconds = remainSeconds;
        this.state.mode = 'SHOW_SCORE';
        this.stopBgm();
        this.emitState();
        clearInterval(this.timer);
        await this.play('assets/sound/info-girl1-zero1.mp3');
        await this.play('assets/sound/info-girl1-sokomade1.mp3');
        await wait(500);
        await this.play('assets/sound/jingle-jazz.mp3');
        await wait(500);
        await this.readScore(this.state.score);
        this.playBgm('assets/bgm/何を作っているのかな？_volume.mp3');
        await this.waitForAnyButtonPushed();
        this.end();
      }
      if (remainSeconds === 10) this.play('assets/sound/info-girl1-zyuu1.mp3');
      if (remainSeconds === 9) this.play('assets/sound/info-girl1-kyuu1.mp3');
      if (remainSeconds === 8) this.play('assets/sound/info-girl1-hachi1.mp3');
      if (remainSeconds === 7) this.play('assets/sound/info-girl1-nana1.mp3');
      if (remainSeconds === 6) this.play('assets/sound/info-girl1-roku1.mp3');
      if (remainSeconds === 5) this.play('assets/sound/info-girl1-go1.mp3');
      if (remainSeconds === 4) this.play('assets/sound/info-girl1-yon1.mp3');
      if (remainSeconds === 3) this.play('assets/sound/info-girl1-san1.mp3');
      if (remainSeconds === 2) this.play('assets/sound/info-girl1-ni1.mp3');
      if (remainSeconds === 1) this.play('assets/sound/info-girl1-ichi1.mp3');
      this.seconds = seconds;
      this.state.remainSeconds = GAME_TIME - seconds;
      this.emitState();
    }
  }

  async readScore(score) {
    const juu = parseInt(score / 10);
    const ichi = score % 10;
    if (juu === 1) await this.play('assets/sound/info-girl1-zyuu2.mp3');
    if (juu === 2) await this.play('assets/sound/info-girl1-nizyuu2.mp3');
    if (juu === 3) await this.play('assets/sound/info-girl1-sanzyuu1.mp3');
    if (juu === 4) await this.play('assets/sound/info-girl1-yonzyuu1.mp3');
    if (juu === 5) await this.play('assets/sound/info-girl1-gozyuu2.mp3');
    if (juu === 6) await this.play('assets/sound/info-girl1-rokuzyuu2.mp3');
    if (juu === 7) await this.play('assets/sound/info-girl1-nanazyuu1.mp3');
    if (juu === 8) await this.play('assets/sound/info-girl1-hachizyuu2.mp3');
    if (juu === 9) await this.play('assets/sound/info-girl1-kyuuzyuu1.mp3');

    if (ichi === 1) await this.play('assets/sound/info-girl1-ichi1.mp3');
    if (ichi === 2) await this.play('assets/sound/info-girl1-ni1.mp3');
    if (ichi === 3) await this.play('assets/sound/info-girl1-san1.mp3');
    if (ichi === 4) await this.play('assets/sound/info-girl1-yon1.mp3');
    if (ichi === 5) await this.play('assets/sound/info-girl1-go1.mp3');
    if (ichi === 6) await this.play('assets/sound/info-girl1-roku1.mp3');
    if (ichi === 7) await this.play('assets/sound/info-girl1-nana1.mp3');
    if (ichi === 8) await this.play('assets/sound/info-girl1-hachi1.mp3');
    if (ichi === 9) await this.play('assets/sound/info-girl1-kyuu1.mp3');

    await this.play('assets/sound/info-girl1-ten2.mp3');
  }

  /** ボタンが押されたときの処理 */
  onPushed(pin) {
    if (this.state.mode !== 'PLAYING') return;
    if (pin !== this.state.nextIndex) {
      this.play('assets/sound/button62.mp3');
      return;
    }
    this.play('assets/sound/button25.wav');
    this.getLedPin(this.state.nextIndex).digitalWrite(0);
    this.state.nextIndex = this.getNextIndex();
    this.getLedPin(this.state.nextIndex).digitalWrite(1);
    this.state.score++;
    this.emitState();
  }

  /** 次のボタンのインデックスを取得する。同じインデックスは採番しない */
  getNextIndex() {
    while (true) {
      const nextIndex = Math.floor(Math.random() * 10);
      if (!this.state || (this.state.nextIndex !== nextIndex)) return nextIndex;
    }
  }
}

module.exports = TimeAttack;
