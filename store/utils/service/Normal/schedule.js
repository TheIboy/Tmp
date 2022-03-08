import { baseUrlApi } from 'utils/api'
import request from 'utils/request'

export default {
  // 生成CP课表绑定码
	generateCpCode: () => {
		return request.post('/schedule/generateCpCode', {}, {baseURL: baseUrlApi})
	},
	// 绑定CP
	bindCp: (bindingCode) => {
		return request.post('/schedule/bindCp/'+bindingCode, {}, {baseURL: baseUrlApi})
	},
	// CP课表绑定发起人信息
	bindingInfo: (bindingCode) => {
		return request.get('/schedule/bindingInfo/'+bindingCode, {}, {baseURL: baseUrlApi})
	},
  // 已绑定的CP
	myPartner: () => {
		return request.get('/schedule/myPartner', {}, {baseURL: baseUrlApi})
	},
  // 解除CP
	relieveBinding: (partnerId) => {
		return request.post('/schedule/relieveBinding/'+partnerId, {}, {baseURL: baseUrlApi})
	},
	// 查看cp课表
	getCpClass: (partnerId) => {
		return request.get('/schedule/cp/'+partnerId, {}, {baseURL: baseUrlApi})
	},
}