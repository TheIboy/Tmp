<template>
<view class="about">
  <img :src="aboutusImg" alt="" class="about-img"/>
</view>
</template>

<script>
import { baseUrlApi } from 'utils/api'
export default {
  components: {},
  data() {
    return {
      aboutusImg:baseUrlApi + 'icon/img/关于我们.jpg'
    };
  },

}
</script>
<style lang='scss' scoped>
.about{
  &-img{
    width: 100%;
    height: 100vh;
  }
}

</style>