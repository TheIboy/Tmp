<template>
	<view class="form">
		<view class="form-top">
			<view class="form-top__title">支付宝红包提现活动</view>
			<view class="form-top__remarks"><span class="ps">请先仔细阅读操作指南</span>，完成操作后，填写下列准确信息的支付宝账号以及支付宝真实姓名，将在24小时内返现。</view>
			<view class="form-top__dashed" @click="toWeb('https://mp.weixin.qq.com/s/Arv8yuHRbwLwrY1BAQSs9g')">>>>操作指南</view>
		</view>
		<view class="form-main">
			<view class="form-main__list" v-for="(item,index) in list" :key="index" >
					<view class="form-main__list__name">{{index+1}}.{{item.name}}</view>
					<input maxlength="255" class="form-main__list__input" type="text" v-model="item.msg"  />
			</view>
			<view class="form-main__button" @click="doSubmit">提交</view>
		</view>
		<!-- 提示信息  -->
		<uni-popup ref="message2" type="message">
			<uni-popup-message :type="openType" :message="messageText" :duration="1000" ></uni-popup-message>
		</uni-popup>
	</view>
</template>

<script>
export default {
	name:'ActiveForm',
	data(){
		return{
			messageText:'',//提示信息
			openType:'',
			list:[{ name:'付款支付宝账号（注：返款亦根据此账号返款）',type:'phone',msg:''},{name:'支付宝真实姓名最后一个字',msg:''},{name:'转账金额',msg:''}],
			service: this.$store.state.info.userInfo.service
		}	
	},
	methods:{
		toWeb(path){
      uni.navigateTo({
        url: '/pages/web-view/index?path=' + path
      })
    },
		doSubmit(){
			let requestData = {
				payAccount: this.list[0].msg,
				username: this.list[1].msg,
				money:this.list[2].msg
			};
			this.service.redPaper.redPaperSave(requestData).then(res => {
				this.messageText = "提交成功";
				this.openType = 'success';
				this.$refs.message2.open();
      }).catch(err => {
				this.messageText = "提交失败";
				this.openType = 'error';
				this.$refs.message2.open();
      })
		}
	},
	onShareAppMessage(){
		return{
			title: '支付红包提现活动'
		}
	},
  onShareTimeline(){
	return{
		title: '支付红包提现活动'
	}
}
}
</script>

<style lang="scss" scoped>
.form{
	margin: 0 20px;
	&-top{
		display: flex;
		flex-direction:column;
		align-items: center;	
		
		&__title{
			font-size: 42rpx;
			line-height: 42rpx;
			margin: 30px 0;
			color: rgb(93, 165, 248);
		}
		&__remarks{
			font-size: 24rpx;
		}
		.ps{
			font-size: 28rpx;
			font-weight: bold;
		}
		&__dashed{
			margin: 10px 0;
			width: 100%;
			height: 20px;
			text-align: right;
			color: rgb(93, 165, 248);
			border-bottom: 1px dashed gray;
		}
	}
	&-main{
		&__list{
			margin: 30px 0;	
			&__msg{
				font-size: 24rpx;
				line-height: 24rpx;
			}
			&__name{
				font-weight: 700;
				margin-right: 5px;
			}
			&__input{
				margin: 8px 0;
				height: 35px;
				padding: 0 20rpx;
				border: 1px solid rgb(216, 213, 213);
			}
		}
		&__button{
			width: 100%;
			height: 42px;
			background: rgb(93, 165, 248);
			color: #ffffff;
			border-radius: 10rpx;
			display: flex;
			align-items: center;
			justify-content: center;
			font-size: 18px;
			margin-top: 60rpx;
		}
	}
}

</style>

