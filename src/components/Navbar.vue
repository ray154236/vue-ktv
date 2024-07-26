<template>
  <nav class="navbar navbar-expand-lg navbar-light bg-light">
    <div class="container">
      <a class="navbar-brand" href="/">
        <img src="/src/assets/GOLD-PANDA.png" alt="Logo" class="logo">
      </a>
      <button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNavDropdown" aria-controls="navbarNavDropdown" aria-expanded="false" aria-label="Toggle navigation">
        <span class="navbar-toggler-icon"></span>
      </button>
      <div class="collapse navbar-collapse" id="navbarNavDropdown">
        <ul class="navbar-nav mx-auto">
          <li class="nav-item">
            <a class="nav-link active" href="/newswebsite">最新消息</a>
          </li>
          <li class="nav-item">
            <a class="nav-link" href="/map">門市地點</a>
          </li>
          <li class="nav-item">
            <a class="nav-link" href="/room">包廂介紹</a>
          </li>
          <li class="nav-item">
            <a class="nav-link" href="/member">會員專區</a>
          </li>

          
          <li class="nav-item">
            <a class="nav-link" href="/booking">線上訂位</a>
          </li>
          
            <!-- 登出按鈕的顯示 -->
            <li class="nav-item" v-if="isLoggedIn && ($route.path === '/' || $route.path === '/member' || $route.path === '/map' || $route.path === '/newswebsite' || $route.path === '/member-profile' || $route.path === '/booking')">
            <a class="nav-link" href="#" @click="handleLogout">登出</a>
          </li>
        </ul>
      </div>
    </div>
  </nav>
</template>

<script>
import { mapActions, mapGetters } from 'vuex';

export default {
  name: 'Navbar',
  computed: {
    ...mapGetters(['isLoggedIn']),
  },
  methods: {
    ...mapActions(['logout']),
    handleLogout() {
      this.logout().then(() => {
        this.$router.push('/'); // 登出後跳轉到首頁或其他頁面
      });
    }
  }
}
</script>

<style scoped>
/* 覆蓋 Bootstrap 樣式 */
.navbar.navbar-light.bg-light {
  background-color: rgb(10, 0, 0) !important;
}

/* 添加自定義樣式 */
.navbar {
  padding: 0.5rem 1rem;
  box-shadow: 0 2px 4px rgba(248, 246, 246, 0.1);
  min-height: 100px; /* 增加導覽列的最小高度 */
  max-height: 100px; /* 增加導覽列的最小高度 */
  background-image: url('/src/assets/background2.jpg');
}

.navbar-brand .logo {
  margin-left: -60px;
  margin-top: 20px;
  height: 70px; /* 增大 Logo 高度 */
  width: auto; /* 自動調整寬度以保持比例 */
}

.navbar-nav .nav-item .nav-link {
  color: #e0dfe0;
  font-weight: 600;
  margin-left: 1rem;
  margin-right: 1rem;
  position: relative;
}

.navbar-nav .nav-item .nav-link.active {
  color: #04eee2;
}

.navbar-nav .nav-item .nav-link:hover {
  color: #007bff;
}

.navbar-nav .nav-item .nav-link::after {
  content: '';
  display: block;
  width: 100%;
  height: 3px;
  background-color: #007bff;
  position: absolute;
  bottom: -2px;
  left: 0;
  opacity: 0;
  transition: opacity 0.3s;
}

.navbar-nav .nav-item .nav-link:hover::after,
.navbar-nav .nav-item .nav-link.active::after {
  opacity: 1;
}

.navbar-toggler {
  border: none;
}

.navbar-toggler-icon {
  background-image: url('data:image/svg+xml;base64,...'); /* 可以使用自定義圖標 */
}
</style>
