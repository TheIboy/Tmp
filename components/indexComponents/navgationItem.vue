<template>
    <!--功能item-->
  <view class="flex">
    <view  class="navigationCart-item" v-for="(item,index) in functionList" :key="index" @click="toFunction(index)"  >
      <view class="navigationCart-icon">
        <img :src="icon[index]" alt="">
        <!-- <view class="bg"></view> -->
      </view>
      <view>
        <view class="navigationCart-text">{{item.name}}</view>
      </view>
    </view>
  </view>
</template>
<script>
export default {
  name: "NavigationItem",
  props:['functionList'],
  data(){
    return{
      icon:[
        "https://www.etsonchen.cn/icon/HomeImg/成绩查询.png",
        "https://www.etsonchen.cn/icon/HomeImg/考试安排.png",
        "https://www.etsonchen.cn/icon/HomeImg/义工活动.png",
        "https://www.etsonchen.cn/icon/HomeImg/实时公交.png",
        "https://www.etsonchen.cn/icon/HomeImg/校园通知.png",
        "https://www.etsonchen.cn/icon/HomeImg/学分查询.png",
        "https://www.etsonchen.cn/icon/HomeImg/辉煌邑大.png",
        "https://www.etsonchen.cn/icon/HomeImg/常用链接.png",
      ]

    }
  },
  methods:{
    toFunction(index){
      console.log(index);
      switch(index){
        case 0:
          uni.navigateTo({
            url: '/pages/tabBar/index/score/score'
          });
          break
        case 1:
          uni.navigateTo({
            url: '/pages/tabBar/index/exam/exam'
          });
          break
        case 2:
          uni.navigateTo({
            url: '/pages/tabBar/index/score/score'
          });
          break
        case 3:
            uni.navigateToMiniProgram({
            appId: 'wxa89720422d3127c4',//腾讯实时公交appid
            path: '',
            envVersion: 'release',// 打开正式版
            success(res) {
                  // 打开成功
              console.log(res)
            },
            fail: function (err) {
              console.log(err);
            }
          })
          break
        case 4:
          uni.navigateTo({
            url: '/pages/tabBar/index/inform/inform'
          });
          break
        case 5:
          uni.navigateTo({
            url: 'pages/tabBar/index/phone/phone'
          });
          break
        case 6:
          uni.navigateToMiniProgram({
          appId: 'wxe1d6c38051a8b09c',//学党史的appid
          path: '',
          envVersion: 'release',// 打开正式版
          success(res) {
                // 打开成功
          },
            fail: function (err) {
              console.log(err);
          }
        })
        break
        case 7:
          uni.navigateTo({
            url: '/pages/tabBar/index/more/more'
          });
          break
      }
    }
  }
}
</script>

<style lang="scss" scoped>
  .flex{
    display: flex;
    flex-flow:row wrap;
    align-content: flex-start;
    padding: 0 5%;
    padding-top: 50rpx;
  }
  .navigationCart-item{
    flex: 0 0 25%;
    text-align: center;
    height: 49px;
  }
  .navigationCart-icon img{
    width: 30px;
    height: 30px;

    margin: 0 auto;
    /* vertical-align: middle 去掉图片与文字之间的间距 */
    vertical-align: middle;
  }
  .navigationCart-text{
    // font-size: $ball-font-size-sm;
    font-size: 12px;
  }

</style>


