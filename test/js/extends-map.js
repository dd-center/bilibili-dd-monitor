class ContextMap extends Map {
  constructor (context) {
    super()
    this.context = context
  }

  delete (key) {
    this.context.foo()
    super.delete(key)
  }

  set (key, value) {
    this.context.foo()
    super.set(key, value)
  }

  clear () {
    this.context.foo()
    super.clear()
  }

  printContext () {
    console.log(this.context)
  }
}

const context = {
  k: 45,
  foo () {
    console.log('do some stuff')
  }
}
const mapWithContext = new ContextMap(context)
mapWithContext.printContext()
mapWithContext.set('foo', 1)
mapWithContext.delete('foo')
mapWithContext.clear('foo')
