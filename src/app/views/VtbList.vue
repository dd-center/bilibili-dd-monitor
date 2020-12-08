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
    <!--https://github.com/tangbc/vue-virtual-scroll-list/issues/237#issuecomment-641935872-->
    <virtual-list style="height: 700px; overflow-y: auto;"
                  :data-key="'mid'"
                  :data-sources="vtbInfos"
                  :data-component="itemComponent"
                  :extra-props="{ followedVtbMids, toggleFollow: toggleFollow, enterRoom:enterRoom }"
    />
  </div>
</template>

<script>
import VirtualListItem from '../components/VirtualListItem'
import VirtualList from 'vue-virtual-scroll-list'
import { VtbInfoService, FollowListService, LivePlayService } from '@/app/services/index'
import store from '../store'

export default {
  name: 'VtbList',
  components: {
    VirtualList
  },
  data () {
    return {
      userInput: '',
      filteredVtbInfos: [], // filtered from vtbInfos
      followedVtbMids: [], // for showing follow/unfollow text

      itemComponent: VirtualListItem
    }
  },
  computed: {
    vtbInfos: () => [...store.state.vtbInfosMap.values()]
  },
  created () {
    console.log(store.state.count)
    this.initService()
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
      console.log('vtb list:enter room')
      this.livePlayService.enterRoom(roomid)
    },
    foo () {
      console.log('vtb list: foo')
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

</style>
