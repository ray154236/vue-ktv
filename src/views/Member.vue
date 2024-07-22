<template>
  <div class="member-container">
    <!-- 左側：會員頭像和部分基本資料 -->
    <div class="member-profile">
      <div class="profile-picture">
        <!-- 圓形圖片，可以讓使用者自行上傳 -->
        <img src="/src/assets//member.jpg" alt="Profile Picture">
      </div>
      <div class="profile-info">
        <div v-if="member">
          <p><strong>會員編號:</strong> {{ member.memberId }}</p>
          <p><strong>帳號:</strong> {{ member.idNumber }}</p>
          <p><strong>會員名稱:</strong> {{ member.memberName }}</p>
          <p><strong>電話:</strong> {{ member.phone }}</p>
          <p><strong>生日:</strong> {{ member.birth }}</p>
          <p><strong>Email:</strong> {{ member.email }}</p>
          <p><strong>狀態:</strong> {{ member.status }}</p>
        </div>
        <!-- 根據需要顯示其他資料 -->
      </div>
    </div>

    <!-- 右側：功能按鈕 -->
    <div class="member-actions">
      
      <router-link to="/member-profile">修改基本資料</router-link>
      <button @click="goToReservation">立即訂位</button>
      <button @click="goToReservationQuery">訂位查詢</button>
    </div>
  </div>
</template>

<script setup>
import { useStore } from 'vuex';
import { useRouter } from 'vue-router';

const store = useStore();
const router = useRouter();

const member = store.state.member; // 假設你的 store 中有一個 member 的 state

function goToReservation() {
  // 跳轉到訂位功能頁面的邏輯
}

function goToReservationQuery() {
  // 跳轉到訂位查詢功能頁面的邏輯
}
</script>

<style scoped>
/* 根據需要添加樣式 */
.member-container {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  max-width: 800px;
  margin: 0 auto;
  padding: 20px;
}

.member-profile {
  display: flex;
  align-items: center;
}

.profile-picture {
  width: 120px;
  height: 120px;
  border-radius: 50%;
  overflow: hidden;
  margin-right: 20px;
}

.profile-picture img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.profile-info {
  border: 1px solid #ccc;
  padding: 10px;
}

.info-item {
  margin-bottom: 10px;
}

.member-actions {
  display: flex;
  flex-direction: column;
}

.member-actions button,
.member-actions a {
  margin-bottom: 10px;
  padding: 10px 20px;
  font-size: 16px;
  cursor: pointer;
  text-decoration: none;
  color: inherit;
}
</style>
