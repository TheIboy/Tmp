<template>
	<view class="volunteer">
		<view class="volunteer__head">
			<template>
				<img :src="baseUrlApi+'icon/img/volunteerLogo.png'" class="volunteer__head__image" alt="" >
			</template>
			<view class="volunteer__head__message">
				<text class="volunteer__head__message__realName">{{volunteerItem.realName}}</text>
				<text class="volunteer__head__message__status">{{volunteerItem.status}}</text>
				<view class="volunteer__head__message__userName">{{volunteerItem.userName}}</view>
			</view>
		</view>
		<view class="volunteer__msg" v-if="volunteerItem.registerTime">
			<view class="volunteer__msg__registerTime">注册时间：{{volunteerItem.registerTime}}</view>
			<view class="volunteer__msg__cardNum">义工证号：{{volunteerItem.cardNum}}</view>
		</view>
		<view class="volunteer__main" @touchend="touchend" @touchstart="touchstart">
			<view class="volunteer__main__tab segmented-control">
			<!-- Tabbar -->
			<view class="tabBar">
				<view class="tabBar__tabItem" v-for="(item,index) in itemName" :key="index">
					<view class="tabBar__tabItem--text" 
						:class="{'tabBar__tabItem--text--active':tabIndex === index}"
						@click="tabClickItem(index)">
						{{item}}
					</view>
				</view>
			</view>
			<template>
				<alltime-volunteer v-show="tabIndex === 0" :volunteerItem="volunteerItem"></alltime-volunteer>
				<servelog-volunteer v-show="tabIndex === 1" :volunItem="volunItem"></servelog-volunteer>
				<trainlog-volunteer v-show="tabIndex === 2" :TrainingsItem="TrainingsItem"></trainlog-volunteer>
			</template>
			</view>
			</view>
		<view>
		</view>
	</view>
</template>

<script>
import { getCache } from 'utils/index';
import { baseUrlApi } from 'utils/api'
import {volunItem,info,TrainingsItem} from './utils/volunteerClass';
import alltimeVolunteer from './childVolunteer/alltimeVolunteer.vue';
import ServelogVolunteer from './childVolunteer/servelogVolunteer.vue';
import TrainlogVolunteer from './childVolunteer/trainlogVolunteer.vue';
	export default {
  components: { alltimeVolunteer, ServelogVolunteer ,TrainlogVolunteer},
		data() {
			return {
				baseUrlApi:baseUrlApi,
				// 用户信息(时长概览)
				volunteerItem:{},
				//服务记录
				volunItem:{},
				// 培训记录
				TrainingsItem:{},
				// 切换栏内容
				tabValue:{
					alltime:       		new info('时长概览'),
					servelog:					new info('服务记录'),
					trainlog:					new info('培训记录'),
				},
				// 志愿者tabvar数据
				itemName:[],
				// TAB索引
				tabIndex:0,
				// 开始拖动
				startTouchX:0,
				endTouchX:0,
				endTouchY:0,
				startTouchY:0,
				page:1,
				loginfresh:false,
				service: this.$store.state.info.userInfo.service
			}
		},
		onReachBottom(){
			this.getvolunserve();
		},
		created(){
			// 发送请求获取用户信息
			this.getMyInfo();
			// 获取tab类型
			this.getName();
		},
		onShow(){
			// 切换用户后刷新数据
			this.tagMyInfo();
		},
		methods: {
			// 遍历获取切换栏数据
			getName(){
				//遍历获取数据
				for(let i in this.tabValue){
					this.itemName.push(this.tabValue[i].itemName);
				}
			},
			// 发送义工信息请求
			getMyInfo(){
				// 获取个人义工信息
				this.service.volunteer.getMyInfo().then(res =>{
						this.volunteerItem = res.info
				}).catch(err =>{
					uni.hideLoading();
					if(err.code === 1006){
						this.checkCache();
					}else{
						if(getCache('autoLogin') == false){
							// 重新跳转到登录界面
							uni.navigateTo({
								url: '/pages/tabBar/index/volunteer/loginVolunteer/loginVolunteer'
							});
						}else if(getCache('autoLogin') == true){
							this.newLogin();
						}
					}
				})
				// 历史活动 服务记录请求
				let data = {
					page : 1
				}
				this.service.volunteer.getActivities(data).then(res =>{
						this.volunItem = new volunItem(res.info)
				}).catch(err =>{
					uni.hideLoading();
				})
				// 培训记录请求
				this.service.volunteer.getTrainings().then(res =>{
						this.TrainingsItem = new TrainingsItem(res.info)
				}).catch(err => {
					uni.hideLoading();
				})
			},
			// 切换用户发送请求
			tagMyInfo(){
				// 获取个人义工信息
				this.service.volunteer.getMyInfo().then(res =>{
						this.volunteerItem = res.info
				}).catch(err =>{
					uni.hideLoading();
					uni.redirectTo({
						url: '/pages/tabBar/index/volunteer/loginVolunteer/loginVolunteer'
					})
				})
				// 历史活动 服务记录请求
				let data = {
					page : 1
				}
				this.service.volunteer.getActivities(data).then(res =>{
						this.volunItem = new volunItem(res.info)
				}).catch(err =>{
					uni.hideLoading();
				})
				// 培训记录请求
				this.service.volunteer.getTrainings().then(res =>{
						this.TrainingsItem = new TrainingsItem(res.info)
				}).catch(err => {
					uni.hideLoading();
				})
			},
			// 重新登录或者重新自动登录
			newLogin(){
				let loginRequestData = {
					username:getCache('volUsername'),
					password:getCache('volPassword'),
				}
				this.service.volunteer.getLogin(loginRequestData).then(res => {
					uni.reLaunch({
						url: '/pages/tabBar/index/volunteer/volunteer'
					});
					uni.showToast({
						title: '自动登录成功',
						icon:"none",
						duration: 1000
					});
			}).catch(err =>{
					uni.hideLoading();
					uni.showToast({
						title: '自动登录失败',
						icon:"none",
						duration: 1000
					});
				})
			},
			// 下拉加载义工信息
			getvolunserve(){
				this.page++;
				this.service.volunteer.getActivities({page: this.page}).then(res =>{
					res.info.forEach(element => {
						this.volunItem.array.push(element)
					});
				}).catch(() =>{
					uni.hideLoading();
					uni.showToast({
						title: '没有更多数据了',
						icon:"none",
						duration: 1000
					});
				})
			},
			//切换tabbar
			tabClickItem(index){
				this.tabIndex = index
			},
			// 检查缓存
			checkCache(){
				if(getCache('volUsername').length == 0){
					uni.navigateTo({
						url: '/pages/tabBar/index/volunteer/loginVolunteer/loginVolunteer'
					});
				}else if(getCache('volUsername').length !== 0 && getCache('autoLogin') == true){
					// 自动登录
					this.newLogin();
				}
			},
			//开始拖动
			touchstart(e){
				this.startTouchX = e.changedTouches[0].clientX;
				this.startTouchY =e.changedTouches[0].clientY;
			},
			// 拖动结束
			touchend(e){
				this.endTouchX = e.changedTouches[0].clientX;
				this.endTouchY =e.changedTouches[0].clientY;
				if(this.tabIndex == 0  &&  this.startTouchX-this.endTouchX>20 && Math.abs(this.startTouchY-this.endTouchY)<30 || this.tabIndex == 1 && this.startTouchX-this.endTouchX>20 && Math.abs(this.startTouchY-this.endTouchY)<30){
					this.tabIndex ++
				}else if(this.tabIndex == 1 && this.endTouchX-this.startTouchX>20 && Math.abs(this.startTouchY-this.endTouchY)<30 || this.tabIndex == 2 && this.endTouchX-this.startTouchX>20 && Math.abs(this.startTouchY-this.endTouchY)<30){
					this.tabIndex --
				}
			}
		}
	}
