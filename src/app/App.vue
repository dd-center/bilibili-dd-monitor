<template>
  <div id="app">
    <!-- sidebar -->
    <div class="nav-container">
      <nav id="nav" class="nav">
        <ul class="nav-list">
          <li class="nav-list-item">
            <router-link to="/" class="nav-list-item-link">
              <font-awesome-icon :icon="['fas', 'home']" class="nav-list-item-icon"/>
              主页
            </router-link>
          </li>
          <li class="nav-list-item">
            <router-link to="/follow" class="nav-list-item-link" :class="{'router-link-active':subIsActive('/list')}">
              <font-awesome-icon :icon="['fas', 'heart']" class="nav-list-item-icon"/>
              关注
            </router-link>
          </li>
          <li class="nav-list-item">
            <router-link to="/vtbList" class="nav-list-item-link">
              <font-awesome-icon :icon="['fas', 'list-ul']" class="nav-list-item-icon"/>
              DD_CENTER
            </router-link>
          </li>
          <li class="nav-list-item">
            <router-link to="/setting" class="nav-list-item-link">
              <font-awesome-icon :icon="['fas', 'cog']" class="nav-list-item-icon"/>
              设置
            </router-link>
          </li>
          <li class="nav-list-item">
            <router-link to="/liveRoomEntry" class="nav-list-item-link">
              <font-awesome-icon :icon="['fas', 'paper-plane']" class="nav-list-item-icon"/>
              直播间入口
            </router-link>
          </li>
        </ul>
      </nav>
      <div class="shield-container">
        <vue-shield class="shield-item" :title="'CDN'" :content="currentCDN"/>
        <vue-shield class="shield-item" :title="'已获取 vtubers'" :content="vtbCount"/>
        <vue-shield class="shield-item" :title="'正在直播'" :content="livingVtbCount"/>
        <vue-shield class="shield-item" :title="'正在更新'" :content="updateVtbCount"/>
        <vue-shield class="shield-item" :title="'平均更新间隔(MS)'" :content="averageUpdateInterval"/>
        <vue-shield class="shield-item" :title="'当前播放器窗口'" :content="playerWindowCount"/>
      </div>
    </div>
    <!-- main-->
    <main class="content">
      <router-view/>
    </main>

    <!-- for custom style: https://github.com/euvl/vue-notification#style-->
    <notifications group="action-feedback" position="top center"/>

    <!-- use v-if to make lazy compile-->
    <div v-if="updateAvailableModalVisible" id="modal-update-available" class="modal modal-update-available">
      <div class="modal-content">
        <div class="modal-header">
          <h3 class="modal-title">发现更新</h3>
        </div>
        <div class="modal-body">
          <!-- .version undefined BUG-->
          <h4>新版本: {{ updateInfo && updateInfo.version }}. 是否立即下载？</h4>
          <p>更新内容</p>
          <p v-html="(updateInfo && updateInfo.releaseNotes)"></p>
        </div>
        <div class="modal-footer">
          <button class="modal-button modal-button-ok" @click="handleClickOK">是</button>
          <button class="modal-button modal-button-cancel" @click="handleClickCancel">否</button>
        </div>
      </div>
    </div>

  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import VueShield from '@/app/components/VueShield'

const ipcRenderer = window.ipcRenderer

export default {
  data () {
    return {}
  },
  components: {
    VueShield
  },
  computed: {
    ...mapGetters([
      'vtbCount',
      'livingVtbCount',
      'updateVtbCount',
      'playerWindowCount',
      'averageUpdateInterval',
      'currentCDN',
      'updateAvailableModalVisible',
      'updateInfo'
    ])
  },
  methods: {
    subIsActive (routePath) {
      const paths = Array.isArray(routePath) ? routePath : [routePath]
      return paths.some((path) => {
        return this.$router.currentRoute.path.indexOf(path) !== -1
      })
    },
    handleClickOK () {
      // here should lock UI
      this.$store.dispatch('toggleShowUpdateAvailableModal', this.updateInfo)
      ipcRenderer.send('user-confirm-download')
      // here should unlock UI
      // (doge 狂点复读机
    },
    handleClickCancel () {
      this.$store.dispatch('toggleShowUpdateAvailableModal', this.updateInfo)
    }
  }
}
</script>

<style lang="scss">
// my free style reset
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

/* tune smaller scrollbar width*/
*::-webkit-scrollbar {
  width: 13px;
}

/* disable the buttons on the scrollbar (arrows pointing upwards and downwards). */
*::-webkit-scrollbar-button {
  display: none;
}

/*  custom the draggable scrolling handle. */
*::-webkit-scrollbar-thumb {
  min-height: 16px;
  background-color: #999999;
  background-clip: padding-box;
  border: 3px solid #fdfdfd;
  border-radius: 5px;
}

#app {
  display: flex;
  flex-direction: row;
  min-height: 100vh;
  flex: 1;

  font-family: Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}

// make nav container controlled by flex layout
.nav-container {
  flex: 0 0 12.5em;
}

//make fixed nav by position and specific width
.nav {
  position: fixed;
  width: 12.5em;

  &-list {
    list-style: none;
    border-right: #e2e2e2 solid 1px;
  }

  &-list-item {
    list-style: none;

    &-icon {
      margin-right: 8px;
    }
  }

  &-list-item-link {
    outline: none;
    padding: 10px 0 10px 20px;
    display: block;
    color: #2c3e50;
    text-decoration: none;

    &:hover {
      color: #42b983;
    }

    &.router-link-active,
    &.router-link-exact-active {
      color: #42b983;
      background-color: rgba(66, 185, 131, 0.1);
      border-right: #42b983 solid 2px;
    }
  }
}

.content {
  flex: 1;
}

.shield-container {
  position: fixed;
  bottom: 0;
  width: 12.5em;
}

.shield-item {
  margin: 6px;
}

// override default style
.vue-notification-group {
  top: 30% !important;
}

.modal {
  position: fixed;
  z-index: 3000;
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, .2);

  display: flex;
  align-items: center;
  justify-content: center;

  &-content {
    border: #e2e2e2 solid 1px;
    border-radius: 5px;
    background-color: white;
    width: 40%;

    display: flex;
    flex-direction: column;

    font-size: 1rem;
    color: #666262;
  }

  &-header {
    border-bottom: #e2e2e2 solid 1px;
    display: flex;
    flex-direction: row;
    align-items: center;
    padding: 6px 12px;
  }

  &-title {
    flex: 1;
    font-weight: 400;
    font-size: 1em;
  }

  &-body {
    padding: 16px;
    flex: 1;
    border-bottom: #e2e2e2 solid 1px;
  }

  &-footer {
    display: flex;
    flex-direction: row-reverse;
    font-weight: 400;
    padding: 8px 12px;
  }

  &-button {
    outline: none;
    text-align: center;
    text-decoration: none;
    display: inline-block;
    justify-self: end;
    padding: 8px 16px;
    border-radius: 5px;
    border: #e2e2e2 solid 1px;
    cursor: pointer;
    margin-left: 10px;

    &-ok {
      order: -1;
      background-color: #3da2ff;
      color: white;
    }

    &-cancel {
      order: 1;
      color: #666262;
    }
  }

}

</style>
