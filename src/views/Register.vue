<!-- src/views/Register.vue -->
<template>
  <div class="login">
    <div class="login-form">
      <h5 class="room-title">加入會員</h5>
    <form @submit.prevent="handleSubmit">
      <div class="input-group">
        <label for="idNumber">身分證字號:</label>
        <input v-model="idNumber" type="text" id="idNumber" required />
      </div>
      <div class="input-group">
        <label for="password">密碼:</label>
        <input v-model="password" type="password" id="password" required />
      </div>
      <div class="input-group">
        <label for="memberName">會員名稱:</label>
        <input v-model="memberName" type="text" id="memberName" required />
      </div>
      <div class="input-group">
        <label for="phone">電話:</label>
        <input v-model="phone" type="text" id="phone" required />
      </div>
      <div class="input-group"> 
        <label for="birth">生日:</label>
        <input v-model="birth" type="date" id="birth" required />
      </div>
      <div class="input-group">
        <label for="email">Email:</label>
        <input v-model="email" type="email" id="email" required />
      </div>
      <button type="submit">註冊</button>
    </form>
    <p v-if="message">{{ message }}</p>
    <div class="links">
        <router-link to="/login">返回登入</router-link>
        </div>
  </div></div>
</template>

<script>
export default {
  data() {
    return {
      idNumber: '',
      password: '',
      memberName: '',
      phone: '',
      birth: '',
      email: '',
      message: ''
    };
  },
  methods: {
    async handleSubmit() {
      // 檢查身分證字號長度是否為10
      if (this.idNumber.length !== 10) {
        this.message = '身分證字號必須為 10 個字元。';
        return;
      }
      
      // 檢查身分證字號的第一個字元是否為大寫英文
      const firstChar = this.idNumber.charAt(0);
      if (!/^[A-Z]$/.test(firstChar)) {
        this.message = '身分證字號的第一個字元必須是大寫英文。';
        return;
      }
      
      // 檢查身分證字號的其餘字元是否為數字
      const restChars = this.idNumber.slice(1);
      if (!/^\d{9}$/.test(restChars)) {
        this.message = '身分證字號的第二到第十個字元必須是數字。';
        return;
      }
      
      try {
        const response = await fetch('/ktv-app/api/register', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            idNumber: this.idNumber,
            password: this.password,
            memberName: this.memberName,
            phone: this.phone,
            birth: this.birth,
            email: this.email
          })
        });

        if (response.ok) {
          console.log('註冊成功');  // F12 顯示成功訊息
          this.message = '註冊成功!';
          alert(this.message);
          this.$router.push('/login');  // 成功後跳轉到登入頁面
        } else {
          const errorData = await response.text();
          this.message = `${errorData}`;
        }
      } catch (error) {
        console.error('Error:', error);
        this.message = 'An error occurred during registration.';
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
  color: #000000; /* 鏈接字體顏色 */
  text-decoration: none; /* 無下劃線 */
  font-size: 14px; /* 字體大小 */
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
  margin-bottom: 20px;
  font-size: 28px;
  font-weight: bold;
  background: none;
  text-shadow: 3px 3px 6px orange;
}
</style>

