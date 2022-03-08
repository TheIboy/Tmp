<template>
	<view class="profile">
    <!-- ifnotLogin === true?toCard:toLogin -->
    <view class="profile-header" @click="ifnotLogin===true?toCard():toLogin()">
      <!-- 导入头像 -->
      <img class="profile-header__img" :src='avatarUrl'/>
      <view class="profile-header-info">
        <template v-if="ifnotLogin === true && userobj.name" >
          <view class="profile-header-info__text">{{userobj.name}}</view>
          <view class="profile-header-info__text"> {{userobj.year}}级 {{userobj.major}}</view>
        </template>
        <template v-else>
          <view class="profile-header-info__text">点击登录</view>
        </template>
      </view>
      <img class="profile-header__icon" :src="arrowImg" />
    </view>
    <template v-for="(item, index) in pageList">
      <button :key="index" class="profile-list" @click="toUrl(item.url)">
        <img :src='item.icon' class="profile-list__img">
        <view  class="profile-list__text">{{item.name}}</view>
        <img :src='item.arrow' class="profile-list__arrow">
      </button>
    </template>
    <!-- <button class="profile-list" @click="toUrl('/pages/tabBar/index/developmentPlan/developmentPlan')">
      <img :src="baseUrlApi + 'icon/img/js.svg'" class="profile-list__img">
      <view class="profile-list__text">开发计划</view>
      <img :src="arrowImg" class="profile-list__arrow">
    </button>
    <button class="profile-list" @click="toWeb('https://mp.weixin.qq.com/s/cNiE8dKhQMGTi-67le9GSA')">
      <img :src="baseUrlApi + 'icon/img/点赞.svg'" class="profile-list__img">
      <view class="profile-list__text">展翅计划</view>
      <img :src="arrowImg" class="profile-list__arrow">
    </button> -->
    <button open-type="share" class="profile-list">
      <img :src='shareImg' class="profile-list__img">
      <view class="profile-list__text">分享YIDA微校园</view>
      <img :src="arrowImg" class="profile-list__arrow">
    </button>
    <view class="profile__copyright">Copyright ©2019-2021 YIDA Micro campus,All Rights Reserved.</view>
  </view>
</template>

<script>
import { Factory } from './utils/pageList'
import { getCache } from 'utils/index'
import { baseUrlApi } from 'utils/api'
export default {
  name: 'profile',
  data() {
    return{
      baseUrlApi:baseUrlApi,
      info:'',
      avatarUrl:'',
      ifnotLogin:false,
      pageList: [
        Factory('反馈建议','反馈.png','feedback/feedback','link'),
        Factory('帮助中心','帮助中心.png','help/help', 'link'),
        Factory('关于我们','关于我们.png','aboutus/aboutus','link'),
        Factory('系统公告','系统公告.png','bulletin/bulletin','link'),
      ],
      arrowImg:baseUrlApi + 'icon/img/右箭头bfbfbf.png',
      shareImg:baseUrlApi+'icon/img/分享.png',
      userobj:{}
    }
    
  },
  methods:{
    toCard(){
      uni.navigateTo({
        url:'/pages/tabBar/profile/innerRouter/mycard/mycard'
      })
    },
    toLogin(){
      uni.navigateTo({
        url:'/pages/login/login'
      })
    },
    toUrl(url){
      uni.navigateTo({
        url:url
      })
    },
    toWeb(path){
      uni.navigateTo({
        url: '/pages/web-view/index?path=' + path
      })
    },
    showUserInfo(){
      if(getCache('userInfo')){
        this.ifnotLogin = true
      }else{
        this.ifnotLogin = false
      }
    },
    showCard(){
      this.userobj.name = getCache('userInfo').name,
      this.userobj.year = getCache('userInfo').year,
      this.userobj.major = getCache('userInfo').major
    }
  },
  onShareAppMessage() {
	return {
		title: 'YIDA微校园',
    desc:'更便捷的YIDA生活小程序'
		}
  },
  created() {
    this.showUserInfo()
  },
  onShow() {
    if(this.$store.state.info.userInfo.school === 1){
      this.pageList= [
        Factory('反馈建议','反馈.png','feedback/feedback','link'),
        Factory('帮助中心','帮助中心.png','help/help', 'link'),
        Factory('关于我们','关于我们.png','aboutus/aboutus','link'),
        Factory('系统公告','系统公告.png','bulletin/bulletin','link'),
      ]
    }else if(this.$store.state.info.userInfo.school === 2){
      this.pageList= [
        Factory('反馈建议','反馈.png','feedback/feedback','link'),
        Factory('关于我们','关于我们.png','aboutus/aboutus','link'),
        Factory('系统公告','系统公告.png','bulletin/bulletin','link'),
      ]
    }
    this.avatarUrl = getCache('avatarUrl')
    this.showCard()
    this.showUserInfo()
  }
}
</script>

<style lang="scss" scoped>
.profile{
  padding: 5px 10rpx;
  background-color: rgb(246, 246, 246);
  box-sizing: border-box;
  height: 100vh;
  position: relative;
  &-header{
    padding: 0 20rpx;
    display: flex;
    align-items: center;
    height: 100px;
    color: #FFFFFF;
    border-radius: 30rpx;
    background: #C6191E;
    box-shadow: 8rpx 10rpx 15rpx 2rpx #979797;
    margin-bottom: 20px;
    margin-top: 8px;
    &:active{
      opacity: .8;
    }
    &__img{
      width: 75px;
      height: 75px;
      background-color:#fff ;
      border-radius: 50%;
      margin: 0 10rpx;
    }
    &-info{
      margin-left: 20rpx;
      &__text{
        width: 400rpx;
        margin: 20px 0;
        overflow:hidden;
        white-space: nowrap;
        text-overflow: ellipsis;
        font-size: 15px;
      }
    }
    &__icon{
      position: absolute;
      right: 40rpx;
      background-color: #C6191E;
      width: 60rpx;
      height: 60rpx;
    }
  }
  &-list{
    display: flex;
    height: 50px;
    width: 100%;
    align-items: center;
    background-color: #fff;
    margin-bottom: 8px;
    padding-left: 20px;
    border-radius: 8px;
    &__img{
      display: block;
      width: 25px;
      height: 25px;
    }
    &__text{
      font-size: 28rpx;
      margin-left: 13px;
    }
    &__arrow{
      display: block;
      width: 21px;
      height: 21px;
      position: absolute;
      right: 26px;
    }
  }
  &__copyright{
    position: absolute;
    bottom: 5px;
    width: 100%;
    text-align: center;
    font-size: 22rpx;
    color: #7c7c7c;
  }
}
button {
  -webkit-appearance: none;
  border:none;
}
button::after, button::before{
  border: none;
}
</style>
