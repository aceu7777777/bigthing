<template>
<el-card class="box-card">
    <div slot="header" class="clearfix">
    <span>更换头像</span>
    </div>
    <div>
    <!-- 图片，用来展示用户选择的头像 -->
    <img class="the_img" v-if="!this.avatar" src="../../assets/images/avatar.jpg" alt="" />
    <img class="the_img" v-else :src="this.avatar" alt="">
    <!-- 按钮区域 -->
    <div class="btn-box">
        <input type="file" accept="image/*" style="display: none" ref="iptRef" @change="onFileChange" />
        <el-button type="primary" icon="el-icon-plus" @click="chooseImg">选择图片</el-button>
        <el-button type="success" icon="el-icon-upload" :disabled="avatar === ''"
        @click="uploadFn"
        >上传头像</el-button>
    </div>
    </div>
</el-card>
</template>
<script>
import { updateAvatarAPI } from "@/api/index";
export default {
name: 'UserAvatar',
data () {
    return {
    avatar: ''
    }
    
},
methods: {
    // 选择图片->点击事件->让选择框出现
    chooseImg () {
    // 模拟点击行为
    this.$refs.iptRef.click()
    },
    // 在选择框中选择图片后触发的改变事件
    onFileChange (e) {
    // 获取用户选择的文件列表（伪数组）
    const files = e.target.files
    if (files.length === 0) {
        // 没有选择图片
        this.avatar = ''
    } else {
        // 选择了图片
        //console.log(files[0])
        //这里只是拿到了图片  我们想要展示图片 不能直接展示
        //因为前端图片img标签的src值 只能是图片的连接地址（外连接是http什么的  还有图片文件的路径）
        //                               和base64字符穿   这里要把图片文件转成base64字符串

        //解决方案1. 把这个文件转换成临时地址  （不能发送给后台）
        //语法：URL.createObjectURL（）
       // this.avatar=URL.createObjectURL(files[0])
        //console.log(this.avatar)

        //解决方案2. 把文件转换成base64字符串  可以传给后台
        // 1. 创建 FileReader 对象
        const fr = new FileReader()
        // 2. 调用 readAsDataURL 函数，读取文件内容  
        //读成base64字符串 
        fr.readAsDataURL(files[0])
        // 3. 监听 fr 的 onload 事件 这个事件是在读取完之后执行的
        fr.onload = e => {//这些都是固定的
        // 4. 通过 e.target.result 获取到读取的结果，值是字符串（base64 格式的字符串）
        this.avatar = e.target.result
        console.log(this.avatar)
        }
        }
    },
    //上传图片 调接口
    async uploadFn(){
        const { data: res }=await updateAvatarAPI(this.avatar)
        //更换失败
        if(res.code!=0){
            return this.$message.error(res.message)
        }
        //成功  此时只是后台更换成功 页面还没有把vuex里的东西修改
        this.$message.success(res.message)
        //立刻让vuex 里获取用户信息的actions 再请求一次后台  更新vuex里的值
        this.$store.dispatch('initUserInfo')
        
    }

}
}
</script>
<style lang="less" scoped>
.btn-box {
margin-top: 10px;
}
.preview {
object-fit: cover;
}
.the_img{
    width: 350px;
    height: 350px;
}
</style>