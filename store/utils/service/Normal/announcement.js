import { baseUrlApi } from 'utils/api'
import request from 'utils/request'

export default {
  // 获取历史公告
	getHistory:(data)=>{
		return request.post('/announcement/getHistory',data, {baseURL: baseUrlApi})
	},
	// 获取最新功告
	getAnnouncement:()=>{
		return request.get('/announcement/getLatestAnnouncement',{}, {baseURL: baseUrlApi})
	},
  // 最新公告是否已读
	bulletinRead:()=>{
		return request.get('/announcement/isReadLatestAnnouncement',{}, {baseURL: baseUrlApi})
	},
  //获取历史公告
  getHistory: (data) => {
    return request.post('/announcement/getHistory', data, {baseURL: baseUrlApi})
  },
  //获取历史公告
  getHistory: (data) => {
    return request.get('/announcement/getHistory', data , {baseURL: baseUrlApi})
  },
  //公告已读
  getRead: (data) => {
    return request.post('/announcement/read', data , {baseURL: baseUrlApi})
  },
}