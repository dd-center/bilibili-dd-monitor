import Vue from 'vue'
import Vuex from 'vuex'
import { FollowList, VtbInfo } from '@/interfaces'
import { slog } from '@/main'

Vue.use(Vuex)

const _compareByOnlineDesc = (vtbInfoA: VtbInfo, vtbInfoB: VtbInfo): number => {
  return vtbInfoB.online - vtbInfoA.online
}

export default new Vuex.Store({
  state: {
    vtbInfos: [] as Array<VtbInfo>,
    followLists: [] as Array<FollowList>,
    updateVtbCount: 0 as number
  },
  getters: {
    vtbInfos: (state) => {
      return state.vtbInfos
    },
    vtbCount: (state) => {
      return state.vtbInfos.length
    },
    updateVtbCount: (state) => {
      return state.updateVtbCount
    },
    followLists: (state) => {
      return state.followLists
    },
    followedVtbMids: (state): number[] => {
      const followedVtbMids: number[] = []
      state.followLists.forEach((followList: FollowList) => {
        followedVtbMids.push(...followList.mids)
      })
      return followedVtbMids
    },
    followedVtbInfos: (state, getters) => {
      let followedVtbInfos: VtbInfo[] = []
      followedVtbInfos = [
        ...getters.vtbInfos.filter((vtbInfo: VtbInfo) => {
          return getters.followedVtbMids.includes(vtbInfo.mid)
        })
      ]
      return followedVtbInfos.sort(_compareByOnlineDesc)
    }
  },
  mutations: {
    updateVtbInfos (state, newVtbInfos: VtbInfo[]) {
      // is first update. init vtbInfos
      if (state.vtbInfos.length === 0) {
        state.vtbInfos.push(...newVtbInfos)
      } else {
        // next update
        newVtbInfos.forEach((newVtbInfo: VtbInfo) => {
          const index = state.vtbInfos.findIndex(vtbInfo => vtbInfo.mid === newVtbInfo.mid)
          // found => update existed object
          if (index !== -1) {
            // todo show diff parts
            Vue.set(state.vtbInfos, index, newVtbInfo)
          } else {
            // not found, add this newVtbInfo to state.vtbInfos
            state.vtbInfos.push(newVtbInfo)
          }
        })
      }
      state.updateVtbCount = newVtbInfos.length
      slog('updateVtbCount', state.updateVtbCount)
      slog('vtbCount', state.vtbInfos.length)
    },
    // todo diff compare and update
    updateFollowLists (state, followLists: FollowList[]) {
      state.followLists = followLists
    }
  },
  actions: {
    updateVtbInfos ({ commit, state }, vtbInfos: VtbInfo[]) {
      commit('updateVtbInfos', vtbInfos)
    },
    updateFollowLists ({ commit, state }, followLists: FollowList[]) {
      commit('updateFollowLists', followLists)
    }
  },
  modules: {}
})
