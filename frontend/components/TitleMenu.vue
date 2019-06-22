<template>
  <div>
    <img src="http://192.168.1.111:3000/img/royal_king_gyokuza.png"/>
    <div v-if="mode === 'WAIT_PUSH_BUTTON'" class="title-message">
      ぼたんを おしてね
    </div>
    <div v-if="mode === 'MENU_LIST'" class="title-message">
      どれで あそぶ？
    </div>
  </div>
</template>

<script>
import TitleMenu from '~/components/TitleMenu.vue'
import io from 'socket.io-client'

export default {
  props: {
    socket: { type: Object, required: true },
  },
  mounted() {
    this.socket.on('state', this.onStateChange);
    this.socket.emit('requestState');
  },
  data() {
    return {
      mode: null
    }
  },
  methods: {
    onStateChange(state) {
      this.mode = state.mode;
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
</style>
