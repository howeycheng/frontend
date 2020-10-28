import Vue from 'vue'
import Router from 'vue-router'


import Home from '../components/Home'
import Login from '../components/Login'
import Cases from '../components/Cases'
import requirement from '../components/Requirement'
import run from '../components/Run'
import log from '../components/Log'
import job from "../components/job";
import manage from "@/components/manage";

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
            name: 'Login',
            component: Login,
        },
        {
            path: '/home',
            name: 'Home',
            component: Home
        },
        {
            path: '/cases',
            name: 'Cases',
            component: Cases
        },
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
            path: '/job',
            name: 'job',
            component: job
        },
        {
            path: '/manage',
            name: 'manage',
            component: manage
        }
    ],
})

