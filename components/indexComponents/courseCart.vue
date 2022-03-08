<template>
  <view>
    <view class="listcart">
      <view class="msg1">
        <view class="msgBox">
        <view class="classNum">第二大节</view>
        <view class="time">10:10-11:45</view>
        </view>
      </view>
      <view class="msg2">
        <view class="msgBox">
        <view class="lesson">通信原理</view>
        <view class="teacher">李老师 <span class="Classroom">@北主楼705</span></view>
        </view>
      </view>
    </view>
  </view>
</template>

<script>
export default {
  name: "courseCart", 
}
</script>

<style lang="scss" scoped>
.listcart{
    background-color: rgb(246, 246, 246);
    margin: 0 5%;
    height: 130rpx;
    border-radius: 20rpx;
    font-size: 28rpx;
    display: flex;
    flex-flow:row wrap; //横向分布 换行
    align-content: flex-start;  //换行之后 平均分布
    box-shadow: 10rpx 10rpx 5px #888888;
  }
  .listcart .msg1{
    display: flex;
    flex-direction: column;
    line-height: 50rpx;
    flex: 0 0 35%;
  }

  .listcart .msg2{
    display: flex;
    flex-direction: column;
    line-height: 50rpx;
    flex: 0 0 65%;
  }
  .msgBox{
    padding-left: 50rpx;
    padding-top: 20rpx;
  }
</style>

