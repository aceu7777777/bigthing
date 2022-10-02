import Vue from 'vue'
import Vuex from 'vuex'
import createPersistedState from 'vuex-persistedstate'
import { getUserInfoAPI } from '@/api'
Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    // 1. 用来存储登录成功之后，得到的 token
    token:'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MzU5OCwidXNlcm5hbWUiOiJ6c2hoIiwibmlja25hbWUiOiLotbDmnIjlhYnmspnmu6kiLCJlbWFpbCI6IjEyM0BxcS5jb20iLCJpYXQiOjE2NTcyODA4OTgsImV4cCI6MTY1NzMxNjg5OH0.FM2wxCI0SPcdcv7eAv5GM1QD7vWEZLTKG0inPeM0NbE',//取的时候默认值从本地去区
    userInfo: {
      id: 3598, 
      username: "zshh", 
      nickname: "", 
      email: "", 
      user_pic: null
    } // 定义用户信息对象
  },
  mutations: {
    // 2. 更新 token 的 mutation 函数
    updateToken (state, newToken) {
      state.token = newToken
      //console.log(state.token)
      //可以从这往浏览器本地存一份 localstorage  一个一个写会很麻烦
      //所以用了个插件帮助我们存
    },
    // 更新用户的信息
    updateUserInfo (state, info) {
      state.userInfo = info
    }
    
  },
  actions: {
    // 定义初始化用户基本信息的 action 函数
    async initUserInfo (store) {
      const { data: res } = await getUserInfoAPI()
      console.log(res)
      if (res.code === 0) {
        store.commit('updateUserInfo', res.data)
      }
    }
  },
  modules: {
  },
  getters: {
    nickname: state => state.userInfo.nickname, // 昵称
    username: state => state.userInfo.username, // 用户名
    user_pic: state => state.userInfo.user_pic // 用户头像
},
  plugins: [createPersistedState()]
})
//vuex默认保存在内存中，所以刷新时所有的值会回归初始化(无法做到永久储存)