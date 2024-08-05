<template>
  <h5 class="room-title">我的訂單</h5>

  <!-- 只有在 member 不為 null 時才顯示會員資料 -->
  <div v-if="member" hidden class="member-info p">
    會員名稱: {{ member.memberName }} 電話: {{ member.phone }} 信箱: {{ member.email }}
  </div>

  <div class="container">
    <table class="order-table">
      <thead>
        <tr>
          <th>訂單編號</th>
          <th>人數</th>
          <th @click="sort('orderDate')">
            訂位日期
            <span v-if="sortKey === 'orderDate'" class="sort-arrow">{{ sortOrder === 'asc' ? '↑' : '↓' }}</span>
          </th>
          <th @click="sort('startTime')">
            開始時間
            <span v-if="sortKey === 'startTime'"></span>
          </th>
          <th>結束時間</th>
          <th>歡唱時數</th>
          <th>狀態</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="order in sortedOrders" :key="order.orderId">
          <td>{{ order.orderId }}</td>
          <td>{{ order.numberOfPersons }}</td>
          <td>{{ order.orderDate }}</td>
          <td>{{ order.startTime }}</td>
          <td>{{ order.endTime }}</td>
          <td>{{ order.hours }}</td>
          <td>
            <span v-if="order.status == '取消預約'" class="cancelled-text">已取消</span>
            <button v-if="order.status != '取消預約'" class="cancel-button"
              @click="confirmCancelOrder(order.orderId)">取消訂單</button>
          </td>
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
const cancelledOrders = ref([]);

const sortKey = ref('orderDate');
const sortOrder = ref('desc');

async function orderList() {
  const request = {
    start: 0,
    max: 1000,
    dir: false,
    order: "orderId",
    memberId: member.value?.memberId || null,
    room: null,
    orderId: null,
  };

  try {
    const response = await axios.post("/ktvbackend/orders/find", request);
    orders.value = response.data.list;
  } catch (error) {
    Swal.fire({
      icon: "error",
      title: "查詢失敗",
      text: error.message,
      showConfirmButton: true,
    });
  }
}

const sortedOrders = computed(() => {
  return orders.value.slice().sort((a, b) => {
    const aValue = sortKey.value === 'orderDate' ? new Date(a[sortKey.value]) : a[sortKey.value];
    const bValue = sortKey.value === 'orderDate' ? new Date(b[sortKey.value]) : b[sortKey.value];
    return sortOrder.value === 'asc' ? aValue - bValue : bValue - aValue;
  });
});

function sort(key) {
  if (sortKey.value === key) {
    sortOrder.value = sortOrder.value === 'asc' ? 'desc' : 'asc';
  } else {
    sortKey.value = key;
    sortOrder.value = 'asc';
  }
}
function confirmCancelOrder(orderId) {
  Swal.fire({
    title: '確定要取消訂單嗎?',
    text: "此操作不可恢復!",
    icon: 'warning',
    showCancelButton: true,
    confirmButtonColor: '#3085d6',
    cancelButtonColor: '#d33',
    confirmButtonText: '確認',
    cancelButtonText: '取消'
  }).then((result) => {
    if (result.isConfirmed) {
      cancelOrder(orderId);
    }
  });
}

async function cancelOrder(orderId) {
  try {
    const response = await axios.post("/ktvbackend/orders/noCheckIn/" + orderId, {});
    if (response.data.success) {
      Swal.fire({
        icon: "success",
        title: "取消成功",
        text: response.data.message,
        showConfirmButton: true,
      });
      cancelledOrders.value.push(orderId); // 更新已取消訂單列表
      location.reload();//重新刷新頁面
    } else {
      Swal.fire({
        icon: "error",
        title: "取消失敗",
        text: response.data.message,
        showConfirmButton: true,
      });
    }
  } catch (error) {
    Swal.fire({
      icon: "error",
      title: "取消訂單失敗",
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
  background-color: #861641;
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
  background-color: #ff85b3;
}

.title {
  margin-top: 5px;
  text-align: center;
}

/* 調整箭頭樣式 */
.sort-arrow {
  font-size: 18px;
  /* 調整箭頭大小 */
  color: #fff;
  /* 調整箭頭顏色 */
  margin-left: 5px;
  /* 調整箭頭與文本之間的間距 */
}

.order-table th {
  cursor: pointer;
  /* 更改表頭為可點擊樣式 */
  position: relative;
  /* 使箭頭可以絕對定位在表頭 */
}

/* 可選的箭頭定位 */
.order-table th span {
  position: absolute;
  right: 10px;
  /* 調整箭頭位置 */
  top: 50%;
  transform: translateY(-50%);
}

/* 已取消文本的樣式 */
.cancelled-text {
  font-weight: bold;
  /* 設置字體粗細 */
  color: #fff;
  /* 設置文本顏色，這裡使用紅色作為已取消的顯示顏色 */
}

/* 按鈕的樣式 */
.cancel-button {
  background-color: #861641;
  /* 按鈕背景顏色 */
  color: white;
  /* 按鈕文字顏色 */
  border: none;
  /* 去掉按鈕邊框 */
  padding: 8px 16px;
  /* 設置按鈕內邊距 */
  border-radius: 4px;
  /* 設置按鈕圓角 */
  cursor: pointer;
  /* 設置鼠標懸停時的樣式 */
  font-size: 14px;
  /* 設置按鈕文字大小 */
  font-weight: bold;
  /* 設置字體粗細 */
}

/* 按鈕懸停樣式 */
.cancel-button:hover {
  background-color: #890096;
  /* 按鈕懸停時的背景顏色 */
}

.room-title {
  margin-top: 40px;
  text-align: center;
  color: #fff;
  margin-bottom: 0px;
  font-size: 28px;
  font-weight: bold;
  background: none;
  text-shadow: 3px 3px 6px orange;
}

.no-order {
  text-align: center;
  font-size: 48px;
}
</style>
