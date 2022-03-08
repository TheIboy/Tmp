import { baseUrlApi } from 'utils/api'
import request from 'utils/request'

export default {
  // 授权订阅
	getMessage: () => {
		return request.post('/message/allowMessage',{},{baseURL: baseUrlApi})
	},
	// 查看订阅授权状态信息
	getmessageStatus: () => {
		return request.get('/message/messageStatus', {}, {baseURL: baseUrlApi})
	},
	// 取消授权订阅
	refuseMessage: () => {
		return request.post('/message/refuseMessage', {}, {baseURL: baseUrlApi})
	},
}