<template>
<view class="login">
	<view class="login-header">
		<picker mode="selector" :value="school - 1" :range="select" range-key='name' @change="pickerChange">
			<view style="display:flex">
				<template v-if="school">
					<image mode="aspectFit" :src='baseUrlApi + select[school - 1].Logo' class="login-header__image" alt="" >
				</template>
				<template v-else>
					<image mode="aspectFit" :src="baseUrlApi + 'icon/img/选择学校.png'" class="login-header__image" alt="" >
				</template>
				<view class="iconfont icon-jiantou login-header__icon"></view>
			</view>
		</picker>
		<view>
			<view class="login-header-stu">
				<img :src="useripImg" class="login-header-stu__img"/>
				<input class="login-header-stu__input" type="text" name="studentId" placeholder="请输入学号" v-model="username">
			</view>
			<view class="login-header-stu">
				<img :src="surePasswordImg" class="login-header-stu__img"/>
				<input class="login-header-stu__input" type="text" :password='showPassword' name="password" placeholder="请输入教务系统密码" v-model="password">
				<text class="iconfont" :class="showPassword === true ?'.icon-zhaoshangxiaochengxu-mimabukexian':'.icon-zhaoshangxiaochengxu-mimakexian'" @click="openYourEyes"></text>
			</view>
			<view class="login-header-identify">
				<img :src="identifierImg" class="login-header-identify__imgfir"/>
				<input type="text" name="identify" placeholder="请输入验证码" v-model="verityCode" class="login-header-identify__input">
				<img :src=imgData class="login-header-identify__img2" alt="" @click="changeverify"/>
			</view>
			<view>
				<view class="login-header-checkboxer"  @click="showgou" :class="{'login-header-checkboxer--check':gou == true}">✔</view>
				<text class="login-header-remember">记住密码</text>
			</view>
		<view class="login-header-login" @click="doLogin">登录</view>
	</view>
	<uni-popup ref="message" type="message">
		<uni-popup-message :type="msgType" :message="messageText" :duration="2000"></uni-popup-message>
	</uni-popup>
	<!-- <view class="msgtalk" v-if="talk == true">{{failmsg}}</view> -->
	</view>
</view>
</template>

<script>
import { getCache } from 'utils/index';
import { setCache } from 'utils/index';
import { baseUrlApi } from 'utils/api'

