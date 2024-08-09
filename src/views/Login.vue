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
        <div class="input-group captcha-group">
          <label for="captcha">驗證碼：</label>
          <div class="captcha-container">
            <canvas ref="captchaCanvas" width="150" height="50" @click="generateCaptcha"></canvas>
            <input v-model="captchaInput" type="text" id="captcha" class="captcha-input" required />
          </div>
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
      captchaInput: '',
      captchaCode: '',
      message: ''
    };
  },
  mounted() {
    this.generateCaptcha();
  },
  methods: {
    generateCaptcha() {
      const canvas = this.$refs.captchaCanvas;
      const ctx = canvas.getContext('2d');
      if (!ctx) {
        console.error('Cannot get canvas context.');
        return;
      }

      const chars = 'abcdefghijklmnopqrstuvwxyz0123456789';
      this.captchaCode = '';
      for (let i = 0; i < 4; i++) {
        this.captchaCode += chars.charAt(Math.floor(Math.random() * chars.length));
      }

      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // 設定背景顏色
      ctx.fillStyle = '#f0f0f0'; // 設定為淺灰色，根據需要調整
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // 繪製隨機干擾線條
      for (let i = 0; i < 5; i++) {
        ctx.strokeStyle = `rgba(${Math.random() * 255}, ${Math.random() * 255}, ${Math.random() * 255}, 0.5)`;
        ctx.beginPath();
        ctx.moveTo(Math.random() * canvas.width, Math.random() * canvas.height);
        ctx.lineTo(Math.random() * canvas.width, Math.random() * canvas.height);
        ctx.stroke();
      }

      // 繪製隨機點
      for (let i = 0; i < 100; i++) {
        ctx.fillStyle = `rgba(${Math.random() * 255}, ${Math.random() * 255}, ${Math.random() * 255}, 0.5)`;
        ctx.beginPath();
        ctx.arc(Math.random() * canvas.width, Math.random() * canvas.height, 1, 0, Math.PI * 2);
        ctx.fill();
      }

      // 繪製驗證碼字
      for (let i = 0; i < this.captchaCode.length; i++) {
        ctx.save();
        ctx.font = `${Math.random() * 20 + 20}px Arial`;
        ctx.fillStyle = `rgb(${Math.random() * 255}, ${Math.random() * 255}, ${Math.random() * 255})`;
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        const x = (i + 0.5) * canvas.width / this.captchaCode.length;
        const y = canvas.height / 2;
        ctx.translate(x, y);
        ctx.rotate(Math.random() * 0.5 - 0.25); // 隨機旋轉
        ctx.fillText(this.captchaCode.charAt(i), 0, 0);
        ctx.restore();
      }
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
          console.log('登入成功'); // F12 顯示成功訊息
          this.message = '登入成功!';

          // 保存 ID Number 和其他登入資訊到 sessionStorage
          sessionStorage.setItem('idNumber', this.idNumber);
          sessionStorage.setItem('token', data.token); // 使用從後端獲取的實際 token

          // 保存 ID Number 到 Vuex Store（確保已經在 store 中定義了相應的 mutation 或 action）
          this.$store.commit('setIdNumber', this.idNumber);

          // 如果需要，可以在這裡調用方法來獲取會員資料
          await this.$store.dispatch('fetchMemberProfile');

          // 重定向到會員頁面
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
  }
};
</script>

<style scoped>
.login {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 60vh;
  background: none;
}

.login-form {
  width: 400px;
  padding: 20px;
  border-radius: 5px;
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
  text-align: center;
}

.login-form h5 {
  margin-bottom: 20px;
  font-size: 24px;
  color: #fff;
  font-weight: bold;
}

.input-group {
  margin-bottom: 15px;
  text-align: left;
  font-size: 18px;
}

.input-group label {
  display: block;
  margin-bottom: 5px;
  font-weight: bold;
  color: #ffffff;
}

.input-group input {
  width: 100%;
  padding: 8px;
  border: 1px solid #ccc;
  border-radius: 5px;
  box-sizing: border-box;
}

.captcha-group {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
}

.captcha-container {
  display: flex;
  align-items: center;
}

.captcha-container canvas {
  margin-right: 10px;
}

.captcha-input {
  width: 80px; /* 調整為合適的寬度 */
  padding: 8px;
  border: 1px solid #ccc;
  border-radius: 5px;
  box-sizing: border-box;
}

button {
  width: 100%;
  padding: 10px;
  background-color: #ff85b3;
  color: white;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  font-size: 18px;
  margin-top: 10px;
  font-weight: 800;
}

button:hover {
  background-color: #681736;
}

.links {
  display: flex;
  justify-content: space-between;
  margin-top: 10px;
}

.links a {
  color: #ffffff;
  text-decoration: none;
  font-size: 16px;
  font-weight: 800;
}

.links a:hover {
  text-decoration: underline;
}

p {
  color: red;
  margin-top: 20px;
}

.room-title {
  text-align: center;
  color: #fff;
  margin-bottom: 80px;
  font-size: 30px;
  font-weight: bold;
  background: none;
  text-shadow: 3px 3px 6px orange;
}
</style>