<template>
  <v-layout row wrap>
    <v-flex xs4>
      <img src="/img/royal_king_gyokuza.png" class="charactor">
    </v-flex>
    <v-flex xs8>
      <h1 class="display-3">もうおわっちゃうの？</h1>
      <v-list two-line>
        <v-list-tile :class="{selected: selected === 0}">
          <v-list-tile-content class="display-2">やっぱりつづける</v-list-tile-content>
        </v-list-tile>
        <v-list-tile :class="{selected: selected === 1}">
          <v-list-tile-content class="display-2">おわる</v-list-tile-content>
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
      selected: 0
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