export default {
	data() {
		return {
			showPassword:true,
			baseUrlApi,
			gou:false,//是否记住密码
			username:'',
			password:'',
			verityCode:'',//输入验证码
			imgData:'',//后端传入的base64
			msg:'',//登录成功信息
			failmsg:'',//登录失败信息
			talk:false,//信息弹窗是否显示
			school: 1,// 校区
			msgType: 'error',
			messageText: '',
			LogoImg:'icon/img/YiDaLogo.png',
			useripImg:baseUrlApi + 'icon/img/账号.png',
			surePasswordImg:baseUrlApi + 'icon/img/确认密码.png',
			identifierImg:baseUrlApi + 'icon/img/验证码.png',
			service: this.$store.state.info.userInfo.service,
			select:[
				{school: 1, name: '五邑大学', Logo: 'icon/img/YiDaLogo.png'},
				{school: 1, name: '广东工业大学', Logo: 'icon/img/广工logo.png'},
			]
		};
	},
	
	methods: {
		openYourEyes(){
			this.showPassword = !this.showPassword
		},
		pickerChange: function(e) {
			let value = e.mp.detail.value
			console.log(value);
			this.school = Number(value) + 1
			setCache('school', this.school)
			this.getverify()
		},
		showgou(){
			this.gou = !this.gou
		},
		getverify(){
			this.service.school.loginVerify({school: this.school}).then(res => {
				let base64Data = res.info;
				/// 通过微信小程序自带方法将base64转为二进制去除特殊符号，再转回base64
				base64Data = uni.arrayBufferToBase64(uni.base64ToArrayBuffer(base64Data));
				/// 拼接请求头，data格式可以为image/png或者image/jpeg等，看需求
				const base64ImgUrl = "data:image/png;base64," + base64Data;
				this.imgData = base64ImgUrl
			})
		},
		doLogin(){
			if(!getCache('avatarUrl')){
				uni.getUserProfile({
					desc: 'YIDA微校园',
					success: res =>{
						setCache('avatarUrl',res.userInfo.avatarUrl)
					},
					fail: res => {
						console.log(res)
					}
				})
			}	
			let loginRequestData = {
				username:this.username,
				password:this.password,
				verityCode:this.verityCode,
				school: this.school,
			}
			this.service.school.loginIn(loginRequestData).then(res => {
				if(res.code === 1){
					this.service.school.getInfo().then(res => {
						let userData = res.info
						userData.school = this.school
						setCache('userInfo',userData)
						this.$store.commit('setUserinfo',userData)
						let pages = getCurrentPages(); // 当前页面
						let beforePage = pages[pages.length - 2]; // 前一个页面
						uni.showToast({
							icon:'success',
							title:'登录成功',
							mask:true,
							duration:2000,
							success: function(){
								setTimeout(function(){
									if(beforePage){
										uni.navigateBack()
									}else{
										uni.switchTab({
											url:'/pages/tabBar/index/index'
										})
									}
								},1500)	
							}
						})
						setCache('school', this.school)
						setCache('username',this.username);
						setCache('password',this.password);
						setCache('gou',this.gou);
						setCache('loginState',true);
					}).catch(err => {
						if(err.code){
							uni.showToast({
								icon: 'error',
								title: err.info,
								mask: true,
								duration: 1000,
							})
						}
					})
				}
			}).catch(err => {
				if(err.code){
					let that = this
					this.failmsg = err.info
					this.msgType = 'error'
					this.messageText = this.failmsg
					this.$refs.message.open()
					setTimeout(function(){
						that.talk = true
						that.verityCode = ''
					},0);
					setTimeout(function(){
						that.talk = false
					},1004);
					this.getverify();
				}
			})
		},
		loadRemember(){
			this.username = getCache('username');
			this.password = getCache('password');
			this.gou = getCache('gou');
		},
		changeverify(){
			this.getverify()
		}
	},
	mounted() {
		if(getCache('gou') == true){
			this.loadRemember()
		}
	},
	created() {
		this.school = getCache('school');
		this.getverify();
	}

}
</script>
<style lang="scss">
.login{
	&-header{
		z-index: 99;
		width: 85%;
		margin: 0 auto;
		font-size: 14px;
		&__image{
			width: 360rpx;
			height: 100rpx;
			margin: 20px 0;
			display: flex;
			align-items: center;
			justify-content: center;
			font-size: 40rpx;
		}
		&__icon{
			display: flex;
			align-items: center;
			font-size: 26rpx;
			font-weight: bold;
			margin-left: 10px;
			transform: rotate(90deg);
		}
		&-stu{
			border: 0.2px solid #cac9c9;
			border-radius: 2rem;
			display: flex;
			flex-direction: row;
			align-items: center;
			padding: 10px 10px 10px 10px;
			margin: 10px 0 10px 0;
			&__img{
				margin-right: 15px;
				width: 17px;
				height: 17px;
			}
			&__input{
				margin:0 10px;
				width: 100%;
			}
		}
		&-identify{
			width: 60%;
			border: 0.2px solid #cac9c9;
			border-radius: 2rem;
			display: flex;
			flex-direction: row;
			align-items: center;
			padding: 10px 10px 10px 10px;
			margin: 10px 0 10px 0;
			position: relative;
			&__imgfir{
				width: 17px;
				height: 17px;
			}
			&__input{
				margin-left: 15px;
				width: 100%;
			}
			&__img2{
				width: 85px !important;
				height: 30px !important;
				position: absolute;
				right: -50%;
			}
		}
		&-checkboxer{
			width: 18px;
			height: 9px;
			color: white;
			border:0.2px solid #cac9c9;
			border-radius: 0.4rem;
			// background: #131212;
			text-align: center;
			display: inline-block;
			margin: 15px 0 20px 0;
			padding-bottom: 8px;
			&--check{
				background: #131212;
			}
		}
		&-remember{
			font-size: 12px;
			font-weight: 400;
			margin-left: 12px;
		}
		&-login{
			width: 100%;
			height: 42px;
			background: rgb(217, 30, 36);
			color: #ffffff;
			border-radius: 0.75rem;
			display: flex;
			align-items: center;
			justify-content: center;
			font-size: 18px;
			font-weight: 500;
		}
	}
}
.header{
    z-index: 99;
    width: 85%;
    margin: 0 auto;
    font-size: 14px;
    &-stu{
			border: 0.2px solid #cac9c9;
			border-radius: 2rem;
			display: flex;
			flex-direction: row;
			align-items: center;
			padding: 10px 10px 10px 10px;
			margin: 10px 0 10px 0;
			&__img{
					width: 17px;
					height: 17px;
					margin-right: 10px;
			}
			&__input{
					margin-left: 10px;
					width: 100%;
			}
    }
    &-identify{
			width: 60%;
			border: 0.2px solid #cac9c9;
			border-radius: 2rem;
			display: flex;
			flex-direction: row;
			align-items: center;
			padding: 10px 10px 10px 10px;
			margin: 10px 0 10px 0;
			position: relative;
			&__imgfir{
				width: 17px;
				height: 17px;
			}
			&__input{
					margin-left: 10px;
					width: 100%;
			}
			&__img2{
				width: 85px !important;
				height: 30px !important;
				position: absolute;
				right: -50%;
				margin-right: 3px;
			}
    }
    .checkboxer{
			width: 18px;
			height: 9px;
			color: white;
			border:0.2px solid #cac9c9;
			border-radius: 0.4rem;
			// background: #131212;
			text-align: center;
			display: inline-block;
			margin: 15px 0 20px 0;
			padding-bottom: 8px;
		}
    .remember{
			font-size: 12px;
			font-weight: 400;
			margin-left: 12px;
    }
    .login{
			width: 100%;
			height: 42px;
			background: rgb(217, 30, 36);
			color: #ffffff;
			border-radius: 0.75rem;
			display: flex;
			align-items: center;
			justify-content: center;
			font-size: 18px;
			font-weight: 500;
    }
}
</style>
