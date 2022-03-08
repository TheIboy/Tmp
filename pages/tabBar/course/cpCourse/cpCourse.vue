<template>
	<view class="cp">
		<login-window v-if="showloginWindow" @loginwindowShow = 'emitwindowShow' @requestAgain = 'requestAgain' sureback = "onShareAppMessage"/>
			<button open-type="share" class="cp-share">
				<i class="iconfont icon-weixin cp-share__button"></i>
				<view class="cp-share__msg">邀请微信好友绑定CP课表</view>
			</button>
		<view class="cp-people">
			<view class="cp-people__head">已绑定CP</view>
			<view class="cp-people__list" v-for="(item,index) in CPItem.array" :key="index">
				<img class="cp-people__list__photo" :src='item.avatar'/>
				<view class="cp-people__list__msg">
					<view class="cp-people__list__msg__name">{{item.realName}}</view>
					<view class="cp-people__list__msg__time">已绑定{{item.differDay}}天</view>
				</view>
				<view class="cp-people__list__relieve" @click="handleRelieve(item.partnerId,item.avatar,item.realName)">解除绑定</view>
			</view>
		</view>
		<course-relieve-cp v-if="isRelieveShow" @cancel="cancel" @relive="relive" @bg='cancel' :relieveID='relieveID' :avatar='avatar' :realName='realName'></course-relieve-cp>
		<uni-popup ref="message" type="message">
      <uni-popup-message :type="msgType" :message="messageText" :duration="1000"></uni-popup-message>
    </uni-popup>
	</view>
</template>

<script>
import courseRelieveCp from '../course-components/course-relieveCP.vue';
import { getCache } from 'utils/index';
import { CPItem } from '../courseUtils/cpCourse';
import { baseUrlApi } from 'utils/api';
	export default {
	name:'CpCourse',
  components: { courseRelieveCp },
		data() {
			return {
				isRelieveShow:false,
				cpCode:'',
				// 显示登录验证码
				showloginWindow:false,
				CPItem:'',
				cpDay:'',
				msgType: '',
				messageText: '',
				relieveID:'',
				// 绑定用户的图片
				avatar:'',
				realName:'',
				service: this.$store.state.info.userInfo.service
			}
		},
		created(){

		},
		onShow(){
			// 上传头像
			this.updateAvatar();
			this.myPartner();
		},
		// 监听点击分享按钮后的数据
		onShareAppMessage(res) {
			let promise = new Promise((resolve) => {
				this.service.schedule.generateCpCode().then(res => {
					resolve({
						title: 'TA请求和你绑定成学习好盆友',
						path: '/pages/tabBar/index/index?cpCode=' + res.info,
						imageUrl:  baseUrlApi  + 'icon/img/cp封面.png'
					})
				}).catch(err =>{
					this.getInfo();
					// console.log(err);
					if(err.code == 1201){
						this.msgType = 'error'
						this.messageText = err.info
						this.$refs.message.open();
						return
					}
					return
				})
			})
			return {
				title: '此链接不可用,请重新分享',
				promise
			}
		},
		methods: {
			emitwindowShow(val){
				this.showloginWindow = val
			},
			requestAgain(val){
				this[val].apply(this)
			},
			// 解绑cp
			handleRelieve(id,avatar,realName){
				this.isRelieveShow = true;
				this.relieveID = id
				this.avatar = avatar
				this.realName = realName
			},
			// 取消解除解绑
			cancel(data){
				this.isRelieveShow = data
			},
			// 确定解绑
			relive(data){
				// 隐藏弹窗
				this.isRelieveShow = false;
				// 发送信息
				this.msgType = data.type
        this.messageText = data.info
        this.$refs.message.open();
				this.myPartner();
			},
			// 上传自身头像
			updateAvatar(){
				this.service.user.updateAvatar({avatarUrl: getCache('avatarUrl')})
			},
			// 获取cp列表
			myPartner(){
				this.service.schedule.myPartner().then(res => {
					this.CPItem =  new CPItem(res.info);
					// console.log(this.CPItem);
				}).catch(err =>{
				})
			},
		}
	}
</script>

<style lang="scss" scoped>
.cp{
	background-color: rgb(246, 246, 246);
	height: 100vh;
	&-share{
		width: 95%;
		height: 240rpx;
		border-radius: 20rpx;
		box-shadow: 3rpx 8rpx 8rpx 5rpx rgb(239, 239, 239);
		background-color: #fff;
		margin:0 auto;
		display: flex;
		flex-direction:column;
		align-items:center;
		&__button{
			// width: 55px;
			// height: 55px;
			color: rgb(40, 198, 67) ;
			font-size: 55px;
			border-radius: 50%;
			margin: 15px 0;
		}
		&__msg{
			font-size: 28rpx;
		}
	}
	&-people{
		&__head{
			font-size: 28rpx;
			font-weight: 500;
			margin: 30px 0;
			margin-left: 3%;
		}
		&__list{
			height: 85px;
			// background-color: red;
			display: flex;
			// justify-content: center;
			align-items:center;
			justify-content:space-around;
			border-bottom: 1px solid rgb(239, 239, 239);
			&__photo{
				width: 55px;
				height: 55px;
				// background-color: gray;
				border-radius: 8px;
				margin-left: 30rpx;
			}
			&__msg{
				height: 55px;
				margin-right: 100px;
				display: flex;
				flex-direction:column;
				justify-content:space-around;
				&__name{
					font-size: 34rpx;
				}
				&__time{
					font-size: 26rpx;
					color: gray;
				}
			}
			&__relieve{
				font-size: 26rpx;
				padding: 8px 20rpx;
				margin-right: 6rpx;
				border-radius: 10rpx;
				background-color:rgb(251, 157, 59);
				color: white;
				margin-right: 30rpx;
			}
		}
	}
	&-relieve{
		height: 100vh;
		&-popup{
			margin: 0 auto;
			position: relative;
			top: 50%; /*偏移*/
			width: 100px;
			height: 100px;
			background-color: red;
			transform: translateY(-50%);
		}
	}
}
// 去掉button默认边框
button::after, button::before{
  border: none;
}
</style>

