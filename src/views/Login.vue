<template>
  <div class="login">
    <div class="login-form">
      <h5 class="room-title">會員登入</h5> <!-- 登入頁面標題 -->
      <form @submit.prevent="handleSubmit"> <!-- 登入表單，防止默認提交 -->
        <div class="input-group">
          <label for="idNumber">身分證字號：</label> <!-- 身分證字號標籤 -->
          <input v-model="idNumber" type="text" id="idNumber" required /> <!-- 輸入身分證字號 -->
        </div>
        <div class="input-group">
          <label for="password">密碼：</label> <!-- 密碼標籤 -->
          <input v-model="password" type="password" id="password" required /> <!-- 輸入密碼 -->
        </div>
       

        <button type="submit">登入</button> <!-- 登入按鈕 -->
        <div class="links">
          <router-link to="/forgot-password">忘記密碼</router-link> <!-- 到忘記密碼頁面的連結 -->
          <router-link to="/register">加入會員</router-link> <!-- 到註冊頁面的連結 -->
        </div>
      </form>
      <p v-if="message">{{ message }}</p> <!-- 顯示登入結果訊息 -->
    </div>
  </div>
</template>

<script>
import { mapActions } from 'vuex';

export default {
  data() {
    return {
      idNumber: '', // 身分證字號狀態
      password: '', // 密碼狀態
      message: '' // 顯示訊息狀態
    };
  },
  methods: {
    ...mapActions(['setIdNumber', 'fetchMemberProfile']),
    async handleSubmit() {
      try {
        const response = await fetch('/ktv-app/api/login', { // 發送登入請求到後端
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({ idNumber: this.idNumber, password: this.password }) // 發送的 JSON 資料
        });

        if (response.ok) { // 如果回應成功
          console.log('登入成功');  // F12 顯示成功訊息
          this.message = '登入成功!';

          // 保存 ID Number 和其他登入資訊到 localStorage
          localStorage.setItem('idNumber', this.idNumber);
          // 保存 ID Number 到 Vuex Store
          this.setIdNumber(this.idNumber);
          await this.fetchMemberProfile();  // 確保 Vuex actions 獲取會員資料
          this.$router.push('/member');  // 跳轉到會員基本資料頁面
        } else {
          const errorData = await response.text(); // 如果回應不成功，顯示錯誤訊息
          this.message = `密碼錯誤 ${errorData}`;
        }
      } catch (error) {
        console.error('Error:', error); // 如果有錯誤，顯示錯誤訊息
        this.message = '發生錯誤';
      }
    }
  }
};
</script>

<style scoped>
.login {
  display: flex; /* 使用 Flexbox 進行排版 */
  justify-content: center; /* 水平置中 */
  align-items: center; /* 垂直置中 */
  min-height: 60vh; /* 最小高度為螢幕高度的 80% */
  background: none; /* 保持網頁原背景 */
}

.login-form {
  width: 400px; /* 登入表單寬度 */
  padding: 20px; /* 內邊距 */
  border-radius: 5px; /* 圓角 */
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.1); /* 陰影效果 */
  text-align: center; /* 文字置中 */
}

.login-form h1 {
  margin-bottom: 20px; /* 標題底部間距 */
  font-size: 24px; /* 字體大小 */
  color: #fff; /* 字體顏色 */
  font-weight: bold;
}

.input-group {
  margin-bottom: 15px; /* 輸入組底部間距 */
  text-align: left; /* 文字左對齊 */
  font-size: 22px;
}

.input-group label {
  display: block; /* 顯示為區塊元素 */
  margin-bottom: 5px; /* 標籤底部間距 */
  font-weight: bold; /* 粗體字 */
  color: #ffffff; /* 字體顏色 */
}

.input-group input {
  width: 100%; /* 輸入框寬度 */
  padding: 8px; /* 內邊距 */
  border: 1px solid #ccc; /* 灰色邊框 */
  border-radius: 5px; /* 圓角 */
  box-sizing: border-box; /* 盒模型 */
}

button {
  width: 100%; /* 按鈕寬度 */
  padding: 10px; /* 內邊距 */
  background-color: #ff85b3; /* 按鈕背景顏色 */
  color: white; /* 字體顏色 */
  border: none; /* 無邊框 */
  border-radius: 5px; /* 圓角 */
  cursor: pointer; /* 游標類型 */
  font-size: 24px; /* 字體大小 */
  margin-top: 10px; /* 按鈕頂部間距 */
  font-weight: 800;
}

button:hover {
  background-color: #681736; /* 滑鼠懸停時的背景顏色 */
}

.links {
  display: flex; /* 使用 Flexbox 進行排版 */
  justify-content: space-between; /* 空間平均分配 */
  margin-top: 10px; /* 鏈接頂部間距 */
}

.links a {
  color: #ffffff; /* 鏈接字體顏色 */
  text-decoration: none; /* 無下劃線 */
  font-size: 20px; /* 字體大小 */
  font-weight: 800;
}

.links a:hover {
  text-decoration: underline; /* 滑鼠懸停時添加下劃線 */
}

p {
  color: red; /* 段落文字顏色 */
  margin-top: 20px; /* 段落頂部間距 */
}
.room-title {
  text-align: center;
  color: #fff;
  margin-bottom: 80px;
  font-size: 40px;
  font-weight: bold;
  background: none;
  text-shadow: 3px 3px 6px orange;
}
</style>
