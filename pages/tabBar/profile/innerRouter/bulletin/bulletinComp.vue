<template>
<view class='window' v-if="windowshow">
  <view class="window-bg" @click="windowhidden"></view>
  <view class="window-content">
    <view class="window-content-title" v-if="title !== ''">
        {{title}}
    </view>
    <view class="window-content-inner">
        <slot></slot>
    </view>
    <view class="window-content-button" @click="windowhidden">我知道了</view>
  </view>
</view>
</template>

<script>

export default {
    props:{
      title:{
        type: String,
        default: '',
        require: false
      },
      windowshow:{
        type: Boolean,
        default: false,
        require: true
      }
    },
    data() {
      return {

      };
    },
    methods: {
      windowhidden(){
        let noshow = false;
        this.$emit('windowhidden',noshow)
      }
    }
}
</script>
<style lang='scss' scoped>
.window{
    &-bg{
      position: fixed;
      width: 100%;
      height: 100%;
      opacity: 0.7;
      filter: alpha(opacity=70);
      top: 0;
      left: 0;
      z-index: 99;
      background-color: #444343;
    }
    &-content{
      position: fixed;
      width: 90%;
      background-color: #ffffff;
      border-radius: 0.5rem;
      top: 45%;
      left: 50%;
      transform: translate(-50%, -50%);
      z-index: 100;
      height: auto;
      &-title{
        font-size: 40rpx;
        font-weight: 540;
        font-family: Microsoft Yahei;
        padding: 20px 0;
        display: flex;
        align-items: center;
        justify-content: center;
        }
        &-inner{
          text-align: left;
          color: #858383;
          padding: 10px 20px; 
          max-height: 200px;
          overflow-x: hidden;
          overflow-y: auto;
        }
        &-button{
          border-top: 0.5px solid rgba($color: #ececec, $alpha: 1.0);
          height: 60px;
          display: flex;
          align-items: center;
          justify-content: center;
          color: rgb(27, 100, 173);
          font-weight: 600;
          font-size: 30rpx;
        }
    }
}

</style>