<template>
<view class="login">
	<view class="login-header">
		<img :src="img.vImg" class="login-header__image" alt="" >
		<view>
			<view class="login-header-stu">
				<img :src="img.studentIdImg" class="login-header-stu__img"/>
				<input type="text" name="studentId" placeholder="请输入义工账号" v-model="volUsername">
			</view>
			<view class="login-header-stu">
				<img :src="img.passwordImg" class="login-header-stu__img"/>
				<input type="password" name="password" placeholder="请输入密码" v-model="volPassword">
			</view>
			<view>
				<view class="login-header-checkboxer"  @click="showAutoLogin" :class="{'login-header-checkboxer--check':autoLogin == true}">✔</view>
				<text class="login-header-remember">自动登录</text>
			</view>
		<view class="login-header-login" @click="doLogin">登录</view>
	</view>
	<!-- <view class="msgtalk" v-if="talk == true">{{failmsg}}</view> -->
	</view>
		<!-- 提示信息  -->
	<uni-popup ref="message2" type="message">
		<uni-popup-message :type="openType" :message="messageText" :duration="1000" ></uni-popup-message>
	</uni-popup>
</view>
</template>

<script>
import { getCache } from 'utils/index';
import { setCache } from 'utils/index';
import { baseUrlApi } from 'utils/api'

export default {
	data() {
		return {
			img:{
				vImg:baseUrlApi+'icon/img/volunteerLogo.png',
				passwordImg:baseUrlApi+'icon/img/确认密码.png',
				studentIdImg:baseUrlApi+'icon/img/账号.png'
			},
			autoLogin:false,//自动登录
			volUsername:'',
			volPassword:'',
			messageText:'',//登录状态信息
			openType:'',
			talk:false,//信息弹窗是否显示
			service: this.$store.state.info.userInfo.service
		};
	},
	
	methods: {
		showAutoLogin(){
			this.autoLogin = !this.autoLogin
		},
		doLogin(){
			let loginRequestData = {
				username:this.volUsername,
				password:this.volPassword,
			}
			this.service.volunteer.getLogin(loginRequestData).then(res => {
					this.messageText = res.info;
					this.openType = 'success';
					this.$refs.message2.open();
					uni.navigateBack({
						delta: 1
					});
					setCache('volUsername',this.volUsername);
					setCache('volPassword',this.volPassword);
					setCache('autoLogin',this.autoLogin);
			}).catch(err =>{
					uni.hideLoading();
					uni.showToast({
						title: '账号或密码错误',
						icon:"none",
						duration: 1000
					});
				})
		},
		loadRemember(){
			this.autoLogin = getCache('autoLogin');
		},
	},
	mounted() {
		if(getCache('autoLogin') == true){
			this.loadRemember();
			this.doLogin();
		}
	},
	created() {
		this.volUsername = getCache('volUsername');
		this.volPassword = getCache('volPassword');
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
			width: 150px;
			height: 80px;
			margin: 40rpx 0;
		}
		&-stu{
			border: 0.2px solid #cac9c9;
			border-radius: 2rem;
			display: flex;
			flex-direction: row;
			align-items: center;
			padding: 20rpx;
			margin: 50rpx 0;
			&__img{
				width: 17px;
				height: 17px;
			}
			&__input{
				margin-left: 10px;
				width: 100%;
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
			border-radius: 45rpx;
			display: flex;
			align-items: center;
			justify-content: center;
			font-size: 18px;
			margin-top: 20rpx;
		}
	}
}
.msgtalk{
	position: absolute;
	left: 50%;
	top:50%;
	transform: translate(-50%,-50%);
	background: #000000;
	opacity: 0.8;
	z-index: 100;
	color: #ffffff;
	width: 130px;
	height: 45px;
	display: flex;
	align-items: center;
	justify-content: center;
	border-radius: 10px;
	font-size: 13px;
}
</style>
