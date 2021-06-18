import request from '@/utils/request'

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