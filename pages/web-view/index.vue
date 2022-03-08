<template>
  <view class="web-view">
    <web-view :src="path"></web-view>
  </view>
</template>

<script>
export default {
  data() {
    return {
      path: ''
    };
  },
  onLoad(options){
    this.path = options.path
  }
}
</script>
<style lang='scss' scoped>
</style>