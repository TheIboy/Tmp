<template>
	<view>
    <!-- 登录弹窗 -->
		<login-window v-if="showloginWindow" @loginwindowShow = 'emitwindowShow' @requestAgain = 'requestAgain' sureback = "handleExam"/>
    <!--  成绩缓存 -->
		<view class="exam__card">
      <view class="exam__card__box" v-for="(item,index) in examItem.array" :key="index">
        <view  class="exam__card__box__tag" 
          :value="handleTime(item.ksrq)"
          :class="{'exam__card__box__tag--active': tag.tagText>0 || tag.tagText === 0 ,'exam__card__box__tag--state':tag.tagText<0}">
          <template v-if="tag.tagText>0">
            剩{{tag.tagText}}天
          </template>
          <template v-else-if="tag.tagText<0">
            已结束
          </template>
          <template v-else-if="tag.tagText == 0">
            今天
          </template>
        </view>
        <view class="exam__card__box__title font--size--base">{{item.kcmc}}</view>
        <view class="exam__card__box__msg">
          <view class="exam__card__box__msg__icon">
            <img class="exam__card__box__msg__icon__img" :src="imgUrl.src1" alt="">
          </view>
          <view class="exam__card__box__msg--time font--size--sm">{{item.ksrq}},{{item.kssj}}</view>
        </view>
        <view class="exam__card__box__msg">
          <view class="exam__card__box__msg__icon">
            <img class="exam__card__box__msg__icon__img" :src="imgUrl.src2" alt="">
          </view>
          <view class="exam__card__box__msg--time font--size--sm">{{item.kscdmc}}</view>
        </view>
        <view class="exam__card__box__msg">
          <view class="exam__card__box__msg__icon">
            <img class="exam__card__box__msg__icon__img" :src="imgUrl.src3" alt="">
          </view>
          <view class="exam__card__box__msg--time font--size--sm">{{item.ksaplxmc}}</view>
        </view>
        <view class="exam__card__box__msg">
          <view class="exam__card__box__msg__icon">
            <img class="exam__card__box__msg__icon__img" :src="imgUrl.src4" alt="">
          </view>
          <view class="exam__card__box__msg--time font--size--sm">{{item.jkteaxms}}</view>
        </view>
      </view> 
    </view>
	</view>
</template>

<script>
import { baseUrlApi } from 'utils/api';
import { examItem } from '../utils/examClass';
import { getCache } from 'utils/index';
import { setCache } from 'utils/index';
import loginWindow from 'components/loginwindow/loginWindow.vue'
import 'utils/Format';
export default {
  name:'ExamCard',
  props:['xnxqdm'],
  components: { loginWindow },
  data(){
    return{
      // 考试列表
      examItem:[],
      // 判断是否考试结束
      isday:'',
      //获取实时时间
      nowTime: new Date(),
      // tag状态标签
      tag:{
        tagText:0,
      },
      // 图片地址
      imgUrl:{
        src1: baseUrlApi+"icon/img/日期.png",
        src2: baseUrlApi+"icon/img/位置标记.png",
        src3: baseUrlApi+"icon/img/信息.png",
        src4: baseUrlApi+"icon/img/学士帽.png",
      },
      // 背景显示
      isshow:true,
      // tag显示
      tagShow:'',
      // 显示登录验证码
      showloginWindow:false,
      service: this.$store.state.info.userInfo.service
    }
  },
  created(){
		this.checkCache();
  },
  methods:{
    emitwindowShow(val){
			this.showloginWindow = val
		},
		requestAgain(val){
			this[val].apply(this)
		},
    // 获取请求
    handleExam(newName){
      let requestData = {
        xnxqdm:newName,
      };
      this.service.school.getExam(requestData).then(res =>{
        if(res.info.length == 0){
          uni.showLoading({
            title: '暂无考试安排',
            duration:1000
          });
          uni.removeStorageSync('examItem');
          this.examItem = [];
          this.$emit('mul-time','选择学期')
          this.$emit('is-show',true)
        }else{
          this.examItem =  new examItem(res.info);
          setCache('examItem',this.examItem);
        }
      }).catch(err => {
        if(err.code === 1006){
					if(getCache('username')){
						this.showloginWindow = true;
					}else{
						uni.navigateTo({
							url:'/pages/login/login'
						})
					}
        }
      })
    },
    //检测考试时间
    handleTime(ksrq){
      let myksrq =ksrq;
      let nowTime = new Date().Format('yyyy-MM-dd').split('-');
      let examTime = new Date(myksrq).Format('yyyy-MM-dd').split('-');
      let newNowTime = new Date(nowTime[0],nowTime[1],nowTime[2]);
      let newExamTime = new Date(examTime[0],examTime[1],examTime[2]);
      let toExamTime = (newExamTime-newNowTime)/(24*60*60*1000);
      this.tag.tagText = toExamTime;
    },
    // 检查缓存
		checkCache(){
      if(getCache('examItem').length !== 0){
        this.examItem = getCache('examItem');
      }
		}
  },
  watch:{
    xnxqdm(newName, oldName) {
      this.handleExam(newName)
      this.$emit('is-show',false)
		}
  }
}
</script>

<style lang="scss" scoped>
  .font--size--sm{
    font-size: 30rpx;
  }
  .font--size--base{
    font-size: 32rpx;
  }
  .exam__card{
    &__box{
      background-color: #fff;
      position: relative;
      width: 640rpx;
      margin: 10px auto;
      // height: 150px;
      border-radius: 15px;
      padding: 10px 20px;
      &__tag{
        position: absolute;
        right: 20rpx;
        top: 10px;
        height: 25px;
        line-height: 25px;
        width: 60px;
        border-radius: 5px;
        font-size: 24rpx;
        text-align: center;
        color: #fff;
      }
      &__tag--state{
        background-color: rgb(157, 157, 157);  
      }
      &__tag--active{
        background-color: rgb(243, 192, 23);
      }
      &__title{
        width: 70%;
        padding-top: 2px;
        white-space:nowrap;
        overflow:hidden;
        text-overflow:ellipsis;
      }
      &__msg{
        display: flex;
        margin-top: 10px;
        color: gray;
        &__icon{
          flex: 0 0 10;
          width: 15px;
          height: 15px;
          margin-right: 10px;
          &__img{
            width: 15px;
            height: 15px;
          }
        }
        &--time{
          flex: 1;
          height: 15px;
          line-height: 15px;
        }
      }
    }
  }
</style>

