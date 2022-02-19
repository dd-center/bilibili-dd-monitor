# technical doc

## z-index 约定

- dropdown 1000
- modal 3000
- notification 5000(default)

## Vue router and init

Vue切换路由时，

- 不同组件，会触发created()
- 相同组件，会重用组件，不会触发created()

## Angular VtbList page

> https://angular.io/guide/zone

禁止采用原repo方式获取数据。 每次切换进入vtblist都会发新请求到backend，没有必要。 因为这种方式

- 用户必须手动切换路由，才能触发更新
- 网络数据流量每次都是2000+条，但是实际上后续更新时，一般都是50-200条之间数据发生变更。数据负载大，真正有用的数据量少。

更好的解决方案：

- 初始化vtblist时，不触发任何到electron的数据请求
- 将vtbInfos标记为计算属性，监控vuex的数据。如果vuex更新，那么页面自动会更新。 这样，只有第一次数据量较大，后续更新压力很小。
- 创建 VtbInfoUpdateListener。专门监听后端数据更新，后端在数据更新时会使用IPC发送到前端， 前端触发actions，最终更新到vuex。

## input search performance improvement

- visual difference about original/debounce/throttle event

> http://demo.nimius.net/debounce_throttle/

假设你鼠标来回移动的频率是:每10次/s

- original => 每10次/s
- debounce 限制为最多3次/s，那么callback fn不会触发
- throttle 限制为最高频率为5次/s，那么callback fn触发最多也就5次/s

## vue Reactivity in Depth

- https://vuejs.org/v2/guide/reactivity.html
- https://vuejs.org/v2/api/#Vue-set

Vue 2.x 对数组mutation的监控能力非常有限，必须小心使用push,splice等已被拦截的方法，才能保证反应性。

## Vuex vtbInfos data

### vuex

```
state: {
  vtbInfos: [] as Array<VtbInfo>,
  followLists: [] as Array<FollowList>,
},
```

### init

```
followLists(vuex) 
vtbInfos(vuex)
followedVtbMid get from followLists(vuex)
```

### page

- living

```
followedVtbInfos: followedVtbMids(followLists)(vuex) + vtbInfos(vuex) =>
```

- follow

```
followLists(vuex)
```

- followList

```
followLists(vuex)
activeFollowList: local activeListId + followLists(vuex) =>
activeFollowedVtbInfos: activeFollowList + vtbInfos(vuex) =>
```   

- vtbList

```
vtbInfos(vuex) => show long list
followedVtbMids => show follow/unfollow
```

## image icons lazy loading

- https://web.dev/browser-level-image-lazy-loading/
- https://web.dev/lazy-loading-images/#images-inline-native

use browser-level image lazy loading ability

## 计算最优多屏显示效果

|playerNum|row|col=playerNum/row|row/col=r^2/playerNum|√playerNum|abs(r-√playerNum) |
|---|---|---|---|---|---|
| 1| 1| 1| 1| 1|0(best) |
| 2| 1| 2| 0.5| 1.414|0.4x(best) |
| 2| 2| 1| 2| 1.414| 0.5x |
| 3| 1| 3| 0.33| 1.73|0.73|
| 3| 2| 1.5| 1.3| 1.73| 0.27(best)|
| 3| 3| 1| 3| 1.73|1.27|
| ...| ...| ...| ...| ...| ...|
|7 | 1|  |  | 2.65|1.65 |
|7 |2 |  |  | 2.65 | 0.65|
|7 | 3|  |  | 2.65 | 0.35(best)|
|7 | 4|  |  | 2.65 | 1.35|
|7 | 5|  |  | 2.65 | 2.35|
|7 | 6|  |  | 2.65 | 3.35|
|7 | 7|  |  | 2.65 | 4.35|

其中abs(r-√playerNum)值最小时的row就是最理想的row值。可以使得多屏效果和实际物理屏幕尺寸比例相契合。

## beautiful logging

> web browser

- shields-log

该log适用于浏览器环境，不适用于NodeJS console。类似于shields.io 图标。

> electron(NodeJS)

- pretty

当前使用pretty

```
[ERROR] => MESSAGE
[WARN] => MESSAGE
[SUCCESS] => MESSAGE
[DEBUG] => MESSAGE
```

- cat-loggr

```
 12/10 15:05:33  verbose  Hello, world!
 12/10 15:05:33   info    Hello, world!
 12/10 15:05:33   init    Hello, world!
 12/10 15:05:33   warn    Hello, world!
 12/10 15:05:33   error   Hello, world!
 12/10 15:05:33   fatal   Hello, world!
```

## measure electron app performance

> https://www.geeksforgeeks.org/gpu-information-in-electronjs/

性能衡量指标：CPU 网络 内存 磁盘 GPU

测试环境

```
CPU: Intel(R) Core(TM) i7-8550U CPU @ 1.80GHz
内存：16.0 GB 速度: 2400 MHz
磁盘 0 (D:) Samsung SSD 970 EVO Plus 500GB
磁盘 1 (C:) SAMSUNG MZVLB256HAHQ-00000
GPU 0 Intel(R) UHD Graphics 620 | 共享 GPU 内存	7.9 GB
GPU 1 NVIDIA GeForce MX250 | 专用 GPU 内存 2.0 GB | 共享 GPU 内存 7.9 GB
```

### 内存

|描述|内存|delta|
|---|---|---|
|仅启动，不开任何播放器|40MB|-|
|1 player playing |336MB |+300|
|2 player playing |474MB |+140|
|3 player playing |575MB |+100|
|4 player playing |650MB| +80|
|5 player playing |800MB| +150|
|6 player playing |900MB| +100|
|关闭所有播放器窗口 |250MB| -650|

CPU/网络/GPU 是主要瓶颈。

## 非socket.io获取数据信息的模式[TODO]

> https://github.com/dd-center/vtbs.moe/blob/master/api.md

当socket.io API不可用时，使用以下策略：

1.初始化所有vtubers数据，这个数据量通过该接口获取：info

```
https://api.vtbs.moe/v1/info
```

2.定时轮询直播状态接口，获取当前正在直播的vtubers的房间id: List of living rooms

```
https://api.vtbs.moe/v1/living
```

> 轮询时间间隔如何设计？

- 固定时间间隔。例如每10s轮询一次，那么滑动时间窗口也就是10s的长度。
- 智能化更新轮询时间间隔。 例如当前正在直播的有100，第二次获取时，变成了120，第三次更新时变成了121，也就是说明第二次~第三次的时间span内，变化很微弱，得出一种假设：当前变化率不大，下一次的变化率也会不大。于是，可以加大时间窗口长度来提升性能，于是将10 s x 2=20s。这就是大致的思路。

## 优雅的升级提示

每次启动时，执行更新检测。 根据JSON文件的hasUpdate字段判断，

- 如果hasUpdate字段不存在或者为fasle，那就执行更新检测。
    - 存在可用更新时，在左下角添加小红点。提示用户升级，同时将一个字段 hasUpdate:true 写入本地配置。
    - 不存在可用更新时，将 hasUpdate:false 写入本地配置
- 如果hasUpdate为true，那就显示消息提示用户去升级。类似Apple的小红点即可。

## 调研b站官方vtuber直播状态的API[TODO]

这个是最终fallback的策略。

## electron 配置文件工具库

- [x] electron-settings (简单，当前使用这个)
    - sync/async write and read methods
- [ ] electron-store (需求不契合，不需要链式点访问语法)
- [ ] electron-json-storage 
    - no setSync() method ??? (同步方法缺失)