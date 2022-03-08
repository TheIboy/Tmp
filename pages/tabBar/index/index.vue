<template>
	<view class="index">
    <bulletin-comp :title="text.title" :windowshow='!bulletinshow' @windowhidden='windowhidden'>
      <view v-html="text.content"></view>
    </bulletin-comp>
    <view class="index-top">
      <!-- 轮播图 starting -->
      <template>
        <swiper class="index-top-swiper"  circular :autoplay="autoplay" :interval="interval" :duration="duration" >
          <!-- <swiper-item v-if="!closeAd">
            <ad unit-id="adunit-d554e3c78584294b" bindclose="adClose"></ad>
          </swiper-item> -->
          <swiper-item v-for="(item, index) in swiperItem.array" :key="index" @click="swiperClick(item)">
            <img class="index-top-swiper__img" :src="baseUrlApi + item.pictureUrl" alt="" >
          </swiper-item>
        </swiper>
      </template>
      <!-- 轮播图 endting -->
      <!-- 九宫格 starting-->
      <view class="index-top-func">
        <view class="func-item" v-for="(item,index) in functionItem.array" :key="index" @click="functionClick(item)">
          <i class="iconfont func-item__img" :class="item.icon" :style="{background: functionColor[index % 4],'box-shadow': '4rpx 6rpx 8rpx 2rpx ' + backgroundColor[index % 4]}"></i>
          <!-- <img :src="item.icon" alt="" :style="{background: functionColor[index % 4]}" class="func-item__img"> -->
          <view class="func-item__text">{{item.name}}</view>
          <!-- <view class="new-tips">new</view> -->
        </view>
      </view>
      <!-- 九宫格 ending -->
    </view>
    <!-- 今日课表头 starting -->
    <view class="index-main">
      <view class="index-main__head">
        <span class="index-main__head__day">第 {{nowWeek.week}} 周 {{nowWeekText}} </span>
        <span class="index-main__head__num">有 {{todayCourse.length}} 节课</span>
      </view>
      <view class="index-main-schedule">
        <view class="schedule-list" v-for="(item, index) in todayCourse" :key="index" @click="know(index)">
          <view class="schedule-list-left">
            <view class="schedule-list__text">{{item.indexSchedule().timeText}}</view>
            <view class="schedule-list__text">{{item.indexSchedule().time}}</view>
          </view>
          <view class="schedule-list-right">
            <view class="schedule-list__text">{{item.indexSchedule().teacher}} {{item.indexSchedule().name}}</view>
            <view class="schedule-list__text">{{item.indexSchedule().location}}</view>
          </view>
        </view>
      </view>
    </view>
    <view v-if="newLogin" class="index-bottom">
      <view class="index-bottom__text">您还没有登录，登录后即可解锁所有功能</view>
      <view class="index-bottom__login" @click="toLogin">立即登录</view>
      <view class="iconfont icon-guanbi index-bottom__cancle" @click="cancleNewLogin"></view>
    </view>
    <!-- 今日课表头 ending -->
    <!-- 今日课表弹窗 -->
    <course-window :showdetail="showdetail" @window="window">
    <view class="index-innerlist-title">
      <view style="overflow:hidden">{{todayCourse[id].kcmc}}</view>
    </view>
		<view v-if="id !== ''">
			<view v-for="(item,index) in todayCourse[id].window" :key = "index" class="index-innerlist">
				<img class="index-innerlist__img" :src="todayCourse[id].window[index].img"/>
				<view class="index-innerlist-infotitle">{{todayCourse[id].window[index].title}}</view>
				<view>
				{{ todayCourse[id].window[index].windowinfo }}
				</view>
			</view>
		</view>
    </course-window>
    <!-- cp课表 -->
    <course-accept-cp  v-if="isShowCP" @cancel="cancel" @accept="accept" @bg='cancel' :cpInfo="cpInfo"></course-accept-cp>
    <uni-popup ref="message" type="message">
      <uni-popup-message :type="msgType" :message="messageText" :duration="1000"></uni-popup-message>
    </uni-popup>
    <login-window v-if="showloginWindow" @loginwindowShow = 'emitwindowShow' @requestAgain = 'requestAgain' sureback = "accept"/>
  </view>
