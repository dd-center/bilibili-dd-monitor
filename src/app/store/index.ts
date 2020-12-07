import Vue from 'vue'
import Vuex from 'vuex'
import { FollowList, VtbInfo } from '@/interfaces'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    // vtb info map
    vtbInfosMap: new Map<number, VtbInfo>(),

    // follow
    followLists: [] as Array<FollowList>,
    followedVtbMids: [] as number[],

    // for test
    count: 0
  },
  // aim for computed/derived data design API
  getters: {
    // compute followedVtbInfos from vtbInfos by followedVtbMids

    // followedVtbMids

    // vtbInfos
    vtbInfos: (state): VtbInfo[] => {
      return [...state.vtbInfosMap.values()]
    },

    // compute filterVtbInfosByName()
    filterVtbInfosByName: (state) => (name: string): VtbInfo[] => {
      return [...state.vtbInfosMap.values()].filter((vtbInfo: VtbInfo) => vtbInfo.uname?.includes(name))
    }
  },
  // MUST sync
  mutations: {
    // for init or create vtbInfos
    updateVtbInfos (state, vtbInfos) {
      vtbInfos.forEach((vtbInfo: VtbInfo) => {
        state.vtbInfosMap.set(vtbInfo.mid, vtbInfo)
      })
      console.log(`now vtb count: ${state.vtbInfosMap.size}`)
    },
    increment (state) {
      state.count++
    }
  },
  // can be Async
  actions: {
    updateVtbInfos ({ commit, state }, vtbInfos) {
      commit('updateVtbInfos', vtbInfos)
    },
    increment ({ commit }) {
      commit('increment')
    }
  },
  modules: {}
})
