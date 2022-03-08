import { baseUrlApi } from 'utils/api'
import request from 'utils/request'

export default {
  // 获取课程成绩
	getSaveScore:(data) => {
		return request.post('/score/share',data,{baseURL: baseUrlApi})
	},
}