</script>

<style lang="scss" scoped>
// 头部切换栏
.segmented-control /deep/ .segmented-control__text{
	font-size: 12px;
}
.volunteer{
	height: 100vh;
	width: 100%;
	background-color: #fff;
	&__head{
		height: 15vh;
		width: 100%;
		background-color: #fff;
		display: flex;
		align-items: center;
		&__image{
			flex: 30%;
			width: 180rpx;
			height: 120rpx;
			margin-left: 30rpx;
		}
		&__message{
			flex: 70%;
			padding-left: 30rpx;
			&__realName{
				font-weight: 700;
				font-size: 14px;
				height: 30px;
				line-height: 30px;
			}
			&__status{
				font-size: 12px;
				color: rgb(29, 142, 256);
			}
			&__userName{
				font-size: 14px;
			}
		}
	}
	&__msg{
		background-color: #fff;
		font-size: 12px;
		margin-bottom: 5px;
		border-bottom: 2px solid rgb(166, 166, 166);
		box-shadow: 1px 1px 1px 1px rgb(231, 231, 231);
		&__registerTime{
			height: 24px;
			line-height: 24px;
			margin-left: 30rpx;
		}
		&__cardNum{
			height: 24px;
			line-height: 24px;
			margin-left: 30rpx;
			margin-bottom: 15rpx;
		}
	}
	&__main{
		height: auto;
		min-height: 70vh;
		&__tab{
			background-color: #fff;
		}
	}
}

// 自定义分段器
.tabBar{
	width: 100%;
	height: 80rpx;
	// background-color: red;
	display: flex;
	&__tabItem{
		flex: 1;
		// background-color: green;
		margin: 0 10rpx;
		&--text{
			margin:  0 40rpx;
			text-align: center;
			font-size: 24rpx;
			height: 70rpx;
			line-height: 70rpx;
			&--active{
				font-weight: 700;
				border-bottom: 2px solid #C6191E;
			}
		}
	}
}

</style>


