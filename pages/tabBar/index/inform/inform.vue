<template>
	<view class="inform">
		<!--搜索框 statring  -->
		<view class="inform-bg" v-show="searchActive"></view>
		<view view class="inform-search" :class="{'inform-search--active':searchActive}">
			<view class="inform-search__content">
				<i class="iconfont icon-xiaosuo inform-search__content__search"></i>
				<input class="inform-search__content__searchInput" @click="focusSearch"  @blur="blurSearch" confirm-type="search" v-model="searchValue" @confirm="search" placeholder="请输入关键字搜索" type="text" />
				<span class="iconfont icon-guanbi inform-search__content__cancel" v-show="searchValue.length !== 0" @click="clickCancel"></span>
			</view>
			<view v-show="searchActive" class="inform-search__history">
				<view class="inform-search__history__msg" v-if="historyList.length == 0">暂无历史搜索记录</view>
				<template v-else v-for="(item,index) in historyList" >
					<view class="inform-search__history__item" :class="{'inform-search__history__item--active':searchActive}"  :key="index" @click="clickHistory(item)">{{item}}</view>
				</template>
			</view>
		</view>
    <!--搜索框 ending  -->
		<!-- 主内容 starting -->
		<view class="segmented-control" :class="{'segmented-control--active':searchActive}"  @touchend="touchend" @touchstart="touchstart">
		<uni-segmented-control :current="current" :values="itemName" @clickItem="onClickItem" styleType="text" activeColor="#C6191E"></uni-segmented-control>
      <template class="content">
				<view class="content__list">
					<uni-list>
						<uni-list-item class="content__list-item" v-for="(item,index) in informnewsItem.array" :key="index" direction="column" ellipsis="1" badge-text="12" clickable @click="toContent(item)">
						<!-- 自定义 header -->
						<view slot="header"  class="slot-box content__list-item__title" :class="{'content__list-item__title--read':item.read}"><text>{{item.title}}</text></view>
						<!-- 自定义 body -->
						<template slot="body" class="content__list-item__msg">
							<text class="slot-box content__list-item__msg__slot content__list-item__msg__slot--author">{{item.author}}</text>
							<text class="slot-box content__list-item__msg__slot content__list-item__msg__slot--publishDate">{{item.publishDate}}</text>
						</template>
						</uni-list-item>
					</uni-list>
				</view>
      </template>
    </view>
		<!-- 主内容ending -->
		<!-- 底部分页栏 statring-->
    <view class="inform-bottomPage" >
      <view class="inform-bottomPage--size" v-if="page.nowPage">
        <view class="inform-bottomPage--size__nextPage" @click="changePage('sub')">上一页 </view>
				<picker @change="bindPickerChange" :value="Number(page.nowPage)-1" :range="pageArray">
					<view class="inform-bottomPage--size__pageNum" @click="showClick">
						{{page.nowPage}}/{{page.allPage}}
					</view>
				</picker>
        <view class="inform-bottomPage--size__lastPage"  @click="changePage('add')">下一页</view>
      </view>
    </view>
    <!-- 底部分页栏 ending-->
	</view>
</template>

<script>
// import schoolNewsletter from './childInform/schoolNewsletter.vue';
import {info} from 'pages/tabBar/index/inform/utils/informClass';
import { informNewsItem } from 'pages/tabBar/index/inform/utils/listClass';
import { paging } from 'pages/tabBar/index/inform/utils/pagingClass';

