<template>
  <div class="live-room-entry">
    <h4 class="search-title">直播间临时入口</h4>
    <p class="search-description">
      说明：该功能作为API临时不可用时，或者API尚未收录某些vtuber时的一种补充策略。
    </p>
    <div class="search">
      <input class="search-input" v-model="searchRoomId" type="number" placeholder="直播房间号"/>
      <button class="search-button" @click="handleRoomSearch">
        Go!
      </button>
    </div>
    <div class="search-history">
      <p class="search-history-title">历史记录</p>
      <ul class="search-history-list">
        <li class="search-history-list-item"
            v-for="(item,index) in searchHistory" :key="index">
          <span class="room-id" @click="enterRoom(item.value)">{{ item.value }}</span>
          <span class="delete" @click="handleSearchHistoryItemRemove(item.value)">x</span>
        </li>
      </ul>
    </div>
  </div>
</template>

<script>
import { LivePlayService, SearchHistoryService } from '@/app/services'

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
    },
    initData () {
      this.searchHistory = this.searchHistoryService.get()
    },
    handleRoomSearch () {
      // validate user input
      if (!this.searchRoomId) {
        this.actionNotify('warn', '直播房间号不能为空')
        return
      }
      this.enterRoom(this.searchRoomId)
      // add
      const addFeedback = this.searchHistoryService.add(this.searchRoomId)
      if (addFeedback) {
        this.searchHistory = this.searchHistoryService.get()
        // finally, reset input
        this.searchRoomId = null
      } else {
        this.actionNotify('warn', '添加历史记录失败，请重试')
      }
    },
    handleSearchHistoryItemRemove (roomId) {
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

        .room-id {
          display: inline-block;
          padding: 0 5px;
          cursor: pointer;
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
