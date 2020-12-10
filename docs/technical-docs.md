# technical doc

##  z-index 约定
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
- 将vtbInfos标记为计算属性，监控vuex的数据。如果vuex更新，那么页面自动会更新。
这样，只有第一次数据量较大，后续更新压力很小。
- 创建 VtbInfoUpdateListener。专门监听后端数据更新，后端在数据更新时会使用IPC发送到前端，
前端触发actions，最终更新到vuex。

## input search performance improvement
- visual difference about original/debounce/throttle event
> http://demo.nimius.net/debounce_throttle/

假设你鼠标来回移动的频率是:每10次/s
- original => 每10次/s
- debounce 限制为最多20次/s，那么callback fn不会触发
- debounce 限制为最高频率为5次/s，那么callback fn触发最多也就5次/s

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

##  image icons lazy loading
- https://web.dev/browser-level-image-lazy-loading/
- https://web.dev/lazy-loading-images/#images-inline-native

use browser-level image lazy loading ability

## 计算最优多屏显示效果
|playerNum|row|col=playerNum/row|row/col=r^2/playerNum|√playerNum|abs(r-√playerNum) |
|---|---|---|---|---|---|
| 1| 1| 1| 1| 1|0 |
| 2| 1| 2| 0.5| 1.414|0.4x |
| 2| 2| 1| 2| 1.414| 0.5x |
| 3| 1| 3| 0.33| 1.73|0.73|
| 3| 2| 1.5| 1.3| 1.73| 0.27|
| 3| 3| 1| 3| 1.73|1.27|
| ...| ...| ...| ...| ...| ...|
|7 | 1|  |  | 2.65|1.65 |
|7 |2 |  |  | 2.65 | 0.65|
|7 | 3|  |  | 2.65 | 0.35|
|7 | 4|  |  | 2.65 | 1.35|
|7 | 5|  |  | 2.65 | 2.35|
|7 | 6|  |  | 2.65 | 3.35|
|7 | 7|  |  | 2.65 | 4.35|

其中abs(r-√playerNum)值最小时的row就是最理想的row值。可以使得多屏效果和实际物理屏幕尺寸比例相契合。

