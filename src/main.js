import Vue from 'vue'
import Router from 'vue-router'
import App from './App.vue'
import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'

import HelloWorld from './components/HelloWorld'


Vue.config.productionTip = false;
Vue.use(ElementUI);
Vue.use(Router);

const routes = [
    {
        path: '/helloworld',
        component: HelloWorld,
    }
];

const router = new Router({
    mode:'history',
    routes
});
new Vue({
    render: h => h(App),
    router
}).$mount('#app');