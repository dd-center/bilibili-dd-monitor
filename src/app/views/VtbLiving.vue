<template>
  <div class="living-list-container">
    <table class="living-list">
      <thead class="living-list-head">
      <tr class="living-list-head-row">
        <th class="living-list-head-item">头像</th>
        <th class="living-list-head-item">昵称</th>
        <th class="living-list-head-item">ID</th>
        <th class="living-list-head-item">直播状态</th>
        <th class="living-list-head-item">人气</th>
        <th class="living-list-head-item">直播标题</th>
        <th class="living-list-head-item">操作</th>
      </tr>
      </thead>
      <tbody class="living-list-body">
      <tr v-for="vtbInfo in followedVtbInfos" :key="vtbInfo.mid" class="living-list-body-row">
        <td class="living-list-body-cell">
          <img loading="lazy" class="living-list-body-cell-media-avatar" :src="vtbInfo.face"/>
        </td>
        <td class="living-list-body-cell">{{ vtbInfo.uname }}</td>
        <td class="living-list-body-cell">{{ vtbInfo.mid }}</td>
        <td class="living-list-body-cell">
          <div class="living-list-body-cell-media-info">
            <div v-if="vtbInfo.liveStatus === 1" class="living-list-body-cell-media-online">
              <font-awesome-icon :icon="['fas', 'signal']" class="living-list-body-cell-media-online-icon"/>
            </div>
            <div v-if="vtbInfo.liveStatus !== 1" class="living-list-body-cell-media-offline">
              <font-awesome-icon :icon="['fas', 'ban']" class="living-list-body-cell-media-offline-icon"/>
            </div>
          </div>
        </td>
        <td class="living-list-body-cell">{{ vtbInfo.online }}</td>
        <td class="living-list-body-cell">{{ vtbInfo.title }}</td>
        <td class="living-list-body-cell"><a @click="enterRoom(vtbInfo.roomid)" class="living-list-body-cell-enter-room">进入直播间</a></td>
      </tr>
      </tbody>
    </table>
  </div>
</template>

<script>
import { LivePlayService } from '@/app/services'
import { mapGetters } from 'vuex'

export default {
  name: 'VtbLiving',
  data () {
    return {
      //
    }
  },
  created () {
    this.initServices()
  },
  computed: {
    ...mapGetters([
      'followedVtbInfos'
    ])
  },
  methods: {
    initServices () {
      this.livePlayService = new LivePlayService()
    },
    enterRoom (roomid) {
      this.livePlayService.enterRoom(roomid)
    }
  }
}
</script>

<style scoped lang="scss">
.living-list {
  border-collapse: collapse;
  width: 100%;
  color: #666262;

  &-head-row {
    border-bottom: #e2e2e2 solid 1px;
  }

  &-head-item {
    font-weight: 400;
    text-align: left;
    padding: 10px 10px 10px 20px;
  }

  &-body {
    font-size: 0.85em;
  }

  &-body-row {
    border-bottom: #e2e2e2 solid 1px;

    &:hover {
      background-color: rgba(66, 185, 131, 0.1);
    }
  }

  &-body-cell {
    padding: 10px 10px 10px 20px;

    &-media-avatar {
      width: 40px;
      height: 40px;
      border-radius: 50%;
      display: block;
    }

    &-media-online-icon {
      color: #4cd495;
    }

    &-media-offline-icon {
      color: #df7373;
    }

    &-enter-room {
      color: #3da2ff;
      cursor: pointer;
    }
  }
}
</style>
