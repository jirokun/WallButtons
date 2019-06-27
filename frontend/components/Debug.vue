<template>
  <v-layout row wrap>
    <v-flex xs12>
      <table>
        <tr>
          <th>LIGHTEN LED</th>
          <td>{{ enabledLedPinIndex }}</td>
        </tr>
        <tr>
          <th>PUSHED BUTTON</th>
          <td>{{ pushedPinIndex }}</td>
        </tr>
      </table>
      <div>0番のボタンを2回連続で押すとメニューに戻れます。</div>
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
th {
  text-align: right;
  padding-right: 10px;
}
* {
  font-size: 38pt;
}
</style>
