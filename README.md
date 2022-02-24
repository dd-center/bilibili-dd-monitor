<h1 align="center">
  <a href="https://github.com/wdpm/bilibili-dd-monitor/">
    <img src="./images/banner.png" alt="bilibili-dd-monitor" width="1600">
  </a>
</h1>

<h4 align="center">专为DD设计的多屏直播观看工具</h4>

<p align="center">
  <a href="#">
    <img src="https://img.shields.io/github/issues/wdpm/bilibili-dd-monitor" alt="GitHub issues">
  </a>
  <a href="https://app.fossa.com/projects/git%2Bgithub.com%2Fwdpm%2Fbilibili-dd-monitor?ref=badge_shield">
    <img src="https://app.fossa.com/api/projects/git%2Bgithub.com%2Fwdpm%2Fbilibili-dd-monitor.svg?type=shield" alt="FOSSA Status">
  </a>
  <a href="#">
    <img src="https://img.shields.io/github/repo-size/wdpm/bilibili-dd-monitor" alt="GitHub repo size">
  </a>
  <a href="#">
    <img src="https://img.shields.io/github/languages/code-size/wdpm/bilibili-dd-monitor" alt="GitHub code size in bytes">
  </a>
  <a href="#">
    <img src="https://img.shields.io/tokei/lines/github/wdpm/bilibili-dd-monitor" alt="Lines of code">
  </a>
  <a href="#">
    <img src="https://img.shields.io/github/downloads/wdpm/bilibili-dd-monitor/total" alt="GitHub all releases">
  </a>
  <a href="#">
    <img src="https://img.shields.io/github/contributors/wdpm/bilibili-dd-monitor" alt="GitHub contributors">
  </a>
  <a href="#">
    <img src="https://img.shields.io/github/last-commit/wdpm/bilibili-dd-monitor" alt="GitHub last commit">
  </a>
  <a href="#">
    <img src="https://img.shields.io/github/commit-activity/y/wdpm/bilibili-dd-monitor" alt="GitHub commit activity">
  </a>
</p>

|  Living            |  Follow | vtuber-list            |  setting |
|---------------------|----------------------|---------------------|----------------------|
| ![Living](./images/page-living.png) | ![Follow](./images/page-follow.png)  |![vtuber-list](./images/page-vtuber-list.png) | ![Follow](./images/page-setting.png)  |

|   player     |  multi-player |real-time-indicator  |  player-menu |
|---------------------|----------------------|---------------------|----------------------|
| ![player](./images/player.png) | ![multi-player](./images/multi-player.png)  |![real-time-indicator](./images/real-time-indicator.png) | ![player-menu](./images/player-menu.png)  |

## Table of Contents
<!-- START doctoc generated TOC please keep comment here to allow auto update -->
<!-- DON'T EDIT THIS SECTION, INSTEAD RE-RUN doctoc TO UPDATE -->


