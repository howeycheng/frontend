import Vue from 'vue'
import App from './App.vue'
import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'
import router from './router'
import iView from 'iview';
import 'iview/dist/styles/iview.css';
import axios from 'axios'
import Cookies from 'js-cookie';
import store from './store'
import './permission' // permission control
// import VueCookies from 'vue-cookies'

import codemirror from 'vue-codemirror'
import 'vue-codemirror/node_modules/codemirror/lib/codemirror.css'
Vue.use(codemirror)

Vue.use(Cookies);
Vue.config.productionTip = false;
Vue.use(ElementUI);
Vue.use(iView);
Vue.prototype.$axios = axios;
axios.defaults.withCredentials = true
Vue.prototype.GLOBAL = global;
Vue.prototype.$axios.defaults.withCredentials = true
Vue.prototype.$Cookies = Cookies;
// http request 拦截器
const url =  process.env.VUE_APP_BASE_API + '/apis/';
axios.interceptors.request.use(
    config => {
        let cookies = Cookies.get('csrftoken');
        if (cookies) {
            config.headers['X-CSRFToken'] = cookies;
        }
        if (config.url.indexOf(url) === -1) {
            config.url = url + config.url;/*拼接完整请求路径*/
        }
        return config;
    }
);
new Vue({
    render: h => h(App),
    router,
    store
}).$mount('#app');
