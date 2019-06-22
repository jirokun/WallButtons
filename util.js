const player = require('play-sound')(opts = { player: 'mpg123' })

module.exports.play = async function play(file) {
  return new Promise(resolve => {
    player.play(file, () => {
      resolve();
    });
  });
}
