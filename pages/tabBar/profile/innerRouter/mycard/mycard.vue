<template>
  <view class="card">
    <image :src="logo" mode="aspectFit"  class="card-img" alt="">
    
    <template v-for="(item,index) in cardList">
      <view :key="index" class="card-item">
        <img :src='item.icon' class="card-item__img" alt="">
        <view class="card-item-text">{{item.title}}</view>
        <view class="card-item-info">{{item.info}}</view>
      </view>
    </template>
    <view class="card-outlogin" @click="doLogin()">退出登录</view>
  </view>
</template>

<script>
import { cardFac } from './cardlist'
import { getCache,removeCache } from 'utils/index'
import { baseUrlApi } from 'utils/api'
export default {
  name: 'mycard',
  data() {
    return{
      cardList:[
        cardFac('name',getCache('userInfo').name),
        cardFac('num',getCache('userInfo').studentNum),
        cardFac('institude',getCache('userInfo').college),
        cardFac('grade',getCache('userInfo').year),
        cardFac('class',getCache('userInfo').myClass),
        cardFac('profession',getCache('userInfo').major)
      ],
      logo:'',
      service: this.$store.state.info.userInfo.service
    }
  },
  methods:{
    doLogin(){
      this.service.school.logout().then(res =>{
      })
      // this.$store.commit('setUserinfo',[])
      removeCache('userInfo')
      removeCache('score')
      // removeCache('xnxqdm')
      // removeCache('course')
      // removeCache('startschooldate')
      uni.navigateBack({
        url:'/pages/tabBar/profile/index'
      })
    }
  },
  onShow(){
    if(getCache('school')===1){
      this.logo = baseUrlApi + 'icon/img/YiDaLogo.png'
    }else if(getCache('school')===2){
      this.logo = baseUrlApi + 'icon/img/广工logo.png'
    }
  }
}
</script>

<style lang="scss" scoped>
.card{
  &-img{
    width: 360rpx;
		height: 100rpx;
    margin: 40rpx;
  }
  &-item{
    display: flex;
    width: 100%;
    height: 80rpx;
    line-height: 80rpx;
    background-color: #ffffff;
    border-top: 1px solid #d8d8d8;
    align-items: center;
    padding-left: 10px;
    &__img{
      width: 25px;
      height: 25px;
    }
    &-text{
      font-size:  32rpx;
      margin-left: 10px;
      color: gray;
    }
    &-info{
      font-size:  32rpx;
      position: absolute;
      right: 20px;
    }
  }
  &-outlogin{
    width: 80%;
    height: 42px;
    background: rgb(217, 30, 36);
    color: #ffffff;
    border-radius: 45rpx;
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

