import {login, logout, selectProject} from "@/api/system/user";
import {getToken, removeToken, setToken} from "@/utils/auth";

const user = {
    state: {
        token: getToken(),
        name: '',
        roles: [],
        permissions: [],
        project: '',
    },

    mutations: {
        SET_TOKEN: (state, token) => {
            state.token = token
        },
        SET_NAME: (state, name) => {
            state.name = name
        },
        SET_ROLES: (state, roles) => {
            state.roles = roles
        },
        SET_PERMISSIONS: (state, permissions) => {
            state.permissions = permissions
        },
        SET_PROJECT: (state, project) => {
            state.project = project
        }
    },

    actions: {
        // 登录
        Login({commit}, userInfo) {
            const username = userInfo.username.trim()
            const password = userInfo.password
            return new Promise((resolve, reject) => {
                login(username, password).then(res => {
                    setToken(res.data.token)
                    commit('SET_TOKEN', res.data)
                    resolve()
                }).catch(error => {
                    reject(error.response.data.msg)
                })
            })
        },

        // 退出系统
        LogOut({commit}) {
            return new Promise((resolve, reject) => {
                logout().then(() => {
                    commit('SET_TOKEN', '')
                    commit('SET_ROLES', [])
                    commit('SET_PERMISSIONS', [])
                    removeToken()
                    resolve()
                }).catch(error => {
                    reject(error)
                })
            })
        },

        // 选择项目
        SelectProject({commit}, projectId) {
            return new Promise(
                (resolve, reject) => {
                    selectProject(projectId).then(() => {
                        commit('SET_PROJECT', projectId)
                        resolve()
                    }).catch(error => {
                        reject(error)
                    })
                }
            )
        }
    }
}

export default user