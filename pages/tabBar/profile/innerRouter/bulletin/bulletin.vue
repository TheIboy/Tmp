<template>
<view class="bulletin">
  <template v-for="(item,index) in announce">
    <view :key="index"  @click="windowshow(index,item.identifier)" class="bulletin-inner">
      <view>
        <view class="bulletin-inner-title">{{`YIDA微校园${item.version}`}}</view>
        <view class="bulletin-inner-date">{{item.updateTime}}</view>
      </view>
      <img :src="weiduImg" alt="" class="bulletin-inner-weidu" v-show="!read[index]" :key="index"/>
      <img :src="arrowImg" alt="" class="bulletin-inner-arrow" :key="index"/>
    </view>
  </template>
  <bulletin-comp :title="announce[index].version" :windowshow='show' @windowhidden='windowhidden'>
    <view v-html="announce[index].content"></view>
  </bulletin-comp>
</view>
</template>

<script>
import bulletinComp from './bulletinComp.vue'
import { baseUrlApi } from 'utils/api'
export default {
  components: {
    bulletinComp
  },
  data() {
    return {
      title:'',
      show:false,
      announce:[],
      index:'',//点击的第几个公告详情
      identifier:'',
      read:[],
      weiduImg:baseUrlApi+'icon/img/未读.png',
      arrowImg:baseUrlApi + 'icon/img/右箭头bfbfbf.png',
      url:'',
      service: this.$store.state.info.userInfo.service
    };
  },
  created(){
    this.getBulletin()
  },
  methods:{
    windowshow(index,identifier){
      this.index = index
      this.show = true
      this.identifier = identifier
      let read ={
        identify: this.identifier
      }
      this.service.announcement.getRead(read).then(res => {
        if(res.code === 1){
          this.read[index] = true
        }
      })
      
    },
    windowhidden(val){
      this.show = val
    },
    getBulletin(){
      let data ={
        page: '1'
      }
      this.service.announcement.getHistory(data).then(res => {
        if(res.code === 1006){
          uni.showToast({
          title:'连接过期',
          mask:true,
          icon:'error',
          duration:1000,
          })
          setTimeout(function(){
          uni.navigateTo({
            url:'/pages/login/login'
          })
          },1000)
        }else{
          this.announce = res.info
          res.info.forEach(item => {
          this.read.push(item.read)
        })
        }
      }).catch((err)=>{
        console.log(err)
      })
    },
  }
}
</script>
<style lang='scss' scoped>
.bulletin{
background-color: #f8f8f8;
  &-inner{
  display: flex;
  width: 100%;
  height: 60px;
  margin-bottom: 4px;
  align-items: center;
  background: #ffffff;
  padding-left: 40rpx;
    &-title{
      font-size: 15px;
      font-weight: 400;
      margin-bottom: 11px;
    }
    &-date{
      color: #474747;
      font-size: 13px;
    }
    &-weidu{
      width: 16px;
      height: 16px;
      position: absolute;
      right: 30px
    }
    &-arrow{
      width: 16px;
      height: 16px;
      position: absolute;
      right: 10px
    }
  }
}

</style>