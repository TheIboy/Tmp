<template>
<view class="verify">
    <view class="verify-bg"></view>
    <view class='verify-content'>
      <view class="verify-content-title">登录已过期，请重新登录</view>
      <view class="verify-content-main">
        <img :src=imgData class="verify-content-main__img" alt="" @click="changeverify"/>
        <input type="text" name="identify" placeholder="请输入验证码" v-model="verityCode" class="verify-content-main__input">
      </view>
      <view class="verify-content-button">
        <view @click="cancelWindow()" class="verify-content-button__cancel">取消</view>
        <view @click="doLogin()" class="verify-content-button__login">登录</view>
      </view>
    </view>
    <uni-popup ref="message" type="message">
      <uni-popup-message :type="msgType" :message="messageText" :duration="2000"></uni-popup-message>
    </uni-popup>
</view>
</template>

<script>
import { getCache, setCache } from 'utils/index';
export default {
  name:'loginWindow',
  props:{
    sureback:{
      type: String,
      default:'',
    }
  },
  data() {
    return {
      imgData:'',
      verityCode:'',
      msgType: 'warn',
			messageText: '',
      school: getCache('school') || 1,
      service: this.$store.state.info.userInfo.service
    };
  },
  methods: {
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
    changeverify(){
			this.getverify()
		},
    doLogin(){
      let data = {
        username : getCache('username'),
        password : getCache('password'),
        school: this.school,
        verityCode : this.verityCode 
      }
      this.service.school.loginIn(data).then(res =>{
        this.msgType = 'success'
        this.messageText = '登录成功'
        this.$refs.message.open()
        let that = this
        setTimeout(function(){
          that.$emit('loginwindowShow',false)
          that.$emit('requestAgain',that.sureback)
          setCache('school', school)
        },1000)
      }).catch(err => {
        if(err.code){
          this.verityCode = ''
          this.getverify()
          let failmsg = err.info
          this.msgType = 'error'
          this.messageText = failmsg
          this.$refs.message.open()
        }
      })
    },
    cancelWindow(){
      this.$emit('loginwindowShow',false)
    }
  },
  created() {
    this.getverify()
  }
}
</script>
<style lang='scss' scoped>
.verify{
  &-bg{
    transform:translateZ(0);
    position: fixed;
		width: 100%;
		height: 100%;
		opacity: 0.7;
		filter: alpha(opacity=70);
		top: 0;
		left: 0;
		z-index: 999;
		background-color: #444343;
  }
  &-content{
    transform:translateZ(0);
    position: absolute;
		font-size: 20px;
		width: 90%;
		background-color: #ffffff;
		border-radius: 1rem;
		top: 300px;
		left: 50%;
		transform: translate(-50%, -50%);
		z-index: 1000;
		height: auto;
    &-title{
      font-size: 18px;
      font-weight: 400;
      height: 60px;
      display: flex;
      align-items: center;
      justify-content: center;
    }
    &-main{
      width: 100%;
      display: flex;
      align-items: center;
      justify-content: center;
      flex-direction: column;
      &__img{
        width: 80%;
        height: 100px;
      }
      &__input{
      width: 80%;
      height: 60px;
      line-height: 60px;
      font-size: 20px;
      }
    }
    &-button{
      display: flex;
      font-weight: 400;
      border-top: 1px solid #f5f5f5;
      padding: 20px 0 20px 0;
      &__cancel{
        width: 50%;
        text-align: center;
      }
      &__login{
        color: #007aff;
        width: 50%;
        text-align: center;
        border-left:1px solid #f0f0f0;
      }
    }
  }
}

</style>