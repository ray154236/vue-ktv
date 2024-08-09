<template>
  <div id="app">
    <Navbar />
    <main class="content">
      <router-view />
    </main>
    <footer>
      <div class="footer-content">
        <div class="footer-left">
          <p>大安旗艦店</p>
          <p>訂位專線：(02)6631-6588</p>
          <p>服務時間：週一~週日</p>
          <p>門市地址：台北市大安區復興南路一段390號2樓</p>
        </div>
        <div class="footer-right">
          <ul>
            <li><a href="/">官網首頁</a></li>
            <li><a href="/newswebsite">最新消息</a></li>
            <li><a href="/map">門市地點</a></li>   
          </ul></div>
          <div class="footer-right">
          <ul>
          <li><a href="/room">包廂介紹</a></li>
            <li><a href="/member">會員專區</a></li>
            <li><a href="/booking">線上訂位</a></li>
          </ul>
        </div>
      </div>
      <div class="footer-bottom">
        <p>Copyright © GOLD PANDA股份有限公司&nbsp;&nbsp;網頁設計 | 熊貓科技</p>
      </div>
    </footer>
  </div>
</template>

<script>
import Navbar from './components/Navbar.vue'

export default {
  name: 'App',
  components: {
    Navbar
  }
}
</script>

<style>
/* 設置全局背景圖片 */
body {
  background: url('/src/assets/background16.jpg') no-repeat center center fixed;
  background-size: cover;
  margin: 0;
  font-family: Arial, sans-serif;
  height: 100%;
}

html, body {
  height: 100%;
  margin: 0;
}

#app {
  display: flex;
  flex-direction: column;
  min-height: 100vh; /* Ensure the body takes full height */
}

.content {
  flex: 1; /* Allows the main content to grow and push the footer down */
}

footer {
  background-color: #333;
  color: #ffffff;
  width: 100%;
  font-weight: 800;
  font-size: 14px;
}

.footer-content {
  display: flex;
  justify-content: space-between;
  padding: 4px;
  max-width: 1250px; /* Adjust width to fit your design */
  margin: 0 auto; /* Center align the footer-content */
}

.footer-left, .footer-right {
  flex: 1;
}

.footer-left p {
  margin: 1px 0;
}

.footer-right ul {
  list-style: none;
  padding: 0;
  margin: 5px;
  padding-left: 150px;
}

.footer-right li {
  margin: 5px 0;
}

.footer-right a {
  color: #fff;
  text-decoration: none;
}

.footer-bottom {
  background-color: #222;
  padding: 10px;
  text-align: center;
  font-weight: 800;
}

.footer-bottom p {
  margin: 0;
  font-weight: 800;
}
</style>