</template>

<script>
import {funcNewsItem} from 'pages/tabBar/index/utils/indexFuncClass';
import {swiperItem} from 'pages/tabBar/index/utils/indexSwiper';
import { getCache, setCache } from 'utils/index'
import scheduleFactory from './utils/indexCourse'
import {baseUrlApi} from 'utils/api'
import courseWindow from '../../tabBar/course/course-components/courseWindow.vue'
import BulletinComp from '../profile/innerRouter/bulletin/bulletinComp.vue';
import courseAcceptCp from '../course/course-components/course-acceptCP.vue';
export default {
  name: 'index',
  components:{
    courseWindow,
    BulletinComp,
    courseAcceptCp
  },
  computed:{
    nowWeekText(){
      let weeks = ['周日', '周一', '周二', '周三', '周四', '周五', '周六']
      return weeks[this.nowWeek.day]
    }
  },
  data() {
    return{
      baseUrlApi: baseUrlApi + 'icon/banner/',
      // 自动播放轮播图
      autoplay:true,
      interval:5000,
      duration:500,
      // 轮播图列表
      pictureUrlList:[],
      // 功能列表
      functionItem:[],
      // 当天为第几周周几
      nowWeek: {week: 0, day: 0},
      // 当天课程
      todayCourse: [],
      startSchool:'',
      showdetail:0,//弹窗状态
      title:'',//课程名称
      id:'',//点击弹窗的出现id
      functionColor: [
        'linear-gradient(#f2928e, #f06e72)',
        'linear-gradient(#f2be6e, #f5a046)',
        'linear-gradient(#96aaf0, #6e8cf0)',
        'linear-gradient(#82d2dc, #09dcc8)'
      ],
      backgroundColor: ['rgba(240, 110, 114, .4)', 'rgba(240, 110, 114, .4)', 'rgba(110, 140, 240, .4)', 'rgba(110, 140, 240, 0.4)'],
      text:{
        title:'',
        content:''
      },
      // 最新公告展示
      bulletinshow:true,
      // 轮播图
      swiperItem:[],
      // 展示cp绑定
      isShowCP:false,
      cpCode:'',
      msgType: '',
      messageText: '',
      cpName:'',
      cpInfo:{},
      // 显示登录验证码
      showloginWindow:false,
      service: this.$store.state.info.userInfo.service,
      newLogin:false
    }
  },
  onLoad(options){
    // // TODO 10月底需要去掉
    // let school = getCache('school') || 0
    // setCache('school', school)
    // 获取cp课表绑定码
    if(options.cpCode){
      this.cpCode = options.cpCode
      this.bindingInfo(options.cpCode) 
    }
    let timer = setInterval(() => {
      if(getCache('token')){
        clearInterval(timer)
        // 获取首页轮播图
        this.handleGetBanners();
        // 获取最新公告并且判断已读
        this.bulletinRead();
        this.getAnnouncement();
      }
    }, 100)
  },
  onShow(){
    let timer = setInterval(() => {
      if(getCache('token')){
        clearInterval(timer)
        this.getStartCourse()
        // 获取首页功能
        this.handleGetFunction();
        // 判断是否新用户
        this.checkSchool();
      }
    }, 50)
  },
  created(){
    
  },
  methods:{
    emitwindowShow(val){
			this.showloginWindow = val
		},
		requestAgain(val){
			this[val].apply(this)
		},
    // 判断学籍信息
    isStudent(){
      this.service.user.isStudent().then(res => {
        if(res.info == false){
          this.getInfo();
          return res.info
        }else if(res.info == true){
          this.isShowCP = true
          return res.info
        }
			}).catch(err =>{
        // 获取学籍信息
        this.getInfo();
			})
    },
    // 获取申请用户信息
    bindingInfo(data){
      this.service.schedule.bindingInfo(data).then(res => {
        this.isShowCP = true
        this.cpInfo = res.info
      }).catch(err =>{
				this.isShowCP = false
			})
    },
    // 取消解除解绑CP
    cancel(data){
      this.isShowCP = data
    },
    // 确定绑定
    accept(data){
      this.service.schedule.bindCp(this.cpCode).then(res => {
        this.isShowCP = false;
        this.msgType = 'success'
        this.messageText = res.info
        this.$refs.message.open();
      }).catch(err =>{
        if(err.code == 1202 || err.code == 1201){
          this.msgType = 'error';
          this.messageText = err.info;
          this.$refs.message.open();
        }else if(err.code == 1006){
          uni.navigateTo({
            url:'/pages/login/login'
          })
        }
      })
    },
    know(id){
      this.showdetail = 1
      this.id = id
      this.title = this.todayCourse[id].kcmc;
    },
    	//课表弹窗隐藏
		window(val) {
			this.showdetail = val
		},
    // 获取首页轮播图
    handleGetBanners(){
      this.service.login.getBanners().then(res => {
        this.swiperItem = new swiperItem(res.info)
      })
    },
    // 获取首页功能
    handleGetFunction(){
      this.service.login.getFunction().then(res =>{
        this.functionItem =  new funcNewsItem(res.info)
      })
    },
    // 首页功能点击事件
    functionClick(item){
      item.click();
    },
    swiperClick(item){
      // console.log("123");
      item.click();
    },
    getStartCourse(){
      let nowxq = ''
      let nowyear = ''
      let nowTime = new Date()
      if(nowTime.getMonth()+1>=2&&nowTime.getMonth()+1<=7){
        nowyear = nowTime.getFullYear() - 1
        nowxq = nowyear.toString().concat('-',nowyear + 1,'-2')
      }else{
        if(nowTime.getMonth()+1<2){
          nowyear = nowTime.getFullYear() - 1
        }else{
          nowyear = nowTime.getFullYear()
        }
        nowxq = nowyear.toString().concat('-',nowyear + 1,'-1')
      }
      let requestschoolStart = {
				xnxqdm: nowxq
			}
      this.service.school.getStartSchool(requestschoolStart).then(res => {
        this.startSchool = res.info
        this.nowWeek = this.judgeNowWeekNum()
        this.todayCourse = this.setTodaySchedule()
      }).catch(err => {
        console.log(err)
      })
    },
    // 获取当前为第几周周几
    judgeNowWeekNum(){
      let nowDate = new Date()
      let startDate = new Date(this.startSchool)
      // 加上8个小时解决时区的问题
      let differDay = (nowDate - startDate + 8 * 1e3 * 3600) / 1e3 / 24 / 3600
      // 去除小数
      differDay = (differDay) >> 0
      // 当前周数
      let nowWeekNum = ((differDay / 7) >> 0) + 1
      // 当天星期几
      let nowDayNum = differDay % 7
      return {week: nowWeekNum, day: nowDayNum}
    },
    // 获取当天课程数量
    setTodaySchedule(){
      let todayCourse = []
      if(this.startSchool === getCache('startschooldate')){
        if(getCache('course')){
          // 总课程表
          let totalCourse = getCache('course')
          for(let i = 0; totalCourse[i].zc <= this.nowWeek.week; i ++){
            if(totalCourse[i].zc === this.nowWeek.week && totalCourse[i].xq === this.nowWeek.day){
              todayCourse.unshift(totalCourse[i])
            }
          }
          return new scheduleFactory(todayCourse).data
        }
      }
      
    },
    // 获取最新公告
    getAnnouncement(){
      this.service.announcement.getAnnouncement().then(res =>{
        this.text.title = res.info.version
        this.text.content = res.info.content;
      })
    },
    // 获取最新公告已读
    bulletinRead(){
      this.service.announcement.bulletinRead().then(res =>{
        this.bulletinshow = res.info;
      })
    },
    // 关闭最新通告
    windowhidden(val){
      this.bulletinshow = !val
    },
    // 导入学籍信息
    getInfo(){
      this.service.school.getInfo().then(res => {
        
      }).catch(err =>{
        uni.navigateTo({
          url:'/pages/login/login'
        })
      })
    },
    //新用户跳转登录
    toLogin(){
      this.newLogin = false;
      uni.navigateTo({
        url: '/pages/login/login'
      });
    },
    // 获取校区
    checkSchool(){
      this.service.user.mySchool().then(res =>{
        setCache('school', res.info)
        if(res.info == 0){
          this.newLogin = true;
        }else{
          this.newLogin = false;
        }
      })
    },
    // 关闭提示
    cancleNewLogin(){
      this.newLogin = false;
    }
  },
  onShareAppMessage(){},
  onShareTimeline(){}
}
</script>

