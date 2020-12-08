<template>
  <div class="follow-vtb-list">
    <h3 class="follow-vtb-list-title">{{ activeFollowList.name }}</h3>

    <virtual-list style="height: 700px; overflow-y: auto;"
                  :data-key="'mid'"
                  :data-sources="activeFollowedVtbInfos"
                  :data-component="itemComponent"
                  :extra-props="{toggleFollow: toggleFollow, enterRoom:enterRoom, handleSetListModalShow:handleSetListModalShow }"
    />

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
import { FollowListService, LivePlayService } from '@/app/services'
import { mapGetters } from 'vuex'
import FollowListItem from './FollowListItem'
import VirtualList from 'vue-virtual-scroll-list'

export default {
  name: 'FollowList',
  data () {
    return {
      itemComponent: FollowListItem,
      followListService: null,
      isSetListModalVisible: false,
      selectedVtbInfo: null,
      selectedListId: null,
      isSetListModalSuccessLoading: false,
      activeListId: -1 // - 1, 0,...
    }
  },
  computed: {
    ...mapGetters([
      'followLists',
      'followedVtbInfos'
    ]),
    activeFollowList () {
      let activeFollowList = {}
      // handle "全部关注"
      if (this.activeListId === -1) {
        const allFollow = {
          id: -1,
          name: '全部关注',
          mids: []
        }
        this.followLists.forEach((followList) => allFollow.mids.push(...followList.mids))
        activeFollowList = allFollow
      } else {
        // handle listId >=0
        this.followLists.forEach((followList) => {
          if (followList.id === this.activeListId) {
            activeFollowList = followList
          }
        })
      }
      return activeFollowList
    },
    activeFollowedVtbInfos () {
      return this.followedVtbInfos.filter((vtbInfo) => this.activeFollowList.mids.includes(vtbInfo.mid))
    }
  },
  components: {
    VirtualList
  },
  created () {
    this.initServices()
  },
  beforeRouteUpdate (to, from, next) {
    this.activeListId = parseInt(to.params.id)
    next()
  },
  methods: {
    initServices () {
      this.followListService = new FollowListService()
      this.livePlayService = new LivePlayService()
    },
    handleSetListModalShow (selectedMid) {
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
        this.isSetListModalSuccessLoading = false
        this.isSetListModalVisible = false
        this.actionNotify('success', '设置成功。')
        this.$store.dispatch('updateFollowLists', followLists)
      })
    },
    isValidListId (listId) {
      return listId !== null && listId !== undefined
    },
    toggleFollow (mid) {
      this.followListService.toggleFollow(mid).subscribe((followLists) => {
        this.$store.dispatch('updateFollowLists', followLists)
      })
    },
    enterRoom (roomid) {
      this.livePlayService.enterRoom(roomid)
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
