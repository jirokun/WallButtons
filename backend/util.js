const mp3Player = require('play-sound')(opts = { player: 'mpg123' })
const wavPlayer = require('play-sound')(opts = { player: 'aplay' })


async function wait(msec) {
  return new Promise(resolve => {
    setTimeout(() => {
      resolve();
    }, msec);
  });
}
module.exports.wait = wait;
