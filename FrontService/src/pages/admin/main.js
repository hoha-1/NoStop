import Vue from 'vue';
import App from "@/pages/admin/App";
import router from './router.js'
import ElementUI from 'element-ui';
import 'element-ui/lib/theme-chalk/index.css';
import * as echarts from 'echarts';

Vue.prototype.$echarts=echarts;
Vue.use(ElementUI);
Vue.config.productionTip = false;

new Vue({
    render:h=>h(App),
    router
}).$mount('#app')






