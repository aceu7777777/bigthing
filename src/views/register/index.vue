<template>
<!-- 注册页面的整体盒子 -->
<div class="reg-container">
    <!-- 注册的盒子 -->
    <div class="reg-box">
    <!-- 标题的盒子 -->
    <div class="title-box"></div>
    <!-- 注册的表单区域 -->
    <el-form :model="regForm" :rules="regRules" ref="regRef">
    <!-- 用户名 -->
    <el-form-item prop="username">
        <el-input v-model="regForm.username" placeholder="请输入用户名"></el-input>
    </el-form-item>
    <!-- 密码 -->
    <el-form-item prop="password">
        <el-input v-model="regForm.password" type="password" placeholder="请输入密码"></el-input>
    </el-form-item>
    <!-- 确认密码 -->
    <el-form-item prop="repassword">
        <el-input v-model="regForm.repassword" type="password" placeholder="请再次确认密码"></el-input>
    </el-form-item>
    <el-form-item>
        <el-button type="primary" class="btn-reg" @click="regNewUserFn">注册</el-button>
        <el-link type="info" @click="$router.push('/login')">去登录</el-link>
    </el-form-item>
    </el-form>
    </div>
</div>
</template>

<script>
import { registerAPI } from "@/api/index"
export default {
data () {
    //全是对组件的分析使用
    //注意：必须在data里用这个函数 才能确保regform的使用
    const samePwd = (rule, value, callback) => {
    if (value !== this.regForm.password) {
        // 如果验证失败，则调用 回调函数时，指定一个 Error 对象。
        callback(new Error('两次输入的密码不一致!'))
    } else {
        // 如果验证成功，则直接调用 callback 回调函数即可。
        callback() 
    }
    }
    return {
    // 注册表单的数据对象
    regForm: {
        username: '',
        password: '',
        repassword: ''
    },
    // 注册表单的验证规则对象
    regRules: {
        username: [
        { required: true, message: '请输入用户名', trigger: 'blur' },
        {
            pattern: /^[a-zA-Z0-9]{1,10}$/,
            message: '用户名必须是1-10的大小写字母数字',
            trigger: 'blur'
        }
        ],
        password: [
        { required: true, message: '请输入密码', trigger: 'blur' },
        {
            pattern: /^\S{6,15}$/,
            message: '密码必须是6-15的非空字符',
            trigger: 'blur'
        }
        ],
        repassword: [
        { required: true, message: '请再次输入密码', trigger: 'blur' },
        { pattern: /^\S{6,15}$/, message: '密码必须是6-15的非空字符', trigger: 'blur' },
        { validator: samePwd, trigger: 'blur' }
        ]
    }
    }
},
methods: {
    //用js完成一个兜底校验
    regNewUserFn (){
        //先把这个表单拿出来
        //组件有个validate方法  这里就是组件里方法和属性的熟练应用应用
        this.$refs.regRef.validate(async valid =>{
            if(valid){
                //通过校验，拿到绑定数据 调用接口
                const res = await registerAPI(this.regForm)
                //console.log(res)
                //  注册失败，提示用户
                if (res.data.code !== 0) {
                    //必须加return 这样就不执行下面代码 下面成功的代码
                    //这里$message是组件里的方法 返回一个弹窗
                    return this.$message.error(res.message)
                }
                // 注册成功，提示用户
                this.$message.success(res.message)
                this.$router.push('/login')//跳转
            }else{
                return false //阻止默认的提交动作 （还没有校验呢就提交）  表单下面会红色提示自动出现
            }
            //看看拿到了什么内容
            //console.log(this.regForm)
            
        })
    }
},
}
</script>

<style lang="less" scoped>
.reg-container {
    background: url('../../assets/images/login_bg.jpg') center;
    background-size: cover;
    height: 960px;

    .reg-box {
    width: 400px;
    height: 335px;
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

    .btn-reg {
        width: 100%;
    }
}
}
</style>