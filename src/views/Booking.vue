<template>
  <div class="container">
    <form @submit.prevent="submitForm" class="form" v-if="member">
      <div class="form-group">
        <h1>線上訂位</h1>
      </div>
      <div class="form-group">
        <label>會員名稱:</label>
        <p>{{ member.memberName }}</p>
      </div>
      <div class="form-group">
        <label>電話:</label>
        <p>{{ member.phone }}</p>
      </div>
      <div class="form-group">
        <label>信箱:</label>
        <p>{{ member.email }}</p>
      </div>
      <div class="form-group">
        <label>人數:</label>
        <select v-model="order.numberOfPersons" required>
          <option value="5">小包廂(適合5人)</option>
          <option value="10">中包廂(適合10人)</option>
          <option value="20">大包廂(適合20人)</option>
        </select>
      </div>
      <div class="form-group">
        <label>訂位日期:</label>
        <input type="date" v-model="order.orderDate" required @change="calculateEndTime" :min="minDate">
      </div>

      <div class="form-group">
        <label>訂位時間範圍:</label>
        <div class="row">
          <div class="col-md-4">
            <label>開始時間:</label>
            <div class="d-flex align-items-center">
              <select class="form-control mr-1" v-model="order.startTime" @change="validateTime">
                <option v-for="hour in hours" :key="'start-' + hour" :value="hour">{{ hour }}</option>
              </select>
              <div>時</div>
              <select class="form-control ml-1" v-model="order.startTimeMinute" @change="validateTime">
                <option v-for="minute in minutes" :key="'start-' + minute" :value="minute">{{ minute }}</option>
              </select>
              <div>分</div>
            </div>
          </div>
          <div class="col-md-4">
            <label>結束時間:</label>
            <p>{{ order.endTime }}</p>
          </div>
          <div class="col-md-4">
            <label>歡唱時間(小時):</label>
            <select class="form-control" v-model="order.hours" @change="calculateEndTime">
              <option v-for="hour in singTimehours" :key="'singTime-' + hour" :value="hour">{{ hour }}</option>
            </select>
          </div>
        </div>
      </div>

      <button type="submit">訂位</button>
      <!-- 返回按鈕 -->
      <button type="button" @click="goHome" class="return-button button-large">返回首頁</button>
    </form>
  </div>
</template>

<script>
import axios from 'axios';
import Swal from 'sweetalert2'; // 引入 SweetAlert2
import { useStore } from 'vuex';
import { useRouter } from 'vue-router';

