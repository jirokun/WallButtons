const mp3Player = require('play-sound')(opts = { player: 'mpg123' })
const wavPlayer = require('play-sound')(opts = { player: 'aplay' })

module.exports.play = async function play(file) {
  return new Promise(resolve => {
    if (file.match(/\.wav$/)) {
      wavPlayer.play(file, () => {
        resolve();
      });
    } else {
      mp3Player.play(file, () => {
        resolve();
      });
    }
  });
}
