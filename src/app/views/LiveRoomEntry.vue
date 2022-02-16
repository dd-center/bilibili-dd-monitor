<template>
  <div class="live-room-entry">
    <h4 class="search-title">直播间临时入口</h4>
    <p class="search-description">
      说明：该功能作为API临时不可用时，或者API尚未收录某些vtuber时的一种补充策略。
    </p>
    <div class="search">
      <input class="search-input" v-model="searchRoomId" type="number" placeholder="直播房间号"/>
      <button class="search-button" @click="searchRoom">
        Go!
      </button>
    </div>
    <div class="search-history">
      <p class="search-history-title">历史记录</p>
      <ul class="search-history-list">
        <li class="search-history-list-item"
            v-for="(info,index) in searchHistory" :key="index">
          <img :src="info.face" class="face" alt=""/>
          <span class="room-id" @click="enterRoom(info.roomId)">{{ info.roomId }}</span>
          |
          <span class="uname">{{ info.uname }}</span>
          |
          <button class="follow-action" @click="followUser(info)">关注</button>
          |
          <span class="delete" @click="removeSearchHistoryItem(info.roomId)">x</span>
        </li>
      </ul>
    </div>
  </div>
</template>

<script>
import { LivePlayService, SearchHistoryService, RoomService, FollowListService } from '@/app/services'

export default {
  name: 'LiveRoomEntry',
  data () {
    return {
      searchRoomId: null,
      searchHistory: []
    }
  },
  created () {
    this.initServices()
    this.initData()
  },
  methods: {
    initServices () {
      this.livePlayService = new LivePlayService()
      this.searchHistoryService = new SearchHistoryService()
      this.followListService = new FollowListService()
      this.roomService = new RoomService()
    },
    initData () {
      this.searchHistory = this.searchHistoryService.get()
    },
    searchRoom () {
      // validate user input
      if (!this.searchRoomId) {
        this.actionNotify('warn', '直播房间号不能为空')
        return
      }

      // check whether this roomid is valid
      this.roomService.getInfoByRoom(this.searchRoomId).subscribe((result) => {
        // check validation
        if (!result.isValid) {
          this.actionNotify('error', `根据直播房间号${this.searchRoomId}查询信息失败`)
          return
        }

        // temporarily save this.searchRoomId(valid)
        const roomIdCopy = this.searchRoomId

        // add search history item
        const addFeedback = this.searchHistoryService.add(result.info)
        if (addFeedback) {
          this.searchHistory = this.searchHistoryService.get()
          // finally, reset input
          this.searchRoomId = null
        } else {
          this.actionNotify('warn', '添加历史记录失败，请重试')
        }

        // open player
        this.enterRoom(roomIdCopy)
      })
    },
    removeSearchHistoryItem (roomId) {
      const removeSearchHistoryItemFeedback = this.searchHistoryService.remove(roomId)
      if (removeSearchHistoryItemFeedback) {
        this.searchHistory = this.searchHistoryService.get()
      } else {
        this.actionNotify('warn', '删除历史记录失败，请重试')
      }
    },
    clearSearchHistory () {
      this.searchHistoryService.clear()
    },
    followUser (info) {
      // after click this button, delete this button from UI

      // this.followListService.toggleFollow(mid).subscribe((followLists) => {
      //   this.$store.dispatch('updateFollowLists', followLists)
      // })
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
    outline: none;
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

  &-history {
    margin-left: 20px;

    &-title {
      margin-top: 20px;
      padding: 4px;
      border-bottom: #e2e2e2 solid 1px;
    }

    &-list {
      list-style: none;

      &-item {
        display: inline-flex;
        padding: 5px;
        margin: 5px 10px 5px 0;
        border: 1px solid rgba(66, 185, 131, 0.5);
        border-radius: 4px;
        align-items: center;

        &:hover {
          background-color: rgba(66, 185, 131, 0.3);
        }

        .face {
          width: 32px;
          height: 32px;
          border-radius: 50%;
        }

        .room-id {
          display: inline-block;
          margin-left: 4px;
          padding: 0 5px;
          cursor: pointer;
          border: 1px solid darkgrey;
        }

        .follow-action {
          outline: none;
          border: none;
          width: 36px;
          border-radius: 2px;
          background-color: #4cd495;
          cursor: pointer;
          color: white;
        }

        .delete {
          display: flex;
          width: 20px;
          height: 20px;
          justify-content: center;
          align-items: center;
          border: 1px solid rgba(255, 0, 0, .6);
          border-radius: 50%;
          cursor: pointer;
          color: rgba(255, 0, 0, .6);
        }
      }
    }
  }
}
</style>
