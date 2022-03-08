import { baseUrlApi } from 'utils/api'
import request from 'utils/request'

export default {
  // 获取课表
	getkb: (data) => {
		return request.post('/school/standard/getKb',data,{baseURL: baseUrlApi})
	},
  // 获取开学日期
	getStartSchool: (data) => {
		return request.post('/school/standard/getStartSchool',data,{baseURL: baseUrlApi})
	},
  // 获取登录验证码
  loginVerify: (data) =>{
		return request.get('/school/standard/getSchoolYzm',data, {baseURL: baseUrlApi})
	},
  // 教务处登录
	loginIn: (data) => {
		return request.post('/school/standard/trylogin',data,{baseURL: baseUrlApi})
	},
	// 获取学籍卡片
	getInfo: (data) => {
		return request.get('/school/standard/getStudentInfo', data, {baseURL: baseUrlApi})
	},
  // 读取考试安排
	getExam:(data) => {
		return request.post('/school/standard/getExam',data, {baseURL: baseUrlApi})
	},
	// 读取考试成绩
	getScores:(data) => {
		return request.post('/school/standard/getScores',data, {baseURL: baseUrlApi})
	},
  // 读取考试安排
  getExam:(data) => {
    return request.post('/school/standard/getExam',data, {baseURL: baseUrlApi})
  },
  // 退出登录
  logout: () => {
    return request.post('/school/standard/logout', {} , {baseURL: baseUrlApi})
  },
  // 第二课堂学分
  getSecondClass: (data) => {
    return request.post('/school/standard/getSecondClass', data, {baseURL: baseUrlApi})
  }
}