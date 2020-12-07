<template>
  <div class="follow-vtb-list">
    <h3 class="follow-vtb-list-title">{{ activeFollowList.name }}</h3>
    <vue-auto-virtual-scroll-list :totalHeight="700" :defaultHeight="80" style="width: 100%;">
      <uL class="virtual-list">
        <li v-for="vtbInfo in activeFollowedVtbInfos" :key="vtbInfo.mid" :style="{ height: `${vtbInfo.height}px` }" class="virtual-list-item">
          <div class="virtual-list-item-media">
            <img class="virtual-list-item-media-avatar" :src="vtbInfo.face" alt=""/>
            <div class="virtual-list-item-media-body">
              <h3 class="virtual-list-item-media-title">{{ vtbInfo.uname }}</h3>
              <p class="virtual-list-item-media-content">{{ vtbInfo.sign }}</p>
            </div>
            <div class="virtual-list-item-media-action">
              <a class="virtual-list-item-media-unfollow" @click="toggleFollow(vtbInfo.mid)">取关</a>
              |
              <a class="virtual-list-item-media-enter-room" @click="enterRoom(vtbInfo.roomid)">进入直播间</a>
              |
              <a class="virtual-list-item-media-set-list" @click="handleSetListModalShow(vtbInfo.mid)">设置分组</a>
            </div>
          </div>
        </li>
      </uL>
    </vue-auto-virtual-scroll-list>

    <div v-show="isSetListModalVisible" id="modal-set-list" class="modal">
      <div class="modal-content">
        <div class="modal-header">
          <h3 class="modal-title">
            为
            {{ selectedVtbInfo ? selectedVtbInfo.uname : '' }}
            选择分组
          </h3>
          <span class="modal-close" @click="handleSetListModalCancel">×</span>
        </div>
        <div class="modal-body">
          <v-select label="name" :options="followLists" v-model="selectedListId" :reduce="followList => followList.id"></v-select>
        </div>
        <div class="modal-footer">
          <button class="modal-button modal-button-ok" @click="handleSetListModalSuccess">确定</button>
          <button class="modal-button modal-button-cancel" @click="handleSetListModalCancel">取消</button>
        </div>
      </div>
    </div>

  </div>
</template>

<script>
import { FollowListService, LivePlayService, VtbInfoService } from '@/app/services'
import VueAutoVirtualScrollList from 'vue-auto-virtual-scroll-list'

export default {
  name: 'FollowList',
  data () {
    return {
      followListService: null,
      vtbInfoService: null,

      isSetListModalVisible: false,
      selectedVtbInfo: null,
      selectedListId: null,
      isSetListModalSuccessLoading: false,

      activeListId: -1, // - 1, 0,...
      activeFollowList: {}, // for show in content page
      activeFollowedVtbInfos: [], // for show in content page

      // backend data
      followLists: []
    }
  },
  components: {
    VueAutoVirtualScrollList
  },
  created () {
    this.initServices()
    // this.loadData()
  },
  beforeRouteUpdate (to, from, next) {
    this.activeListId = parseInt(to.params.id)
    this.updateByData(this.followLists)
    next()
  },
  methods: {
    initServices () {
      this.followListService = new FollowListService()
      this.vtbInfoService = new VtbInfoService()
      this.livePlayService = new LivePlayService()
    },
    updateByData (followLists) {
      // init followLists
      this.followLists = followLists

      // init activeFollowList
      // handle "全部关注"
      if (this.activeListId === -1) {
        const allFollow = {
          id: -1,
          name: '全部关注',
          mids: []
        }
        followLists.forEach((followList) => allFollow.mids.push(...followList.mids))
        this.activeFollowList = allFollow
      } else {
        // handle listId >=0
        followLists.forEach((followList) => {
          if (followList.id === this.activeListId) {
            this.activeFollowList = followList
          }
        })
      }
      // make sure activeFollowList NOT be {}

      // init activeFollowedVtbInfos by activeFollowList from backend followedVtbInfos
      this.vtbInfoService.getFollowedVtbInfos().subscribe((followedVtbInfos) => {
        this.activeFollowedVtbInfos = followedVtbInfos.filter((vtbInfo) => this.activeFollowList.mids.includes(vtbInfo.mid))
      })
    },
    loadData () {
      this.followListService.getFollowLists().subscribe((followLists) => {
        this.updateByData(followLists)
      })
    },
    handleSetListModalShow (selectedMid) {
      // MUST load newest followLists
      this.loadData()
      this.selectedVtbInfo = this.activeFollowedVtbInfos.find((vtbInfo) => vtbInfo.mid === selectedMid)
      this.isSetListModalVisible = true
    },
    handleSetListModalCancel () {
      this.selectVtbInfo = null
      this.isSetListModalVisible = false
    },
    handleSetListModalSuccess () {
      if (!this.isValidListId(this.selectedListId)) {
        this.actionNotify('warn', '请选择分组。')
        return
      }

      this.isSetListModalSuccessLoading = true
      this.followListService.addMidsToFollowList([this.selectedVtbInfo.mid], this.selectedListId).subscribe((followLists) => {
        this.updateByData(followLists)
        this.isSetListModalSuccessLoading = false
        this.isSetListModalVisible = false
        this.actionNotify('success', '设置成功。')
        this.$parent.loadData()
      })
    },
    isValidListId (listId) {
      return listId !== null && listId !== undefined
    },
    toggleFollow (mid) {
      this.followListService.toggleFollow(mid).subscribe(() => {
        this.loadData()
      })
      // better optimization: The parent passes data down to the child via props, and the child sends messages to the parent via events.
      this.$parent.loadData()
    },
    enterRoom (roomid) {
      this.livePlayService.enterRoom(roomid)
    },
    bar () {
      console.log('bar')
    }
  }
}
</script>