<style lang="scss" scoped>
.index{
  background-color: rgb(246, 246, 246);
	height: 100vh;
  &-top{
    background-color: #fff;
    border-radius: 0 0 10px 10px;
    &-swiper{
      width: 700rpx;
      height: 240rpx;
      text-align:center;
      margin:0 auto;
      border-radius: 40rpx;
      overflow: hidden;
      &__img{
        width: 100%;
        height: 100%;
        border-radius: 40rpx;
      }
    }
    &-func{
      width: 720rpx;
      margin: 10px auto;
      .func-item{
        display: inline-block;
        margin: 5px 15rpx;
        width: 150rpx;
        height: 150rpx;
        text-align: center;
        position: relative;
        .new-tips{
          position: absolute;
          top: -10px;
          right: 10rpx;
          font-size: 20rpx;
          background: red;
          color: white;
          padding: 2px 10rpx;
          border-radius: 4px;
          opacity: .8;
          &::before{
            content: '';
            position: absolute;
            left: 8px;
            bottom: -2px;
            width: 5px;
            height: 5px;
            background: inherit;
            transform: rotate(45deg);
          }
        }
        &__img{
          width: 100rpx;
          height: 100rpx;
          display: flex;
          justify-content: center;
          align-items: center;
          border-radius: 16rpx;
          margin: 0 auto 2px;
          font-size: 54rpx;
          color: white;
          animation: funcImg .7s;
        }
        &__text{
          margin-top: 5px;
          font-size: 24rpx;
          animation: funcText 1.5s;
        }
      }
    }
  }
  &-main{
    &__head{
      color: black;
      margin: 20px 50rpx;
      font-size: 28rpx;
      &__num{
        margin: 5%;
      }
    }
    &-schedule{
      .schedule-list{
        display: flex;
        background-color: white;
        border-radius: 20rpx;
        font-size: 26rpx;
        width: 700rpx;
        margin: 10px auto;
        padding: 10px 20rpx;
        box-sizing: border-box;
        box-shadow: 8rpx 10rpx 20rpx 2rpx rgb(226, 226, 226);
        &-left{
          width: 200rpx;
          margin-right: 20rpx;
        }
        &-right{
          width: 400rpx;
        }
        &__text{
          padding: 8px 5rpx;
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
        }
      }
    }
  }
  &-bottom{
    display: flex;
    justify-content:space-around;
    align-items: center;
    position: fixed;
		bottom: 0%;
		height: 40px;
		width: 100vw;
		background: rgba(0,0,0,0.3);
    &__text{
      color: #fff;
      font-size: 26rpx;
    }
    &__login{
      color: #fff;
      font-size: 24rpx;
      text-align: center;
      line-height: 25px;
      width: 140rpx;
      height: 25px;
      border-radius: 20px;
      background-color: rgb(217, 30, 36);
    }
    &__cancle{
      font-size: 22rpx;
      color:gray;
    }
  }
  &-innerlist{
		display: flex;
		flex-direction: row;
		background: #f5f4f4;
		margin: 5px 5px 5px 5px;
		border-radius: 0.25rem;
		padding: 5px 5px 5px 5px;
		align-items: center;
		text-overflow: ellipsis;
		overflow-x:scroll;
		white-space: nowrap;
    &-title{
      border-bottom: 0.1px solid #dddddd;
			font-size: 18px;
			font-weight: 400;
			font-family: Microsoft Yahei;
			padding: 10px 10px;
			display: flex;
			align-items: center;
			justify-content: center;
    }
		&__img{
			flex: 0 0 8%;
			width: 21px;
			height: 21px;
			margin-right: 5px;
		}
		&-infotitle{
			color: #8d8d8d;
			flex: 0 0 20%;
		}
	}
  @keyframes funcImg {
    0%{
      transform: translate(-3px, -5px);
      opacity: .1;
    }
    100%{
      transform: translate(0);
      opacity: 1;
    }
  }
  @keyframes funcText {
    0%{
      opacity: 0;
    }
    100%{
      opacity: .9;
    }
  }
}


</style>
