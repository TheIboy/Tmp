<template>
	<view class="score">
		<login-window v-if="showloginWindow" @loginwindowShow = 'emitwindowShow' @requestAgain = 'requestAgain' sureback = "getScore"/>
		<view class="score-header">
			<!-- 平均绩点 -->
			<view class="score-header-text">平均绩点</view>
			<text class="iconfont  score-header-text--icon" :class="openeye === '1'?'.icon-zhaoshangxiaochengxu-mimakexian':'.icon-zhaoshangxiaochengxu-mimabukexian'" @click="openYourEyes"></text>
			<view class="score-header-number">
				<template v-if="openeye === '1'">
					{{averageScore}}
				</template>
				<template v-else>
					* * * *
				</template>
			</view>
			<!-- picker -->
			<view class="score-header-picker">
				<img :src="baseUrlApi + 'icon/img/share.svg'" class="score-header-picker-img"  @click="showSave">
				<picker-view v-if="visible" :indicator-style="indicatorStyle" @change="bindChange" class="score-header-picker-view" :mask-style="maskStyle">
					<picker-view-column class="score-header-picker-view--color">
						<view :class="Year===item?'pickerSelected':''" class="score-header-picker-item" v-for="(item,index) in schoolYear " :key="index">{{item}}</view>
					</picker-view-column>
					<picker-view-column>
						<view :class="schoolSemester===item?'pickerSelected':''" class="score-header-picker-item" v-for="(item,index) in semester" :key="index">{{item}}</view>
					</picker-view-column>
					<picker-view-column>
						<view :class="selectCourse===item?'pickerSelected':''" class="score-header-picker-item" v-for="(item,index) in Course" :key="index">{{item}}</view>
					</picker-view-column>
				</picker-view>
			</view>
		</view>
		<view class="score-detail">
			<!-- 成绩详情 -->
			<view class="score-detail-title">
				成绩详情
			</view>
			<view class="score-detail-course-head">
				<text class="score-detail-course-head__name">课程名称</text>
				<view class="score-detail-course-head__score">成绩</view>
				<view class="score-detail-course-head__xf">学分</view>
			</view>
			<template v-for="(item,index) in scoreList">
				<view class="score-detail-course-main" :key="index" :style="{'background':item.color}" :class="{'score-detail-course-main--show':item.screenshow}">
					<view  class="score-detail-course-main__name">{{item.kcmc}}</view>
					<view  class="score-detail-course-main__score">{{item.zcj}}</view>
					<view  class="score-detail-course-main__xf">{{item.xf}}</view>
				</view>
			</template>
		</view>
		<view class="score-analysis">
			<!--  成绩分析-->
			<view class="score-detail-title">
				成绩分析
			</view>
			<!-- echart -->
			<view class="score-analysis-charts-box">
				<qiun-data-charts
					canvasId="m47q94iWdR9cPX7aAnnLC1h4rDU6rTr7"
					type="pie"
					:chartData="chartData"
					background="none"
					:canvas2d="true"
					:animation="false"
				/>
			</view>
		</view>
		<score-actionsheet :display="tochild" @toScore='toScore'></score-actionsheet>
	</view>
