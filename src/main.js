import Vue from 'vue'
import App from './App.vue'
import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'
import router from './router'
import iView from 'iview';
import 'iview/dist/styles/iview.css';
import axios from 'axios'
import global from "./components/global";


Vue.config.productionTip = false;
Vue.use(ElementUI);
Vue.use(iView);
Vue.prototype.$axios = axios;
    Vue.prototype.GLOBAL = global;

new Vue({
    render: h => h(App),
    router
}).$mount('#app');