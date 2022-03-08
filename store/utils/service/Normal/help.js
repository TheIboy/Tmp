import { baseUrlApi } from 'utils/api'
import request from 'utils/request'

export default {
  // 获取所有帮助列表
  getAllList: () => {
    return request.get('/help/getAllArticle',{},{baseURL: baseUrlApi})
  },
}