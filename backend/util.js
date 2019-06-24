const mp3Player = require('play-sound')(opts = { player: 'mpg123' })
const wavPlayer = require('play-sound')(opts = { player: 'aplay' })

let bgmProcess = null;
async function playBgm(file) {
  await play(file, true);
}
async function play(file, bgm = false) {
  return new Promise(resolve => {
    if (bgm) stopBgm();

    let proc;
    if (file.match(/\.wav$/)) {
      proc = wavPlayer.play(file, () => {
        resolve();
      });
    } else {
      proc = mp3Player.play(file, () => {
        resolve();
      });
    }
    if (bgm) bgmProcess = proc;
  });
}
function stopBgm() {
  if (bgmProcess) bgmProcess.kill();
  bgmProcess = null;
}
async function wait(msec) {
  return new Promise(resolve => {
    setTimeout(() => {
      resolve();
    }, msec);
  });
}
module.exports.playBgm = playBgm;
module.exports.play = play;
module.exports.stopBgm = stopBgm;
module.exports.wait = wait;
