<template>
  <div>
    <title-menu v-if="game === 'TitleMenu'" :socket="socket"/>
    <time-attack v-else-if="game === 'TimeAttack'" :socket="socket"/>
  </div>
</template>

<script>
import TitleMenu from '~/components/TitleMenu.vue'
import TimeAttack from '~/components/TimeAttack.vue'
import io from 'socket.io-client'

export default {
  components: {
    TitleMenu,
    TimeAttack
  },
  mounted() {
    this._socket = io('http://192.168.1.111:3000')
    this.socket.on('game', this.onGameChange)
    document.addEventListener('keydown', this.onKeydown)
  },
  beforeDestroy() {
    this.socket.off('game', this.onGameChange)
    document.removeEventListener('keydown', this.onKeydown)
  },

  data() {
    return {
      game: null
    }
  },
  computed: {
    socket() {
      return this._socket
    }
  },
  methods: {
    onKeydown(evt) {
      let index = evt.keyCode - 49
      if (index === -1) index = 10
      this.socket.emit('keydown', index)
    },
    onGameChange(game) {
      this.game = game
    }
  }
}
</script>
