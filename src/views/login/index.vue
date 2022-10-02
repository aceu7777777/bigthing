<template>
    <!-- 登录页面的整体盒子 -->
    <div class="login-container">
        <!-- 登录的盒子 -->
        <div class="login-box">
        <!-- 标题的盒子 -->
        <div class="title-box"></div>
        <!-- 登录的表单区域 -->
        <el-form :model="loginForm" :rules="loginRules" ref="loginRef">
            <!-- 用户名 -->
            <el-form-item prop="username">
            <el-input v-model="loginForm.username" placeholder="请输入用户名" maxlength="10" minlength="1"></el-input>
            </el-form-item>
            <!-- 密码 -->
            <el-form-item prop="password">
            <el-input
                v-model="loginForm.password"
                type="password"
                placeholder="请输入密码"
                maxlength="15"
                minlength="6"
            ></el-input>
            </el-form-item>
            <el-form-item>
            <el-button type="primary" class="btn-login" @click="loginFn">登录</el-button>
            <el-link type="info" @click="$router.push('/reg')">去注册</el-link>
            </el-form-item>
        </el-form>
        </div>
    </div>
</template>

<script>
import { loginAPI } from "@/api/index"

import { mapMutations } from 'vuex'//mapMutations用于映射mutations里的方法
export default {
data () {
    return {
    // 登录表单的数据对象
    loginForm: {
        username: '',
        password: ''
    },
    // 登录表单的验证规则对象
    loginRules: {
        username: [
        { required: true, message: '请输入用户名', trigger: 'blur' },
        { pattern: /^[a-zA-Z0-9]{1,10}$/, message: '用户名必须是1-10的字母数字', trigger: 'blur' }
        ],
        password: [
        { required: true, message: '请输入密码', trigger: 'blur' },
        { pattern: /^\S{6,15}$/, message: '密码必须是6-15', trigger: 'blur' }
        ]
    }
    }
},
methods: {
    ...mapMutations(['updateToken']),
    // 登录按钮->点击事件
    async loginFn () {
        this.$refs.loginRef.validate(async valid => {
        if (!valid) return
        // 1. 发起登录的请求
        const {data:res} = await loginAPI(this.loginForm)
        // 2. 登录失败
        //console.log(res)
        if (res.code !== 0) return this.$message.error(res.message)
        // 3. 登录成功
        this.$message.success(res.message)
        console.log(res.token)
        this.updateToken(res.token)
        //this.$store.commit('updateToken',res.token)
        // this.$router.push('/')
        })
        //成功后跳转
        this.$router.push('/')
        // 4. 保存到vuex中 
        //这样直接保存 当页面刷新 所有代码重新执行 vuex里的token值又清零了
        //想让他保存在浏览器本地

    }
}
}
</script>

<style lang="less" scoped>
.login-container {
    background: url('../../assets/images/login_bg.jpg') center;
    background-size: cover;
    height: 960px;

.login-box {
    width: 400px;
    height: 270px;
    background-color: #fff;
    border-radius: 3px;
    position: absolute;
    left: 50%;
    top: 50%;
    transform: translate(-50%, -50%);
    padding: 0 30px;
    box-sizing: border-box;

    .title-box {
        height: 60px;
        background: url('../../assets/images/login_title.png') center no-repeat;
    }

    .btn-login {
        width: 100%;
    }
}
}
</style>
