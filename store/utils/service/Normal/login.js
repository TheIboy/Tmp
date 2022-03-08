import { baseUrlApi } from 'utils/api'
import request from 'utils/request'

export default {
  // wx登录
	tryLogin: (data) =>{
		return request.post('/login/trylogin', data, {baseURL: baseUrlApi});
	},
	// 获取首页轮播图
	getBanners: () => {
		return request.get('/getBanners', {}, {baseURL: baseUrlApi})
	},  
	// 获取首页功能
	getFunction: (data) => {
		return request.get('/getFunction', data, {baseURL: baseUrlApi})
	},  
}