export default {
  computed: {
    member() {
      console.log('目前會員狀態:', this.$store.state.member); // 打印會員狀態
      return this.$store.state.member;
    },
    isLoggedIn() {
      return this.$store.getters.isLoggedIn;
    },
    hours() {
      const hours = [];
      for (let i = 0; i < 24; i++) {
        hours.push(i.toString().padStart(2, '0'));
      }
      return hours;
    },
    minutes() {
      const minutes = [];
      for (let i = 0; i < 60; i += 15) {
        minutes.push(i.toString().padStart(2, '0'));
      }
      return minutes;
    },
    singTimehours() {
      const hours = [];
      for (let i = 1; i < 13; i++) {
        hours.push(i.toString().padStart(2, '0'));
      }
      return hours;
    },
  },
  created() {
  if (this.isLoggedIn) {
    this.$store.dispatch('fetchMemberProfile').then(() => {
      // 確保 member 資料已經正確獲取
      console.log('Current member state:', this.member);
      if (this.member && this.member.memberId) {
        this.order.memberId = this.member.memberId;
      } else {
        console.error('MemberId is not available');
      }
    }).catch(error => {
      console.error('Failed to fetch member profile:', error);
    });
  } else {
    this.$router.push('/login');
  }
},
  data() {
    return {
      order: {
        orderId: '',
        startHour: '',
        startMinute: '',
        endHour: '',
        endMinute: '',
        endTime: '',
        orderDate: '',
        numberOfPersons: '',
        memberId: '',
        hours: '',
      },
      minDate: new Date().toISOString().split('T')[0] // 獲取當前日期並格式化為 'YYYY-MM-DD'
    };
  },
  methods: {
  calculateEndTime() {
    const startHour = parseInt(this.order.startTime, 10);
    const startMinute = parseInt(this.order.startTimeMinute, 10);
    const singTime = parseInt(this.order.hours, 10);

    if (!isNaN(startHour) && !isNaN(startMinute) && !isNaN(singTime) && this.order.orderDate) {
      let totalHours = startHour + singTime;
      let endHour = totalHours % 24;
      let nextDay = Math.floor(totalHours / 24);
      let endDay = new Date(this.order.orderDate);
      endDay.setDate(endDay.getDate() + nextDay);

      let endMinute = startMinute;

      this.order.endTime = `${endDay.getFullYear()}-${(endDay.getMonth() + 1).toString().padStart(2, '0')}-${endDay.getDate().toString().padStart(2, '0')} ${endHour.toString().padStart(2, '0')}:${endMinute.toString().padStart(2, '0')}`;
    }
  },

  validateTime() {
    const now = new Date();
    const orderDate = new Date(this.order.orderDate);
    const startHour = parseInt(this.order.startTime, 10);
    const startMinute = parseInt(this.order.startTimeMinute, 10);

    now.setSeconds(0, 0);

    if (orderDate.toDateString() === now.toDateString()) {
      const selectedTime = new Date(orderDate);
      selectedTime.setHours(startHour);
      selectedTime.setMinutes(startMinute);

      if (selectedTime < now) {
        Swal.fire({
          icon: 'error',
          title: '選擇錯誤',
          text: '選擇的開始時間不能早於當前時間。',
        });
        return false;
      }
    } else if (orderDate < now) {
      Swal.fire({
        icon: 'error',
        title: '選擇錯誤',
        text: '訂位日期不能早於今天。',
      });
      return false;
    }

    return true;
  },

  submitForm() {
  if (!this.validateTime()) {
    return;
  }
  
  // 确保填入用户的 member ID
  this.order.memberId = this.member.memberId;
  this.order.createBy = this.member.memberId; // 填入 createBy 字段
  console.log('memberId:', this.order.memberId);

  // 记录创建时间
  this.order.createTime = new Date().toString();
  this.order.startTime = `${this.order.startTime.padStart(2, '0')}:${this.order.startTimeMinute.padStart(2, '0')}`;

  if (!this.order.numberOfPersons) {
    Swal.fire({
      icon: 'warning',
      title: '人數選擇錯誤',
      text: '請選擇人數。',
    });
    return;
  }

  // 将订单数据转换为 JSON 字符串
  const orderData = JSON.stringify(this.order);

  this.addOrder(orderData)
    .then(() => {
      Swal.fire({
        icon: 'success',
        title: '訂位成功',
        text: '您的訂位已成功提交！',
      });
    })
    .catch(error => {
      console.error('錯誤訊息:', error.message);
      Swal.fire({
        icon: 'error',
        title: '訂位失敗',
        text: '訂位過程中發生錯誤，請稍後再試。',
      });
    });
},

  addOrder(orderData) {
  return axios.post(`http://localhost:8080/ktv-app/ktvbackend/orders/testNewOrder`, orderData, {
    headers: {
      'Content-Type': 'application/json',
    },
  })
  .then(response => {
    console.log('成功創建新訂單:', response.data);
    return response.data;
  })
  .catch(error => {
    console.error('錯誤訊息:', error.message);
    throw error;
  });
},

  goHome() {
    this.$router.push({ path: '/' });
  }
}
}
</script>

<style>
.container {
  display: flex;
  justify-content: center;
  align-items: center;
}

.form {
  width: 600px; /* 設置表單的寬度 */
  padding: 20px;
  border: 1px solid #ccc;
  border-radius: 5px;
  background-color: #f9f9f9;
  margin-top: 5%;
}

.form-group {
  margin-bottom: 10px;
}

label {
  display: block;
  margin-bottom: 5px;
}

input,
select {
  width: calc(100% - 20px); /* 寬度減去 padding 值，防止寬度超出容器 */
  padding: 8px;
  margin-bottom: 10px;
  border: 1px solid #ccc;
  border-radius: 3px;
}

button {
  width: 100%;
  padding: 10px;
  background-color: #007BFF;
  color: white;
  border: none;
  border-radius: 3px;
  cursor: pointer;
  margin-top: 10px; /* 調整按鈕間距 */
}

button:hover {
  background-color: #0056b3; /* 懸停時顏色變化 */
}

.return-button {
  margin-top: 20px; /* 返回按鈕上方的間距 */
}

.col-md-4 {
  flex: 0 0 33.33%; /* 使每個列的寬度佔比為三分之一 */
  max-width: 33.33%;
  padding-right: 15px;
  padding-left: 15px;
}

.d-flex {
  display: flex;
  align-items: center;
}

.ml-1 {
  margin-left: 5px;
}

.mr-1 {
  margin-right: 5px;
}

.row {
  display: flex;
  flex-wrap: wrap;
  margin-right: -15px;
  margin-left: -15px;
}

@media (max-width: 992px) {
  .col-md-4 {
    flex: 0 0 100%;
    max-width: 100%;
  }
}
</style>
