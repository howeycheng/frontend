import request from '@/utils/request'


export function getSceneCasesIo(reqId, compId) {
    const params = {
        'reqId': reqId,
        'compId': compId
    }
    return request({
        url: 'apis/unit/cases/editor/',
        method: 'get',
        params: params
    })
}

export function updateSceneCasesIo(sceneId, casesData, componentsInfo) {
    const data = {
        'sceneId': sceneId,
        'casesData': casesData,
        'componentsInfo': componentsInfo,
    }
    return request({
        url: 'apis/unit/cases/editor/',
        method: 'post',
        data: data
    })
}