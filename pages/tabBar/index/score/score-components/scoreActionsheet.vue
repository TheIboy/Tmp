<template>
<view class='actionsheet' v-show="display">
	<!-- 遮罩层 -->
	<view class="actionsheet-bg" @click="changedisplay" catchtouchmove='true'>
		<view class="actionsheet-content" catchtouchmove='true'>
			<view class="actionsheet-content-course" @click="saveAlbum('save')">
				<view class="actionsheet-content-course-picker">保存到相册</view>
			</view>
			<view class="actionsheet-content-course" @click="saveAlbum('share')">
				保存并发送给好友
			</view>
			<view @click="changedisplay" class="actionsheet-content-cancel">
				<text class="actionsheet-content-cancel__text">取消</text>
			</view>
		</view>
	</view>
</view>
</template>

<script>
import {getCache,setCache} from 'utils/index'
export default {
	props: ['display'],
	data() {
		return {
			src: null,
			service: this.$store.state.info.userInfo.service
		}
	},
	methods: {
		//保存到相册
		saveAlbum(type = 'save'){
			this.savePoster(type)
			this.$emit('toScore',false)
		},
		// 发送并保存到相册
		saveAndSend(filePath) {
			wx.showShareImageMenu({
				path:filePath
			})
		},
		// 点击遮罩层
		changedisplay() {
			this.$emit('toScore', false)
		},
		savePoster(type) {
			wx.getSetting({ //获取用户的当前设置
				success: (res) => {
					if (res.authSetting['scope.writePhotosAlbum']) { //验证用户是否授权可以访问相册
						this.saveImageToPhotosAlbum(type);
					} else {
						wx.authorize({ //如果没有授权，向用户发起请求
							scope: 'scope.writePhotosAlbum',
							success: () => {
								this.saveImageToPhotosAlbum(type);
							},
							fail: () => {
								wx.showToast({
									title: "请打开保存相册权限，再点击保存相册分享",
									icon: "none",
									duration: 3000
								});
								setTimeout(() => {
									wx.openSetting({ //调起客户端小程序设置界面,让用户开启访问相册
										success: (res2) => {
											console.log(res2.authSetting)
										}
									});
								}, 3000);
							}
						})
					}
				}
			})
		},
		saveImageToPhotosAlbum(type = 'save') {
			this.src = ''
			let requestSave = getCache('requestSave')
			this.service.score.getSaveScore(requestSave).then(res => {
				let base64Data = res.info.replace(/[\r\n]/g,"")
				base64Data = wx.arrayBufferToBase64(wx.base64ToArrayBuffer(base64Data));
				this.src = base64Data
			})
			let timer = setInterval(()=>{
				if(this.src !== ''){
					clearInterval(timer)
					let filePath = wx.env.USER_DATA_PATH +'/' + new Date().getTime().toString() +'xw.png';
					// console.log(filePath)
					wx.showLoading({
						title: '加载中',
						mask: true
					})
					let that = this
					wx.getFileSystemManager().writeFile({
						filePath: filePath, //创建一个临时文件名
						data: that.src, //写入的文本或二进制数据
						encoding: 'base64', //写入当前文件的字符编码
						success: res => {
							console.log(type);
							if(type === 'share')
								that.saveAndSend(filePath)
								console.log(filePath);
							wx.saveImageToPhotosAlbum({
								filePath: filePath,
								success: function(res2) {
									wx.hideLoading();
									wx.showToast({
										title: '保存成功，请从相册选择再分享',
										icon: "none",
										duration: 5000
									})
								},
								fail: function(err) {
									wx.hideLoading();
								}
							})
						},
						fail: err => {
							wx.hideLoading();
						}
					})
				}
			}, 1)
		},
  },
}
</script>
<style lang='scss' scoped>
.actionsheet{
	&-bg{
		position: fixed;
		width: 100%;
		height: 100vh;
		top: 0;
		left: 0;
		z-index: 399;
		background-color: rgba(68, 67, 67, .7);
		::after{
			position: relative;
		}
	}
	&-content{
		position: absolute;
		font-size: 27rpx;
		width: 100%;
		background-color: #f5f5f5;
		border-radius: 0.25rem;
		bottom: 0;
		left: 50%;
		transform: translateX(-50%);
		z-index: 400;
		&-course{
			background: #fff;
			height: 100rpx;
			border-bottom: 1px solid #f5f5f5;
			display: flex;
			align-items: center;
			justify-content: center;
			&-picker{
				display: flex;
				align-items: center;
				justify-content: center;
				width: 100vw;
				height: 100rpx;
				border-bottom: 1px solid #f5f5f5;
			}
			&:active{
				background-color: rgb(212, 212, 212);
			}
		}
		&-cancel{
			background: #fff;
			margin-top: 10px;
			height: 100rpx;
			padding-bottom: constant(safe-area-inset-bottom);  
			padding-bottom: env(safe-area-inset-bottom); 
			display: flex;
			justify-content: center;
			&__text{
				margin-top: 30rpx;
			}
			&:active{
				background-color: rgb(212, 212, 212);
			}
		}
	}
}
</style>