</template>
<script>
import { scoreList } from './utils/scoreClass'
import { getCache,setCache } from 'utils/index'
import loginWindow from 'components/loginwindow/loginWindow.vue'
import {baseUrlApi} from 'utils/api'
import scoreActionsheet from './score-components/scoreActionsheet.vue'
export default {
	name:'score',
	components:{
		loginWindow,
		scoreActionsheet
	},
	data () {
		const schoolYear = ['全部','大一','大二','大三','大四']
		const Year = '全部'
		const semester = ['全部','上学期','下学期']
		const schoolSemester = '全部'
		const Course = ['包含选修','不包含选修']
		const selectCourse = '包含选修'
		return {
			openeye:'',
			tochild: false,//传值给保存相册组件控制开关
			baseUrlApi,
			schoolYear,
			Year,
			semester,
			schoolSemester,
			Course,
			selectCourse,
			visible: true,
			indicatorStyle: `height: 50px;color: rgba(255,255,255,1)`,
			maskStyle:"background: rgb(54,207,201);z-index:0",
			chartData:{
				categories: [],
				series: [{
					"data": [
						{
							"name": "优秀",
							"value": 0
						},
						{
							"name": "良好",
							"value": 0
						},
						{
							"name": "中等",
							"value": 0
						},
						{
							"name": "及格",
							"value": 0
						},
						{
							"name": "不及格",
							"value": 0
						}
					]
				}]
			},
			scoreList:[],
			averageScore:0,
			echartsValue:[],
			showloginWindow:false,
			watchCache:[],
			flat:1,
			service: this.$store.state.info.userInfo.service
		}
	},
	methods: {
		//控制睁眼闭眼
		openYourEyes(){
			if(this.openeye === '1'){
				this.openeye = '0'
			}else{
				this.openeye = '1'
			}
			setCache('openeye',this.openeye)
		},
		//显示保存进相册
		showSave(){
			this.tochild = true
		},
		//弹窗消失
		toScore(val){
			this.tochild = val
			console.log('弹窗消失')
		},
		//登录弹窗
		emitwindowShow(val){
			this.showloginWindow = val
		},
		//登录弹窗登录成功后再次请求成绩
		requestAgain(val){
			this[val].apply(this)
		},
		//选择学年学期
		bindChange (e) {
			this.scoreList = []
			let timer = setInterval(() => {
				const val = e.detail.value
				this.Year = this.schoolYear[val[0]]
				this.schoolSemester = this.semester[val[1]]
				this.selectCourse = this.Course[val[2]]
				clearInterval(timer)
			}, 1)
			
		},
		//获取成绩
		getScore(){
			let data = {		
				"xnxqdm": ""
			}
			let userInfoYear = ''
			if(getCache('userInfo')){
				userInfoYear = getCache('userInfo').Year
				this.service.school.getScores(data).then(res => {
				if(getCache('username')){
					let storagescore = new scoreList(res.info,this.Year,this.schoolSemester,this.selectCourse,userInfoYear).getscore()//全部的成绩
					setCache('score',storagescore)
					this.watchCache = getCache('score')
					uni.stopPullDownRefresh();
				}else if(this.flat === 1){
						this.flat = 0
						uni.navigateTo({
						url:'/pages/login/login'
					})
				}
				}).catch(err => {
				if(err.code === 1006){
					if(getCache('username')){
						this.showloginWindow = true;
						uni.stopPullDownRefresh();
					}else if(this.flat === 1){
						this.flat = 0
						uni.navigateTo({
							url:'/pages/login/login'
						})
					}
				}
				uni.hideLoading()
				})
				}else if(this.flat === 1){
					this.flat = 0
					uni.stopPullDownRefresh();
					setTimeout(()=>{
						uni.showToast({
							title: '您还未登录',
							duration:2000,
							icon:'error',
							success:(res =>{
								setTimeout(()=>{
									uni.navigateTo({
									url:'/pages/login/login'
								})
								},400)
							})
						})
					},400)
				}
		},
		//得到成绩结果并存缓存
		watchScore(){
			let userInfoYear = getCache('userInfo').year
			let score = getCache('score')
			this.scoreList = new scoreList(score,this.Year,this.schoolSemester,this.selectCourse,userInfoYear).getStoragescore(this).scoreFilter//筛选出来的
			this.scoreList.forEach(element => {
				setTimeout(() => {
					element.screenshow = false
				}, 50)	
			});
			this.averageScore = new scoreList(score,this.Year,this.schoolSemester,this.selectCourse,userInfoYear).getStoragescore(this).average
			let echartsArr = new scoreList(score,this.Year,this.schoolSemester,this.selectCourse,userInfoYear).getStoragescore(this).echartsValue
			for(let i = 0;i<echartsArr.length;i++){
				this.chartData.series[0].data[i].value = echartsArr[i]
			}
			let requestSave = {
				"title": getCache('userInfo').name + '成绩单',
				"subTitle": this.Year == this.schoolSemester ? '全部成绩 ' +this.selectCourse : this.Year + this.schoolSemester+ ' ' +this.selectCourse,
				"gradeList": new scoreList(score,this.Year,this.schoolSemester,this.selectCourse,userInfoYear).getAxiosData(this),
				"averagePoint":this.averageScore
			}
			setCache('requestSave',requestSave)
		}
	},
	onShow(){
		if(getCache('score')){
			this.watchScore()
		}else{
			this.getScore()
		}


		if(getCache('openeye') === ''){
			this.openeye = '1'
		}else{
			this.openeye = getCache('openeye')
		}
	},
	created(){
		this.flat = 1
	},
	//下拉刷新
	onPullDownRefresh(){
		this.tochild = false
		this.flat = 1
		this.scoreList = []
		let timer = setInterval(()=>{
			this.getScore()
			clearInterval(timer)
		}, 1)
	},
	watch: {
		Year:'watchScore',
		schoolSemester:'watchScore',
		selectCourse:'watchScore',
		watchCache:'watchScore'
	},
}	
</script>
<style lang='scss' scoped>
.score{
	-webkit-transform: translate3d(0, 0, 0);
	-moz-transform: translate3d(0, 0, 0);
	-ms-transform: translate3d(0, 0, 0);
	transform: translate3d(0, 0, 0);
	overflow: hidden;
	position: relative;
	&::before,
	&::after{
		content:"";
		width: 4000rpx;
		height: 4000rpx;
		position: absolute;
		left: 50%;
		top: -1450rpx;
		transform: translate(-50%, 50%);
		z-index: 10;
	}
	&::after{
		border-radius: 47%;
		background: rgba(255, 255, 255, 0.5);
		animation: roll 8s linear infinite;
	}
	&::before{
		border-radius: 49%;
		background: rgba(255, 255, 255, 1);
		animation: roll 10s linear infinite;
	}
	@keyframes roll {
		100%{
			transform: translate(-50%, 50%) rotate(360deg);
		}
	}
	&-header{
		background: rgb(54,207,201);
		position: relative;
		&-text{
			position: absolute;
			color: #fff;
			font-weight: 300;
			font-size: 20px;
			left: 50%;
			top:15%;
			transform: translateX(-50%);
			&--icon{
				color:#fff;
				position: absolute;
				left: 62%;
				top:15%;
			}
		}
		&-number{
			position: absolute;
			color: #fff;
			font-weight: 400;
			font-size: 50px;
			left: 50%;
			top:25%;
			transform: translateX(-50%);
		}
		&-picker{
			&-view{
				width: 100%;
        height: 300rpx;
        margin-top:200rpx;
			}
			&-item{
				line-height: 100rpx;
        text-align: center;
				// color: rgb(233, 233, 233);
				color: rgba(255,255,255,0.3)
			}
			&-img{
				width:22px;
				height: 22px;
				margin-left: 93%;
				margin-top: 5px;
			}
		}
	}
	&-detail{
		position: relative;
		z-index: 100;
		background-color: #fff;
		padding: 20px 0;
		min-height: 600rpx;
		&-title{
			border: 1px solid rgb(54,207,201);
			background: rgb(181,245,236);
			color: rgb(54,207,201);
			border-radius: 0 1rem 1rem 0;
			display: flex;
			align-items: center;
			justify-content: center;
			width: 80px;
			height: 30px;
			font-weight: 800;
		}
		&-course-head{
			display: flex;
			margin-left: 15rpx;
			margin-right: 15rpx;
			margin-top: 10px;
			padding-left: 17.5rpx;
			padding-right: 17.5rpx;
			color: rgb(92, 92, 92);
			font-weight: 400;
			margin-bottom: 10px;
			&__name{
				width: 250px;
			}
			&__score{
				text-align: center;
				width: 85px;
			}
			&__xf{
				text-align: center;
				width: 50px;
			}
		}
		&-course-main{
			display: flex;
			margin: 15rpx 15rpx 15rpx 15rpx;
			padding-right: 20rpx;
			text-emphasis: none;
			height: 50px;
			line-height: 20px;
			// background: rgb(255,192,105);
			color:#fff;
			font-weight: 400;
			align-items: center;
			border-radius: 0.5rem;
			transition: transform 0.5s linear;
			// transform: translateX(400rpx);
			&--show{
				transform: translateX(-102%);
			}
			&__name{
				width: 250px;
				white-space: nowrap;
				overflow: hidden;
				text-overflow: ellipsis;
				margin-left: 22.5rpx;
			}
			&__score{
				text-align: center;
				width: 85px;;
			}
			&__xf{
				text-align: center;
				width: 50px;
			}
		}
	}
	&-analysis{
		height: 400px;
		position: relative;
		z-index: 101;
		&-charts-box{
			margin-top: 30px;
			width: 100%;
			height:300px;
		}
	}
}
.pickerSelected{
	color:#fff
}
</style>