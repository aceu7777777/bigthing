import request from '@/utils/request'
import store from '@/store'
export const registerAPI = ({ username, password, repassword }) => {
    return request({
        url: '/api/reg',
        method: 'post',
        data: {
        username,
        password,
        repassword
        }
    })
}
export const loginAPI = ({ username, password }) => {
    return request({
        url: '/api/login',
        method: 'post',
        data: {
        username,
        password
        }
    })
}

export const getUserInfoAPI = () => {
    return request({
        url: '/my/userinfo',
        headers: {
            //这是js文件 不是vue组件中用store 不用this.$store.state.token
            //要用直接在上边引入
        Authorization:  store.state.token
    }
})
}
export const getMenusAPI = () => {
    return request({
        url: '/my/menus',
    //     headers: {
    //     Authorization: store.state.token
    // }
    })
}

export const updateUserInfoAPI = ({ id, email, nickname, user_pic, username }) => {
    return request({
        url: '/my/userinfo',
        method: 'PUT',
        headers: {
            Authorization: store.state.token
        },
        data: {
        id,
        email,
        nickname,
        user_pic,
        username
    }
    })
}

export const updateAvatarAPI = (avatar) => {
    return request({
        url: '/my/update/avatar',
        method: 'PATCH',
        data: {
        avatar
    },
    headers: {
        Authorization: store.state.token
    },
    })
}

export const getArtCateListAPI = () => {
    return request({
        url: '/my/cate/list',
        headers: {
            Authorization: store.state.token
        },
    })

}

export const addArtCateAPI = ({ cate_name, cate_alias }) => {
    return request({
        url: '/my/cate/add',
        method: 'POST',
        data: {
        cate_name,
        cate_alias
    },
    headers: {
        Authorization: store.state.token
    },
    })
}

export const updateArtCateAPI = ({ id, cate_name, cate_alias }) => {
    return request({
        url: '/my/cate/info',
        method: 'PUT',
        data: {
        id,
        cate_name,
        cate_alias
    },
    headers: {
        Authorization: store.state.token
    },
    
    })
}


export const delArtCateAPI = (id) => {
    return request({
        url: '/my/cate/del',
        method: 'DELETE',
        params: {
        id
    },
    headers: {
        Authorization: store.state.token
    },
    })
}


export const uploadArticleAPI = (fd) => {
    return request({
        url: '/my/article/add',
        method: 'POST',
        headers: {
            Authorization: store.state.token
        },
        data: fd // 参数要的是表单对象, 不能写普通对象, axios内部会判断, 如果是表单对象, 传递的请求体会设置Content-Type: form-data与后端对应
    })
}

export const getArticleListAPI = ({ pagenum, pagesize, cate_id, state }) => {
    return request({
        url: '/my/article/list',
        params: {
        pagenum,
        pagesize,
        cate_id,
        state
    },
    headers: {
        Authorization: store.state.token
    },
    })
}

export const getArticleDetailFn = (id) => {
    return request({
        url: '/my/article/info',
        params: {
        id
    },
    headers: {
        Authorization: store.state.token
    },
    })
}