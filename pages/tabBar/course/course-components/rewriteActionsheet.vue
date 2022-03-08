<template>

<view class='actionsheet' v-show="display">
	<!-- 遮罩层 -->
	<view class="actionsheet-bg" @click="changedisplay"></view>
	<view class="actionsheet-content">
		<view class="actionsheet-content-course" @click="remindClick()">
			<template v-if="!isRemind">
				开启课程提醒
			</template>
			<template v-else>
				关闭课程提醒	
			</template>
		</view>
		<view class="actionsheet-content-course" @click="changedisplay">
			<picker mode="multiSelector"  @change="MultiPickerChange" :value="indexMulPicker" :range="multiArray">
				<view class="actionsheet-content-course-picker">导入课表</view>
			</picker>
		</view>
		<view class="actionsheet-content-course" @click="openConfirm">
				清除课表
		</view>
		<view class="actionsheet-content-course" @click="cpCourse">
				CP课表
		</view>
		<!-- <view class="actionsheet-content-course" @click="shareCourse">
				分享课表
		</view> -->
		<view @click="cancelaction" class="actionsheet-content-cancel">取消</view>
	</view>
</view>
</template>

<script>
export default {
	props: ['display'],
	data() {
		return {
			indexMulPicker: [3, 1],
			multiArray: [[], ['1', '2']],
			// 是否订阅上课提醒功能
			isRemind: false,
			service: this.$store.state.info.userInfo.service
		}
	},
	created(){
		this.initYear()
		this.checkMessageStatus()
	},
	methods: {
		// 判断是否订阅上课提醒
		checkMessageStatus(){
			this.service.message.getmessageStatus().then(res => {
				this.isRemind = res.info
			})
		},
		// 提醒按钮点击事件
		remindClick(){
			if(this.isRemind){	// 已经订阅了上课提醒，再次点击则是取消上课提醒
				this.service.message.refuseMessage().then(res => {
					uni.showToast({
						icon:'success',
						title: res.info
					})
					this.isRemind = false
					this.cancelaction()
				})
			}else{							// 还没有订阅上课提醒，则点击之后是订阅上课提醒
			let that = this
				wx.requestSubscribeMessage({
					tmplIds: ['Pjw8FxjYZ2VPlUHlx049fD10i8N1OOgCXc45dYZc1cs'],
					success (res) { 
						if(res.errMsg === 'requestSubscribeMessage:ok'){
							this.service.message.getMessage().then(res => {
								that.isRemind = true
								that.cancelaction()
								if(!res.info){		// 数据库没有数据时，需要提醒用户重新导入课表
									uni.showToast({
										icon:'none',
										title: '重新导入课表之后，提醒生效'
									})
								}else{
									uni.showToast({
										icon:'success',
										title: res.info
									})
								}
							})
						}
					}
				})
			}
		},
		// CP课表
		cpCourse(){
			this.service.user.isStudent().then(res => {
				if(res.info){
					uni.navigateTo({
						url: '/pages/tabBar/course/cpCourse/cpCourse'
					});
				}else{
					this.service.school.getInfo().then(res => {
						uni.navigateTo({
							url: '/pages/tabBar/course/cpCourse/cpCourse'
						});
					}).catch(err =>{
						uni.navigateTo({
							url:'/pages/login/login'
						})
					})
				}
			})
		},
		//TODO 分享课表
		shareCourse(){
			console.log('shareCourse')
		},
		// 点击取消按钮
		cancelaction(){
			let displayer = 0
			this.$emit('toCourse',displayer)
		},
		// 选择年份选择器
		MultiPickerChange(e) {
			let addcourse = [this.multiArray[0][e.mp.detail.value[0]],this.multiArray[1][e.mp.detail.value[1]]];
			addcourse = addcourse.join('-')
			this.$emit('addin',true,addcourse)
		},
		// 清除课表框
		openConfirm() {
			let displayer = 0
			this.$emit('toCourse',displayer)
			var that = this
			uni.showModal({
				title: '清除课表',
				content: '是否确认清除课表（清除后需要重新导入， 无法撤销）',
				confirmText: "确定",
				cancelText: "取消",
				success: function (res) {
				console.log(res);
				if (res.confirm) {
					console.log('用户点击主操作')
					that.$emit('cancelout', true)
				}else {
					console.log('用户点击辅助操作')
				}
				}
			});
		},
		// 点击遮罩层
		changedisplay() {
			this.cancelaction()
		},
		// 初始化年份选择器
		initYear(){
			let nowDate = new Date()
			let year = nowDate.getFullYear()
			let month = nowDate.getMonth() + 1
			if(month < 2){
				year --
			}
			for(let i = -3; i <= 3; i ++){
				this.multiArray[0][i + 3] = Number(year + i) + '-' + Number(year + i + 1)
			}
			console.log(month);
			if(month >= 9 || month <= 2){
				this.indexMulPicker[1] = 0
			}else{
				this.indexMulPicker[1] = 1
			}
		}
  },
}
</script>
<style lang='scss' scoped>
.actionsheet{
	&-bg{
		position: fixed;
		width: 100%;
		height: 100%;
		opacity: 0.7;
		filter: alpha(opacity=70);
		top: 0;
		left: 0;
		z-index: 99;
		background-color: #444343;
	}
	&-content{
		position: fixed;
		font-size: 27rpx;
		width: 100%;
		background-color: #f5f5f5;
		border-top-left-radius: 20rpx;
		border-top-right-radius: 20rpx;
		overflow: hidden;
		bottom: 0;
		left: 50%;
		transform: translateX(-50%);
		z-index: 100;
		animation: drawer 0.2s;
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
			display: flex;
			align-items: center;
			justify-content: center;
			&:active{
				background-color: rgb(212, 212, 212);
			}
		}
	}
	@keyframes drawer {
		0%{
			bottom: -30vh;
		}
		100%{
			bottom: 0;
		}
	}
}
</style>