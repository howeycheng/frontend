import request from '@/utils/request'


export function getComponents(componentId) {
    const params = {
        'id' : componentId
    }
    return request({
        url: 'apis/unit/components/',
        method: 'get',
        params: params
    })
}


export function getComponentScript(componentId) {
    const params = {
        'id' : componentId
    }
    return request({
        url: 'apis/unit/component/script',
        method: 'get',
        params: params
    })
}