import request from '@/utils/request'



export function getSceneCasesIo(reqId, compId) {
    const params = {
        'reqId': reqId,
        'compId': compId
    }
    return request({
        url: 'apis/unit/cases/edit/',
        method: 'get',
        params: params
    })
}