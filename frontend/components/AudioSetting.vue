<template>
  <v-layout row wrap>
    <v-flex xs4>
      <img src="/img/royal_king_gyokuza.png" class="charactor" />
    </v-flex>
    <v-flex xs8>
      <h1 class="display-3">おとのおおきさ ちょうせつ</h1>
      <div>
      <h2 v-if="volume !== null" :style="{backgroundColor: '#88f', width: `${volume}%`}">{{ volume }}%</h2>
      </div>
    </v-flex>
  </v-layout>
</template>

<script>
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
      volume: null
    }
  },
  methods: {
    onKeydown(evt) {
      let index = evt.keyCode - 49
      if (index === -1) index = 10
      this.socket.emit('keydown', index)
    },
    onStateChange(state) {
      this.volume = state.volume
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
