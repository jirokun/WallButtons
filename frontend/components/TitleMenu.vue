<template>
  <div>
    <div v-if="mode === 'WAIT_PUSH_BUTTON'" class="title-message">
      ボタンを押してね
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
  font-size: 64px;
}
</style>
