<template>
<view class="course" @touchstart="touchstart" @touchend="touchend">
	<view class="bg" v-if="showlist&&secondChoose" @click="cancleBG"></view>
	<login-window v-if="showloginWindow" @loginwindowShow = 'emitwindowShow' @requestAgain = 'requestAgain' sureback = "addincourse"/>
	<!-- 头部选择周 -->	
	<view class="course-head">
		<view class="course-head-select">
			<picker mode="selector" value="selectClass.getWeekId()" :range="selectClass.weekArray" range-key='num' @change="pickerChange">
				<view class="course-head-select-picker">
					<view>
						<view>第{{ Number(selectClass.selectWeek) + 1 }}周
							<text v-if="(nowWeek === Number(selectClass.selectWeek) + 1)&&result" class="course-head-select-picker__nowweek">(当前周)</text>
							<img :src="arrowImg" alt="" class="course-head-select-picker-downarrow"/>
						</view>
					</view>
				</view>
			</picker>
		</view>
		<!-- 导入课表 -->
		<rewrite-actionsheet :display="tochild" @toCourse="toCourse" @cancelout="out" @addin="addin(arguments)"></rewrite-actionsheet>
	</view>
	<view @click="changedisplay" v-show="!whoKB" class="course-add">
		<text class="course-add-font">+</text>
	</view>
	<!-- 用户课表切换 -->
	<view class="course-change">
		<view class="course-change__tab" @click="mycourse" :class="{'course-change__who':whoKB === 0}">
			<text class="course-change__tab__text" :class="{'course-change__who__text':whoKB === 0}">我的课表</text>
		</view>
		<view class="course-change__tab" @click="tacourse" :class="{'course-change__who':whoKB === 1}">
			<text class="course-change__tab__text" :class="{'course-change__who__text':whoKB === 1}">{{CPItem.array[listIndex].realName!==undefined?CPItem.array[listIndex].realName:'Ta'}}的课表
				<text class="iconarrow iconfont icon-jiantou"></text>
			</text>
				<view class="course-change__tab-list" v-if="showlist&&secondChoose">
					<template v-for="(item,index) in CPItem.array">
						<view class="course-change__tab-list__choose" :key="index" @click="chooseItem(index,item.partnerId)" :class="{'course-change__tab-list--backlight':listIndex == index}">{{item.realName}}</view>
					</template>
				</view>
		</view>
	</view>
	<!-- 周历课程表 -->
	<view class="course-main">
		<view class="course-main-week">{{weeksdetail}}月</view>
	</view>
		<view v-for="(item,index) in daysdetail" :key="index" class="course-main" 
			:class="{'course-main--highlight':item === new Date().getDate()&&judgelight.substring(0,4) === new Date().Format('yyyy')
				&&(daysdetail[6] < daysdetail[0] && item > daysdetail[6] ? weeksdetail - 1 : weeksdetail) === new Date().getMonth() + 1}">
				{{weekday[index]}}
				<view>{{item}}</view>
		</view>
		<template v-if="info.length !== 0">
			<view class="course-item" v-for="(item,index) in info" :key="index" @click="changeshowdetail(index);funcZcover(item,index)" :style="[{
				left: item.getLeft(item.xq),
				top: item.getTop(courseStart[index]) ,
				height:  item.getHeight(),
				maxHeight: item.getMaxHeight() ,
				background: source_background[index%5],	
				zIndex: item.zCover
				}]" v-show="item.zc == Number(selectClass.selectWeek) +1" ref="wait">
				<view class="course-item-content">
					<view class="course-item-content-kcmc">{{item.kcmc}}</view>
					<view class="course-item-content-jxcdmc">{{item.jxcdmc}}</view>
				</view>
				<view class="course-item__tips" v-if="item.zCover">{{item.zCover + 1}}</view>
			</view>
		</template>
		<template v-else-if="whoKB === 1 && CPItem.array.length !== 0">
			<view class="course__tips">快去邀请对方重新导入课表吧，对方导入成功后重新进入小程序就能看到对方的课表啦</view>
		</template>
		<template v-else-if="whoKB === 1 && CPItem.array.length === 0">
			<view class="course-link" @click="cpCourse">
				<view class="iconfont icon-weixin course-link__img"></view>
				点击前往绑定CP
			</view>
		</template>
	<!-- 课程表弹窗 -->
	<course-window :showdetail="showdetail" @window="window">
		<view v-if="id !== ''" class="course-inner">
			<view v-for="(item,index) in windowDetail" :key = "index" class="course-innerlist">
				<view class="course-innerlist-title">
					<view style="overflow:hidden">{{item.kcmc}}</view>
				</view>
				<template v-for="(itemDetail,index) in item.window">
					<view :key="index" class="course-innerlist-winblock">
						<img class="course-innerlist__img" :src="itemDetail.img"/>
						<view class="course-innerlist-infotitle">{{itemDetail.title}}</view>
						<view>
						{{ itemDetail.windowinfo }}
						</view>
					</view>
				</template>
			</view>
		</view>
  </course-window>
	<!-- 左侧时间表 -->
	<view class="course-lefttime">
		<view v-for="(item,index) in leftTimeClass.timeObj" :key="index" class="course-lefttime-time">
			<view class="course-lefttime-time-num">{{item.timenum}}</view>
			<view class="course-lefttime-time-detail">{{item.time}}</view>
		</view>
	</view>
