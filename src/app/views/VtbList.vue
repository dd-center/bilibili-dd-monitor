<template>
  <div class="vtuber-list">
    <!-- search button -->
    <div class="search">
      <input class="search-input" v-model="userInput"/>
      <button class="search-button" @click="filter(userInput)">
        <font-awesome-icon class="search-icon" :icon="['fas', 'search']"/>
      </button>
    </div>

    <br/>
    <vue-auto-virtual-scroll-list :totalHeight="700" :defaultHeight="80" style="width: 100%;">
      <uL class="virtual-list">
        <li v-for="vtbInfo in vtbInfos" :key="vtbInfo.mid" :style="{ height: `${vtbInfo.height}px` }" class="virtual-list-item">
          <div class="virtual-list-item-media">
            <img class="virtual-list-item-media-avatar" :src="vtbInfo.face" alt=""/>
            <div class="virtual-list-item-media-body">
              <h3 class="virtual-list-item-media-title">{{ vtbInfo.uname }}</h3>
              <p class="virtual-list-item-media-content">{{ vtbInfo.sign }}</p>
            </div>
            <div class="virtual-list-item-media-info">
              <div v-if="vtbInfo.liveStatus === 1" class="virtual-list-item-media-online">
                online
                <i class="fas fa-fire"></i>
                {{ vtbInfo.online }}
              </div>
              <div v-if="vtbInfo.liveStatus !== 1" class="virtual-list-item-media-offline">offline</div>
            </div>
            <div class="virtual-list-item-media-action">
              <a v-if="followedVtbMids.includes(vtbInfo.mid)" class="virtual-list-item-media-unfollow" @click="toggleFollow(vtbInfo.mid)">取关</a>
              <a v-if="!followedVtbMids.includes(vtbInfo.mid)" class="virtual-list-item-media-follow" @click="toggleFollow(vtbInfo.mid)">关注</a>
              |
              <a class="virtual-list-item-media-enter-room" @click="enterRoom(vtbInfo.roomid)">进入直播间</a>
            </div>
          </div>
        </li>
      </uL>
    </vue-auto-virtual-scroll-list>
  </div>
</template>

<script>
import VueAutoVirtualScrollList from 'vue-auto-virtual-scroll-list'
import { VtbInfoService, FollowListService, LivePlayService } from '@/app/services/index'
import store from '../store'
import { mapGetters } from 'vuex'
import { VtbInfo } from '@/interfaces'

export default {
  name: 'VtbList',
  components: {
    VueAutoVirtualScrollList
  },
  data () {
    return {
      userInput: '',
      filteredVtbInfos: [], // filtered from vtbInfos

      followedVtbMids: [] // for showing follow/unfollow text
    }
  },
  computed: {
    vtbInfos: () => store.state.vtbInfosMap.values()
  },
  created () {
    console.log(store.state.count)
    // this.initService()
    // this.loadData()
  },
  methods: {
    initService () {
      this.vtbInfoService = new VtbInfoService()
      this.followListService = new FollowListService()
      this.livePlayService = new LivePlayService()
    },

    loadData () {
      this.vtbInfoService.getVtbInfos().subscribe((vtbInfos) => {
        // init vtbInfos
        this.vtbInfos = vtbInfos

        // init followedVtbMids
        this.followListService.getFollowedVtbMids().subscribe((followedVtbMids) => {
          this.followedVtbMids = followedVtbMids
        })

        // init filteredVtbInfos
        this.filteredVtbInfos = this.vtbInfos
      })
    },

    filter (userInput) {
      this.vtbInfoService.getVtbInfos().subscribe((vtbInfos) => {
        this.filteredVtbInfos = vtbInfos.filter((vtbInfo) => vtbInfo.uname.includes(userInput))
      })
    },

    toggleFollow (mid) {
      this.followListService.toggleFollow(mid).subscribe((followedVtbMids) => {
        this.followedVtbMids = followedVtbMids
      })
    },

    enterRoom (roomid) {
      this.livePlayService.enterRoom(roomid)
    },

    scrollToLastViewLocation () {
      // https://github.com/cristovao-trevisan/vue-auto-virtual-scroll-list
      // setIndex() method utility
    }
  }
}
</script>

<style scoped lang="scss">
.search {
  display: flex;
  flex-direction: row;
  width: 300px;
  margin-left: 20px;

  &-input {
    flex: 1;
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
  }

  &-icon {
    color: white;
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

    &-follow {
      cursor: pointer;
      color: #3da2ff;
    }

    &-unfollow {
      cursor: pointer;
      color: #f57373;
    }

    &-enter-room {
      cursor: pointer;
      color: #3da2ff;
    }
  }
}
</style>
