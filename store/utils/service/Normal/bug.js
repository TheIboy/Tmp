import { baseUrlApi } from 'utils/api'
import request from 'utils/request'

export default {
  //发送反馈
  postFeedBack: (data) => {
    return request.post('/bug/send', data, {baseURL: baseUrlApi})
  },
}