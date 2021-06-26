import request from '@/utils/request'

export function getRequirements(rqid) {
    const params = {
        'rqid': rqid
    }
    return request({
        url: 'apis/unit/req/',
        method: 'get',
        params: params
    })
}

export function addRequirements(name,id) {
    const data = {
        'name': name,
        'id': id,
    }
    return request({
        url: 'apis/unit/req/',
        method: 'post',
        data: data
    })
}

export function delRequirements(id) {
    const data = {
        'id': id,
    }
    return request({
        url: 'apis/unit/req/',
        method: 'delete',
        data: data
    })
}