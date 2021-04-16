import Vue from 'vue'
import App from './App.vue'
import router from './router'
import '@/assets/font/font.css';
import './plugin/hljs.js'



Vue.config.productionTip = false


new Vue({
    router,
    render: h => h(App)
}).$mount('#app')