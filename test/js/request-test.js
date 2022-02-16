const request = require('request')

let roomid = 1603600
let url = `https://api.live.bilibili.com/xlive/web-room/v1/index/getInfoByRoom?room_id=${roomid}`
request(url, function (error, response, body) {
  if (error) {
    console.error('error:', error) // Print the error if one occurred
    return
  }

  if (response && response.statusCode === 200) {
    const result = JSON.parse(body)
    const hasSuccessResponse = result && result.code === 0 && result.data

    if (hasSuccessResponse) {
      const data = result.data
      const roomInfo = data.room_info
      const anchorInfo = data.anchor_info

      const mid = roomInfo.uid
      const roomId = roomInfo.room_id
      const uname = anchorInfo.base_info.uname
      const face = anchorInfo.base_info.face

      console.log(mid, roomId, uname, face)
    } else {
      // maybe invalid roomid parameter
      console.log("invalid response")
    }

  }

})
