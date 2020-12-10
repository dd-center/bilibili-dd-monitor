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
- [x] 左下角实时更新指示器UI：
  - [x] vtubers count
  - [x] living count
  - [x] updating count
  - [x] average update internal(ms)
  - [x] current window count
  - [ ] socket.io event
- [x] 菜单栏：窗口处理
    - [x] 置顶所有播放器窗口
    - [x] 取消置顶所有播放器窗口
    - [x] 自动布局所有播放器窗口：等分网格法
    - [ ] 最大化所有播放器窗口
    - [ ] 最小化所有播放器窗口
    - [x] 关闭所有播放器窗口
- [ ] 菜单栏：其他
    - 关闭所有播放器窗口
    - 其他/后期支持/关于/检查更新
    - 调试控制台
- [ ] Tray mode
- [ ] loading indicator UI

## performance improvement & feature enhancement
- [x] custom action message feedback UI by vue-notification
- [x] migrate NgZone API to vuex store
- [x] change vtbInfo update logic to ipcMain/ipcRenderer model(server push mode) to
reduce subsequent request network traffic significantly 
- [x] in vtbList page, when user searches by input, use debounce/throttle to decrease DOM event trigger rate to reduce memory usage.
- [x] icon images lazy load by browser-level lazy-loading
- [x] vtb list sort by `online` field
- [x] change Logic for getting vtb infos data from client pull to server push mode
- [ ] ~~icon images zip size: different size (10kb-500kb),dimension(A x A)~~
- [ ] highlight search result text
- [ ] use VtbInfoLite version NOT VtbInfo to reduce data size

## bug fix
- [x] /follow router doesn't highlight when navigate to its sub route
- [ ] ~~多开window 之后，如果删除其中一些窗口，再次重排窗口无效。该bug不稳定重现~~


