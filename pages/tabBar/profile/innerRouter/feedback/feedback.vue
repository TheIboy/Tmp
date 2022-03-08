<template>
<view class="feedback">
  <button open-type="contact">
    <image :src="kefuImg" class="feedback-img"></image>
  </button>
  <view class="feedback-title">反馈建议</view>
  <uni-forms ref="form" :modelValue="formData" :rules="rules">
    <view class="feedback-label">问题描述</view>
    <uni-forms-item  name="problem">
      <uni-easyinput type="textarea" v-model="formData.problem" placeholder="请描述你遇到的问题" class="feedback-area"/>
      
    </uni-forms-item>
  </uni-forms>
  <button @click="submit()" class="feedback-submit">发送</button>
  <uni-popup ref="message" type="message">
		<uni-popup-message :type="msgType" :message="messageText" :duration="2000"></uni-popup-message>
	</uni-popup>
  
</view>

</template>

<script>
import { baseUrlApi } from 'utils/api'
export default {
  components: {},
  data() {
    return {
      service: this.$store.state.info.userInfo.service,
      formData: {
        problem: ''
      },
      rules: {
        // 对name字段进行必填验证
        problem: { 
          rules: [
            {
              required: true,
              errorMessage: '请输入您的问题',
            },
            {
              minLength: 4,
              maxLength: 200,
              errorMessage: '输入内容字数在16到200之间',
            }
          ]
        },
      },
      msgType:'',
      messageText:'',
      kefuImg:baseUrlApi+'icon/img/客服.png'
    }
  },
  methods: {
    submit() {
      this.$refs.form.validate().then(res=>{
        let data = {
          content: res.problem
        }
        this.service.bug.postFeedBack(data).then(res =>{
          if(res.info.surplusNum){
            this.msgType = 'success'
            this.messageText = '发送成功！ 今日还可以发送'+res.info.surplusNum+'条反馈信息'
            this.$refs.message.open()
          }else{
            this.msgType = 'error'
            this.messageText = '发送失败!' + res.info
            this.$refs.message.open()
          }
        })
      }).catch(err =>{
        console.log('表单错误信息：', err);
      })
    },
  }
}
</script>
<style lang='scss' scoped>
button::after{
  border: 0;
}
.feedback{
  width: 100%;
  &-img{
    width: 40px;
    height: 40px;
    position: absolute;
    top:10px;
    right: 10px;
  }
  &-label{
    margin-bottom: 10px;
    margin-left: 10px;
  }
  &-title{
    font-size: 20px;
    font-weight: 700;
    width: 100%;
    height: 200px;
    display: flex;
    align-items: center;
    justify-content: center;
  }
  &-area{
    position: relative;
  }
  &-submit{
    width: 80%;
    height: 42px;
    background: rgb(217, 30, 36);
    color: #ffffff;
    border-radius: 0.75rem;
    display: flex;
    align-items: center;
    justify-content: center;
    margin:0 auto;
    font-size: 18px;
    font-weight: 500;
    margin-top: 50px;
  }
}

</style>