import Vue from 'vue'
import Vuex from 'vuex'
import { FollowList, VtbInfo } from '@/interfaces'
import { UpdateInfo } from 'electron-updater'
import { _compareByOnlineDesc } from '@/app/utils/helpers'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    vtbInfos: [] as Array<VtbInfo>,
    followLists: [] as Array<FollowList>,
    updateVtbCount: 0 as number,
    playerWindowCount: 0 as number,
    averageUpdateInterval: 0 as number,
    currentCDN: '' as string,
    updateAvailableModalVisible: false as boolean,
    updateInfo: {
      version: '' as string,
      releaseNotes: '' as string
    } as UpdateInfo
  },
  getters: {
    currentCDN: (state) => {
      return state.currentCDN
    },
    vtbInfos: (state) => {
      return state.vtbInfos
    },
    vtbCount: (state) => {
      return state.vtbInfos.length
    },
    playerWindowCount: (state) => {
      return state.playerWindowCount
    },
    livingVtbCount: (state): number => {
      return state.vtbInfos.filter((vtb: VtbInfo) => !!vtb.liveStatus).length
    },
    updateVtbCount: (state) => {
      return state.updateVtbCount
    },
    averageUpdateInterval: (state) => {
      return state.averageUpdateInterval
    },
    followLists: (state) => {
      return state.followLists
    },
    followedVtbMids: (state): number[] => {
      const followedVtbMids: number[] = []
      state.followLists.forEach((followList: FollowList) => {
        followedVtbMids.push(...followList.list.map((item) => item.mid))
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
    updateAvailableModalVisible: (state) => {
      return state.updateAvailableModalVisible
    },
    updateInfo: (state) => {
      return state.updateInfo
    }
  },
  mutations: {
    updateVtbInfos (state, { updatedVtbInfos, averageUpdateInterval }) {
      // is first update. init vtbInfos
      if (state.vtbInfos.length === 0) {
        state.vtbInfos.push(...updatedVtbInfos)
      } else {
        // next update
        updatedVtbInfos.forEach((newVtbInfo: VtbInfo) => {
          const index = state.vtbInfos.findIndex(vtbInfo => vtbInfo.mid === newVtbInfo.mid)
          // found => update existed object
          if (index !== -1) {
            // do better: sort and show diff parts
            Vue.set(state.vtbInfos, index, newVtbInfo)
          } else {
            // not found, add this newVtbInfo to state.vtbInfos
            state.vtbInfos.push(newVtbInfo)
          }
        })
      }
      state.updateVtbCount = updatedVtbInfos.length
      state.averageUpdateInterval = averageUpdateInterval
    },
    updateFollowLists (state, followLists: FollowList[]) {
      state.followLists = followLists
    },
    updatePlayerWindowCount (state, count: number) {
      state.playerWindowCount = count
    },
    updateCurrentCDN (state, currentCDN: string) {
      state.currentCDN = currentCDN
    },
    toggleShowUpdateAvailableModal (state, updateInfo: UpdateInfo) {
      state.updateAvailableModalVisible = !state.updateAvailableModalVisible
      state.updateInfo = updateInfo
    }
  },
  actions: {
    updateVtbInfos ({ commit, state }, payload) {
      commit('updateVtbInfos', payload)
    },
    updateFollowLists ({ commit, state }, followLists: FollowList[]) {
      commit('updateFollowLists', followLists)
    },
    updatePlayerWindowCount ({ commit, state }, count: number) {
      commit('updatePlayerWindowCount', count)
    },
    updateCurrentCDN ({ commit, state }, currentCDN: string) {
      commit('updateCurrentCDN', currentCDN)
    },
    toggleShowUpdateAvailableModal ({ commit, state }, updateInfo: UpdateInfo) {
      commit('toggleShowUpdateAvailableModal', updateInfo)
    }
  },
  modules: {}
})
