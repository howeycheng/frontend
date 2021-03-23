import request from '@/utils/request'

export function getSets(setId){
    const params = {
        'id' : setId
    }
    return request({
        url: 'apis/unit/set/',
        method: 'get',
        params: params
    })
}

export function getCasesOfSet(params){
    return request({
        url: 'apis/unit/reqOfCase/',
        method:'get',
        params: params
    })
}

export function getCasesOfReqInSet(params){
    return request({
        url: 'apis/unit/casesToRun/',
        method:'get',
        params: params
    })
}

