<template>
  <view class="train">
    <uni-list>
      <uni-list-item class="train-item" v-for="(item,index) in TrainingsItemList" :key="index"  ellipsis="1">
        <view class="train-item__content" slot="body">
          <text class="train-item__content-title">{{item.trainingType}}</text>
          <text class="train-item__content-note">{{item.organization}}</text>
        </view>
      </uni-list-item>
    </uni-list>
  </view>
</template>

<script>
export default {
  name:'TrainlogVolunteer',
  props:['TrainingsItem'],
  data(){
    return{
      TrainingsItemList:[]
    }
  },
  watch:{
    TrainingsItem(newVal,oldVal){
      this.TrainingsItemList = newVal.array;
    }
  }
}
</script>

<style lang="scss" scoped>
.train{
  &-item{
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

