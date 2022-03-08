<template>
<view class="help">
  <img :src="FaqImg" alt="" class="help-img">
  <uni-collapse accordion class="help-collapse">
    <template v-for="(item,index) in helpList">
      <uni-collapse-item :key="index" :title='item.title'>
        <view v-html="item.content" class="help-collapse-content"></view>
      </uni-collapse-item>
    </template>
  </uni-collapse>
</view>


</template>

<script>
import {getCache,setCache} from 'utils/index'
import { baseUrlApi } from 'utils/api'
export default {
  components: {},
  data() {
    return {
      helpList:[],
      FaqImg:baseUrlApi+'icon/图片/FAQ.png',
      service: this.$store.state.info.userInfo.service
    };
  },
  created() {
    if(getCache('helpList')){
      this.helpList = getCache('helpList')
    }else{
      this.service.help.getAllList().then(res => {
        this.helpList = res.info
        setCache('helpList',res.info)
      })
    }    
  }
}
</script>
<style lang='scss' scoped>
.help{
  &-img{
    width:100%;
    height: 250px;
  }
  &-collapse{
    &-content{
      line-height: 30px;
      padding: 15px 10px;
    }
  }
}

</style>