# Changelog
All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]
### Added
- [ ] Tray mode
- [ ] loading indicator UI
- [ ] 添加非socket.io获取数据信息的模式

### Changed
- [ ] highlight search result text
- [ ] use VtbInfoLite version NOT VtbInfo to reduce data size

### Fixed
- [ ] 多开window 之后，如果删除其中一些窗口，再次重排窗口无效。该bug不稳定重现。
- [ ] 播放器画质切换无效的严重BUG

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

[Unreleased]: https://github.com/wdpm/bilibili-dd-monitor/compare/v0.8.1...HEAD
[0.8.1]: https://github.com/wdpm/bilibili-dd-monitor/releases/tag/v0.8.1
[0.8.0]: https://github.com/wdpm/bilibili-dd-monitor/releases/tag/v0.8.0
[0.7.5]: https://github.com/wdpm/bilibili-dd-monitor/releases/tag/v0.7.5
[0.7.4]: https://github.com/wdpm/bilibili-dd-monitor/releases/tag/v0.7.4
[0.7.2]: https://github.com/wdpm/bilibili-dd-monitor/releases/tag/v0.7.2
