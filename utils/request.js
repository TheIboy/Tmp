var Fly=require("flyio/dist/npm/wx")
import { baseUrlApi } from './api'
import { getCache, setCache } from './index'

const request = new Fly()

const updateManager = uni.getUpdateManager()

updateManager.onCheckForUpdate(function (res) {
  // 请求完新版本信息的回调
  console.log(res.hasUpdate)
})

updateManager.onUpdateReady(function () {
  uni.showModal({
    title: '更新提示',
    content: '新版本已经准备好，是否重启应用？',
    success: function (res) {
      if (res.confirm) {
        // 新的版本已经下载好，调用 applyUpdate 应用新版本并重启
        updateManager.applyUpdate()
      }
    }
  })
})

updateManager.onUpdateFailed(function () {
  // 新版本下载失败
})


// 微信token
let token = ''
if(getCache("token")){
	uni.checkSession({
		success(){
			token = getCache('token')
		},
		fail(){
			uni.login({
				success(res) {
					//1.获取用户的登录临时凭证，和用户是否授权没有直接关系 有效时长五分钟
					let code = {
						'code': res.code
					};
					// 2.发送code给服务器端
					request.post('/login/trylogin', code, {baseURL: baseUrlApi}).tryLogin(code).then(res => {
						token = res.info;
						// 3.将自定义登录状态缓存
						setCache('token',token)
					}).catch((err) => {
						if(err.code){
							uni.showToast({
								icon:'none',
								title:'请重新加载小程序，若还存在这个问题，请联系管理员',
								mask:true,
								duration:3000,
							})
						}
					});
				}
			});
		}
	})
}else{
	uni.login({
		success(res) {
			//1.获取用户的登录临时凭证，和用户是否授权没有直接关系 有效时长五分钟
			let code = {
				'code': res.code
			};
			// 2.发送code给服务器端
			request.post('/login/trylogin', code, {baseURL: baseUrlApi}).then(res => {
				token = res.info;
				// 3.将自定义登录状态缓存
				setCache('token',token)
			}).catch((err) => {
				if(err.code){
					uni.showToast({
						icon:'none',
						title:'请重新加载小程序，若还存在这个问题，请联系管理员',
						mask:true,
						duration:3000,
					})
				}
			});
		}
	});
}


request.interceptors.request.use((request) => {
	if(request.url.indexOf('/school/trylogin') !== -1){
		uni.showLoading({
			title:'登录中',
			mask:true
		})
	}else{
		uni.showLoading({
			title: '加载中',
			mask:true
		});
	}
	if (request.url.indexOf("wxLogin") == -1 || type == 'WORKBENCH') {
		// let storeId = getCache("storeId");
		let storeCode = getCache("storeCode");
		let inviter = getCache("inviter");
		let token = getCache("token");
		request.headers = {
			"Content-type": "application/json", 
			"source": "miniApp",
			"token": token,
			"storeCode": storeCode,
			"inviter": inviter
		}
		let dataSource = getCache("dataSource")
		if (dataSource) { 
			request.headers['dataSource'] = dataSource	
		}
		return request
	}
})

request.interceptors.response.use((response, promise) => {
	uni.hideLoading()
	if(response.request.url === '/school/getStartSchool' && response.data.code === 1){
		uni.showToast({
			icon:'success',
			title:'导入成功',
			mask:true,
			duration:1100,
		})
	}
	// 微信运维统计
	if (response.status) {
		uni.reportMonitor('0', +(response.status))
	}
	if (response.headers.date) {
		let time = new Date().getTime() - new Date(response.headers.date).getTime()
		uni.reportMonitor('1', +(time))
	}
	return promise.resolve(response.data)
},(err, promise) => {
		uni.hideLoading()
		if(err.status === 500 || err.status === 404 || err.status === 504){
			uni.showToast({
				title: '出错啦！请稍后再试试哦～',
				icon: 'none',
				duration: 2000
			})
		}
		if(err.status === 412){
			return promise.reject(err)
		}
		uni.hideNavigationBarLoading()
		return promise.reject(err.response.data)
	}
)

export default request