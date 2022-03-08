<script>
// import request from './service/login-service'
import { getCache, setCache } from 'utils/index'
export default {
  created () {
    
  },
  onShow(){
    let userInfo = getCache('userInfo')
    if(userInfo){
      if(!userInfo.school){
        userInfo.school = getCache('school') || 1
        setCache('userInfo', userInfo)
      }
      this.$store.commit('setUserinfo', userInfo)
    }else{
      this.$store.commit('setUserinfo', {})
    }
    for(let i = 0; i <= 7; i ++){
      uni.removeStorage({
        key: 'func' + i
      })
    }
  },
}
</script>
<style>
	/*每个页面可用的公共css */
	@import "assets/css/base.css";
  @import "assets/icon/iconfont.css";
</style>
