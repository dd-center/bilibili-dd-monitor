# Changelog
All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

### TODO
- [ ] DD_CENTER 列表中，对于每一个列表项，添加右键菜单：1.跳转到b站个人空间主页；2.跳转到b站直播间页面。
- [ ] 侧边栏添加新TAB，用于进行直播数据统计。显示例如按人气分段的人数分布，等等。
- [ ] 持久化 DD_CENTER 列表的用户偏好设置，例如【仅显示在线】功能。（该偏好的可能保存方式：本地设置文件或浏览器数据库，需要进一步考虑。）
- [ ] highlight search result text. [minor]
- [ ] 多开window 之后，如果删除其中一些窗口，再次重排窗口无效。该bug不稳定重现。[minor]

### won't fix
- ~~use VtbInfoLite version NOT VtbInfo to reduce data size~~
  > 过度设计，没这个必要。
- ~~添加非socket.io获取数据信息的模式~~
  > 非socket.io获取方式代码成本过大，决定主要使用DD_CENTER的API。
- ~~播放器画质切换无效的严重BUG(HELP WANTED)~~
  > 由于b站服务器限制，游客身份不能观看高清以上清晰度的直播。
  
## [0.10.2] - 2022-2-24
### Fixed
- 修复托盘模式下，重新点开主界面后，大部分功能失效的严重BUG。

## [0.10.1] - 2022-2-19
### Added
- 提升DD_CENTER界面列表显示体验，增加“仅显示在线”按钮，TOP 10 online 页面标注。
- 新增最小化到托盘的模式(Tray mode)
- 在设置页面，新增打开配置文件路径的功能

### Fixed
- 修复因为DD_CENTER API变化而导致的直播在线/离线状态的错误显示问题

### Refactor
- 重构关注用户的功能。

### Internal
- 冻结应用依赖库(package.json)中一些工具库的版本号。

## [0.9.4] - 2021-10-25
### Fixed
- 修复socket.io无法连接的错误
- 修复因CDN链接探测异常导致的URL丢失问题

## [0.9.3] - 2021-3-13
### Fixed
- 修复遗留的无法更新BUG

## [0.9.0] - 2021-3-13
### Added
- Living room entry for some vtubers that has not been collected.

## [0.8.1] - 2020-12-17
### Fixed
- 继续修复更新App对话框的显示关闭逻辑.

## [0.8.0] - 2020-12-17
### Added
- Home page loading spinner

## [0.7.5] - 2020-12-17
### Fixed
- 再次修复更新App对话框的显示关闭逻辑

## [0.7.4] - 2020-12-13
### Fixed
- 修复更新App对话框的显示关闭逻辑

## [0.7.2] - 2020-12-13
### Added
- 已关注的直播列表
  - 列表项：进入直播间
- 关注分组列表
  - 添加分组
  - 删除分组
  - 重命名分组
  - 分组右侧VTB列表
    - 列表项：关注/取关
    - 列表项：进入直播间
    - 列表项：设置分组
- VTB列表
  - 根据名称搜索指定VTB
  - 列表项：关注/取关
  - 列表项：进入直播间
- 设置
  - 启动时通知正在进行的直播
- 左下角实时更新指示器UI：
  - vtubers count
  - living count
  - updating count
  - average update internal(ms)
  - current window count
  - current cdn API url
- 菜单栏：窗口处理
  - 置顶所有播放器窗口
  - 取消置顶所有播放器窗口
  - 自动布局所有播放器窗口：等分迭代网格法
  - 显示所有播放器窗口
  - 最小化所有播放器窗口
  - 关闭所有播放器窗口
- 菜单栏：帮助
  - 帮助文档：=> github docs
  - 问题反馈：=> github issues
  - 检测更新：=> (仅当主动点击该项时检测)
  - 关于
  - 打开主窗口调试控制台

### Changed
- change vtbInfo update logic to ipcMain/ipcRenderer model(server push mode) to
  reduce subsequent request network traffic significantly
- in vtbList page, when user searches by input, use debounce(not throttle) to decrease DOM event trigger rate to reduce memory usage.
- icon images lazy load by browser-level lazy-loading
- specify img size to remove chromium annoying performance issue.

### Fixed
- follow router doesn't highlight when navigate to its sub route.
- 对当前在线某个vtb进行关注，马上取关，触发奇怪的下播提醒。

[Unreleased]: https://github.com/wdpm/bilibili-dd-monitor/compare/v0.10.2...HEAD
[0.10.2]: https://github.com/wdpm/bilibili-dd-monitor/releases/tag/v0.10.2
[0.10.1]: https://github.com/wdpm/bilibili-dd-monitor/releases/tag/v0.10.1
[0.9.4]: https://github.com/wdpm/bilibili-dd-monitor/releases/tag/v0.9.4
[0.9.3]: https://github.com/wdpm/bilibili-dd-monitor/releases/tag/v0.9.3
[0.9.0]: https://github.com/wdpm/bilibili-dd-monitor/releases/tag/v0.9.0
[0.8.1]: https://github.com/wdpm/bilibili-dd-monitor/releases/tag/v0.8.1
[0.8.0]: https://github.com/wdpm/bilibili-dd-monitor/releases/tag/v0.8.0
[0.7.5]: https://github.com/wdpm/bilibili-dd-monitor/releases/tag/v0.7.5
[0.7.4]: https://github.com/wdpm/bilibili-dd-monitor/releases/tag/v0.7.4
[0.7.2]: https://github.com/wdpm/bilibili-dd-monitor/releases/tag/v0.7.2
