<template>
  <view class="alltime">
  <!-- 九宫格 starting-->
  <view class="alltime-func">
    <view class="alltime-func-item" v-for="(item,index) in gridList" :key="index" v-bind:style="{backgroundColor:item.color}">
      <view class="alltime-func-item__time">{{item.timeHour}}<text v-show="index< 7" class="alltime-func-item__time-h">h</text> <text v-show="index>=7" class="alltime-func-item__time-h">次</text></view>
      <view class="alltime-func-item__text">{{item.timeName}}</view>
    </view>
  </view>
  <!-- 九宫格 ending -->
    <view class="alltime-leaveLogin" @click="leaveLogin">退出登录</view>
  </view>
</template>

<script>
import {time} from '../utils/volunteerClass';
export default {
  name:'AlltimeVolunteer',
  props:['volunteerItem'],
  data(){
    return{
      // 九宫格数据
      joinTime:{},
      volunteerTimeAll:{},
      trainingTimeAll:{},
      volunteerTimeThisYear:{},
      volunteerTimeLastYear:{},
      trainingTimeThisYear:{},
      trainingTimeLastYear:{},
      volunteerTimesAll:{},
      trainingTimesAll:{},
      // 九宫格数据数组
      gridList:[],
      // 渐变颜色数组
    }
  },
  watch:{
    volunteerItem(newVal,oldVal){
      this.volunteerTimeAll = new time('服务总时长',this.volunteerItem.volunteerTimeAll,"#ff9d9c");
      this.joinTime = new time('志愿者总时长',this.volunteerItem.joinTime,"#FFC069");
      this.trainingTimeAll = new time('总培训时长',this.volunteerItem.trainingTimeAll,"#36CFC9");
      this.volunteerTimeThisYear = new time('本年服务时长',this.volunteerItem.volunteerTimeThisYear,"#FFC069");
      this.volunteerTimeLastYear = new time('上年服务时长',this.volunteerItem.volunteerTimeLastYear,"#ff9d9c");
      this.trainingTimeThisYear = new time('本年培训时长',this.volunteerItem.trainingTimeThisYear,"#95DE64");
      this.trainingTimeLastYear = new time('上年培训时长',this.volunteerItem.trainingTimeLastYear,"#36CFC9");
      this.volunteerTimesAll = new time('总服务次数',this.volunteerItem.volunteerTimesAll,"#95DE64");
      this.trainingTimesAll = new time('总培训次数',this.volunteerItem.trainingTimesAll,"#ff9d9c");
      this.gridList = [ 
        this.volunteerTimeAll,
        this.joinTime,
        this.trainingTimeAll,
        this.volunteerTimeThisYear,
        this.volunteerTimeLastYear,
        this.trainingTimeThisYear,
        this.trainingTimeLastYear,
        this.volunteerTimesAll,
        this.trainingTimesAll
      ]
    }
  },
  methods:{
    leaveLogin(){
      uni.removeStorageSync('autoLogin');
      // uni.removeStorageSync('volPassword');
      // uni.removeStorageSync('volUsername');
      uni.navigateTo({
        url: '/pages/tabBar/index/volunteer/loginVolunteer/loginVolunteer'
      });
    }
  }
}
</script>

<style lang="scss" scoped>
.alltime{
  &-func{
    width: 720rpx;
    margin: 10px auto;
    &-item{
      display: inline-block;
      margin: 5px 15rpx;
      width: 210rpx;
      height: 180rpx;
      text-align: center;
      position: relative;
      border-radius: 10px;
      box-shadow: 4px 5px 7px 1px #979797;
      &__time{
        font-size: 50rpx;
        position: absolute;
        top: 50%;
        left: 50%;
        color: #fff;
        transform: translate(-50%,-50%);
        &-h{
          font-size: 30rpx;
        }
      }
      &__text{
        font-size: 24rpx;
        position: absolute;
        bottom: 8%;
        width:100%;
        text-align: center;
        color: #fff; 
      }
    }
  }
  &-leaveLogin{ 
    position: fixed;
    bottom: 2%;
    left:0; 
    right:0;
    width: 60%;
    height: 80rpx;
    background-color:rgb(217, 30, 36);
    color: #ffffff;
    border-radius: 45rpx;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 28rpx;
    margin: 0 auto;
    // margin-top: 20rpx;
  }
}

</style>

