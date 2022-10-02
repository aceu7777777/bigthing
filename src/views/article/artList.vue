<template>
<div>
    <el-card class="box-card">
    <div slot="header" class="clearfix">
        <span>文章列表</span>
    </div>
    <!-- 搜索区域 -->
    <div class="search-box">
        <el-form :inline="true" :model="q">
        <el-form-item label="文章分类">
            <el-select v-model="q.cate_id" placeholder="请选择分类" size="small">
            <!-- 循环渲染分类的可选项 -->
            <el-option :label="item.cate_name" :value="item.id" v-for="item in cateList" :key="item.id">
            </el-option>
            </el-select>
        </el-form-item>
        <el-form-item label="发布状态" style="margin-left: 15px;">
            <el-select v-model="q.state" placeholder="请选择状态" size="small">
            <el-option label="已发布" value="已发布" ></el-option>
            <el-option label="草稿" value="草稿" ></el-option>
            </el-select>
        </el-form-item>
        <el-form-item>
            <el-button type="primary" size="small" @click="choseFn">筛选</el-button>
            <el-button type="info" size="small"  @click="reFn">重置</el-button>
        </el-form-item>
        </el-form>
        <!-- 发表文章的按钮 -->
        <el-button type="primary" size="small" class="btn-pub"
        @click="showPubDialogFn"
        >发表文章</el-button>
    </div>
    <!-- 文章表格区域 -->
    <el-table :data="artList" style="width: 100%;" border stripe>
    <el-table-column label="文章标题">
    <template v-slot="{ row }">
        <el-link type="primary" @click="showDetailFn(row.id)">{{ row.title }}</el-link>
    </template> 
    </el-table-column>
    <el-table-column label="分类" prop="cate_name"></el-table-column>
    <el-table-column label="发表时间" >{{this.time}}</el-table-column>
    <el-table-column label="状态" prop="state"></el-table-column>
    <el-table-column label="操作"></el-table-column>
    </el-table>
    <!-- 发表文章的 Dialog 对话框 -->
    <el-dialog title="发表文章" :visible.sync="pubDialogVisible" fullscreen :before-close="handleClose"
    @closed="onDialogClosedFn">
        <!-- 发布文章的对话框 -->
        <el-form :model="pubForm" :rules="pubFormRules" ref="pubFormRef" label-width="100px">
        <el-form-item label="文章标题" prop="title">
            <el-input v-model="pubForm.title" placeholder="请输入标题"></el-input>
        </el-form-item>
        <el-form-item label="文章分类" prop="cate_id">
        <el-select v-model="pubForm.cate_id" placeholder="请选择分类" style="width: 100%;">
            <!-- 循环渲染分类的可选项 -->
            <el-option :label="item.cate_name" :value="item.id" v-for="item in cateList" :key="item.id">
            </el-option>
        </el-select>
        </el-form-item>
        <el-form-item label="文章内容"  prop="content">
        <!-- 使用 v-model 进行双向的数据绑定 -->
        <quill-editor v-model="pubForm.content"></quill-editor>
        </el-form-item>
        <el-form-item label="文章封面">
            <!-- 用来显示封面的图片 -->
            <img src="../../assets/images/cover.jpg" alt="" class="cover-img" ref="imgRef" />
            <br />
            <!-- 文件选择框，默认被隐藏 -->
            <input type="file" style="display: none;" accept="image/*" ref="iptFileRef" @change="onCoverChangeFn"/>
            <!-- 选择封面的按钮 -->
            <el-button type="text" @click="chooseImgFn">+ 选择封面</el-button>
            </el-form-item>
            <el-form-item>
                <el-button type="primary" @click="pubArticleFn('已发布')">发布</el-button>
                <el-button type="info" @click="pubArticleFn('草稿')">存为草稿</el-button>
            </el-form-item>
        </el-form>
    </el-dialog>
    <!-- 文章表格区域 -->
    <!-- 分页区域 -->
    <el-pagination
    @size-change="handleSizeChangeFn"
    @current-change="handleCurrentChangeFn"
    :current-page.sync="q.pagenum"
    :page-sizes="[2, 3, 5, 10]"
    :page-size.sync="q.pagesize"
    layout="total, sizes, prev, pager, next, jumper"
    :total="total"
    >
    </el-pagination>
    <!-- 查看文章详情的对话框 -->
    <!-- 查看文章详情的对话框 -->
    <el-dialog title="文章预览" :visible.sync="detailVisible" width="80%">
    <h1 class="title">{{ artDetail.title }}</h1>

    <div class="info">
        <span>作者：{{ artDetail.nickname || artDetail.username }}</span>
        <span>发布时间：{{ this.time }}</span>
        <span>所属分类：{{ artDetail.cate_name }}</span>
        <span>状态：{{ artDetail.state }}</span>
    </div>
        
    <!-- 分割线 -->
    <el-divider></el-divider>
    <!--  需要注意的点 -->
    <!-- 文章的封面 -->
    <img :src=" 'http://big-event-vue-api-t.itheima.net' + artDetail.cover_img" alt="" />
    <!--需要注意的点-->
    <!-- 文章的详情 -->
    <div v-html="artDetail.content" class="detail-box"></div>
    </el-dialog>
    </el-card>

