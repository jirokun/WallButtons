<template>
  <v-layout row wrap>
    <v-flex xs4>
      <img src="http://192.168.1.111:3000/img/royal_king_gyokuza.png" class="charactor">
    </v-flex>
    <v-flex xs8>
      <h1 class="display-3">どれで あそぶ？</h1>
      <v-list two-line>
        <v-list-tile
          v-for="(game, index) in games"
          :key="game.title"
          :class="{selected: selected === index}"
        >
          <v-list-tile-avatar>
            <v-icon x-large>alarm</v-icon>
          </v-list-tile-avatar>
          <v-list-tile-content class="display-2">{{ game.title }}</v-list-tile-content>
        </v-list-tile>
      </v-list>
    </v-flex>
  </v-layout>
</template>

<script>
import TitleMenu from '~/components/TitleMenu.vue'
import io from 'socket.io-client'

export default {
  props: {
    socket: { type: Object, required: true }
  },
  mounted() {
    this.socket.on('state', this.onStateChange)
    this.socket.emit('requestState')
  },
  beforeDestroy() {
    this.socket.off('state', this.onStateChange)
  },
  data() {
    return {
      selected: 0,
      games: []
    }
  },
  methods: {
    onKeydown(evt) {
      let index = evt.keyCode - 49
      if (index === -1) index = 10
      this.socket.emit('keydown', index)
    },
    onStateChange(state) {
      this.selected = state.selected
      this.games = state.games
    }
  }
}
</script>

<style lang="scss" scoped>
.title-message {
  display: inline-block;
  vertical-align: top;
  font-size: 64px;
}
.charactor {
  width: 100%;
}
.selected {
  background-color: #2196f3;
}
</style>
