import { createApp } from 'vue';
import App from './App.vue';
import router from './router';
import axios from './axios';  // 引入 axios 的配置檔案
import store from './store/store';  // 引入 store

import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap';

// 創建 Vue 應用
const app = createApp(App);

// 使用 router 和 store
app.use(router);
app.use(store);

// 提供 axios 實例
app.provide('$axios', axios);

// 應用啟動時設定登入狀態
app.mixin({
    async beforeMount() {
        const idNumber = sessionStorage.getItem('idNumber');
        if (idNumber) {
            this.$store.dispatch('setIdNumber', idNumber);
            await this.$store.dispatch('fetchMemberProfile');
        }
    }
});

app.mount('#app');
