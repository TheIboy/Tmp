import { baseUrlApi } from 'utils/api'
import request from 'utils/request'

export default {
  //搜索校内通知
  searchNotify:(data) => {
    return request.post('/wyu/notify/searchNotify',data, {baseURL: baseUrlApi})
  },
  //获取校内通知单页列表
  getNotifyList:(data) => {
    return request.post('/wyu/notify/getNotifyList',data, {baseURL: baseUrlApi})
  },
  //获取校内通知详细信息
  getDetail:(data) => {
    return request.post('/wyu/notify/getDetail',data, {baseURL: baseUrlApi})
  },
  // 搜索记录
  searchHistory:() => {
    return request.get('/wyu/notify/searchHistory',{}, {baseURL: baseUrlApi})
  }
}