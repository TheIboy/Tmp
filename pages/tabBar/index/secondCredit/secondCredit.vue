<template>
	<view class="second">
		<!-- 登录弹框 -->
		<login-window v-if="showloginWindow" @loginwindowShow = 'emitwindowShow' @requestAgain = 'requestAgain' sureback = "getSecondClass"/>
		<view>
			<view class="second-head" >
				<view class="second-head--center">
					<view class="second-head--center__name">第二课堂总学分</view>
					<view class="second-head--center__num">{{allSecondScore}}</view>
				</view>
				<view  class="second-head__refresh">
					上次更新时间 {{refreshTime}}
				</view>
				<img class="second-head__img" :class="{'second-head__img--click':isClickToLogin}" :src="baseUrlApi+'icon/img/refresh.svg'" @click="toLogin" >
			</view>
		</view>
		<!-- <view class="second--bgc"> -->
			<movable-area class="second-area" :class="{'top':isTop,'second-area--top':isShowTop}" >
				<movable-view ref="mview" class="second-view" :x="x" :y="y" direction="vertical" out-of-bounds  @change="handleChange" @click="goTop">
				<view class="second-view__content" v-for="(item,key,index) in selectItem" :key="index">
					<view class="second-view__content__time">{{key}}</view>
					<view class="second-view__content__main" v-for="(item2,index2) in selectItem[key]" :key="index2">
						<view class="second-view__content__main-name">{{item2.xmfl}}</view>
						<view class="second-view__content__main-num">{{item2.rdxf}}</view>
					</view>
				</view>
				</movable-view>
			</movable-area>
		<!-- </view> -->
	</view>
</template>

<script>
import { baseUrlApi } from 'utils/api'
import { getCache } from 'utils/index';
import { setCache } from 'utils/index';
import {secondItem} from './utils/secondClass';
import loginWindow from 'components/loginwindow/loginWindow.vue'
import 'utils/Format';
export default {
	name:'SecondCredit',
	components:{
		loginWindow
	},
	data() {
		return {
			y: 0,
			old: {
				y: 0,
			},
			req:{
				page:1
			},
			secondItem:{},
			selectItem:{},
			//正在回弹
			isReseting: false, 
			// 总学分
			allSecondScore:0,
			// 刷新时间
			refreshTime:'',
			// 显示总学分
			isShowTop:false,
			// 是否置顶
			isTop:false,
			// 点击按钮旋转
			isClickToLogin:false,
			baseUrlApi:baseUrlApi,
			// 显示登录验证码
			showloginWindow:false,
			clickLogin:false,
			service: this.$store.state.info.userInfo.service
		}
	},
	created(){
		// this.getSecondClass();
		// 判断缓存
		this.checkCache();
	},
	onShow(){
		// 判断登录后第一次请求
		if(getCache('selectItem').length == 0){
			this.getfirst();
		}
	},
	methods: {
		emitwindowShow(val){
			this.showloginWindow = val
		},
		requestAgain(val){
			this[val].apply(this)
		},
		// 判断缓存
		checkCache(){
			// 判断是否与缓存
			if(getCache('selectItem').length !== 0){
				this.selectItem = getCache('selectItem');
				this.refreshTime =  getCache('refreshTime');
				this.allSecondScore = getCache('allSecondScore');
			}
		},
		//刷新页面
		toLogin(){
			this.isClickToLogin = !this.isClickToLogin;
			// 发送请求
			this.getSecondClass();
		},
		// 点击置顶 回来
		goTop(e) {
			this.isShowTop = true;
		},
		//滑动
		handleChange(e){
			if(e.detail.y < 0){
				// 上滑
				this.isShowTop =true;
			}else if(e.detail.y >0){
				// 下拉
				this.isShowTop =false;
			}			
		},
		// 获取每学期请求
		getSecondClass(){
			let res = {
				page:this.req.page
			}
			this.service.school.getSecondClass(res).then(res =>{
				uni.showToast({
					title: '更新成功',
					icon:"success",
					duration: 1000
				});
				this.secondItem = new secondItem(res.info)
				// 计算总学分
				let sumxf = 0; 
				for(let i = 0; i < this.secondItem.array.length; i ++){
					sumxf = sumxf + Number(this.secondItem.array[i].rdxf)
				}
				this.allSecondScore = sumxf.toFixed(1);
				// 分类 每学期比赛项目
				let obj = {};
				this.secondItem.array.forEach(res => {
					if(!obj[res.xnxqmc]){
						obj[res.xnxqmc] = []
					}
					obj[res.xnxqmc].push(res)
				});
				this.selectItem = obj
				let refreshTime =  new Date().Format("yyyy-MM-dd hh:mm:ss")
				this.refreshTime = refreshTime;
				setCache('refreshTime',refreshTime);
				setCache('selectItem',this.selectItem);
				setCache('allSecondScore',this.allSecondScore);
			}).catch(err => {
				if(err.code === 1006){
					uni.showToast({
						title: '更新失败',
						icon:"error",
						duration: 1000
					});
					if(getCache('userInfo')){
						this.showloginWindow = true
					}else{
						uni.navigateTo({
							url:'/pages/login/login'
						})
					}
					// uni.navigateTo({
					// 	url: '/pages/login/login'
					// });
				}
			})
		},
		// 获取登录后的首次请求
		getfirst(){
			// 判断是否与缓存
			let res = {
				page:this.req.page
			}
			this.service.school.getSecondClass(res).then(res =>{
				uni.showToast({
					title: '更新成功',
					icon:"success",
					duration: 1000
				});
				this.secondItem = new secondItem(res.info)
				// 计算总学分
				let sumxf = 0; 
				for(let i = 0; i < this.secondItem.array.length; i ++){
					sumxf = sumxf + Number(this.secondItem.array[i].rdxf)
				}
				this.allSecondScore = sumxf.toFixed(1);
				// 分类 每学期比赛项目
				let obj = {};
				this.secondItem.array.forEach(res => {
					if(!obj[res.xnxqmc]){
						obj[res.xnxqmc] = []
					}
					obj[res.xnxqmc].push(res)
				});
				this.selectItem = obj
				let refreshTime =  new Date().Format("yyyy-MM-dd hh:mm:ss")
				this.refreshTime = refreshTime;
				setCache('refreshTime',refreshTime);
				setCache('selectItem',this.selectItem);
				setCache('allSecondScore',this.allSecondScore);
			}).catch(err => {
				if(err.code === 1006){
					uni.showToast({
						title: '更新失败',
						icon:"error",
						duration: 1000
					})
				}
			})
		}
	}
}
</script>

