import request from '@/utils/request'

// 登录方法
export function login(username,password) {
    const data = {
        username,
        password
    }
    return request({
        url: 'user/login',
        method: 'post',
        data: data
    })
}

// 退出方法
export function logout() {
    return request({
        url: 'user/logout',
        method: 'post'
    })
}

// 选择项目
export function selectProject(projectId) {
    const data = {
        projectId :projectId
    }
    return request({
        url: 'user/project',
        method: 'post',
        data: data
    })
}




