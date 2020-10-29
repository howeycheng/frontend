import Vue from 'vue'
import App from './App.vue'
import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'
import router from './router'
import iView from 'iview';
import 'iview/dist/styles/iview.css';
import axios from 'axios'
import global from "./components/global";
import Cookies from 'js-cookie';
// import VueCookies from 'vue-cookies'

Vue.use(Cookies);
Vue.http.interceptors.push((request, next) => {
    // 请求发送前的处理逻辑
    request.headers.set('X-CSRFToken', Cookies.get("csrftoken"))
    next((response) => {
        // 请求发送后的处理逻辑
        // 根据请求的状态，response参数会返回给successCallback或errorCallback
        return response
    })
})
Vue.config.productionTip = false;
Vue.use(ElementUI);
Vue.use(iView);
Vue.prototype.$axios = axios;
axios.defaults.withCredentials = true
Vue.prototype.GLOBAL = global;
Vue.prototype.$axios.defaults.withCredentials = true
Vue.prototype.$Cookies = Cookies;
new Vue({
    render: h => h(App),
    router
}).$mount('#app');
