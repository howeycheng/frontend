import Vue from 'vue'
import Router from 'vue-router'


import Login from '../components/Login'
import Cases from '../components/Cases'
import requirement from '../components/Requirement'
import run from '../components/Run'
import log from '../components/Log'
import manager from "../components/Manager";
import index from "../views/index"
import project from "@/components/Project";
import components from "@/components/Components";
import CasesEditor from "@/components/CasesEditor";

// 解决Uncaught (in promise) NavigationDuplicated {_name: “NavigationDuplicated”, name: "NavigationDuplic}的报错问题
const originalPush = Router.prototype.push
Router.prototype.push = function push(location) {
    return originalPush.call(this, location).catch(err => err)
}


Vue.use(Router);
export default new Router({
    mode: 'hash',
    routes: [
        {
            path: '/',
            name: 'index',
            component: index,
            redirect: 'manager',
            children: [
                {
                    path: '/manager',
                    name: 'manager',
                    component: manager
                },
                {
                    path: '/project',
                    name: 'project',
                    component: project,
                    children: [
                        {
                            path: '/requirement',
                            name: 'requirement',
                            component: requirement
                        },
                        {
                            path: '/run',
                            name: 'run',
                            component: run
                        },
                        {
                            path: '/log',
                            name: 'log',
                            component: log
                        },
                        {
                            path: '/components',
                            name: 'components',
                            component: components
                        }
                    ]
                }]
        },
        {
            path: '/cases',
            name: 'Cases',
            component: Cases
        },
        {
            path: '/casesEditor',
            name: 'CasesEditor',
            component: CasesEditor
        },
        {
            path: '/login',
            name: 'Login',
            component: Login
        }
    ],
})

