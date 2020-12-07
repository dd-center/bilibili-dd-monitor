import Vue from 'vue'
import Vuex from 'vuex'
import { FollowList, VtbInfo } from '@/interfaces'
import { FollowListService, LivePlayService, VtbInfoService } from '@/app/services'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    // services => singleton pattern
    vtbInfoService: new VtbInfoService(),
    followListService: new FollowListService(),
    livePlayService: new LivePlayService(),

    // vtb info map
    vtbInfos: new Map<number, VtbInfo>(),

    // follow
    followLists: [] as Array<FollowList>,
    followedVtbMids: [] as number[]
  },
  // aim for computed/derived data design API
  getters: {
    // compute followedVtbInfos from vtbInfos by followedVtbMids

    // followedVtbMids

    // compute filterVtbInfosByName()
  },
  // MUST sync
  mutations: {
    // for init or create vtbInfos
    updateVtbInfos (state, vtbInfos) {
      vtbInfos.forEach((vtbInfo: VtbInfo) => {
        state.vtbInfos.set(vtbInfo.mid, vtbInfo)
      })
    }
  },
  // can be Async
  actions: {
    updateVtbInfos ({ commit, state }, vtbInfos) {
      commit('updateVtbInfos', vtbInfos)
    }
  },
  modules: {}
})
