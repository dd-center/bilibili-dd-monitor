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
现象：socket.io 连接错误。
解决方案：
1. 在webPreferences中加入webSecurity: false
```js
webPreferences: {
  //...
  webSecurity: false,
}
```
2. 在使用socket.io-client 时设置参数
```js
private defaultSocketOptions = { transports: ['websocket'], rejectUnauthorized: false }
const socket = io(this.socketIOUrl, this.defaultSocketOptions)
```

参考链接：
- https://stackoverflow.com/questions/47696304/node-js-app-fails-to-connect-using-socket-io-client/47697179
- https://github.com/socketio/socket.io-client/issues/1097

## 发布
1. 本地修改代码
2. 提升package.json version字段，以及git 标记对应tag，例如v0.9.3。
3. push tag and commits
