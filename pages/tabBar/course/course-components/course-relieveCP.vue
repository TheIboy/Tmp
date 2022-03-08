<template>
  <view class="relive" >
    <view class="relive-bg" @click="handlebg"></view>
    <view class="relive-dialog">
      <view class="relive-dialog__photo">
        <img class="relive-dialog__photo__m" :src='avUrl'/>
        <img class="relive-dialog__photo__m" :src='avatar'/>
      </view>
      <view class="relive-dialog__msg">
        是否确认解除与{{realName}}的CP关系
      </view>
      <view class="relive-dialog__button">
        <view class="relive-dialog__button__sure" @click="handleRelive">解除</view>
        <view class="relive-dialog__button__cancel" @click="handleCancel">取消</view>
      </view>
    </view>
  </view>
</template>

<script>
import { getCache } from 'utils/index'
export default {
  name:'CourseRelieveCP',
  props:['relieveID','avatar','realName'],
  data(){
    return{
      avUrl:'',
      service: this.$store.state.info.userInfo.service
    }
  },
  created(){
    this.avUrl = getCache('avatarUrl');
  },
  methods:{
    // 取消cp课表
    handleCancel(){
      this.$emit('cancel', false);
    },
    // 解除CP课表
    handleRelive(){
      this.service.schedule.relieveBinding(this.relieveID).then(res => {
        console.log(res);
        this.$emit('relive', {info:res.info,type:'success'});
      }).catch(err =>{
        console.log(this.relieveID);
        this.$emit('relive', {info:'解除失败',type:'error'});
      })
    },
    // 点击背景取消
    handlebg(){
      this.$emit('bg', false);
    }
  }
}
</script>

<style lang="scss" scoped>
.relive{
  position: absolute;
  top: 0%;
  height: 100vh;
  width: 100vw;
  &-bg{
    position: absolute;
    top: 0%;
    height: 100vh;
    width: 100vw;
    background: rgba(0,0,0,0.3);
  }
  &-dialog{
    margin: 0 auto;
    position: relative;
    top: 50%; 
    transform: translateY(-50%);
    width: 500rpx;
    height: 200px;
    background-color: #fff;
    border-radius: 20px;
    display: flex;
    flex-direction:column;
    align-items: center;
    justify-content: center;
    // justify-content: center;
    &__photo{
      width: 300rpx;
      display: flex;
      justify-content: space-around;
      &__m{
				width: 55px;
				height: 55px;
				// background-color: gray;
				border-radius: 8px;
      }
      &__y{
        width: 55px;
				height: 55px;
				// background-color: gray;
				border-radius: 8px;
      }
    }
    &__msg{
      margin: 20px 0;
      font-size: 28rpx;
    }
    &__button{
      display: flex;
      justify-content: space-around;
      width: 400rpx;
      &__sure{
        font-size: 26rpx;
				padding: 6px 50rpx;
				border-radius: 10rpx;
        border: 1px solid rgb(251, 157, 59);
				color: #000;
      }
      &__cancel{
        font-size: 26rpx;
				padding: 6px 50rpx;
				border-radius: 10rpx;
        background-color:rgb(251, 157, 59);
				color: white;
      }
    }
  }
}
</style>