</div>
</template>
<script>
import { getArtCateListAPI,uploadArticleAPI,getArticleListAPI,getArticleDetailFn } from "@/api";
import defaultImg from '@/assets/images/cover.jpg'
import dayjs from 'dayjs'
export default {
name: 'ArtList',
data() {
    return {
    pubDialogVisible: false, // 控制发表文章对话框的显示与隐藏
    // 查询参数对象
    q: {
        pagenum: 1,// 现在 是第几页
        pagesize: 2,//每页多少条
        cate_id: '',
        state: ''
    },
    cateList: [], // 文章分类
    // ...其他
    pubForm: { // 表单的数据对象
        title: '',
        cate_id: '',
        content: '', // 文章的内容
        cover_img: null, // 用户选择的封面图片（null 表示没有选择任何封面） 是个文件
        state: '' // 文章的发布状态，可选值有两个：草稿、已发布
    },
    artList: [], // 文章的列表数据
    total: 0 ,// 总数据条数
    detailVisible: false, // 控制文章详情对话框的显示与隐藏
    artDetail: {}, // 文章的详情信息对象
    pubFormRules: { // 表单的验证规则对象
        title: [
            { required: true, message: '请输入文章标题', trigger: 'blur' },
            { min: 1, max: 30, message: '文章标题的长度为1-30个字符', trigger: 'blur' }
    ],
        cate_id: [{ required: true, message: '请选择文章标题', trigger: 'change' }],
        content: [
            { required: true, message: '请输入文章内容', trigger: 'blur' }
    ],
    }
    }
},
methods: {
    // 发表文章按钮->点击事件->让添加文章对话框出现
    showPubDialogFn () {
        this.pubDialogVisible = true
    },
    // 对话框关闭前的回调
    async handleClose (done) {
        // 询问用户是否确认关闭对话框
        const confirmResult = await this.$confirm('此操作将导致文章信息丢失, 是否继续?', '提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning'
        }).catch(err => err)
    
        // 取消了关闭-阻止住, 什么都不干
        if (confirmResult === 'cancel') return
        // 确认关闭
        done()
    },
    // 初始化文章分类的列表数据
    async initCateList() {
    const { data: res } = await getArtCateListAPI()
    if (res.code === 0) {
        this.cateList = res.data
    }
    },
    chooseImgFn() {
    this.$refs.iptFileRef.click()
    },
    // 封面选择改变的事件
    onCoverChangeFn (e) {
    // 获取用户选择的文件列表
    const files = e.target.files
    if (files.length === 0) {
        // 用户没有选择封面
        this.pubForm.cover_img = null
        //this.$refs.imgRef.setAttribute('src', defaultImg)
    } else {
        // 用户选择了封面  后台要的是文件
        this.pubForm.cover_img = files[0]
        const url = URL.createObjectURL(files[0])
        this.$refs.imgRef.setAttribute('src', url)
    }
},
// 发布文章或草稿-按钮点击事件
pubArticleFn (state) {
    // 1. 设置发布状态
    this.pubForm.state = state
    // 2. 表单预校验
    this.$refs.pubFormRef.validate(async valid => {
        if (!valid) return this.$message.error('请完善文章信息！')
        // 3. 判断是否提供了文章封面  校验封面
        if (!this.pubForm.cover_img) return this.$message.error('请选择文章封面！')
        // 4. TODO：发布文章
        //console.log(this.pubForm)
        // 创建 FormData 对象
        const fd = new FormData()

        // 向 FormData 中追加数据
        Object.keys(this.pubForm).forEach((key) => {
            fd.append(key, this.pubForm[key])
        })

        // 发起请求
        const { data: res } = await uploadArticleAPI(fd)
        if (res.code !== 0) return this.$message.error('发布文章失败！')
        this.$message.success('发布文章成功！')
        //console.log(res)
        // 关闭对话框
        this.pubDialogVisible = false
        // TODO：刷新文章列表数据
        // TODO：刷新文章列表数据
        this.initArtListFn()
    })  
},
// 对话框完全关闭之后的处理函数
onDialogClosedFn () {
    // 清空关键数据
    this.$refs.pubFormRef.resetFields()
    // 因为这个变量对应的标签不是表单绑定的, 所以需要单独控制
    //this.pubForm.content = ''
    this.$refs.imgRef.setAttribute('src', defaultImg)
},
// 初始化文章列表
async initArtListFn () {
    const { data: res } = await getArticleListAPI(this.q)

    if (res.code !== 0) return this.$message.error('获取文章列表失败!')
    this.artList = res.data
    this.total = res.total
},
// pageSize 发生了变化 一页里有几条
//也就是 每页条数改变时触发可选[2, 3, 5, 10]
//核心思想： 改变每页有几条newSize 最终改变的是q里的pagesize（每页多少条）  然后再发一次请求（pagesize是参数）
handleSizeChangeFn (newSize) {
    // 为 pagesize 赋值
    this.q.pagesize = newSize
    // 默认展示第一页数据 让现在是第一页
    this.q.pagenum = 1
    // 重新发起请求
    this.initArtListFn()
},
// 页码值发生了变化  跳页的时候
handleCurrentChangeFn(newPage) {
  // 为页码值赋值
    this.q.pagenum = newPage
  // 重新发起请求
    this.initArtListFn()
},
//筛选按钮
choseFn(){
    this.pagenum=1
    this.pagesize=2
    // 重新发起请求
    this.initArtListFn()
},
//重置按钮
reFn(){
    this.q.pagenum=1
    this.q.pagesize=2
    this.q.cate_id= ''
    this.q.state= ''//让上面绑定的值为空
    // 重新发起请求
    this.initArtListFn()
},
// 获取文章详情
async showDetailFn (id) {
    const { data: res } = await getArticleDetailFn(id)
    if (res.code !== 0) return this.$message.error('获取文章详情失败!')
    this.artDetail = res.data
    // 展示对话框
    this.detailVisible = true
}

},
created() {
    this.initCateList()
     // 获取-文章列表
    this.initArtListFn()
},
computed: {
    time(){
        return dayjs(this.artList.pub_date).format('YYYY-MM-DD HH:mm:ss')
    }
},
}
</script>
<style lang="less" scoped>
.search-box {
display: flex;
justify-content: space-between;
align-items: flex-start;
.btn-pub {
    margin-top: 5px;
}
}
// 设置富文本编辑器的默认最小高度
// ::v-deep作用: 穿透选择, 正常style上加了scope的话, 会给.ql-editor[data-v-hash]属性, 只能选择当前页面标签或者组件的根标签
// 如果想要选择组件内的标签(那些标签没有data-v-hash值)所以正常选择选不中, 加了::v-deep空格前置的话, 选择器就会变成如下形式
// [data-v-hash] .ql-editor 这样就能选中组件内的标签的class类名了
::v-deep .ql-editor {
    min-height: 300px;
}
// 设置图片封面的宽高
.cover-img {
    width: 400px;
    height: 280px;
    object-fit: cover;
}
.el-pagination {
    margin-top: 15px;
}
.title {
font-size: 24px;
text-align: center;
font-weight: normal;
color: #000;
margin: 0 0 10px 0;
}
.info {
font-size: 12px;
span {
    margin-right: 20px;
}
}
// 修改 dialog 内部元素的样式，需要添加样式穿透
::v-deep .detail-box {
img {
    width: 500px;
}
}
</style>