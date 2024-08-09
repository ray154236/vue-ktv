<template>
  <div class="login">
    <div class="login-form">
      <h5 class="room-title">會員登入</h5>
      <form @submit.prevent="handleSubmit">
        <div class="input-group">
          <label for="idNumber">身分證字號：</label>
          <input v-model="idNumber" type="text" id="idNumber" required autocomplete="username" />
        </div>
        <div class="input-group">
          <label for="password">密碼：</label>
          <input v-model="password" type="password" id="password" required autocomplete="current-password" />
        </div>
        <div class="input-group">
          <label for="captcha">驗證碼：</label>
          <div id="captcha">{{ captchaCode }}</div>
          <input v-model="captchaInput" type="text" id="captcha" required placeholder="請輸入驗證碼" />
          <button type="button" @click="generateCaptcha">生成驗證碼</button>
        </div>
        <button type="submit">登入</button>
        <div class="links">
          <router-link to="/forgot-password">忘記密碼</router-link>
          <router-link to="/register">加入會員</router-link>
        </div>
      </form>
      <p v-if="message">{{ message }}</p>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      idNumber: '',
      password: '',
      captchaCode: '',
      captchaInput: '',
      message: ''
    };
  },
  methods: {
    generateCaptcha() {
      this.captchaCode = Math.random().toString(36).substr(2, 6).toUpperCase();
    },
    async handleSubmit() {
      if (this.captchaInput !== this.captchaCode) {
        this.message = '驗證碼錯誤！';
        return;
      }
      
      try {
        const response = await fetch('/ktv-app/api/login', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({ idNumber: this.idNumber, password: this.password })
        });

        if (response.ok) {
          const data = await response.json();
          console.log('登入成功');  // F12 顯示成功訊息
          this.message = '登入成功!';

          sessionStorage.setItem('idNumber', this.idNumber);
          sessionStorage.setItem('token', data.token); // 使用從後端獲取的實際 token

          this.$store.commit('setIdNumber', this.idNumber);
          await this.$store.dispatch('fetchMemberProfile');

          this.$router.push('/member');
        } else {
          const errorData = await response.text();
          this.message = `密碼錯誤！`;
        }
      } catch (error) {
        console.error('Error:', error);
        this.message = '發生錯誤';
      }
    }
  },
  created() {
    this.generateCaptcha(); // 初始化驗證碼
  }
};
</script>

<style scoped>
.login {
  display: flex;
  /* 使用 Flexbox 進行排版 */
  justify-content: center;
  /* 水平置中 */
  align-items: center;
  /* 垂直置中 */
  min-height: 60vh;
  /* 最小高度為螢幕高度的 60% */
  background: none;
  /* 保持網頁原背景 */
}

.login-form {
  width: 400px;
  /* 登入表單寬度 */
  padding: 20px;
  /* 內邊距 */
  border-radius: 5px;
  /* 圓角 */
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
  /* 陰影效果 */
  text-align: center;
  /* 文字置中 */
}

.login-form h1 {
  margin-bottom: 20px;
  /* 標題底部間距 */
  font-size: 24px;
  /* 字體大小 */
  color: #fff;
  /* 字體顏色 */
  font-weight: bold;
}

.input-group {
  margin-bottom: 15px;
  /* 輸入組底部間距 */
  text-align: left;
  /* 文字左對齊 */
  font-size: 22px;
}

.input-group label {
  display: block;
  /* 顯示為區塊元素 */
  margin-bottom: 5px;
  /* 標籤底部間距 */
  font-weight: bold;
  /* 粗體字 */
  color: #ffffff;
  /* 字體顏色 */
}

.input-group input {
  width: 100%;
  /* 輸入框寬度 */
  padding: 8px;
  /* 內邊距 */
  border: 1px solid #ccc;
  /* 灰色邊框 */
  border-radius: 5px;
  /* 圓角 */
  box-sizing: border-box;
  /* 盒模型 */
}

button {
  width: 100%;
  /* 按鈕寬度 */
  padding: 10px;
  /* 內邊距 */
  background-color: #ff85b3;
  /* 按鈕背景顏色 */
  color: white;
  /* 字體顏色 */
  border: none;
  /* 無邊框 */
  border-radius: 5px;
  /* 圓角 */
  cursor: pointer;
  /* 游標類型 */
  font-size: 24px;
  /* 字體大小 */
  margin-top: 10px;
  /* 按鈕頂部間距 */
  font-weight: 800;
}

button:hover {
  background-color: #681736;
  /* 滑鼠懸停時的背景顏色 */
}

.links {
  display: flex;
  /* 使用 Flexbox 進行排版 */
  justify-content: space-between;
  /* 空間平均分配 */
  margin-top: 10px;
  /* 鏈接頂部間距 */
}

.links a {
  color: #ffffff;
  /* 鏈接字體顏色 */
  text-decoration: none;
  /* 無下劃線 */
  font-size: 20px;
  /* 字體大小 */
  font-weight: 800;
}

.links a:hover {
  text-decoration: underline;
  /* 滑鼠懸停時添加下劃線 */
}

p {
  color: red;
  /* 段落文字顏色 */
  margin-top: 20px;
  /* 段落頂部間距 */
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
