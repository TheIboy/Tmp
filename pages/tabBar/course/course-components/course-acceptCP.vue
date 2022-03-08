<template>
  <view class="relive" >
    <view class="relive-bg" @click="handlebg"></view>
    <view class="relive-dialog">
      <view class="relive-dialog__photo">
        <img class="relive-dialog__photo__y" :src='cpInfo.avatar'/>
        <img class="relive-dialog__photo__m" :src='avUrl'/>
      </view>
      <view class="relive-dialog__name">{{cpInfo.realName}}</view>
      <view class="relive-dialog__msg">
        想与你绑定CP学习关系，确定愿意？
      </view>
      <view class="relive-dialog__button">
        <view class="relive-dialog__button-button relive-dialog__button-button--cancel" @click="handleCancel">取消</view>
        <view class="relive-dialog__button-button relive-dialog__button-button--sure" @click="handleAccept">确定</view>
      </view>
    </view>
  </view>
</template>

<script>
import { getCache } from 'utils/index'
export default {
  name:'CourseRelieveCP',
  props:{
    cpInfo:{
      type: Object,
      default: {},
      require: true
    }
  },
  data(){
    return{
      acceptMsg:true,
      avUrl:'',
      service: this.$store.state.info.userInfo.service
  }
},
  created(){
    // 判断学籍信息
    // this.isStudent();
    // this.getInfo()
    
    // 上传自身头像给服务器存储
    this.avUrl = getCache('avatarUrl');
    this.updateAvatar();
  }, 
  onShow(){
    this.avUrl = getCache('avatarUrl');
  },
  methods:{
    // 取消cp课表
    handleCancel(){
      this.$emit('cancel', false);
    },
    // 解除CP课表
    handleAccept(){
      this.$emit('accept', this.acceptMsg);
    },
    // 点击背景取消
    handlebg(){
      this.$emit('bg', false);
    },
    // 上传自身头像
    updateAvatar(){
      if(getCache('avatarUrl').length !== 0){
        this.service.user.updateAvatar({avatarUrl: getCache('avatarUrl')}).then(res => {
          // 并且将自身头像显示
          this.avUrl = getCache('avatarUrl');
        }).catch(err =>{
          uni.navigateTo({
            url:'/pages/login/login'
          })
        })
      }else{
        uni.navigateTo({
          url:'/pages/login/login'
        })
      }
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
    padding: 0 20px;
    position: relative;
    top: 50%; 
    transform: translateY(-50%);
    width: 500rpx;
    height: 250px;
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
    &__name{
      margin-top: 10px;
      font-size: 28rpx;
    }
    &__msg{
      margin: 20px 0;
      font-size: 28rpx;
    }
    &__button{
      display: flex;
      justify-content: space-around;
      width: 400rpx;
      &-button{
        font-size: 26rpx;
				padding: 6px 50rpx;
				border-radius: 10rpx;
        &--sure{
          background-color:rgb(251, 157, 59);
          color: white;
        }
        &--cancel{
          border: 1px solid rgb(251, 157, 59);
          color: #000;
        }
      }
    }
  }
}
</style>

