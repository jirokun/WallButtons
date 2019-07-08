<template>
  <div>
    <title-menu v-if="game === 'TitleMenu'" :socket="socket" />
    <time-attack v-else-if="game === 'TimeAttack'" :socket="socket" />
    <debug v-else-if="game === 'Debug'" :socket="socket" />
    <audio-setting v-else-if="game === 'AudioSetting'" :socket="socket" />
    <exit v-else-if="game === 'Exit'" :socket="socket" />
  </div>
</template>

<script>
import TitleMenu from '~/components/TitleMenu.vue'
import TimeAttack from '~/components/TimeAttack.vue'
import Debug from '~/components/Debug.vue'
import AudioSetting from '~/components/AudioSetting.vue'
import Exit from '~/components/Exit.vue'
import io from 'socket.io-client'

export default {
  components: {
    TitleMenu,
    TimeAttack,
    Debug,
    AudioSetting,
    Exit
  },
  mounted() {
    this.socket = io('http://192.168.1.111:3000')
    this.socket.on('game', this.onGameChange)
    document.addEventListener('keydown', this.onKeydown)
  },
  beforeDestroy() {
    this.socket.off('game', this.onGameChange)
    document.removeEventListener('keydown', this.onKeydown)
  },

  data() {
    return {
      socket: null,
      game: null
    }
  },
  methods: {
    onKeydown(evt) {
      let index = evt.keyCode - 49
      if (index === -1) index = 9
      if (index < -1 || index > 9) return
      this.socket.emit('keydown', index)
    },
    onGameChange(game) {
      this.game = game
    }
  }
}
</script>
