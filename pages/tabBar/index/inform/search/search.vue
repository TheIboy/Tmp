<template>
	<view class="search">
    <!-- 搜索列表 -->
    <view class="list">
      <uni-list>
        <uni-list-item class="list-item" v-for="(item,index) in informnewsItem.array" :key="index" direction="column" ellipsis="1" badge-text="12" clickable @click="toContent(item)">
          <view slot="header"  class="slot-box list-item__title" :class="{'list-item__title--read':item.read}"><text>{{item.title}}</text></view>
          <template slot="body" class="list-item__msg">
            <text class="slot-box list-item__msg__text">{{item.author}}</text>
            <text class="slot-box slot-text list-item__msg__publishDate">{{item.publishDate}}</text>
          </template>
        </uni-list-item>
      </uni-list>
    </view>
    <!-- 搜索列表 -->
    <!-- 底部分页栏 statring-->
    <view class="bottomPage" v-if="page.nowPage" >
      <view class="bottomPage--size">
        <view class="bottomPage--size__nextPage" @click="page.changePage('sub')">上一页 </view>
        <picker @change="bindPickerChange" :value="Number(page.nowPage)-1" :range="pageArray">
          <view class="bottomPage--size__pageNum" @click="showClick">{{page.nowPage}}/{{page.allPage}}</view>
        </picker>
        <view class="bottomPage--size__lastPage"  @click="page.changePage('add')">下一页</view>
      </view>
      <!-- <view class="bottomPage__click" v-if="isClickPage">
				<view class="bottomPage__click--flex bottomPage__click__firstPage" @click="firstPage">首页</view>
				<view class="bottomPage__click--flex bottomPage__click__inputPage">
					前往
					<input type="text" class="bottomPage__click--flex__inputPage" confirm-type="go" @confirm="confirmPage">
					页
				</view>
				<view class="bottomPage__click--flex bottomPage__click__lastPage" @click="lastPage(page.allPage)">尾页</view>
			</view> -->
    </view>
    <!-- 底部分页栏 ending-->
	</view>
</template>

<script>
import { informNewsItem } from 'pages/tabBar/index/inform/utils/listClass';
import { paging } from 'pages/tabBar/index/inform/utils/pagingClass';
import { getCache } from 'utils/index';
export default {
  name: "Search",
  data() {
    return {
      // 搜索获取的数据
      informnewsItem:[],
      // 传递过来需要搜索的内容
      requestData:{},
      // 分页器内容
      page:{},
      service: this.$store.state.info.userInfo.service,
      pageArray: []
    };
  },
  created(){
    this.getDate();
  },
  destroyed(){
    uni.removeStorageSync('informSearchItem');
    uni.removeStorageSync('searchValue');
  },
  methods:{
    // 读取缓存
    getDate(){
      this.informnewsItem = getCache('informSearchItem');
      this.page = new paging(this.informnewsItem.btreeId,1,this.informnewsItem.allPage);
      this.listPut();
    },
    // 跳转到详细内容页面
    toContent(item){
      uni.navigateTo({
      url:'/pages/tabBar/index/inform/content/content?item='+JSON.stringify(item)
      })
    },
    // 切换页面
    pageChange(e){
      console.log(e);
      let requestData = {
        text: getCache('searchValue'),
        type: 0,
        page: e,
      };
      this.service.notify.searchNotify(requestData).then(res =>{
        this.informnewsItem =  new informNewsItem(res.info.list,res.info.allPage,res.info.btreeId)
      } 
      )
    },
    bindPickerChange(e) {
      this.page.nowPage = Number(e.target.value)+1
    },
    listPut(){
      this.pageArray = []
      for(let i = 0;i < this.page.allPage;i++){
        this.pageArray.push(Number(i) + 1)
      }
    }
  },
  watch:{
    'page.nowPage': 'pageChange'
  }
}
</script>

<style lang="scss" scoped>
.list-item{
  & .list-item__title{  
    font-size: 32rpx;
    margin-bottom: 20rpx;
    font-weight: 500;
    white-space:nowrap;
    overflow:hidden;
    text-overflow:ellipsis;
    &--read{
      color: gray;
    }
  }
  & .list-item__msg{
  color: gray;
  font-size: 28rpx;
  display: flex;
  justify-content: space-between;
    & .list-item__msg__text{
      flex: 1;
    }  
    & .list-item__msg__publishDate{
      text-align: right;
    }
  }
}
.list{
  padding-bottom: calc(var(--safe-area-inset-bottom) + 80rpx);
}
// 分页
.bottomPage{
  position: fixed;
  left: 0%;
  right: 0%;
  bottom: 0%;
  height: 80rpx;
  line-height: 80rpx;
  background-color: #fff;
  // 适配苹果刘海屏 底部安全区
	padding-bottom: 0;  
  padding-bottom: constant(safe-area-inset-bottom);  
  padding-bottom: env(safe-area-inset-bottom); 
  &--size{
    position: fixed;
    left: 0%;
    right: 0%;
    bottom: 0;
    height: 80rpx;
    line-height: 80rpx;
    background-color: #fff;
    display: flex;
    text-align: center;
    padding-bottom: constant(safe-area-inset-bottom);  
    padding-bottom: env(safe-area-inset-bottom); 
    &__nextPage{
      flex: 1;
    }
    &__pageNum{
      flex: 1;
    }
    &__lastPage{
      flex: 1;
    }
  }
  &__click{
    position: fixed;
    left: 0%;
    right: 0%;
    bottom: 80rpx;
    height: 80rpx;
    line-height: 80rpx;
    background-color: #fff;
    display: flex;
    text-align: center;
    margin-bottom: constant(safe-area-inset-bottom);  
    margin-bottom: env(safe-area-inset-bottom); 
    &__inputPage{
      display: flex;
      align-items: center;
      justify-content: center;
    }
    &--flex{
      flex: 1;
      &__inputPage{
        width: 30px;
        border: 1px solid gray;
        background-color: #fff;
      }
    }
  }
}
</style>


