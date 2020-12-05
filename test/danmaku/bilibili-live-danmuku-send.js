const SWITCH_VALUE = true // true开启, false关闭
const SEND_INTERVAL_IN_MILLISECONDS = 2000 // 发送间隔，单位毫秒
const MAX_COUNT = 5 // 发送条数

let _timer = null // 定时器
let _currentCount = 0 // 计数器

let bulletText = '~~ヾ(ﾟ∀ﾟゞ)(ﾉﾟ▽ﾟ)ﾉ~~' // 独轮车弹幕

const el = (selector) => {
  return document.querySelector(selector)
}

const checkIfCanSendDanmuku = () => {
  let $chatInputBox = el('.chat-input.border-box')
  let $sendButton = el('.bl-button.live-skin-highlight-button-bg.bl-button--primary.bl-button--small')
  return !!$chatInputBox && !!$sendButton
}

const seedDanmuku = () => {
  if (_currentCount >= MAX_COUNT) {
    clearInterval(_timer) // 关闭定时器
    return
  }
  // define DOM event
  const event = document.createEvent('Event')
  event.initEvent('input', true, true)

  // get DOM elements refs
  let $chatInputBox = el('.chat-input.border-box')
  let $sendButton = el('.bl-button.live-skin-highlight-button-bg.bl-button--primary.bl-button--small')

  // mock input text and dispatch event
  $chatInputBox.value = bulletText
  $chatInputBox.dispatchEvent(event)

  // fix: change send button state to enabled
  $sendButton.disabled = false

  // mock click
  $sendButton.click()

  console.log('[_currentCount]:' + _currentCount)

  _currentCount++
}

const reset = () => {
  if (_timer) {
    clearInterval(_timer)
  }
  _timer = null
  _currentCount = 0
}

const fire = () => {
  reset()
  if (SWITCH_VALUE && checkIfCanSendDanmuku()) {
    _timer = setInterval(seedDanmuku, SEND_INTERVAL_IN_MILLISECONDS)
  }
}

