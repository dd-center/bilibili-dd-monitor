import Vue from 'vue'
import Vuex from 'vuex'
import { FollowList, VtbInfo } from '@/interfaces'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    // vtb info map
    vtbInfos: new Map<number, VtbInfo>(),

    // follow
    followLists: [] as Array<FollowList>,
    followedVtbMids: [] as number[]
  },
  getters: {
    // compute followedVtbInfos from vtbInfos by followedVtbMids

    // compute filterVtbInfosByName()
  },
  mutations: {},
  actions: {},
  modules: {}
})
