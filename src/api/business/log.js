import request from '@/utils/request'


export function getLog() {
    return request({
        url: 'apis/unit/runLog/',
        method: 'get',
    })
}