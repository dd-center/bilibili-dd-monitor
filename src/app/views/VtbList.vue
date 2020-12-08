<template>
  <div class="vtuber-list">
    <div class="search">
      <input class="search-input" v-model="searchInput"/>
      <button class="search-button">
        <font-awesome-icon class="search-icon" :icon="['fas', 'search']"/>
      </button>
    </div>
    <p>{{ searchIndicator }}</p>
    <p>{{ 'vtbInfos.length: ' + vtbInfos.length }}</p>
    <p>{{ 'filteredVtbInfos.length: ' + filteredVtbInfos.length }}</p>
    <p>{{ updateInfo }}</p>
    <p>{{ 'followedVtbMids ' + followedVtbMids.length }}</p>
    <br/>
    <!--https://github.com/tangbc/vue-virtual-scroll-list/issues/237#issuecomment-641935872-->
    <virtual-list style="height: 700px; overflow-y: auto;"
                  :data-key="'mid'"
                  :data-sources="filteredVtbInfos"
                  :data-component="itemComponent"
                  :extra-props="{ followedVtbMids, toggleFollow: toggleFollow, enterRoom:enterRoom }"
    />
  </div>
</template>

<script>
import VirtualListItem from '../components/VirtualListItem'
import VirtualList from 'vue-virtual-scroll-list'
import { FollowListService, LivePlayService } from '@/app/services/index'
import { mapGetters } from 'vuex'
import _ from 'lodash'

export default {
  name: 'VtbList',
  components: {
    VirtualList
  },
  data () {
    return {
      itemComponent: VirtualListItem,
      searchInput: '',
      searchInputIsDirty: false,
      isSearchCalculating: false,
      filteredVtbInfos: []
    }
  },
  computed: {
    searchIndicator: function () {
      if (this.isSearchCalculating) {
        return '⟳ Fetching new results'
      } else if (this.searchInputIsDirty) {
        return '... Typing'
      } else {
        return `✓ Done : ${this.filteredVtbInfos.length} results`
      }
    },
    ...mapGetters([
      'vtbInfos',
      'followedVtbMids',
      'updateInfo'
    ])
  },
  watch: {
    searchInput: function () {
      this.searchInputIsDirty = true
      this.computeSearch()
    },
    vtbInfos: function () {
      this.searchVtbInfosByName(this.searchInput)
    }
  },
  created () {
    this.initService()
    this.loadData()
  },
  methods: {
    initService () {
      this.followListService = new FollowListService()
      this.livePlayService = new LivePlayService()
    },
    loadData () {
      // trigger init search by ''
      this.searchVtbInfosByName(this.searchInput)
    },
    computeSearch: _.debounce(function () {
      this.isSearchCalculating = true
      setTimeout(() => {
        this.isSearchCalculating = false
        this.searchInputIsDirty = false
        this.searchVtbInfosByName(this.searchInput)
      }, 1000)
    }, 500),
    searchVtbInfosByName (name) {
      this.filteredVtbInfos = this.vtbInfos.filter((vtbInfo) => vtbInfo.uname?.includes(name))
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
