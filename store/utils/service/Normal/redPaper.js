import { baseUrlApi } from 'utils/api'
import request from 'utils/request'

export default {
  // 提交红包表单
	redPaperSave:(data)=>{
		return request.post('/redPaper/save',data, {baseURL: baseUrlApi})
	},
}