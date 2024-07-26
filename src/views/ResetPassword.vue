<!-- src/views/ResetPassword.vue -->
<template>
  <div class="login">
    <div class="login-form">
    <h1>重設密碼</h1>
    <form @submit.prevent="resetPassword">
      <div class="input-group">
        <label for="newPassword">請輸入新密碼</label>
        <input type="password" id="newPassword" v-model="newPassword" required />
      </div>
      <button type="submit">重設密碼</button>
    </form>
    <p v-if="message">{{ message }}</p>
  </div></div>
</template>

<script>
import axios from '../axios';

export default {
  name: 'ResetPassword',
  data() {
    return {
      newPassword: '',
      message: ''
    };
  },
  methods: {
    async resetPassword() {
      const queryParams = new URLSearchParams(window.location.search);
      const token = queryParams.get('token');

      if (!token) {
        this.message = '發生錯誤';
        return;
      }

      try {
        await axios.post('/reset-password', {
          token,
          newPassword: this.newPassword
        });
        this.message = '密碼變更成功!';
        alert(this.message);
        this.$router.push('/login');  // 跳轉到會員基本資料頁面
      } catch (error) {
        if (error.response) {
          this.message = error.response.data.message || '發生錯誤';
        } else {
          this.message = '發生錯誤';
        }
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
  border: 2px solid #ffffff; /* 白色邊框 */
  border-radius: 5px; /* 圓角 */
  background: rgb(233, 222, 222); /* 背景顏色 */
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.1); /* 陰影效果 */
  text-align: center; /* 文字置中 */
}

.login-form h1 {
  margin-bottom: 20px; /* 標題底部間距 */
  font-size: 20px; /* 字體大小 */
  color: #333; /* 字體顏色 */
}

.input-group {
  margin-bottom: 15px; /* 輸入組底部間距 */
  text-align: left; /* 文字左對齊 */
}

.input-group label {
  display: block; /* 顯示為區塊元素 */
  margin-bottom: 5px; /* 標籤底部間距 */
  font-weight: bold; /* 粗體字 */
  color: #333; /* 字體顏色 */
  font-weight: bold;
}

.input-group input {
  width: 100%; /* 輸入框寬度 */
  padding: 8px; /* 內邊距 */
  border: 1px solid #ccc; /* 灰色邊框 */
  border-radius: 3px; /* 圓角 */
  box-sizing: border-box; /* 盒模型 */
}

button {
  width: 100%; /* 按鈕寬度 */
  padding: 10px; /* 內邊距 */
  background-color: #007BFF; /* 按鈕背景顏色 */
  color: white; /* 字體顏色 */
  border: none; /* 無邊框 */
  border-radius: 3px; /* 圓角 */
  cursor: pointer; /* 游標類型 */
  font-size: 16px; /* 字體大小 */
  margin-top: 10px; /* 按鈕頂部間距 */
}

button:hover {
  background-color: #0056b3; /* 滑鼠懸停時的背景顏色 */
}

p {
  color: red; /* 段落文字顏色 */
  margin-top: 20px; /* 段落頂部間距 */
}
</style>