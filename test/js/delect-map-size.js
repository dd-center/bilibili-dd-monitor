// https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Map
// Methods
// Map.prototype.clear()
// Map.prototype.delete()
// Map.prototype.entries()
// Map.prototype.forEach()
// Map.prototype.get()
// Map.prototype.has()
// Map.prototype.keys()
// Map.prototype.set()
// Map.prototype.values()
// Map.prototype[@@iterator]()

const printMapSize = function () {
  console.log(this)
}

const mutationMapSizeMethods = [
  'clear',
  'delete',
  'set'
]

const mapProto = Map.prototype
const mapExtendMethods = Object.create(mapProto)

mutationMapSizeMethods.forEach(method => {
  const original = mapProto[method]
  mapExtendMethods[method] = function (...args) {
    const result = original.apply(this, args)
    printMapSize.apply(this)
    return result
  }
})

const map = new Map()
// eslint-disable-next-line no-proto
map.__proto__ = mapExtendMethods

map.set('foo', 123)
map.set('a', 1313)
console.log(map)
