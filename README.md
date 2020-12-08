# bilibili-dd-monitor

work in progress.

## features
- [x] 已关注的直播列表
  - [x] 列表项：进入直播间
- [x] 关注分组列表
  - [x] 添加分组
  - [x] 删除分组
  - [x] 重命名分组
  - [x] 分组右侧VTB列表
    - [x] 列表项：关注/取关
    - [x] 列表项：进入直播间
    - [x] 列表项：设置分组
- [x] VTB列表
  - [x] 根据名称搜索指定VTB
  - [x] 列表项：关注/取关
  - [x] 列表项：进入直播间
- [x] 设置
  - [x] 启动时通知正在进行的直播
- [ ] 左下角Socket.IO指示器：socket.io 事件 + vtb条数
- [ ] 菜单栏
  - [ ] 窗口
    - 自动布局所有播放器窗口：等分网格法
    - 置顶所有播放器窗口
    - 最小化所有播放器窗口
    - 关闭所有播放器窗口
  - 其他/后期支持/关于/检查更新
- [ ] Tray mode
- [ ] loading indicator UI

## performance improvement & feature enhances
- [x] custom action message feedback UI by vue-notification
- [x] migrate NgZone API to vuex store
- [x] change vtbInfo update logic to ipcMain/ipcRenderer model(server push mode) to
reduce subsequent request network traffic significantly 
- [x] in vtbList page, when user searches by input, use debounce/throttle to decrease DOM event trigger rate to reduce memory usage.
- [ ] icons lazy load
- [ ] highlight search result text
- [ ] make follow menu layout fixed 

## bug fix
- [x] /follow router doesn't highlight when navigate to its sub route
- 修改前端vue数据更新逻辑，由后端IPC主动推送数据更新到前端。前端只负责订阅，然后处理

