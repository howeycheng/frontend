import Vue from 'vue'
import Router from 'vue-router'


import Home from '../components/Home'
import Login from '../components/Login'
import Cases from '../components/Cases'

Vue.use(Router);
export default new Router({
    mode: 'history',
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
        }
    ],
})

