<template>
  <view class="serve">
    <uni-list>
      <uni-list-item class="serve-item" v-for="(item,index) in volunItemList" :key="index"  ellipsis="1">
        <view class="serve-item__content" slot="body">
          <text class="serve-item__content-title">{{item.activityName}}</text>
          <text class="serve-item__content-note">{{item.organization}}</text>
        </view>
        <template slot="footer">
            <text class="serve-item__footer">{{item.time.replace(/小时/, " ")}}</text>
        </template>
      </uni-list-item>
    </uni-list>
  </view>
</template>

<script>
export default {
  name:'ServelogVolunteer',
  props:['volunItem'],
  data(){
    return{
      volunItemList:[]
    }
  },
  watch:{
    volunItem(newVal,oldVal){
      this.volunItemList = newVal.array;
    }
  }
}
</script>

<style lang="scss" scoped>
.serve{
  &-item{
    &__footer{
      height: 50rpx;
      line-height: 50rpx;
      font-size: 40rpx;
      ::before{
        display: inline-block;
        content: "";
        height: 100%;
        vertical-align: middle;
      }
    }
    &__content{
      display: flex;
      flex-direction: column;
      padding-right: 8rpx;
      flex: 1;
      color: #3b4144;
      justify-content: space-between;
      overflow: hidden;
      &-title{
        font-size: 28rpx;
        color: #3b4144;
      }
      &-note{
        margin-top: 20rpx;
        color: #999;
        font-size: 24rpx;
        overflow: hidden;
      }
    }
  }
}

</style>