import { setCache } from 'utils/index';
	export default {
  // components: { schoolNewsletter },
		data() {
			return {
				// 搜索框输入功能
				searchValue: "",
				//栏索
				current:0,
				// 切换栏内容
				tabValue:{
					inform:       	new info('校内通知',1108),
					simple:					new info('校内简讯',1109),
					bulletin:				new info('公示公告',1110),
					chair:					new info('讲座报名',1111),
					news:						new info('学校要闻',1032),
				},
				// TAB索引
				currentIndex:0,
				// 校园通知类型名称
				itemName:[],
				// 校园通知类型代码
				kind:[],
				// 数据列表
				informnewsItem:[],
				otherinformnewsItem:[],
				// 分页器内容
				otherallpage:[],
				page:{},
				// 搜索获取的数据
				informSearchItem:[],
				searchPage:0,
				service: this.$store.state.info.userInfo.service,
				// 获取搜索焦点
				searchActive:false,
				historyList:[],
				// isClickPage:false,
				// index:0,
				pageArray: []
			}
		},
		onPullDownRefresh(){
			this.refresh();
		},
		created(){
			//遍历获取数据
			for(let i in this.tabValue){
				this.itemName.push(this.tabValue[i].itemName);
				this.kind.push(this.tabValue[i].kind);
			}
			//获取首屏数据
			this.catchIndex();
		},
		onShow(){
			this.historySearch()
		},
		methods: {
			// 点击搜索栏获取焦点
			focusSearch(){
				this.searchActive = true;
			},
			// 获取历史记录
			historySearch(){
				this.service.notify.searchHistory().then(res =>{
					this.historyList = res.info
				})
			},
			// 失去搜索焦点
			blurSearch(){
				this.searchActive = false;
			},
			// 点击清空输入内容
			clickCancel(){
				this.searchValue = ''
			},
			// 点击历史进行搜索
			clickHistory(item){
				this.searchValue = item;
				this.search();
			},
			//搜索功能
			search(){
				let requestData = {
					text: this.searchValue,
					page: this.page.nowPage,
					type: 0,
				};
				this.service.notify.searchNotify(requestData).then(res =>{
					this.historySearch();
					this.informSearchItem =  new informNewsItem(res.info.list,res.info.allPage,res.info.btreeId);
					if(this.informSearchItem.array.length === 0){
						uni.showToast({
							title: '没有相关内容',
							icon:'error',
							duration: 1000
						});
					}else{
						setCache('informSearchItem',this.informSearchItem);
						setCache('searchValue',this.searchValue);
						uni.navigateTo({
							url:'/pages/tabBar/index/inform/search/search'
						})
					}
        })
			},
			// 打开首页
			catchIndex(){
				let requestData = {
					kind: 1108,
					page: 1,
				};
				this.service.notify.getNotifyList(requestData).then(res =>{
					this.informnewsItem = this.otherinformnewsItem[0]= new informNewsItem(res.info.list,res.info.allPage,res.info.btreeId)
					this.page.allPage = this.otherallpage[0] = res.info.allPage;
					this.page.nowPage = 1;
					this.page = new paging(this.informnewsItem.btreeId,1,this.informnewsItem.allPage)
					this.listPut();
				})
			},
			// 切换分段器
			onClickItem(e){
				// 切换的时候会改变索引
				this.currentIndex=e.currentIndex
				this.current = e.currentIndex
			},
			// 切换页数
			changePage(type){
				if(type === "add"){
					if(this.page.nowPage<this.page.allPage){
						uni.pageScrollTo({
								scrollTop: 0,
								duration: 300
						});
						this.page.nowPage++;
						let requestData = {
							kind: this.informnewsItem.btreeId,
							page: this.page.nowPage,
						};
						this.service.notify.getNotifyList(requestData).then(res =>{
							this.informnewsItem =  new informNewsItem(res.info.list,res.info.allPage,res.info.btreeId)
						})
					}else{
						uni.showToast({
							title: '已经是第一页了!',
							duration: 2000,
							icon:"none"
						})
					}
				}else if(type === "sub"){
					if(this.page.nowPage>1){
						uni.pageScrollTo({
							scrollTop: 0,
							duration: 300
					});
						this.page.nowPage--;
						let requestData = {
							kind: this.informnewsItem.btreeId,
							page: this.page.nowPage,
						};
						this.service.notify.getNotifyList(requestData).then(res =>{
							this.informnewsItem =  new informNewsItem(res.info.list,res.info.allPage,res.info.btreeId)
						})
					}else{
						uni.showToast({
							title: '已经是第一页了!',
							duration: 2000,
							icon:"none"
						})
					}
				}
			},
			//开始拖动
			touchstart(e){
				this.startTouchX = e.changedTouches[0].clientX;
				this.startTouchY =e.changedTouches[0].clientY;
			},
			// 拖动结束
			touchend(e){
				this.endTouchX = e.changedTouches[0].clientX;
				this.endTouchY =e.changedTouches[0].clientY;
				if(this.currentIndex !== 4 &&this.startTouchX-this.endTouchX>20 && Math.abs(this.startTouchY-this.endTouchY)<30){
					this.currentIndex ++
					this.current ++
				}else if(this.currentIndex !== 0 && this.endTouchX-this.startTouchX>20 && Math.abs(this.startTouchY-this.endTouchY)<30){
					this.currentIndex --
					this.current --
				}
			},
			bindPickerChange(e) {
				this.page.nowPage = Number(e.target.value)+1;
				let requestData = {
					kind: this.informnewsItem.btreeId,
					page: this.page.nowPage,
				};
				this.service.notify.getNotifyList(requestData).then(res =>{
					this.informnewsItem =  new informNewsItem(res.info.list,res.info.allPage,res.info.btreeId)
				})
			},
			listPut(){
				this.pageArray = []
				for(let i = 0;i < this.page.allPage;i++){
					this.pageArray.push(Number(i) + 1)
				}
			},
			// 打开详细内容
			toContent(item){
				item.read = true
				uni.navigateTo({
					url:'/pages/tabBar/index/inform/content/content?item='+JSON.stringify(item)
				})
			},
			// 下拉加载
			refresh(){
				let requestData = {
					kind: this.informnewsItem.btreeId,
					page: this.page.nowPage,
				};
				this.service.notify.getNotifyList(requestData).then(res =>{
					uni.stopPullDownRefresh();
					this.informnewsItem = this.otherinformnewsItem[this.current] = new informNewsItem(res.info.list,res.info.allPage,res.info.btreeId)
					this.page.allPage = this.otherallpage[this.current] = res.info.allPage;
					this.page.nowPage = 1;
					this.listPut()
				})
			}
		},
		watch:{
			// 监听分段器索引值改变时
			currentIndex(newname,oldname){
				let requestData = {
					kind: this.kind[newname],
					page: 1,
				};
				if(this.otherinformnewsItem[newname]){
					this.informnewsItem = this.otherinformnewsItem[newname];
					this.page.allPage = this.otherallpage[newname]
					this.page.nowPage = 1;
				}else{
					this.service.notify.getNotifyList(requestData).then(res =>{
						this.informnewsItem = this.otherinformnewsItem[newname] = new informNewsItem(res.info.list,res.info.allPage,res.info.btreeId);
						this.page.allPage = this.otherallpage[newname] = res.info.allPage;
						this.page.nowPage = 1;
						this.listPut()
					})
				}
			}
		}
	}