<style scoped lang="scss">
.follow-vtb-list {
  &-title {
    font-size: 1rem;
    font-weight: 600;
    color: black;
    margin: 16px 0 16px 20px;
  }
}

.virtual-list-item {
  border-bottom: #e2e2e2 solid 1px;
  list-style: none;
  margin-left: 20px;
  margin-right: 20px;
  color: #666262;
  font-size: 1rem;

  &:hover {
    background-color: rgba(66, 185, 131, 0.1);
  }

  &-media {
    display: flex;
    align-items: center;

    &-body {
      margin-top: 5px;
      margin-bottom: 5px;
    }

    &-title {
      font-size: 1em;
      line-height: 2em;
      font-weight: 400;
    }

    &-content {
      font-size: 0.85em;
      line-height: 2em;
    }

    &-info {
      flex: 0 0 140px;
      font-size: 0.85em;
    }

    &-online {
      display: inline;
      color: #4cd495;
      border: #4cd495 solid 1px;
      border-radius: 5px;
      padding: 2px 4px;
    }

    &-offline {
      display: inline;
      color: #df7373;
      border: #df7373 solid 1px;
      border-radius: 5px;
      padding: 2px 4px;
    }

    &-avatar {
      margin-left: 1em;
      margin-right: 1em;
      width: 40px;
      height: 40px;

      border-radius: 50%;
      display: block;
    }

    &-body {
      flex: 1;
    }

    &-action {
      font-size: 0.85em;

      margin-right: 1em;
    }

    &-unfollow {
      cursor: pointer;
      color: #f57373;
    }

    &-enter-room {
      cursor: pointer;
      color: #3da2ff;
    }

    &-set-list {
      cursor: pointer;
      color: #3da2ff;
    }
  }
}

.modal {
  position: fixed;
  z-index: 3000;
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, .2);

  display: flex;
  align-items: center;
  justify-content: center;

  &-content {
    border: #e2e2e2 solid 1px;
    border-radius: 5px;
    background-color: white;
    width: 40%;

    display: flex;
    flex-direction: column;

    font-size: 1rem;
    color: #666262;
  }

  &-header {
    border-bottom: #e2e2e2 solid 1px;
    display: flex;
    flex-direction: row;
    align-items: center;
    padding: 6px 12px;
  }

  &-title {
    flex: 1;
    font-weight: 400;
    font-size: 1em;
  }

  &-close {
    font-size: 2em;
    cursor: pointer;
  }

  &-body {
    padding: 16px;
    flex: 1;
    border-bottom: #e2e2e2 solid 1px;
  }

  &-select {
    width: 100%;

    &-option {

    }
  }

  &-input {
    width: 100%;
    border: 1px solid rgba(147, 128, 108, 0.25);
    border-radius: 4px;
    padding: 0.5em 0.75em;
  }

  &-footer {
    display: flex;
    flex-direction: row-reverse;
    font-weight: 400;
    padding: 8px 12px;
  }

  &-button {
    outline: none;
    text-align: center;
    text-decoration: none;
    display: inline-block;
    justify-self: end;
    padding: 8px 16px;
    border-radius: 5px;
    border: #e2e2e2 solid 1px;
    cursor: pointer;
    margin-left: 10px;

    &-ok {
      order: -1;
      background-color: #3da2ff;
      color: white;
    }

    &-cancel {
      order: 1;
      color: #666262;
    }
  }

}
</style>
