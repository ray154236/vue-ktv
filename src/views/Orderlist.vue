<template>
  <div class="container">
    <div class="header">
      <h2>我的訂單</h2>
    </div>
    <table class="order-table">
      <thead>
        <tr>
          <th colspan="6" class="member-info">
            <p><strong>會員名稱:</strong> {{ member.memberName }}</p>
            <p><strong>電話:</strong> {{ member.phone }}</p>
            <p><strong>信箱:</strong> {{ member.email }}</p>
          </th>
        </tr>
        <tr>
          <th>訂單編號</th>
          <th>人數</th>
          <th>訂位日期</th>
          <th>開始時間</th>
          <th>結束時間</th>
          <th>歡唱時數</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="order in orders" :key="order.orderId">
          <td>{{ order.orderId }}</td>
          <td>{{ order.numberOfPersons }}</td>
          <td>{{ order.orderDate }}</td>
          <td>{{ order.startTime }}</td>
          <td>{{ order.endTime }}</td>
          <td>{{ order.hours }}</td>
        </tr>
      </tbody>
    </table>
  </div>
</template>


<script setup>
import { ref, onMounted, computed } from 'vue';
import { useStore } from 'vuex';
import axios from '../axios';
import Swal from 'sweetalert2';

const store = useStore();
const orders = ref([]);
const member = computed(() => store.getters.member);

// 分頁計算
const start = ref(0);
const current = ref(1);
const rows = ref(10);
const total = ref(0);
const pages = ref(0);
const lastPageRows = ref(0);

async function orderList(page) {
  if (page) {
    start.value = page - 1;
    current.value = page;
  } else {
    start.value = 0;
    current.value = 1;
  }

  const request = {
    start: start.value,
    max: rows.value,
    dir: false,
    order: "orderId",
    memberId: member.value?.memberId || null,
    room: null,
    orderId: null,
  };

  try {
    const response = await axios.post("http://localhost:8080/ktv-app/ktvbackend/orders/find", request);
    orders.value = response.data.list;
    total.value = response.data.count;
    pages.value = Math.ceil(total.value / rows.value);
    lastPageRows.value = total.value % rows.value;
  } catch (error) {
    Swal.fire({
      icon: "error",
      title: "查詢失敗",
      text: error.message,
      showConfirmButton: true,
    });
  }
}

onMounted(async () => {
  if (!member.value) {
    await store.dispatch('fetchMemberProfile');
  }
  orderList();
});
</script>

<style scoped>
.container {
  max-width: 1200px; /* 調整容器的最大寬度 */
  margin: 0 auto; /* 使容器居中 */
  padding: 20px; /* 增加內邊距 */
  color: #fff
}

.header {
  display: flex;
  justify-content: center; /* 使標題居中 */
  align-items: center;
  margin-bottom: 20px;
  font-weight: 800;
}

h2 {
  color: #ddd;
  font-weight: 800;
  margin-top: -120px;
  margin-right: 20px;
  white-space: nowrap; /* 防止換行 */
  overflow: hidden; /* 隱藏溢出的文字 */
  text-overflow: ellipsis; /* 顯示省略號以防文字溢出 */
}

.order-table {
  width: 100%;
  border-collapse: separate;
  border-spacing: 0;
  margin-top: 20px;
  border-radius: 8px; /* 添加圓角 */
  overflow: hidden; /* 隱藏溢出的部分 */
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1); /* 添加陰影 */
}

.order-table thead {
  background-color: #4f51c4;
}

.order-table th, 
.order-table td {
  border: 1px solid #ddd;
  padding: 12px;
  text-align: center;
  font-weight: 800;
  
}

.order-table th {
  color: #fff;
  font-weight: 800;
}

.order-table tbody tr:hover {
  background-color: #d49f9f;
}

.member-info {
  display: flex;
  flex-direction: column;
  align-items: center;
  color: #ddd;
  font-weight: 800;
}

.member-info p {
  margin: 0;
  font-weight: 800;
  color: #ddd;
}
</style>
