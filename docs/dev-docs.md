# 开发文档

本页阐述该项目在本地开发时的一些技巧。

## npm 下载 electron zip 文件太慢

```bash
# 指定ELECTRON_MIRROR使用淘宝镜像，最后的'/'是必须的
npm config set ELECTRON_MIRROR "https://npm.taobao.org/mirrors/electron/"
```

> 原文：https://github.com/electron/electron-packager/issues/699

## node-sass build error

解决方法：re-install node-sass

## connect_error Error: xhr poll error

现象：socket.io 连接错误。 解决方案：

1. 在webPreferences中加入webSecurity: false

```js
webPreferences: {
  //...
  webSecurity: false,
}
```

2. 在使用socket.io-client 时设置参数

```js
private
defaultSocketOptions = {
  transports: ['websocket'],
  rejectUnauthorized: false
}
const socket = io(this.socketIOUrl, this.defaultSocketOptions)
```

参考链接：

- https://stackoverflow.com/questions/47696304/node-js-app-fails-to-connect-using-socket-io-client/47697179
- https://github.com/socketio/socket.io-client/issues/1097

## font-awesome issue

```
-  Bundling main process...ERROR in D:/Code/WebStormProjects/bilibili-dd-monitor/src/main.ts(45,3):
45:3 Argument of type 'IconDefinition' is not assignable to parameter of type 'IconDefinitionOrPack'.
  Type 'IconDefinition' is not assignable to type 'IconPack'.
    Index signature is missing in type 'IconDefinition'.
    43 | 
    44 | library.add(
  > 45 |   faSignal,
       |   ^
    46 |   faHeart,
    47 |   faListUl,
    48 |   faCog,
```

- 问题关键：
  "@fortawesome/fontawesome-common-types": 这个包的版本不一致。 引用了不同的@fortawesome/fontawesome-common-types 包的 index.d.ts 文件。

- 解决方法： 寻找依赖它们的library，并且校正版本，使得可以兼容。然后在package.json 锁住相关库的版本。

## electron-updater cannot find module 'fs/promises'

在 node_modules 搜索 `'fs/promises'` 定位到 electron-updater 包。版本问题。 解决方法： "electron-updater": "4.3.9" 直接冻结版本。

## 发布

1. 本地修改代码
2. 提升package.json version字段，以及git 标记对应tag，例如v0.9.3。
3. push tag and commits

## github actions 单独发布了3个release，对应三个平台
> 参阅： https://zhuanlan.zhihu.com/p/164901026

3个平台的构建是并行的，猜测是electron build时候无法正常识别已经存在的release。
```
• creating GitHub release  reason=release doesn't exist tag=v0.10.1 version=0.10.1
```
~~于是需要定位依赖库，找回之前可以正常工作的依赖库版本。~~

最终方案：重构build file中的构建流程，不依赖electron-builder的release功能。

## 保持git commit历史简洁
> 参阅： [Git 压缩多个commit为单个commit](https://kinboyw.github.io/2019/04/09/Git-%E5%8E%8B%E7%BC%A9%E5%A4%9A%E4%B8%AAcommit%E4%B8%BA%E5%8D%95%E4%B8%AAcommit/)

有时，因为某些实验，会造成多次琐碎的提交历史，此时应该：
1. 拉取远程最新提交，
2. 然后本地squash 需要压缩的历史提交记录。这步使用的是git rebase -i
3. 然后push到远程。如果是个人项目，可以暴力--force。如果是多人合作项目，不建议--force。

## 了解Electron打包
> https://zhuanlan.zhihu.com/p/45250432

两个关键点：
- electron 应用很大，是因为electron.exe本身就很大（>50MB）。
- 另外，项目依赖库 node_modules（prod模式）被全部打包进来。

## release file list
```
bilibili-dd-monitor-0.10.1-mac.zip 72.8 MB
bilibili-dd-monitor-0.10.1.dmg 75.1 MB
bilibili-dd-monitor-0.10.1.dmg.blockmap 81.7 KB
latest-mac.yml 584 Bytes

bilibili-dd-monitor-0.10.1-setup.exe 54.2 MB  
bilibili-dd-monitor-0.10.1-setup.exe.blockmap 58.7 KB
latest.yml 404 Bytes

bilibili-dd-monitor-0.10.1.AppImage 74.9 MB
latest-linux.yml 426 Bytes

Source code (zip)
Source code (tar.gz)
```