<style lang="scss" scoped>
.second{
	height: 100vh;
	background-color:rgb(236, 236, 236);
	&-head{
		position: relative;
		display:flex;
		height: 20vh;
		background-color:#FA5151;
		color: #fff;
		text-align: center;
		// transition: transform 0.5s linear;
		&--center{
			align-self:center;
			// transform: translateY(-30%);
			margin: 0 auto;
			&__num{
				font-size: 70rpx;
				font-weight: 700;
				margin-top: 20rpx;
			}
		}
		&__refresh{
			position: absolute;
			left: 2%;
			bottom: 3%;
			font-size: 26rpx;
			color: rgb(255,169, 63);
		}
		&__img{
			position: absolute;
			right: 4%;
			top: 8%;
			width: 40rpx;
			height: 40rpx;
			transition: transform 0.8s ease;
			&--click{
				transform: rotate(360deg);
			}
		}
	}
	&-area{
		height: 80vh;
		width: 100%;
		// border-radius:30rpx 30rpx 0 0 ;
		background-color:#FA5151;
		overflow: hidden;
		transition: transform 0.3s linear;
	}
	&-area--top{
		transform: translateY(-20vh);
		border-radius:0 0 0 0 !important;
		height: 100vh;
		background-color:rgb(236, 236, 236);
	}
	&-view{
		min-height: 80vh;
		height: auto;
		width: 100%;
		padding-top: 10rpx;
		border-radius:30rpx 30rpx 0 0 ;
		background-color: rgb(236, 236, 236);
		// transition: transform 1s linear;
		&__content{
			margin:0 25rpx;
			margin-top: 20rpx;
			color: rgb(156, 156, 156);
			&__time{
				font-size: 25rpx;
				left: 3%;
				text-align: left;
				position: relative;
				display:flex;
				&::before{
					content: ' ';
					align-self:center;
					position: absolute;
					left: -25rpx;
					width: 15rpx;
					height: 15rpx;
					border-radius: 50%;
					background-color: rgb(245, 34, 45);
				}
			}
			&__main{
				margin-top: 10rpx;
				background-color:#fff;
				color: #000;
				font-size: 28rpx;
				border-radius: 20rpx;
				display: flex;
				justify-content:space-between;
				line-height: 80rpx;
				&-name{
					padding-left: 40rpx;
					word-wrap:break-word;
					word-break:break-all;
					text-align: left;
					width: 70%;
				}
				&-num{
					padding-right: 40rpx;
					align-self:center;
				}
			}
		}
	}
}
// .top{
// 	border-radius:0 0 0 0 !important;
// 	height: 100vh;
// 	background-color:rgb(236, 236, 236);
// }

</style>




