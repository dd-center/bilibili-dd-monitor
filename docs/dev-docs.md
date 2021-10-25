# 开发文档
本页阐述该项目在本地开发时的一些技巧。

## npm 下载 electron zip 文件太慢
```bash
# 指定ELECTRON_MIRROR使用淘宝镜像，最后的'/'是必须的
npm config set ELECTRON_MIRROR "https://npm.taobao.org/mirrors/electron/"
```
> 原文：https://github.com/electron/electron-packager/issues/699

## node-sass build error
re-install node-sass
