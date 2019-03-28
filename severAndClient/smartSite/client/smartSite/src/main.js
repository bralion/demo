// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import "babel-polyfill";
import "es5-shim";
import Vue from 'vue'
import App from './App'
import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'
import 'reset-css/reset.css' // reset-css
import './default.css'
import router from './router'
import utils from '@/publicFunction'
import VueClipboard from 'vue-clipboard2'
import JsonExcel from 'vue-json-excel'

Vue.component('downloadExcel', JsonExcel)
Vue.use(VueClipboard);
Vue.config.productionTip = false
Vue.use(ElementUI)
Vue.use(utils) // 注册公共方法

/* eslint-disable no-new */
new Vue({
    el: '#app',
    router,
    components: {App},
    template: '<App/>'
})
