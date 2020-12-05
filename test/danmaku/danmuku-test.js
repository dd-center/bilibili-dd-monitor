let bulletText = '我是一条独轮车弹幕[测试专用]' // 独轮车弹幕

// define DOM event
const event = document.createEvent('Event')
event.initEvent('input', true, true)

// get DOM elements refs
let $chatInputBox = document.querySelector('.chat-input.border-box')
let $sendButton = document.querySelector('.bl-button.live-skin-highlight-button-bg.bl-button--primary.bl-button--small')

// mock input text and dispatch event
$chatInputBox.value = bulletText
$chatInputBox.dispatchEvent(event)

// fix: change send button state to enabled
$sendButton.disabled = false

// mock click
$sendButton.click()

console.log('[send danmaku done]')
