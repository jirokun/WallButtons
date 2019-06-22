<template>
  <div>
    <title-menu v-if="game === 'TitleMenu'" :socket="socket"/>
  </div>
</template>

<script>
import TitleMenu from '~/components/TitleMenu.vue'
import io from 'socket.io-client'

export default {
  components: {
    TitleMenu
  },
  mounted() {
    this._socket = io('http://192.168.1.111:3000')
    this._socket.on('game', this.onGameChange)
  },
  data() {
    return {
      game: null
    }
  },
  computed: {
    socket() {
      return this._socket;
    }
  },
  methods: {
    onGameChange(game) {
      console.log(game);
      this.game = game;
    }
  }
}
</script>