- [Introduction](#introduction)
- [Motivation](#motivation)
- [Key Features](#key-features)
- [How to use](#how-to-use)
- [Technologies Used](#technologies-used)
- [Versioning](#versioning)
- [Development](#development)
  - [Setup](#setup)
  - [Installation](#installation)
- [How to contribute](#how-to-contribute)
  - [pull request](#pull-request)
  - [submit bug feedback](#submit-bug-feedback)
- [Acknowledgments](#acknowledgments)
- [License](#license)

<!-- END doctoc generated TOC please keep comment here to allow auto update -->

## Introduction
Bilibili-dd-monitor是一个专为bilibili dd 设计的多屏观看vtuber直播的实用工具。

## Motivation
> why this project exists?

有时，你关注的多个vtuber会同时在线直播。此时，你有以下方法：
- 使用手机：受限于手机屏幕尺寸，几乎不可能多开观看；
- 使用纯浏览器：受限于纯浏览器的标签窗口，切换麻烦。或者尝试将浏览器窗口缩小，手动编排窗口，这种方式比较原生，是可行的。但是具有非常明显的两个缺点：
  - 1.手动编排多个窗口需要耗费人力，长久而言可能会产生疲惫感。
  - 2.原生浏览器窗口页面元素（除播放器外）过多，不容易控制尺寸，而且比较占系统资源。这也是为什么多开直播窗口会卡的缘故。当然，该软件不能解决多开播放器卡顿的问题，最多是理论上的缓解。

于是，第一个核心功能出现：多开播放器，支持同时观看直播视频。

第二个核心功能是：需要一个能实时获取/检测vtuber是否开播/下播的机制，这样就能在做别的事情时得到通知。很欣慰的是，这样的一个数据API接口已经有DD做了。
> 来自于DD-Center的vtbs.moe数据中心。

万事俱备，只欠~~新建文件夹~~了。在动手之前，利用搜索引擎大致搜索了是否已存在这样的项目或者软件，~~试图白嫖~~。经过一番探索，找到了这样一个契合的项目：

- https://github.com/dd-center/bili-dd-monitor

作者属于dd-center成员，~~果然DD的工具只能DD来写~~。

然而，作者已经不维护很久了。~~白嫖失败~~。怎么办呢，还是下载下来读一下源码。作者使用的技术框架为：Angular + Electron + Socket.io。原作者的实现思路大部分还是很棒的，事实上，Angular 框架本身脏值检测机制NgZone，以及Angular早期版本API设计得相对不够优雅，具体体现在语法层比较繁琐。

最终决定，以原来作者repo为参考，写~~亿~~一下。取其精华，去其糟粕。编码实现的时候，坚持性能第一和简洁原则。能删则删，集中优化瓶颈部分。最终诞生了该项目。

## Key Features
> 注意：这里的【关注】指的是该软件的【关注】功能，非bilibili网站的关注功能，目前不打算集成bilibili account信息。

- 显示已关注而且正在直播的vtb列表
- 分组关注vtb功能
- bilibili vtb信息库列表
- 本地设置
- 播放器观看直播
- 多个播放器自动网格布局

## How to use
前往 [release 页面](https://github.com/wdpm/bilibili-dd-monitor/releases) 。下载对应平台的发布版本。
- *.exe => 对应 windows。没有 Code Signing Certificate
- *.dmg => 对应 mac。 没有Code Signing & Notarize
- *.AppImage => 对应 linux

> 注意：对于以上发布版本，只有windows版本已经在Windows 10测试通过，无严重bug。其他版本未测试。任何平台下的严重BUG，欢迎反馈。

## Technologies Used
- @fortawesome/? | fortawesome 图标库，使用free版本
- core-js | JS 标准库，用于ESLint
- electron-settings | electron本地设置库
- electron-updater | electron自动更新工具库
- electron-json-storage | electron json配置工具库，暂时没有使用
- lodash | JS实用库
- ping | API健康监测
- pretty-log | NodeJS环境下的控制台输出美化库
- request | 网络请求库(过时)
- rxjs | 异步和基于事件的通信工具
- shields-log | 类似shields.io的浏览器控制台日志输出工具
- socket.io-client | socket.io 客户端
- vue 2.x | 前端视图框架
- vuex | vue集中式状态管理
- vue-router | vue页面路由导航
- vue-notification | 第三方vue库，通知组件
- vue-select | 第三方vue库，下拉框组件
- vue-virtual-scroll-list | 第三方vue库，虚拟列表

## Versioning
We use [SemVer](https://semver.org/lang/zh-CN/) for versioning. For the versions available, 
see the [tags](https://github.com/wdpm/bilibili-dd-monitor/tags) on this repository.

## Development
For a developer setup and run this project.

### Setup
```
git clone https://github.com/wdpm/bilibili-dd-monitor
npm i
```
### Installation
Lint
```
npm run lint
```
Local build
```
npm run electron:build
```
Local run
```
npm run electron:serve
```
Generate icons for all platform
```
npm run electron:generate-icons
```
For more command line, see [package.json](./package.json)
 
## How to contribute
You can pull request or submit bug feedback.

### pull request 
对于想要的新功能，或者已有功能的改进建议，也可以在issue页面提出。但是，只有真正的核心功能才会被考虑迭代进后续版本。一些带有强烈个性/非普适的功能，你可以选择fork，然后自行实现。

### submit bug feedback
对于使用过程中出现的bug，可以在issue页面进行反馈。严重bug理论上会被修复。
 
## Acknowledgments
- [DD Center](https://github.com/dd-center) 
- [bili-dd-monitor](https://github.com/dd-center/bili-dd-monitor)

## License
[![FOSSA Status](https://app.fossa.com/api/projects/git%2Bgithub.com%2Fwdpm%2Fbilibili-dd-monitor.svg?type=large)](https://app.fossa.com/projects/git%2Bgithub.com%2Fwdpm%2Fbilibili-dd-monitor?ref=badge_large)
