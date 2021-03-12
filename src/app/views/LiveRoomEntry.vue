<template>
  <div class="live-room-entry">
    <h4 class="search-title">直播间临时入口</h4>
    <p class="search-description">说明：该功能作为API临时不可用时，或者API尚未收录某些vtuber时的一种补充策略。</p>
    <div class="search">
      <input class="search-input" v-model="roomSearchInput" type="number" placeholder="直播房间号"/>
      <button class="search-button" @click="handleRoomSearch">
        Go!
      </button>
    </div>
  </div>
</template>

<script>
import { LivePlayService } from '@/app/services'

export default {
  name: 'LiveRoomEntry',
  data () {
    return {
      roomSearchInput: null
    }
  },
  created () {
    this.initServices()
  },
  methods: {
    initServices () {
      this.livePlayService = new LivePlayService()
    },
    handleRoomSearch () {
      // validate user input
      if (!this.roomSearchInput) {
        this.actionNotify('warn', '直播房间号不能为空')
        return
      }

      this.enterRoom(this.roomSearchInput)
      // reset input
      this.roomSearchInput = null
    },
    enterRoom (roomId) {
      this.livePlayService.enterRoom(roomId)
    }
  }
}
</script>

<style scoped lang="scss">
.search {
  display: flex;
  flex-direction: row;
  margin-left: 20px;

  &-title {
    margin-left: 20px;
    padding: 4px;
    border-bottom: #e2e2e2 solid 1px;
  }

  &-description {
    margin-left: 20px;
    padding: 4px;
  }

  &-input {
    width: 300px;
    border: 1px solid rgba(147, 128, 108, 0.25);
    border-radius: 4px 0 0 4px;
    padding: 0.5em 0.75em;
  }

  &-button {
    width: 30px;
    border: none;
    border-radius: 0 4px 4px 0;
    background-color: #4cd495;
    cursor: pointer;
    color: white;
  }

  &-icon {
    color: white;
  }
}
</style>
