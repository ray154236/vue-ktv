<template>
  <!-- 頁面標題 -->
  <h2 class="title">我的訂單</h2>

  <!-- 會員資訊區域 -->
  <div class="member-info p ">會員名稱:{{ member.memberName }} 電話:{{ member.phone }} 信箱:{{ member.email }} </div>
  <div class="container">




    <!-- 訂單表格區域 -->
    <table class="order-table">
      <thead>
        <tr>
          <!-- 表頭列標題和排序功能 -->
          <th>訂單編號</th>
          <th>人數</th>
          <th @click="sort('orderDate')">
            訂位日期
            <!-- 顯示排序方向的箭頭 -->
            <span v-if="sortKey === 'orderDate'">{{ sortOrder === 'asc' ? '↑' : '↓' }}</span>
          </th>
          <th @click="sort('startTime')">
            開始時間
            <!-- 顯示排序方向的箭頭 -->
            <span v-if="sortKey === 'startTime'">{{ sortOrder === 'asc' ? '↑' : '↓' }}</span>
          </th>
          <th>結束時間</th>
          <th>歡唱時數</th>
        </tr>
      </thead>
      <tbody>
        <!-- 使用 v-for 指令渲染每一行訂單 -->
        <tr v-for="order in sortedOrders" :key="order.orderId">
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
import { ref, onMounted, computed } from 'vue';  // 引入 Vue 的響應式 API
import { useStore } from 'vuex';  // 引入 Vuex 用於狀態管理
import axios from '../axios';  // 引入 axios 用於發送 HTTP 請求
import Swal from 'sweetalert2';  // 引入 SweetAlert2 用於顯示彈窗

const store = useStore();  // 獲取 Vuex store 實例
const orders = ref([]);  // 定義響應式數據用於存儲訂單列表
const member = computed(() => store.getters.member);  // 計算屬性從 Vuex store 中獲取會員資訊

// 排序狀態
const sortKey = ref('orderDate');  // 預設按訂位日期排序
const sortOrder = ref('asc');  // 排序順序，預設為升序

// 分頁計算
const start = ref(0);  // 數據起始位置
const current = ref(1);  // 當前頁碼
const rows = ref(10);  // 每頁顯示的行數
const total = ref(0);  // 總記錄數
const pages = ref(0);  // 總頁數
const lastPageRows = ref(0);  // 最後一頁的記錄數

// 異步函數獲取訂單列表
async function orderList(page) {
  if (page) {
    start.value = page - 1;  // 計算起始記錄位置
    current.value = page;  // 更新當前頁碼
  } else {
    start.value = 0;  // 預設從第一頁開始
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
    orders.value = response.data.list;  // 更新訂單數據
    total.value = response.data.count;  // 更新總記錄數
    pages.value = Math.ceil(total.value / rows.value);  // 計算總頁數
    lastPageRows.value = total.value % rows.value;  // 計算最後一頁的記錄數
  } catch (error) {
    Swal.fire({
      icon: "error",
      title: "查詢失敗",
      text: error.message,
      showConfirmButton: true,
    });
  }
}

// 計算排序後的訂單列表
const sortedOrders = computed(() => {
  return orders.value.slice().sort((a, b) => {
    // 處理日期排序
    const aValue = sortKey.value === 'orderDate' ? new Date(a[sortKey.value]) : a[sortKey.value];
    const bValue = sortKey.value === 'orderDate' ? new Date(b[sortKey.value]) : b[sortKey.value];
    return sortOrder.value === 'asc' ? aValue - bValue : bValue - aValue;
  });
});

// 切換排序的函數
function sort(key) {
  if (sortKey.value === key) {
    // 如果當前排序字段和點擊字段一致，則切換排序順序
    sortOrder.value = sortOrder.value === 'asc' ? 'desc' : 'asc';
  } else {
    // 如果當前排序字段和點擊字段不一致，則設置新的排序字段，預設為升序
    sortKey.value = key;
    sortOrder.value = 'asc';
  }
}

// 在組件掛載後調用 orderList 函數
onMounted(async () => {
  if (!member.value) {
    await store.dispatch('fetchMemberProfile');  // 如果會員資訊不存在，則請求會員資訊
  }
  orderList();  // 獲取訂單列表
});
</script>

<style scoped>
.container {
  max-width: 1200px;
  /* 調整容器的最大寬度 */
  margin: 0 auto;
  /* 使容器居中 */
  padding: 20px;
  /* 增加內邊距 */
  color: #fff;
  text-align: center;
  /* 使容器內部的內容居中 */
}

.header {
  display: flex;
  justify-content: center;
  /* 使標題居中 */
  align-items: center;
  margin-bottom: 20px;
  font-weight: 800;
}

h2 {
  color: #ddd;
  font-weight: 800;
  margin: 0;
  white-space: nowrap;
  /* 防止換行 */
  overflow: hidden;
  /* 隱藏溢出的文字 */
  text-overflow: ellipsis;
  /* 顯示省略號以防文字溢出 */
}

.member-info {
  margin-bottom: 20px;
  /* 增加底部間距 */
  padding: 20px;
  /* 增加內邊距 */

  color: #fff;
  /* 文字顏色 */
  border-radius: 8px;
  /* 圓角 */
  text-align: center;
  /* 使文本居中 */
}

.member-info p {
  margin: 2px 0;
  /* 增加上下間距 */
  font-weight: 400;
  /* 更改文字加粗程度 */
  font-size: 24px;
  /* 增加字體大小 */
}

.order-table {
  width: 100%;
  /* 確保表格寬度與容器一致 */
  border-collapse: collapse;
  /* 使用 collapse 使邊框合併 */
  border-radius: 8px;
  /* 添加圓角 */
  overflow: hidden;
  /* 隱藏溢出的部分 */
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  /* 添加陰影 */
  display: inline-table;
  /* 使表格成為內聯塊元素，以便於居中 */
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
  cursor: pointer;
  /* 鼠标指针样式 */
}

.order-table th {
  color: #fff;
}

.order-table tbody tr:hover {
  background-color: #d49f9f;
}

.title {
  margin-top: 5px;
  text-align: center;
}
</style>
