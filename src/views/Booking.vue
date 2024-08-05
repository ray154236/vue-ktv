<template>
  <div class="container">

    <form @submit.prevent="submitForm" class="form" v-if="member">
      <div class="form-group">
        <h1 class="room-title">線上訂位</h1>
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
          <option value="1">1</option>
          <option value="2">2</option>
          <option value="3">3</option>
          <option value="4">4</option>
          <option value="5">5</option>
          <option value="6">6</option>
          <option value="7">7</option>
          <option value="8">8</option>
          <option value="9">9</option>
          <option value="10">10</option>
          <option value="11">11</option>
          <option value="12">12</option>
          <option value="13">13</option>
          <option value="14">14</option>
          <option value="15">15</option>
          <option value="16">16</option>
          <option value="17">17</option>
          <option value="18">18</option>
          <option value="19">19</option>
          <option value="20">20</option>

        </select>
      </div>
      <div class="form-group">
        <label>訂位日期:</label>
        <input type="date" v-model="order.orderDate" required @input="resetTime" :min="minDate">
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
            <p class="endtime">{{ order.endTime }}</p>
          </div>
          <div class="col-md-4">
            <label>歡唱時間(小時):</label>
            <select class="form-control" v-model="order.hours" @change="calculateEndTime">
              <option v-for="hour in singTimehours" :key="'singTime-' + hour" :value="hour">{{ hour }}</option>
            </select>
          </div>
        </div>
      </div>
      <div class="button-group">
        <!-- 返回按鈕 -->
        <button type="button" @click="goBack" class="return-button button-large">返回</button>
        <button type="submit">訂位</button>
      </div>
    </form>

  </div>
</template>

<script>
import axios from 'axios';
import Swal from 'sweetalert2';
import { useStore } from 'vuex';
import { useRouter } from 'vue-router';
import { ref } from 'vue';

export default {

  computed: {
    member() {
      console.log('目前會員狀態:', this.$store.state.member);
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
        createBy: '',
        updateBy: '',
      },
      minDate: new Date().toISOString().split('T')[0]
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

      // 更新可選的時間範圍
      this.calculateEndTime();

      return true;
    },

    resetTime() {
      // 重置時間選擇框
      this.order.startTime = '';
      this.order.startTimeMinute = '';
      this.order.endTime = '';
    },

    submitForm() {
      const orderData = {
        ...this.order,
        memberId: this.member.memberId,
        createBy: this.member.memberId,
        updateBy: this.member.memberId,
        createTime: new Date().toISOString(),
        startTime: `${this.order.startTime.padStart(2, '0')}:${this.order.startTimeMinute.padStart(2, '0')}`
      };
      console.log("orderData", orderData)
      // 发起第一次请求
      axios.post('/ktv-app/roomCheck', orderData)
        .then(response => {
          console.log('roomCheck response:', response);

          if (response.data.success) {
            // 如果第一次请求成功，发起第二次请求
            return axios.post('/ktv-app/ktvbackend/orders/testNewOrder', orderData);
          } else {
            // 如果第一次請求失敗，顯示提示框
            return Swal.fire({
              icon: 'question',
              text: response.data.message,
              allowOutsideClick: false,
              showConfirmButton: true,
              showCancelButton: true
            }).then(result => {
              if (result.isConfirmed) {
                // 用户确认后发起第二次请求
                return axios.post('/ktv-app/ktvbackend/orders/testNewOrder', orderData);
              } else {
                // 使用者取消了操作，關閉彈窗
                Swal.close();
                // 返回一個空的 Promise，以確保鏈式調用不會繼續
                return Promise.resolve();
              }
            });
          }
        }).catch(function (error) {
          console.log("newOrderError = ", error.message)
        })
        .then(response => {
          if (response && response.data && response.data.success) {
            // 如果第二次請求成功，顯示成功提示並跳轉
            return Swal.fire({
              icon: 'success',
              title: '訂位成功',
              text: response.data.message,
            }).then(() => {
              this.$router.push({ path: '/orderlist' });
            });
          }
        })
        .catch(error => {
          // 捕捉並處理任何錯誤
          console.error('Error occurred:', error);

          Swal.fire({
            icon: 'error',
            title: '訂位失敗',
            text: error.message || '訂位過程中發生錯誤。',
          });
        });
    },
    goBack() {
      this.$router.go(-1); // 返回到上一頁
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

.room-title {
  text-align: center;
  color: #fff;
  margin-bottom: 20px;
  font-size: 28px;
  font-weight: bold;
  background: none;
  text-shadow: 3px 3px 6px orange;
}

.form {
  color: white;
  width: 600px;
  padding: 20px;
  border: 1px solid rgba(0, 0, 0, 0);
  /* 淡色透明邊框 */
  border-radius: 8px;
  /* 圓角邊框 */
  background-color: rgba(255, 255, 255, 0);
  /* 完全透明背景色 */
  margin-top: 20px;
  margin-bottom: 5%;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0);
  /* 柔和的陰影效果 */
  backdrop-filter: blur(0px);
  /* 背景模糊效果 */
}

/* 動畫效果 */
@keyframes fadeIn {
  from {
    opacity: 0;
  }

  to {
    opacity: 1;
  }
}

@keyframes slideInFromTop {
  from {
    transform: translateY(-20px);
    opacity: 0;
  }

  to {
    transform: translateY(0);
    opacity: 1;
  }
}

@keyframes fadeOut {
  from {
    opacity: 1;
  }

  to {
    opacity: 0;
  }
}

/* 表單過渡動畫 */
.form-enter-active,
.form-leave-active {
  animation-duration: 0.5s;
}

.form-enter,
.form-leave-to

/* .form-leave-active in <2.1.8 */
  {
  animation-name: slideInFromTop;
}

.form-enter-active {
  animation-name: fadeIn;
}

.form-leave-active {
  animation-name: fadeOut;
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
  width: calc(100% - 20px);
  padding: 8px;
  margin-bottom: 10px;
  border: 1px solid #ccc;
  border-radius: 3px;
  transition: border-color 0.3s ease, box-shadow 0.3s ease;
  /* 添加過渡動畫 */
}

input:focus,
select:focus {
  border-color: #007BFF;
  /* 聚焦時邊框顏色 */
  box-shadow: 0 0 5px rgba(0, 123, 255, 0.5);
  /* 聚焦時陰影效果 */
}

.button-group {
  display: flex;
  justify-content: space-between;
  /* 使按鈕兩邊對齊，並分開 */

}

.button-group button {
  flex: 1;
  /* 按鈕寬度填滿父容器的寬度 */
  margin: 0 10px;
  /* 在按鈕左右增加間距 */
  text-align: center;
  padding: 4px 20px;
  padding-bottom: 5px;
  font-size: 18px;
  cursor: pointer;
  font-weight: 800;
  border-radius: 4px;
  background-color: #f06292;
  height: 40px;
  color: white;
  margin-top: 10px;
}

button:hover {
  background-color: #681736;
}

button:active {
  transform: scale(0.98);
  /* 點擊時稍微縮小 */
}

.return-button {
  margin-top: 20px;
}

.col-md-4 {
  flex: 0 0 33.33%;
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

.endtime {
  color: white;
}
</style>