<template>
  <div class="vtuber-list">
    <!-- search button -->
    <div class="search">
      <input class="search-input" v-model="searchInput"/>
      <button class="search-button" @click="filter(searchInput)">
        <font-awesome-icon class="search-icon" :icon="['fas', 'search']"/>
      </button>
      <span>{{ searchIndicator }}</span>
    </div>

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
import store from '../store'
import { mapGetters } from 'vuex'
import _ from 'lodash'

export default {
  name: 'VtbList',
  components: {
    VirtualList
  },
  data () {
    return {
      // virtual list item
      itemComponent: VirtualListItem,

      // search
      searchInput: '',
      searchInputIsDirty: false,
      isSearchCalculating: false,

      followedVtbMids: [] // for showing follow/unfollow text
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
      'filteredVtbInfos'
    ])
  },
  watch: {
    searchInput: function () {
      this.searchInputIsDirty = true
      this.computeSearch()
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
      store.dispatch('searchVtbInfosByName', this.searchInput)

      this.followListService.getFollowedVtbMids().subscribe((followedVtbMids) => {
        this.followedVtbMids = followedVtbMids
        console.log(`vtblist: this.followedVtbMids:${this.followedVtbMids.length}`)
      })
    },
    computeSearch: _.debounce(function () {
      this.isSearchCalculating = true
      setTimeout(() => {
        this.isSearchCalculating = false
        this.searchInputIsDirty = false
        // search
        console.log(`search input: ${this.searchInput}`)
        store.dispatch('searchVtbInfosByName', this.searchInput)
        console.log('search done')
      }, 1000)
    }, 500),
    toggleFollow (mid) {
      this.followListService.toggleFollow(mid).subscribe((followedVtbMids) => {
        this.followedVtbMids = followedVtbMids
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
