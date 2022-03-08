import { baseUrlApi } from 'utils/api'
import request from 'utils/request'

export default {
  // 登录义工网
  getLogin: (data) => {
    return request.post('/volunteer/login', data, {baseURL: baseUrlApi})
  },
  // 获取个人义工信息
  getMyInfo: () => {
    return request.post('/volunteer/getMyInfo', {}, {baseURL: baseUrlApi})
  },
  // 志愿者历史活动记录
  getActivities(data){
    return request.post('/volunteer/getActivities', data, {baseURL: baseUrlApi})
  },
  // 志愿者历史培训记录
  getTrainings(){
    return request.post('/volunteer/getTrainings', {}, {baseURL: baseUrlApi})
  }
}