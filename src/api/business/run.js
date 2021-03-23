import request from '@/utils/request'

// 登录方法
export function run(setNames, runName, setId, runMode) {
    const data = {
        "setNames": setNames,
        "runName": runName,
        "setId": setId,
        "runMode": runMode
    }
    return request({
        url: 'apis/unit/run/',
        method: 'post',
        data: data
    })
}