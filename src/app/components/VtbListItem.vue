<template>
  <div :key="source.mid" class="virtual-list-item" :class="[`rank-${rank}`]">
    <div class="virtual-list-item-media">
      <span class="virtual-list-item-rank" v-if="rank <=10">NO.{{ rank }}</span>
      <img loading="lazy" class="virtual-list-item-media-avatar" width="40" height="40" :src="source.face" alt=""/>
      <div class="virtual-list-item-media-body">
        <h3 class="virtual-list-item-media-title">{{ source.uname }}</h3>
        <p class="virtual-list-item-media-content">{{ source.sign }}</p>
      </div>
      <div class="virtual-list-item-media-info">
        <div v-if="!!source.liveStatus" class="virtual-list-item-media-online">
          online
          <i class="fas fa-fire"></i>
          {{ source.online }}
        </div>
        <div v-if="!source.liveStatus" class="virtual-list-item-media-offline">offline</div>
      </div>
      <div class="virtual-list-item-media-action">
        <a v-if="followedVtbMids.includes(source.mid)" class="virtual-list-item-media-unfollow" @click="toggleFollow(source.mid)">取关</a>
        <a v-if="!followedVtbMids.includes(source.mid)" class="virtual-list-item-media-follow" @click="toggleFollow(source.mid)">关注</a>
        |
        <a class="virtual-list-item-media-enter-room" @click="enterRoom(source.roomid)">进入直播间</a>
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
    followedVtbMids: {
      type: Array,
      default () {
        return []
      }
    },
    toggleFollow: {
      type: Function
    },
    enterRoom: {
      type: Function
    }
  },
  data () {
    return {}
  },
  computed: {
    rank () {
      const rank = this.index + 1
      return rank < 10 ? '0' + rank : rank
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

  .virtual-list-item-rank {
    margin-left: 12px;
  }

  // top 1-3 avatar border highlight
  &.rank-01 {
    .virtual-list-item-media-avatar {
      border: 2px solid #f6d10a;
    }

    .virtual-list-item-rank {
      font-size: 32px;
      color: #f6d10a;
    }

    &:hover {
      background-color: rgba(#f6d10a, 0.2);
    }
  }

  &.rank-02 {
    .virtual-list-item-media-avatar {
      border: 2px solid #c5c6d5;
    }

    .virtual-list-item-rank {
      font-size: 26px;
      color: #c5c6d5;
    }

    &:hover {
      background-color: rgba(#c5c6d5, 0.2);
    }
  }

  &.rank-03 {
    .virtual-list-item-media-avatar {
      border: 2px solid rgb(198, 145, 69);
    }

    .virtual-list-item-rank {
      font-size: 20px;
      color: rgb(198, 145, 69);
    }

    &:hover {
      background-color: rgba(rgb(198, 145, 69), 0.2);
    }
  }

  &:hover {
    background-color: rgba(176, 180, 178, 0.2);
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

    &-follow {
      cursor: pointer;
      color: #3da2ff;
    }

    &-unfollow {
      cursor: pointer;
      color: #f57373;
    }

    &-enter-room {
      cursor: pointer;
      color: #3da2ff;
    }
  }
}
</style>
