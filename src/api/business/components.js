import request from '@/utils/request'

// 获取组件
export function getComponents(componentId) {
    const params = {
        'id': componentId
    }
    return request({
        url: 'apis/unit/components/',
        method: 'get',
        params: params
    })
}

// 获取组件目录
export function addComponentDir(parentId, name, des, type) {
    const data = {
        'parentId': parentId,
        'name': name,
        'des': des,
        'type': type
    }
    return request({
        url: 'apis/unit/components/',
        method: 'post',
        data: data
    })
}

// 删除组件目录
export function delComponentDir(id) {
    const data = {
        'id': id
    }
    return request({
        url: 'apis/unit/components/',
        method: 'delete',
        data: data
    })
}

// 获取指定组件脚本
export function getComponentScript(componentId) {
    const params = {
        'id': componentId
    }
    return request({
        url: 'apis/unit/component/script',
        method: 'get',
        params: params
    })
}

// 增加组件脚本
export function addComponentScript(id, name, content) {
    const data = {
        'parentId': id,
        'name': name,
        'content': content
    }
    return request({
        url: 'apis/unit/component/script',
        method: 'post',
        data: data
    })
}
// 获取组件
export function getComponentParameters(componentId) {
    const params = {
        'id': componentId
    }
    return request({
        url: 'apis/unit/component/parameter',
        method: 'get',
        params: params
    })
}