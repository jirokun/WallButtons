<template>
  <v-layout row wrap>
    <v-flex xs3>
      <img src="/img/dance_yorokobi_mai_woman.png" class="charactor">
    </v-flex>
    <v-flex xs9>
      <div>
        のこり じかん:
        <span class="time">{{ remainSeconds }}</span>
      </div>
      <div>てんすう</div>
      <table class="score-table">
        <tbody>
          <tr>
            <th/>
            <th v-for="h in 10" v-bind:key="`horizontal-${h}`">{{ h }}</th>
          </tr>
          <tr v-for="v in 10" v-bind:key="`vertical-${v}`">
            <th>{{ (v - 1) * 10 }}</th>
            <td v-for="h in 10" v-bind:key="`horizontal-${h}`">
              <img v-if="(v - 1) * 10 + h <= score" src="/img/star-35788_640.png">
            </td>
          </tr>
        </tbody>
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
  computed: {
    dozen() {
      const num = parseInt(this.score / 10, 10)
      const ret = []
      for (let i = 0; i < num + 1; i++) {
        ret.push(i * 10)
      }
      return ret
    },
    remain() {
      const num = this.score % 10
      const ret = []
      for (let i = 0; i < num; i++) {
        ret.push(i)
      }
      return ret
    }
  },
  data() {
    return {
      score: null,
      remainSeconds: null
    }
  },
  methods: {
    onStateChange(state) {
      this.score = state.score
      this.remainSeconds = state.remainSeconds
    }
  }
}
</script>

<style lang="scss" scoped>
.charactor {
  width: 100%;
}
th {
  text-align: right;
  padding-right: 10px;
}
* {
  font-size: 30pt;
}
.time {
  font-size: 50px;
  font-weight: bold;
}
.score-table {
  border-collapse: collapse;
  th {
    width: 70px;
    border: 1px solid #888;
    font-size: 30px;
    text-align: center;
  }
  td {
    width: 70px;
    border: 1px solid #888;
    text-align: center;
    height: 61px;
    img {
      vertical-align: middle;
      width: 40px;
    }
  }
}
</style>
