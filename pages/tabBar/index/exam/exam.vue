<template>
	<view class="exam">
		<!-- 学期选择器  -->
    <template>
      <view  class="exam__picker">
				<view class="exam__picker-all">
        <picker class="exam__picker-all__item"  mode="multiSelector" @change="MultiPickerChange" :value="mul.indexMulPicker" :range="mul.multiArray" :key="index">
          {{mul.array}}
        </picker>
				<img class="exam__picker-all__img" :src="baseUrlApi+'icon/img/右箭头bfbfbf.png'" alt="">
				</view>
      </view>
    </template>
    <!-- 学期选择器 -->
		<!-- 考试安排卡片 -->
		<examcard :xnxqdm="mul.xnxqdm" @is-show="show" @mul-time="multime"></examcard>
		<!-- 考试安排卡片 -->
		<img class="exam__bgc__image" v-if="isshow" :src="bgcImg" alt="">
    <view class="exam__bgc__text" v-if="isshow">请选择学期获取考试安排</view>
	</view>
</template>

<script>
import { baseUrlApi } from 'utils/api';
import examcard from './examcard/examcard.vue';
import { getCache } from 'utils/index';
import { setCache } from 'utils/index';

export default {
  components: { examcard },
	name:'Exam',
	data(){
		return{
			// 学期选择器
			baseUrlApi:baseUrlApi,
			mul:{
				multiArray: [],
				indexMulPicker: [3, 1],
				array:'选择学期',
				xnxqdm: "",
				multiArr:[],
				multixq:["1","2"]
			},
			// 背景是否展示
      isshow:true,
			bgcImg:baseUrlApi+'icon/图片/成绩.png',
		}	
	},
	created(){
		this.setTime();
		this.checkCache();
	},
	methods:{
		// 日期
		setTime(){
			let date = new Date().getFullYear();
			for(let i = -4 ; i<=4 ;i++){
				this.mul.multiArr.push(Number(date+i)+'-'+Number(date+i+1)) 
			}
			this.mul.multiArray.push(this.mul.multiArr);
			this.mul.multiArray.push(this.mul.multixq);
		},
		// 学期选择器
		MultiPickerChange(e){
			this.mul.xnxqdm = this.mul.multiArray[0][e.mp.detail.value[0]] + '-' + this.mul.multiArray[1][e.mp.detail.value[1]];
			this.mul.array = this.mul.xnxqdm+'学期';
			setCache('mularray',this.mul.array);
		},
		// 判断选择是否有课
		multime(data){
			this.mul.array = data
		},
		// 显示背景图片
		show(data){
			this.isshow = data
		},
		// 获取缓存日期
		checkCache(){
			if(getCache('examItem').length !== 0){
        this.mul.array = getCache('mularray');
				this.isshow =false;
      }else{
				this.isshow =true;
			}
		}
	}
}
</script>

<style lang="scss" scoped>
.exam{
	background-color: rgb(246, 246, 246);
	height: 100vh;
	&__picker{
		height: 80rpx;
    line-height: 80rpx;
    width: 100%;background-color: #fff;
		&-all{
			margin: 0 auto;
			width: 300rpx;
			display: flex;
			justify-content: center;
			&__item{
				font-size: 32rpx;
			}
			&__img{
				width: 20px;
				height: 20px;
				transform: rotate(90deg);
				position: relative;
				top: 50%; /*偏移*/
				margin-top: 10px; 
			}
		}
	}
	&__bgc__image{
		width: 100%;
    height: 60vh;
	}
	&__bgc__text{
    font-size: 14px;
    text-align: center;
    margin: 0 auto;
	}
}

</style>

