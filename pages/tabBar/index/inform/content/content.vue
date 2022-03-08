<template>
	<view class="content">
    <view class="news">
      <view class="news__title" >{{content.newTitle}}</view>
      <view class="news__main" v-html="content.newContent"> </view>
      <view class="news__download" v-for="(item,index) in content.newDownLoad" :key="index" @click="openDownLoad(item.fileId,item.owner)">{{item.fileName}}</view>
    </view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
        newItem:{},//获取首页过来的json数据
        content:{
          treeId:'',
          newsId:'',
          newContent:{},
          newDownLoad:[],
          newTitle:"",
          // value:'', // 下载附件输入的内容
          imgData:'', // 验证码图片
          oldUrl:''
        },
        service: this.$store.state.info.userInfo.service
			};
		},
    mounted(){
      this.newItem = JSON.parse(this.$mp.query.item)//解析json数据存入
      this.content.treeId = this.newItem.btreeId//获得treeid进行请求
      this.content.newsId = this.newItem.wbNewsId
      this.content.oldUrl = this.newItem.oldUrl
      this.handleGetDetail()       
    },
    onShareAppMessage(){
			return {
				title: this.content.newTitle,
        path:'/pages/tabBar/index/inform/content/content?item='+this.$mp.query.item
			}
		},
    methods:{
    //获取文章具体内容 
    handleGetDetail(){
      let requestData = {
        treeId: this.content.treeId,
        newsId: this.content.newsId,
        oldUrl: this.content.oldUrl
      };
      this.service.notify.getDetail(requestData).then(res =>{
        this.content.newContent = res.info.content.replace(/\<img/gi, '<img style="position: relative;right:28px;width: 100%; height: auto;"');
        this.content.newTitle = res.info.title
        res.info.fileUrl.forEach(item => {
          this.content.newDownLoad.push(item)
        });
      } 
      )
    },
    // 打开下载附件弹窗
    openDownLoad(fileId,owner){
        uni.showModal({
          title: '提示',
          content: '因小程序限制,请复制链接到浏览器中粘贴下载',
          confirmText:'复制链接',
          confirmColor:'#41A9FF',
          success: function (res) {
            if (res.confirm) {
              uni.setClipboardData({
                  data: 'https://www.wyu.edu.cn/system/_content/download.jsp?urltype=news.DownloadAttachUrl&owner='+owner+'&wbfileid='+fileId+'',
                  success: function () {            
                    uni.showToast({
                      title:'复制成功'
                    })
                  }
              })
            } else if (res.cancel) {
            }
        }
      });
    }
    }
	}
</script>

<style lang="scss" scoped>
.news{
  padding: 2% 0;
  font-size: 14px;
  &__title{
    padding: 0 50rpx;
    font-size: 40rpx;
    height: 40rpx;
    color: #101010;
    line-height: 40rpx;
    padding-bottom: 40rpx;
    font-weight: 700;
  }
  &__main{
    margin-top: 20px;
    text-indent:2em;

  }
  &__download{
    color: #40A9FF;
    font-weight: 700;
    margin: 10px 0;
    padding: 0 50rpx;
  }
  &__popup{
    &__dialog{
      &__content{
        color: gray;
        text-align: center;
      }
    }
  }
}
</style>

