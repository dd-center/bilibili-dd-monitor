# note

## router and init
切分chunk
```js
let VtbList = () => import('../views/VtbList.vue')
let FollowList = () => import('../components/FollowList.vue')
let Follow = () => import('../views/Follow.vue')
```
或者，直接引入
```
import VtbLiving from '../views/VtbLiving.vue'
import Follow from '../views/Follow.vue'
import FollowList from '../components/FollowList.vue'
import VtbList from '../views/VtbList.vue'
```
切换route时都会触发vue instance created() hooks。证明都会初始化。
