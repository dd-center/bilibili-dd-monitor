<template>
  <div id="app">
    <!-- sidebar -->
    <div class="nav-container">
      <nav id="nav" class="nav">
        <ul class="nav-list">
          <li class="nav-list-item">
            <router-link to="/" class="nav-list-item-link">
              <font-awesome-icon :icon="['fas', 'signal']" class="nav-list-item-icon"/>
              Home
            </router-link>
          </li>
          <li class="nav-list-item">
            <router-link to="/follow" class="nav-list-item-link" :class="{'router-link-active':subIsActive('/list')}">
              <font-awesome-icon :icon="['fas', 'heart']" class="nav-list-item-icon"/>
              Follow
            </router-link>
          </li>
          <li class="nav-list-item">
            <router-link to="/vtbList" class="nav-list-item-link">
              <font-awesome-icon :icon="['fas', 'list-ul']" class="nav-list-item-icon"/>
              VtbList
            </router-link>
          </li>
          <li class="nav-list-item">
            <router-link to="/setting" class="nav-list-item-link">
              <font-awesome-icon :icon="['fas', 'cog']" class="nav-list-item-icon"/>
              Setting
            </router-link>
          </li>
        </ul>
      </nav>
      <div class="shield-container">
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
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import VueShield from '@/app/components/VueShield'

export default {
  components: {
    VueShield
  },
  computed: {
    ...mapGetters([
      'vtbCount',
      'livingVtbCount',
      'updateVtbCount',
      'playerWindowCount',
      'averageUpdateInterval'
    ])
  },
  methods: {
    subIsActive (routePath) {
      const paths = Array.isArray(routePath) ? routePath : [routePath]
      return paths.some((path) => {
        return this.$router.currentRoute.path.indexOf(path) !== -1
      })
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
</style>
