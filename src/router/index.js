import { createRouter, createWebHistory } from 'vue-router';
import store from '../store/store';  // 確保引入了 Vuex store
import Member from '../views/Member.vue'
import Login from '../views/Login.vue';
import Register from '../views/Register.vue';
import ForgotPassword from '../views/ForgotPassword.vue';
import ResetPassword from '../views/ResetPassword.vue';
import Home from '../views/Home.vue';
import MemberProfile from '../views/MemberProfile.vue';
import Map from '../views/Map.vue';
import RoomImage from '../views/RoomImage.vue';


// 定義路由
const routes = [
    { path: '/', component: Home },  // 將首頁設為 Home
    { path: '/member', component: Member, meta: { requiresAuth: true } },//會員專區
    { path: '/login', component: Login },//登入
    { path: '/register', component: Register },//註冊
    { path: '/forgot-password', component: ForgotPassword },//忘記密碼
    { path: '/reset-password', component: ResetPassword },//重設密碼
    { path: '/member-profile', component: MemberProfile, meta: { requiresAuth: true } },//會員基本資料
    { path: '/map', component: Map },//門市地點
    { path: '/roomImage', component: RoomImage },//包廂介紹
];

// 創建 router 實例
const router = createRouter({
    history: createWebHistory(),
    routes,
});

//路由守衛
router.beforeEach((to, from, next) => {
    const isLoggedIn = !!store.getters.isLoggedIn;
    if (to.matched.some(record => record.meta.requiresAuth) && !isLoggedIn) {
        next('/login'); // 如果需要驗證且未登入，重導向到登入頁面
    } else {
        next(); // 否則正常進入
    }
});


// 將 router 匯出
export default router;

