import request from '@/utils/request'

// 获取当前用户项目列表
export function getProjectList() {
    return request({
        url: 'user/project',
        method: 'get',
    })
}

// 获取当前用户项目列表
export function addProject(projectInfo) {
    return request({
        url: 'project/new',
        method: 'post',
        data: projectInfo
    })
}

export function delProject(project_id) {
    const data = {
        project_id : project_id
    }
    return request({
        url: 'project/one',
        method: 'delete',
        data: data
    })
}