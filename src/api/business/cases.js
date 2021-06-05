import request from '@/utils/request'

export function getSceneComp(rqid) {
    const params = {
        'rqid': rqid
    }
    return request({
        url: 'apis/unit/sceneDetail/',
        method: 'get',
        params: params
    })
}

export function getSceneCasesIo(rqid, comp_id) {
    const params = {
        'rqid': rqid,
        'comp_id': comp_id
    }
    return request({
        url: 'apis/unit/cases/edit/',
        method: 'get',
        params: params
    })
}