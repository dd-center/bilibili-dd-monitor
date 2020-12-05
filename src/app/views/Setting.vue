<template>
  <div class="setting-container">
    <div class="setting-item">
      <p class="setting-item-description">启动时通知正在进行的直播</p>
      <input
        type="checkbox"
        @click="handleIsNotifiedOnStartChange()"
        :checked="isNotifiedOnStart"
        class="setting-item-toggle-button"
      />
    </div>
  </div>
</template>

<script>
import SettingService from '@/app/services/SettingService'

export default {
  name: 'Setting',
  data () {
    return {
      isNotifiedOnStart: false
    }
  },
  created () {
    this.settingService = new SettingService()
    this.settingService.getIsNotifiedOnstart().subscribe((isNotifiedOnStart) => {
      this.isNotifiedOnStart = isNotifiedOnStart
    })
  },
  methods: {
    handleIsNotifiedOnStartChange () {
      this.settingService.setIsNotifiedOnStart(!this.isNotifiedOnStart).subscribe((isNotifiedOnStart) => {
        this.isNotifiedOnStart = isNotifiedOnStart
      })
    }
  }
}
</script>

<style scoped lang="scss">
.setting-container {
  margin-left: 20px;
}

.setting-item {
  &-description {
    margin: 16px 0;
    font-size: 0.85em;
    color: #666262;
  }

  // modified from https://www.youtube.com/watch?v=BQSNBa3gZJU
  &-toggle-button {
    position: relative;
    width: 45px;
    height: 20px;
    appearance: none;
    background: #e2e2e2;
    outline: none;
    border-radius: 10px;
    transition: 0.4s;

    &::before {
      content: '';
      position: absolute;
      width: 20px;
      height: 20px;
      border-radius: 10px;
      top: 0;
      left: 0;
      background: #ffffff;
      transform: scale(0.8);
      transition: 0.5s;
      box-shadow: 0 0 8px rgba(0, 0, 0, 0.2);
    }

    &:checked {
      background: #3da2ff;

      &::before {
        left: 25px;
      }
    }
  }
}
</style>
