const debounce = (fn, delayInMilliseconds) => {
  let timeoutID = null
  return function () {
    if (timeoutID) clearTimeout(timeoutID)
    // eslint-disable-next-line prefer-rest-params
    const args = arguments
    // @ts-ignore
    // eslint-disable-next-line @typescript-eslint/no-this-alias
    const that = this
    timeoutID = setTimeout(function () {
      fn.apply(that, args)
    }, delayInMilliseconds)
  }
}

// https://stackoverflow.com/a/55617228
const handleScroll = function () {
  if (this.timeout) {
    clearTimeout(this.timeout)
  }

  this.timeout = setTimeout(() => {
    // your action
  }, 200) // delay
}
