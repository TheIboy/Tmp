<template>
	<view class="plan">
		<view class="plan-list" v-for="(plan, planIndex) in rightItem" :key="planIndex" @touchend="touchend" @touchstart="touchstart" :id="'plan' + plan.id"> 
			<view class="plan-list-top">
				<view class="plan-list-top__time" :class="{'plan-list-top__time--done': plan.allFinished}">
					<view>{{ plan.releaseTime.slice(0, 4) }}</view>
					<view>{{ plan.releaseTime.slice(5) }}</view>
				</view>
				<view class="plan-list-top__title" :class="{'plan-list-top__title--done': plan.allFinished}">{{ plan.title }}</view>
			</view>
			<view class="plan-list-main">
				<!-- 
					plan-list-main-item--done -> 计划已完成对应样式
				-->
				<view class="plan-list-main-item" v-for="(item, index) in plan.releaseContentList" :key="index" :class="{'plan-list-main-item--done': item.finish}">
					<i class="iconfont plan-list-main-item__icon" :class="item.pictureUrl"></i>
					<view class="plan-list-main-item__right">
						<view class="right__title">{{ item.contentTitle }}</view>
						<view class="right__content" v-html="item.content"></view>
						<template v-for="(tag, tagIndex) in item.releaseTagList">
							<view class="right__tag" :key="tagIndex" :style="{background: color[tag.tag]}">{{ tag.tag }}</view>
						</template>
					</view>
				</view>
			</view>
		</view>
		<view class="plan-button" @click="toBack" :class="{'lucency':isBottom}">
			<i class="iconfont icon-bianjifankui plan-button__icon"></i>
		</view>
	</view>
</template>

<script>
import {baseUrlApi} from 'utils/api'
export default {
	data(){
		return{
			baseUrlApi:baseUrlApi,
			rightItem:[],
			color: {
				'新增功能': '#FC7B73',
				'页面优化': '#F9C66E',
				'页面重构':	'#95DE65',
				'功能优化':	'#41A9FF',
			},
			isBottom : false,
			startTouchY:0,
			endTouchY:0,
			// 当前进度对应索引
			nowIndex: -1,
			service: this.$store.state.info.userInfo.service
		}
	},
	created(){
		this.getReleaseList();
		// 页面渲染结束后 获取dom节点位置信息
		let timer = setInterval(() => {
			// 目标dom节点位置信息
			if(this.nowIndex !== -1){
				// TODO 需要测试代码逻辑是否存在问题
				uni.createSelectorQuery().select('#plan' + this.nowIndex).boundingClientRect(res => {
					if(res){
						clearInterval(timer)
						// 使页面定位到获取节点的位置
						uni.pageScrollTo({
							duration: 1000,
							scrollTop: res.top
						})
					}
				}).exec()
			}
		}, 100)
	},
	onReachBottom(){
		this.isBottom = true;
	},
	methods: {
		// 发送请求
		getReleaseList(){
			this.service.release.getReleaseList().then(res =>{
				this.rightItem = res.info.releasePlanList;
				this.nowIndex = res.info.noFinishedId;
			})
		},
		// 跳转反馈页面
		toBack(){
			uni.navigateTo({
				url: '/pages/tabBar/profile/innerRouter/feedback/feedback'
			});
		},
		//开始拖动
		touchstart(e){
			this.startTouchY =e.changedTouches[0].clientY;
		},
		// 拖动结束
		touchend(e){
			this.endTouchY =e.changedTouches[0].clientY;
			if(this.endTouchY >this.startTouchY){
				this.isBottom = false;
			}
		}
	}
}
</script>

<style lang="scss" scoped>
.plan{
	padding-bottom: calc(constant(safe-area-inset-bottom) + 5px);  
  padding-bottom: calc(env(safe-area-inset-bottom) + 5px); 
	&-list{
		&-top{
			position: absolute;
			transform: translateY(10px);
			display: flex;
			padding-right: 10rpx;
			width: 740rpx;
			&__time{
				font-size: 22rpx;
				width: 80rpx;
				text-align: center;
				display: flex;
				flex-direction: column;
				justify-content: center;
				color: #41A9FF;
				position: relative;
				&::after{
					position: absolute;
					right: -7px;
					transform: translateY(-1px);
					content: "";
					width: 8px;
					height: 8px;
					border-radius: 50%;
					background: #41A9FF;
				}
			}
			&__time--done{
				&::after{
					width: 6px !important;
					height: 6px !important;
					right: -6px !important;
				}
			}
			&__title{
				font-size: 24rpx;
				padding: 10px 16rpx;
				border-radius: 8rpx;
				margin-left: 20rpx;
				width: 640rpx;
				color: white;
				background-color: #41A9FF;
				display: flex;
				align-items: center;
				position: relative;
				&::before{
					content: '';
					position: absolute;
					left: -2px;
					top: 30%;
					width: 10px;
					height: 10px;
					background: inherit;
					transform: rotate(45deg);
				}
				&--done{
					opacity: .3;
				}
			}
		}
		&-main{
			margin-left: 80rpx;
			padding: 40px 10rpx 0;
			border-left: 2px solid #41A9FF;
			&-item{
				border: 2px solid #41A9FF;
				border-radius: 15rpx;
				padding: 5px 10rpx;
				box-shadow: 4rpx 5rpx 20rpx 1rpx rgba(65, 169, 255, .4);
				margin: 10px 0 0;
				display: flex;
				&__icon{
					flex: 3;
					text-align: center;
					font-size: 70rpx;
					color: #41A9FF;
				}
				&__right{
					flex: 17;
					width: 520rpx;
					.right__title{
						margin: 5px 0;
						color: #41A9FF;
						font-weight: bold;
						font-size: 28rpx;
					}
					.right__content{
						margin-bottom: 5px;
						width: 520rpx;
					}
					.right__tag{
						display: inline-block;
						font-size: 22rpx;
						padding: 4px 20rpx;
						margin-right: 6rpx;
						border-radius: 20rpx;
						color: white;
					}
				}
			}
			&-item--done{
				opacity: .3;
			}
		}
	}
	&-button{
		position: fixed;
		bottom: 60px;
		right: 40rpx;
		width: 120rpx;
		height: 120rpx;
		border-radius: 50%;
		background-color: rgba(65,169,255,1);
		box-shadow: 8rpx 10rpx 20rpx 2rpx rgba(65, 169, 255, .4);
		&__icon{
			display: flex;
			align-items: center;
			justify-content: center;
			height: 100%;
			font-size: 60rpx;
			font-weight: 100;
			color: white;
		}
	}
}
.lucency{
	background-color: rgba(65,169,255,.5);
}
</style>

