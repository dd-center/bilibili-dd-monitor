import request from 'request'

// wrap a request in an promise
function wrapRequest (url: string) {
  return new Promise((resolve, reject) => {
    request(url, (error, response, body) => {
      if (error) reject(error);
      if (response.statusCode !== 200) {
        reject('Invalid status code <' + response.statusCode + '>');
      }
      resolve(body);
    });
  });
}

export class RoomService {
  protected constructor () {
    // don't initiate it
  }

  static async getInfoByRoom (roomid: number) {
    let url = `https://api.live.bilibili.com/xlive/web-room/v1/index/getInfoByRoom?room_id=${roomid}`

    let result = {
      isValid: false,
      info: {}
    }

    try {
      const bodyString = await wrapRequest(url) as string;
      const body = JSON.parse(bodyString);
      const hasSuccessResponse = body && body.code === 0 && body.data

      if (hasSuccessResponse) {
        const data = body.data
        const roomInfo = data.room_info
        const anchorInfo = data.anchor_info

        const mid = roomInfo.uid
        const roomId = roomInfo.room_id
        const uname = anchorInfo.base_info.uname
        const face = anchorInfo.base_info.face

        console.log(mid, roomId, uname, face)

        result.isValid = true;
        Object.assign(result.info, {
          mid: mid,
          roomId: roomId,
          uname: uname,
          face: face
        })

      } else {
        // maybe invalid roomid parameter
        console.log("invalid response")
      }

    } catch (e) {
    }

    return result
  }

}
