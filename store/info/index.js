import User from '../utils/User'
const info = {
  state: {
    // 用户信息
    userInfo: {}
  },
  getters: {
    // 返回用户信息
    getUserinfo: state => {
      return state.userInfo
    }
  },
  mutations: {
    // 设置用户信息
    setUserinfo(state, data){
      state.userInfo = new User(data)
    }
  }
}

export default info