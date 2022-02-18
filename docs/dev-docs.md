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
