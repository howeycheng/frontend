import request from "@/utils/request";

export function getScene(reqId) {
    const params = {
        'reqId': reqId
    }
    return request({
        url: 'apis/unit/scene/',
        method: 'get',
        params: params
    })
}

export function addScene(name, reqId) {
    const data = {
        'name': name,
        'reqId': reqId,
    }
    return request({
        url: 'apis/unit/scene/',
        method: 'post',
        data: data
    })
}

export function delScene(id) {
    const data = {
        'id': id,
    }
    return request({
        url: 'apis/unit/scene/',
        method: 'delete',
        data: data
    })
}

export function getSceneComponents(sceneId) {
    const params = {
        'sceneId': sceneId
    }
    return request({
        url: 'apis/unit/scene/components/',
        method: 'get',
        params: params
    })
}