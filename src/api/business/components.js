import request from '@/utils/request'

// ��ȡ���
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

// ��ȡ���Ŀ¼
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

// ɾ�����Ŀ¼
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

// ��ȡָ������ű�
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

// ��������ű�
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
// ��ȡ���
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