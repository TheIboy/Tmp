import { baseUrlApi } from 'utils/api'
import request from 'utils/request'

export default {
  // 开发计划数据列表
  getReleaseList: () =>{
		return request.get('/release/getReleaseList',{}, {baseURL: baseUrlApi})
	},
}