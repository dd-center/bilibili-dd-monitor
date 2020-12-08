import Vue from 'vue'
import Vuex from 'vuex'
import { FollowList, VtbInfo } from '@/interfaces'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    // vtb info map
    vtbInfosMap: new Map<number, VtbInfo>(),

    filteredVtbInfos: [] as Array<VtbInfo>,

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
    filteredVtbInfos: (state) => {
      console.log(`state.filteredVtbInfos.length:${state.filteredVtbInfos.length}`)
      return state.filteredVtbInfos
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
    // filter vtbInfos by search
    searchVtbInfosByName (state, name: string) {
      console.log(`[vuex:mutations:searchVtbInfosByName start]: ${name}`)
      state.filteredVtbInfos = [...state.vtbInfosMap.values()].filter((vtbInfo: VtbInfo) => vtbInfo.uname?.includes(name))
      console.log('[vuex:mutations:searchVtbInfosByName end]')
      console.log(`[vuex:mutations:searchVtbInfosByName state.filteredVtbInfos.length]: ${state.filteredVtbInfos.length}`)
    }
  },
  // can be Async
  actions: {
    updateVtbInfos ({ commit, state }, vtbInfos) {
      commit('updateVtbInfos', vtbInfos)
    },
    searchVtbInfosByName ({ commit, state }, name) {
      console.log(`[vuex:actions:searchVtbInfosByName]: ${name}`)
      commit('searchVtbInfosByName', name)
    }
  },
  modules: {}
})