</view>	
</template>

<script>
import courseWindow from './course-components/courseWindow.vue'
import rewriteActionsheet from './course-components/rewriteActionsheet.vue'
import loginWindow from '../../../components/loginwindow/loginWindow.vue'
import { getCache,formatDate,setCache } from 'utils/index'
import { selectClass } from './courseUtils/headerSelect.js'
import { leftTimeClass } from './courseUtils/leftTime.js'
import { courseObj } from './courseUtils/courseMain.js'
import { baseUrlApi } from 'utils/api'
import { CPItem } from '../course/courseUtils/cpCourse';
export default {
	name: 'course',
	components:{
		courseWindow,
		rewriteActionsheet,
		loginWindow,
	},
	data() {
		return{
			selectClass:new selectClass(25),//周数选择列表
			leftTimeClass:{},//左侧时间表
			id: '',
			tochild: 0,//传值给导入课表组件控制开关
			xnxqdm:'',//学年学期
			titles:['离散数学','计算机通信网络'],//课程名称
			info:[],//课程表
			days: [],
			daysdetail: [],
			weekday:['周日','周一','周二','周三','周四','周五','周六'],
			weeksdetail:'',
			index:'',//点击课程传入显示第几个课程的唯一值
			showdetail:0,//弹窗状态
			ishighlight:false,//当天日期高亮
			judgelight:'',
			nowWeek:0,
			startDate:'',
			moreImg:baseUrlApi + 'icon/img/更多2.png',
			showloginWindow:false,
			source_background : [
				"-webkit-linear-gradient(top,#f39691,#f06d71)",
				"-webkit-linear-gradient(top,#f2bf70,#f79c43)",
				"-webkit-linear-gradient(top,#95acf5,#5f87e9)",
				"-webkit-linear-gradient(top,#92cef8,#3599f3)",
				"-webkit-linear-gradient(top,#88e2d2,#5dddca)",
			],
			arrowImg:baseUrlApi + 'icon/img/右箭头bfbfbf.png',
			startschooldate:'',
			result:false,
			whoKB:0,
			secondChoose:false,
			showlist:false,
			// tacourseList:['张三','李四','王五','狗六','阿七'],
			listIndex:'',
			// cp列表
			CPItem:'',
			partnerId:'',
			otherCourse:[],
			windowDetail:[],//课表弹窗总信息
			touch:true,
			service: this.$store.state.info.userInfo.service
		}
	},
	methods:{
		mycourse(){
			this.whoKB = 0;
			this.info = new courseObj(getCache('course')).getInfo();
			this.leftTimeClass = new leftTimeClass()
		},
		tacourse(){
			if(this.whoKB === 1){
				this.secondChoose = !this.secondChoose
			}
			this.whoKB = 1
			this.showlist = true
			if(this.CPItem.array.length !== 0){
				if(!this.listIndex){
					this.listIndex = 0
				}
				if(this.otherCourse[this.listIndex]){
					this.info = this.otherCourse[this.listIndex]
					this.leftTimeClass = new leftTimeClass(this.CPItem.array[this.listIndex].school)
				}else{
					this.getOtherCourse(this.listIndex, this.CPItem.array[this.listIndex].partnerId)
				}
			}else{
				this.info = []
			}
		},
		chooseItem(index,partnerId){
			this.listIndex = index;
			this.partnerId = partnerId;
			setCache('listIndex',this.listIndex.toString());
			this.info = this.otherCourse[index];
			this.leftTimeClass = new leftTimeClass(this.CPItem.array[this.listIndex].school)
		},
		emitwindowShow(val){
			this.showloginWindow = val
		},
		requestAgain(val){
			this[val].apply(this)
		},
		pickerChange: function(e) {
			let value = e.mp.detail.value
			this.selectClass._SelectWeek = value
			let start = null
			if(getCache('startschooldate')){
				start = new Date(getCache('startschooldate'))
			}else{
				start = new Date()
			}
			start = start.getTime() + Number(value) * 7 * 24 * 60 * 60 * 1000
			let Year = new Date(start).getFullYear()
			let Month = new Date(start).getMonth() + 1
			let Day = new Date(start).getDate()
			let str = formatDate(Year, Month, Day)
			this.initData(str)
		},
		//点击清除课表
		out(w){
			if(w == true){
				this.info = []
				uni.removeStorageSync('course')
				uni.removeStorageSync('startschooldate')
				this.initData()
				this.id = ''
				this.title = ''
				this.xnxqdm = ''
			}
		},
		//点击学期选择
		addin(v){
			if(v[0] == true){
			this.xnxqdm = v[1];
			setCache('xnxqdm',this.xnxqdm)
			this.tochild = 0;
			this.addincourse()
			}
		},
		//点击取消按钮，清除课表取消按钮，遮罩背景层进行底部弹窗隐藏
		toCourse(val){
			this.tochild = val
			this.touch = true
		},
		//底部弹窗出现
		changedisplay() {
			this.tochild = 1;
			this.touch = false
		},
		//导入课表
		addincourse() {
			this.info = []
			let requestschoolStart = {
				xnxqdm: getCache('xnxqdm')
			}
			this.service.school.getStartSchool(requestschoolStart).then(res => {
				this.startschooldate = res.info
				this.initData(this.startschooldate);
				setCache('startschooldate',this.startschooldate)
				this.jumpNowWeek()
				this.judgeyear()
			})
			this.selectClass._SelectWeek = 0;
			let requestData = {
				xnxqdm: getCache('xnxqdm'),
			}
			
			this.service.school.getkb(requestData).then(res => {
				this.info = new courseObj(res.info,true).getInfo()
				setCache('course',this.info)
				if(this.info.length !== 0){
					uni.showToast({
						icon:'success',
						title:'导入成功！'
					})
				}
			}).catch(err => {
				if(err.code === 1006){
					if(getCache('username')){
						this.showloginWindow = true
					}else{
						uni.navigateTo({
							url:'/pages/login/login'
						})
					}
				}
			})
		},
		//点击某一课程，出现详情弹窗
		changeshowdetail(i) {
			this.showdetail = 1;
			this.id = i;
			this.title = this.info[i].kcmc;
			this.touch = false
		},
		//课表弹窗隐藏
		window(val) {
			this.showdetail = val
			this.touch=true
		},
		//左右滑动周期改变
		touchstart(e) {
			// 获取起始坐标位置x
			this.lastPosX = e.mp.changedTouches[0].clientX
			this.lastPosY = e.mp.changedTouches[0].clientY
		},
		touchend(e) {
			// 获取当前位置x
			this.curPosX = e.mp.changedTouches[0].clientX
			this.curPosY = e.mp.changedTouches[0].clientY
			// 计算差值
			this.diffX = +(this.curPosX - this.lastPosX)
			this.diffY = +(this.curPosY - this.lastPosY)
			// 左右滑动的距离 大于 上下滑动的距离 左右滑动
			if(this.touch){
				if(Math.abs(this.lastPosY-this.curPosY) <= 80){
					if( Math.abs(this.lastPosY-this.curPosY) <= Math.abs(this.lastPosX-this.curPosX)){
						//
						if(this.lastPosX-this.curPosX>20  && this.selectClass.selectWeek<24){
							this.selectClass._SelectWeek = Number(this.selectClass.selectWeek) +1
							this.weekPreNext(1)
						//
						}else if(this.curPosX-this.lastPosX>20  && this.selectClass.selectWeek>=1){
							this.selectClass._SelectWeek = Number(this.selectClass.selectWeek) -1
							this.weekPreNext(-1)
						}
					}
				}
			}
		},
		initData (cur) {
			this.daysdetail=[]
			let date = ''
			if (cur) {
				date = new Date(cur)
			} else {
				date = new Date()
			}
			let currentDay = date.getDate()          // 今日日期 几号
			let currentYear = date.getFullYear()       // 当前年份
			let currentMonth = date.getMonth() + 1    // 当前月份
			let currentWeek = date.getDay() // 1...6,0   // 星期几
			const str = formatDate(currentYear, currentMonth, currentDay)// 今日日期 年-月-日
			this.judgelight = str
			this.days.length = 0
			// 今天是周日，放在第一行第7个位置，前面6个 这里默认显示一周，如果需要显示一个月，则第二个循环为 i<= 35- this.currentWeek
			//从currentWeek开始的前后遍历遍历，将日期放数组
			for (let i = currentWeek - 1; i >= 0; i -= 1) {
				const d = new Date(str)
				d.setDate(d.getDate() - i-1)
				this.days.push(d)
				this.daysdetail.push(d.getDate())
				this.weeksdetail=d.getMonth() + 1
			}
			for (let i = 1; i <= 7 - currentWeek; i += 1) {
				const d = new Date(str)
				d.setDate(d.getDate() + i-1)
				this.days.push(d)
				this.daysdetail.push(d.getDate())
				this.weeksdetail=d.getMonth() + 1
			}
		},
		//星期前后方法
		weekPreNext (val) {
			let d = 0
			if(val>0){
				d = this.days[6]
			}else{
				d = this.days[1]  
			}
			d.setDate(d.getDate() + 7*val)
			this.daysdetail=[]
			this.initData(d)
		},
		//初始化课程表
		initCourse(){
			if(getCache('course')&&getCache('startschooldate')){
				this.initData(getCache('startschooldate'))
				this.selectClass._SelectWeek = 0;
				this.info = new courseObj(getCache('course'),false).getInfo()
			}else{
				this.initData();
			}
		},
		judgeNowWeekNum(){
      let nowDate = new Date()
      let startDate = new Date(getCache('startschooldate'))
      // 加上8个小时解决时区的问题
      let differDay = (nowDate - startDate + 8 * 1e3 * 3600) / 1e3 / 24 / 3600
      // 去除小数
      differDay = (differDay) >> 0
      // 当前周数
      let nowWeekNum = ((differDay / 7) >> 0) + 1
      this.nowWeek = nowWeekNum
    },
		jumpNowWeek(){
			this.judgeNowWeekNum()
			let nowyear = 0
			let nowTime = new Date()
			let e = {
				mp:{
					detail:{
						value:this.nowWeek - 1
					}
				}
			}
			if(nowTime.getMonth()+1>=2&&nowTime.getMonth()+1<=7){
				nowyear = nowTime.getFullYear() - 1
			}else{
				if(nowTime.getMonth()+1<2){	
          nowyear = nowTime.getFullYear() - 1
        }else{
          nowyear = nowTime.getFullYear()
        }
			}
			if(nowyear === Number(getCache('xnxqdm').substring(0,4))){
				this.pickerChange(e)
			}
		},
		judgeyear(){
			if(getCache('xnxqdm').substring(0,4) === new Date().Format('yyyy')){
				console.log("hxwehsadasf");
				this.result = true
			}
		},
		// 隐藏蒙层
		cancleBG(){
			this.showlist = false;
			this.secondChoose = false;
		},
		// 获取cp课表列表
		myPartner(){
			this.service.schedule.myPartner().then(res => {
				if(this.CPItem !== new CPItem(res.info)){
					this.CPItem =  new CPItem(res.info);
					this.listIndex = ''
					this.otherCourse = []
				}
			})
		},
		getOtherCourse(index, id){
			this.service.schedule.getCpClass(id).then(res => {
				this.info = this.otherCourse[index] = new courseObj(res.info,true).getInfo()
			})
		},
		funcZcover(item,index){
			this.windowDetail = item.setzCover(item,index)
		},
		// CP课表
		cpCourse(){
			this.service.user.isStudent().then(res => {
				if(res.info){
					uni.navigateTo({
						url: '/pages/tabBar/course/cpCourse/cpCourse'
					});
				}else{
					this.service.school.getInfo().then(res => {
						uni.navigateTo({
							url: '/pages/tabBar/course/cpCourse/cpCourse'
						});
					}).catch(err =>{
						uni.navigateTo({
							url:'/pages/login/login'
						})
					})
				}
			})
		},
	},
	created(){
		this.listIndex = getCache('listIndex');
	},
	onShow() {
		this.leftTimeClass = new leftTimeClass()
		this.initCourse()
		this.judgeNowWeekNum()
		this.jumpNowWeek()
		this.judgeyear()
		this.myPartner();
		this.whoKB = 0;
	},
	computed: {
		courseStart() {
			try{
				let arr = [];
				this.info.forEach(item => {
					if(item.jcdm.length >2){
						if(item.jcdm.substring(2,3) == 0){
						arr.push(parseInt(item.jcdm.substring(3,4)))
						}else{
						arr.push(parseInt(item.jcdm.substring(2,4)))
						}
					}else{
						arr.push(item.jcdm)
					}
				})
				return arr
				}catch{err =>{
					console.log(err);
				}
			}
		}
	},
}
</script>
<style lang="scss" scoped>
.course{
	&-head{
		width: 100%;
    height: 5%;
    border-bottom: 0.5px solid #dddcdc;
    text-align: center;
    vertical-align: middle;
    position: relative;
		padding: 10px 0 10px 0;
		&-select{
			font-weight: 400;
			font-size: 15px;
			&-picker{
				position: relative;
				&-downarrow{
					position: absolute;
					transform:rotate(90deg);
					width: 16px;
					height: 16px;
				}
				&__nowweek{
					font-size: 13px;
				}
			}
		}
		&-img{
			width: 16px;
			height: 16px;
			position: absolute;
			right: 0px;
			top: 0px;
			padding: 10px 0 10px 0;
		}
	}
	&-add{
		position: fixed;
		bottom: 20px;
		right: 20px;
		background: rgba(254,125,18,0.7);
		border-radius: 50%;
		width:120rpx;
		height: 120rpx;
		color:#ffffff;
		z-index: 10;
		box-shadow: 8rpx 10rpx 15rpx 2rpx #979797;
		opacity: .6;
		&::after{
			position: relative;
		}
		&-font{
			position: absolute;
			top:50%;
			left: 50%;
			transform: translate(-50%,-50%);
			font-size: 120rpx;
			display: flex;
			align-items: center;
			justify-content: center;
		}
	}
	&-change{
		position: absolute;
		display: flex;
		align-items: center;
		height: 50px;
		width: 100vw;
		&__tab{
			position: relative;
			width: 50vw;
			display: flex;
			justify-content: center;
			align-items: center;
			height: 100%;
			&__text{
				padding-bottom: 5px;
				position: relative;
				.iconarrow{
					display: block;
					transform: rotate(90deg) translateY(-50%);
					font-size: 24rpx;
					position: absolute;
					right: -20rpx;
					top:0%;
					color: #000000;
					font-weight: 600;
				}
			}
			&-list{
				position: absolute;
				z-index: 900;
				display: flex;
				flex-direction: column;
				align-items: center;
				justify-content: center;
				width: 30vw;
				background: #ffffff;
				top: 40px;
				color: #000000;
				border: 1px solid #ffa19c;
				&__choose{
					padding: 3px 0;
					width: 100%;
					text-align: center;
					margin: 1px 0;
				}
				&--backlight{
					background: #ffa19c;
				}
			}
		}
		&__who{
			color: #C6191E;
			&__text{
				border-bottom: 2px solid #C6191E;
			}
			.iconarrow{
				color: #C6191E !important;
			}
		}
	}
	&-lefttime{
		margin-top: 10px;
    width: 12.5%;
		&-time{
			text-align: center;
			display: flex;
			justify-content: center;
			flex-direction: column;
			height: 55px;
			font-size: 9px;
			&-num{
				font-size: 11px;
				font-weight: 500;
			}
			&-detail{
				font-size: 7px;
			}
		}
	}
	&-main{
		width: 12.5%;
		display: inline-block;
		text-align: center;
		line-height: 20px;
		font-size: 12px;
		margin-top: 52px;
		&-week{
			position: absolute;
			top: 100px;
			left: 4%;
		}
		&--highlight{
			background: #abf794;
			border-radius: 0.5rem;
			font-weight: 600;
		}
	}
	&-item{
		width: 11.7%;
    background: -webkit-linear-gradient(top,#f39691,#f06d71);
    position: absolute;
    font-size: 14px;
		line-height: 20px;
    border-radius: 0.3rem;
    font-weight: 500;
    box-shadow: 6rpx 8rpx 5px 2px rgba(0, 0, 0, 0.2);
    text-align: center;
    padding: 3px 0px 0px 0px;
    // overflow-x: hidden;
    // overflow-y: auto;
		&::after{
			position: relative;
		}
		&__tips{
			position: absolute;
			top: -5px;
			right: -3px;
			width: 30rpx;
			height: 30rpx;
			background: red;
			border-radius: 50%;
			font-size: 22rpx;
			display: flex;
			align-items: center;
			justify-content: center;
			color: white;
			opacity: .7;
		}
		&-content{
			color: #ffffff;
			position: relative;
			height: 100%;
			&-kcmc{
				position: absolute;
				font-size: 24rpx;
				line-height: 30rpx;
				max-height: 80rpx;
				text-overflow: -o-ellipsis-lastline;
				overflow: hidden;
				text-overflow: ellipsis;
				display: -webkit-box;
				-webkit-line-clamp: 2;
				line-clamp: 2;
				-webkit-box-orient: vertical;
			}
			&-jxcdmc{	
				position: absolute;
				bottom: 0;
				font-size: 20rpx;
			}
		}
	}
	&-inner{
		display: flex;
		overflow-x: scroll;
		padding: 10rpx 0px 10rpx 0px;
		&::-webkit-scrollbar {
			/*滚动条整体样式*/
			width: 10px;
			/*高宽分别对应横竖滚动条的尺寸*/
			height: 4px;
			display: block;
			margin: 2px 0;
		}
		&::-webkit-scrollbar-thumb {
			/*滚动条里面小方块*/
			border-radius: 10px;
			// background-color: rgb(177, 177, 177);
			background-color: #94cff7;
			display: block;
		}
		&::-webkit-scrollbar-track {
			/*滚动条里面轨道*/
			display: block;
		}
	}
	&-innerlist{
		display: flex;
		flex-direction: column;
		border-radius: 0.25rem;
		justify-content: center;
		text-overflow: ellipsis;
		white-space: nowrap;
		&-title{
			border-bottom: 0.2rpx solid #dddddd;
			font-size: 36rpx;
			font-weight: 400;
			font-family: Microsoft Yahei;
			padding: 20rpx 20rpx;
			display: flex;
			align-items: center;
			justify-content: center;
			width: 500rpx;
			overflow: hidden;
		}
		&-winblock{
			display: flex;
			overflow-x: scroll;
			background: #f5f4f4;
			margin: 4rpx 4rpx 4rpx 10rpx;
			border-radius: 0.25rem;
			padding: 10rpx 10rpx 10rpx 10rpx;
			align-items: center;
			text-overflow: ellipsis;
			white-space: nowrap;
			width: 520rpx;
			box-sizing: border-box;
		}
		&__img{
			flex: 0 0 8%;
			width: 42rpx;
			height: 42rpx;
			margin-right: 10rpx;
		}
		&-infotitle{
			color: #8d8d8d;
			flex: 0 0 20%;
		}
	}
	&__tips{
		position: absolute;
		top: 50%;
		left: 50%;
		transform: translate(-50%, -50%);
		width: 500rpx;
		background: rgb(150, 150, 150);
		color: white;
		padding: 10px;
		text-align: center;
		font-size: 20rpx;
		line-height: 35rpx;
		border-radius: 10rpx;
	}
	&-link{
		position: absolute;
		top: 50%;
		left: 50%;
		transform: translate(-50%, -50%);
		padding: 10px 50rpx;
		text-align: center;
		background-color: #fff;
		box-shadow: 6rpx 8rpx 20rpx 2rpx rgb(196, 196, 196);
		border-radius: 10rpx;
		&:active{
			opacity: .7;
		}
		&__img{
			font-size: 100rpx;
			margin-bottom: 10px;
			color: rgb(40, 198, 67);
		}
	}
}
.bg{
	z-index: 899;
	position: absolute;
	top:0%;
	width: 100vw;
	height: 100vh;
}
</style>
