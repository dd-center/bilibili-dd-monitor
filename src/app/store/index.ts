import Vue from 'vue'
import Vuex from 'vuex'
import { FollowList, VtbInfo } from '@/interfaces'

Vue.use(Vuex)

const _compareByOnlineDesc = (vtbInfoA: VtbInfo, vtbInfoB: VtbInfo): number => {
  return vtbInfoB.online - vtbInfoA.online
}

export default new Vuex.Store({
  state: {
    vtbInfos: [] as Array<VtbInfo>,
    followLists: [] as Array<FollowList>,
    updateInfo: '' as string
  },
  getters: {
    vtbInfos: (state) => {
      return state.vtbInfos
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
    },
    updateInfo: (state) => {
      return state.updateInfo + ' from getters'
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
      state.updateInfo = `update vtb count: ${newVtbInfos.length}`
      console.log('Now vtbInfos:', state.vtbInfos.length)
    },
    //todo diff compare and update
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
