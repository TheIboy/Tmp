import { baseUrlApi } from 'utils/api'
import request from 'utils/request'

export default {
  // 用户是否为学生
	isStudent: () => {
		return request.get('/user/isStudent', {}, {baseURL: baseUrlApi})
	},
	// 上传头像
	updateAvatar: (data) => {
		return request.post('/user/updateAvatar', data, {baseURL: baseUrlApi})
	},
	// 用户校区信息
	mySchool: () => {
		return request.get('/user/mySchool', {}, {baseURL: baseUrlApi})
	},
}