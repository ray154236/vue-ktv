
import { createApp } from 'vue';
import App from './App.vue';
import router from './router';
import axios from './axios';  // 引入 axios 的配置檔案
import store from './store/store';  // 引入 store


import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap';

// 將 axios 和 router 傳遞給 Vue 應用
createApp(App)
    .use(router)
    .use(store)  // 使用 store
    .provide('$axios', axios)  // 使用 provide 將 axios 注入到 Vue 應用中
    .mount('#app');
