import Vue from 'vue'
import App from './App.vue'
import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'
Vue.config.productionTip = false
Vue.use(ElementUI)
Vue.config.productionTip = false
//导入axios
import Axios from 'axios';
//全局使用axios
Vue.prototype.$axios = Axios;
//配置请求头，非常重要，有了这个才可以正常使用POST等请求后台数据
Axios.defaults.headers.post['Content-Type'] = 'application/x-www-fromurlencodeed'
new Vue({
    render: h => h(App),
}).$mount('#app')