</script>

<style lang="scss" scoped>

// 头部搜索栏
.segmented-control /deep/ .segmented-control__text{
	font-size: 12px;
}
.segmented-control--active{
	margin-top: 46px;
}
.inform{
	&-bg{
		position: absolute;
		top: 0%;
		height: 100vh;
		width: 100vw;
		background: rgba(0,0,0,0.3);
		z-index: 1;
	}
	&-search{
		width: 95%;
		background-color: rgb(240, 240, 240);
		border-radius: 10px;
		display: flex;
		flex-direction:column;
		align-items: center;
		justify-content: space-between;
		box-sizing: border-box;
		margin: 16rpx auto;
		&__content{
			display: flex;
			align-items: center;
			&__searchInput{
				background-color: rgb(240, 240, 240);
				width: 600rpx;
				height: 30px;
				margin-left: 5px;
				font-size: 28rpx;
			}
			&__cancel{
				// margin-right: 30rpx;
				font-size: 26rpx;
			}
			&__search{
				font-size: 34rpx;
				color: gray;
			}
		}
		&__history{
			width:100%;
			min-height: 40px;
			border-radius: 10px;
			position: relative;
			padding: 0 20rpx;
			box-sizing: border-box;
			&__item{
				display: inline-block;
				font-size: 26rpx;
				padding: 4px 20rpx;
				border-radius: 20rpx;
				background-color: #fff;
				margin: 8px 8rpx;
				box-sizing: border-box;
				&--active{
					animation: .3s isShow;
				}
			}
			&__msg{
				font-size: 28rpx;
				height: 100px;
				color: gray;
				line-height: 100px;
				text-align: center;
			}
		}
		&--active{
			position: fixed;
			z-index: 100;
			top: 0%;
			left: 50%;
			transform: translateX(-50%);
		}
	}
	// 分页
	&-bottomPage{
		position: fixed;
		left: 0%;
		right: 0%;
		bottom: 0%;
		height: 80rpx;
		line-height: 80rpx;
		background-color: #fff;
		// 适配苹果刘海屏
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
}
.content{
	&__list{
	padding-bottom: calc(var(--safe-area-inset-bottom) + 80rpx);
  &-item{
    &__title{
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
    &__msg{
      color: gray;
      font-size: 28rpx;
      display: flex;
      justify-content: space-between;
      &__slot{
        flex: 1;
        &--author{
          font-size: 24rpx;
          white-space:nowrap;
          overflow:hidden;
          text-overflow:ellipsis
        }
      }  
      &__slot--publishDate{
        font-size: 24rpx;
        text-align: right;
      }
    }
  }
	}
}
@keyframes isShow {
  0% { margin: 0; }
  100% { margin: 8px 8rpx; }
}
</style>


