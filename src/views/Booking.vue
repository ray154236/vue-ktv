<template>
  <div class="container">
    <form @submit.prevent="submitForm" class="form" v-if="member">
      <div class="form-group">
        <h1>線上訂位</h1>
      </div>
        <div class="form-group">
          <label>會員名稱:</label>
              <p> {{ member.memberName }}</p>
          </div>
          <div class="form-group">
        <label>電話:</label>
        <p> {{ member.phone }}</p>
          </div>
      <div class="form-group">
        <label>信箱:</label>
        <p> {{ member.email }}</p>
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
        <input type="date" v-model="order.orderDate" required>
      </div>

      <div class="form-group">
        <label>訂位時間範圍:</label>
        <div class="row">
          <div class="col">
            <label>開始時間:</label>
            <select class="form-control" v-model="order.startTime" @change="calculateEndTime">
              <option v-for="hour in hours" :key="'start-' + hour" :value="hour">{{ hour }}</option>
            </select>
            <select class="form-control" v-model="order.startTimeMinute" @change="calculateEndTime">
              <option v-for="minute in minutes" :key="'start-' + minute" :value="minute">{{ minute }}</option>
            </select>
          </div>
          <div class="col">
            <label>歡唱時間(小時):</label>
            <select class="form-control" v-model="order.hours" @change="calculateEndTime">
              <option v-for="hour in singTimehours" :key="'singTime-' + hour" :value="hour">{{ hour }}</option>
            </select>
          </div>
          <span></span>
          <div class="col">
  <label>結束時間:</label>
  <p>{{ order.endTime }}</p>
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
import { useStore } from 'vuex';
import { useRouter } from 'vue-router';

export default {
  computed: {
    member() {
      return this.$store.state.member; // 获取会员数据

    },
    isLoggedIn() {
      return this.$store.getters.isLoggedIn; // 获取登入状态
    },
    
    filteredTimeOptions() {
    return this.timeOptions.filter(time => time > this.order.startTime);
    
  },
  hours() {
      // 生成小时选项，假设从0到23
      const hours = [];
      for (let i = 0; i < 24; i++) {
        hours.push(i.toString().padStart(2, '0'));
      }
      return hours;
    },
    minutes() {
      // 生成分钟选项，假设从0到59，步长为15分钟
      const minutes = [];
      for (let i = 0; i < 60; i += 15) {
        minutes.push(i.toString().padStart(2, '0'));
      }
      return minutes;
    },
    singTimehours() {
      // 生成小时选项，假设从0到23
      const hours = [];
      for (let i = 1; i < 25; i++) {
        hours.push(i.toString().padStart(2, '0'));
      }
      return hours;
    },
  },
  created() {
  if (this.isLoggedIn) {
    this.$store.dispatch('fetchMemberProfile').then(() => {
      // 確保成功獲取會員資料後，設置 memberId
      this.order.memberId = this.member.memberId;
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
        memberId:'',
        hours: '', 
      },
    timeSlot: {
      date:'',
      startTime:'',
      endTime:'',
    },

  };
},

  mounted() {

},
  methods: {
    calculateEndTime() {
      const startHour = parseInt(this.order.startTime, 10); // 提取開始時間的小時部分
  const startMinute = parseInt(this.order.startTimeMinute, 10); // 提取開始時間的分鐘部分
  const singTime = parseInt(this.order.hours, 10); // 提取歡唱時間

  console.log('Start Hour:', startHour);
  console.log('Start Minute:', startMinute);
  console.log('Sing Time:', singTime);

  if (!isNaN(startHour) && !isNaN(startMinute) && !isNaN(singTime)) {

    let signHours = singTime; // 計算總共的小時數
    let totalHours =startHour + singTime
    console.log('Total Hours:', signHours);
    let endHour = totalHours % 24; // 如果超過 24 小時，取模運算，確保在一天內
    let endMinute = startMinute; // 結束時間的分鐘部分與開始時間相同

    // 更新結束時間
    this.order.endTime = `${endHour.toString().padStart(2, '0')}:${endMinute.toString().padStart(2, '0')}`;
    console.log('End Time:', this.order.endTime);
  }
},
     fetchMemberDetails() {
  if (!member.value || !member.value.idNumber) {
    console.error('Member idNumber is not available.');
    return;
  }
  // 此处需要修改URL来符合你的API设置
  axios.get(`http://localhost:8080/ktv-app/api/members/${member.value.idNumber}`)
    .then(response => {
      // 将会员详细信息设置给 data 中的 member 属性
      member.value = response.data;
    })
    .catch(error => {
      console.error('Error fetching member details:', error);
    });
},

  validateTimeRange() {
    // 在這裡添加適當的時間範圍驗證邏輯
  },
    submitForm() {
      console.log('提交表單人數:', this.order.numberOfPersons);
      if (!this.order.numberOfPersons) {
    alert('請選擇人數');
    return;
  }
        // 先新增新聞
        this.addOrder()
          .then(() => {

          })
          .catch(error => {
            console.error('Error message:', error.message);
            alert('訂位失敗！');
          });
      },
      addOrder() {
  // 第一步：建立訂單編號
  return axios.post('http://localhost:8080/ktv-app/ktvbackend/orders/createOrderId')
    .then(response => {
      console.log('新聞訂單編號成功:', response.data);
      this.order.orderId = response.data.orderId; // 將獲取的訂單ID保存到this.order中
      // 第二步：根據訂單編號創建新訂單
      return axios.post(`http://localhost:8080/ktv-app/ktvbackend/orders/newOrder/${response.data.orderId}`, this.order);
    })
    .then(response => {
      console.log('成功創建新訂單:', response.data);
      // 可以在這裡處理成功創建訂單後的邏輯

      // 返回響應數據，以便調用addOrder的地方可以繼續處理
      return response.data;
    })
    .catch(error => {
      console.error('錯誤訊息:', error.message);
      throw error; // 傳遞錯誤以便後續處理
    });
},
goHome() {
    // 使用路由導航回首頁
    this.$router.push({ path: '/' });
  },

      },
    generateTimeOptions() {
  const times = [];
  for (let hours = 0; hours < 24; hours++) {
    for (let minutes = 0; minutes < 60; minutes += 15) {
      const formattedTime = `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}`;
      times.push(formattedTime);
    }
  }
  this.times = times;
  this.selectedTime = times[0]; // 將第一個時間設置為默認選中時間
},

  };
</script>

<style>
.container {
  display: flex;
  justify-content: center;
  align-items: center;
}

.form {
  width: 400px; /* 設置表單的寬度 */
  padding: 20px;
  border: 1px solid #ccc;
  border-radius: 5px;
  background-color: #f9f9f9;
}

.form-group {
  margin-bottom: 10px;
}

label {
  display: block;
  margin-bottom: 5px;
}

input,
textarea,
select {
  width: calc(100% - 20px); /* 寬度減去padding值，防止寬度超出容器 */
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

</style>

