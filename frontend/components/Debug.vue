<template>
  <v-layout row wrap>
    <v-flex xs12>
      <table>
        <tr>
          <th>LED</th>
          <td>{{ enabledLedPinIndex }}</td>
        </tr>
        <tr>
          <th>PUSHED PIN</th>
          <td>{{ pushedPinIndex }}</td>
        </tr>
      </table>
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
      enabledLedPinIndex: null,
      pushedPinIndex: null
    }
  },
  methods: {
    onStateChange(state) {
      this.enabledLedPinIndex = state.enabledLedPinIndex
      this.pushedPinIndex = state.pushedPinIndex
      console.log(state)
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
