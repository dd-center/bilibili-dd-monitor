<template>
  <div :key="source.mid" class="virtual-list-item">
    <div class="virtual-list-item-media">
      <img loading="lazy" class="virtual-list-item-media-avatar" width="40" height="40" :src="source.face" alt=""/>
      <div class="virtual-list-item-media-body">
        <h3 class="virtual-list-item-media-title">{{ source.uname }}</h3>
        <p class="virtual-list-item-media-content" :class="[getSignCSSClass(source)]">{{ source.sign }}</p>
      </div>
      <div class="virtual-list-item-media-action">
        <a class="virtual-list-item-media-unfollow" @click="toggleFollow(source.mid)">取关</a>
        |
        <a class="virtual-list-item-media-enter-room" @click="enterRoom(source.roomid)">进入直播间</a>
        |
        <a class="virtual-list-item-media-set-list" @click="handleSetListModalShow(source.mid)">设置分组</a>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'item-component',
  props: {
    index: { // index of current item
      type: Number
    },
    source: {
      type: Object,
      default () {
        return {}
      }
    },
    toggleFollow: {
      type: Function
    },
    enterRoom: {
      type: Function
    },
    handleSetListModalShow: {
      type: Function
    }
  },
  methods: {
    getSignCSSClass (source) {
      const isManualSignInfo = source.updateMethod === 'MANUAL'
      return isManualSignInfo ? 'manual-sign-warn' : ''
    }
  }
}
</script>

<style scoped lang="scss">

.virtual-list-item {
  border-bottom: #e2e2e2 solid 1px;
  list-style: none;
  margin-left: 20px;
  margin-right: 20px;
  color: #666262;
  font-size: 1rem;

  &:hover {
    background-color: rgba(66, 185, 131, 0.1);
  }

  &-media {
    display: flex;
    align-items: center;

    &-body {
      margin-top: 5px;
      margin-bottom: 5px;
    }

    &-title {
      font-size: 1em;
      line-height: 2em;
      font-weight: 400;
    }

    &-content {
      font-size: 0.85em;
      line-height: 2em;

      &.manual-sign-warn {
        text-decoration: line-through;
      }
    }

    &-info {
      flex: 0 0 140px;
      font-size: 0.85em;
    }

    &-online {
      display: inline;
      color: #4cd495;
      border: #4cd495 solid 1px;
      border-radius: 5px;
      padding: 2px 4px;
    }

    &-offline {
      display: inline;
      color: #df7373;
      border: #df7373 solid 1px;
      border-radius: 5px;
      padding: 2px 4px;
    }

    &-avatar {
      margin-left: 1em;
      margin-right: 1em;
      width: 40px;
      height: 40px;

      border-radius: 50%;
      display: block;
    }

    &-body {
      flex: 1;
    }

    &-action {
      font-size: 0.85em;

      margin-right: 1em;
    }

    &-unfollow {
      cursor: pointer;
      color: #f57373;
    }

    &-enter-room {
      cursor: pointer;
      color: #3da2ff;
    }

    &-set-list {
      cursor: pointer;
      color: #3da2ff;
    }
  }
}
</style>
