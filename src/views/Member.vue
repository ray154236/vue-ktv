<template>
   <h5 class="room-title">會員基本資料</h5>
  <div class="member-container">
    <!-- 會員頭像和基本資料 -->
    <div class="member-profile">
      <div class="profile-picture" @click="triggerFileInput">
        <img :src="profilePicture" alt="Profile Picture">
        <input type="file" ref="fileInput" @change="handleFileChange" accept="image/*" hidden>
      </div>
      <div class="profile-info">
        <div v-if="member" class="info-list">
          <p><strong>會員編號:</strong> {{ member.memberId }}</p>
          <p><strong>身分證字號:</strong> {{ member.idNumber }}</p>
          <p><strong>會員名稱:</strong> {{ member.memberName }}</p>
          <p><strong>電話:</strong> {{ member.phone }}</p>
          <p><strong>生日:</strong> {{ formatDate(member.birth) }}</p>
          <p><strong>Email:</strong> {{ member.email }}</p>
          <!-- <p><strong>狀態:</strong> {{ member.status }}</p> -->
        </div>
      </div>
    </div>

    <!-- 右側：功能按鈕 -->
    <div class="member-actions">
      <button @click="goToProfile">修改基本資料</button>
      <button @click="goToReservation">立即訂位</button>
      <button @click="goToReservationQuery">訂位查詢</button>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue';
import { useStore } from 'vuex';
import { useRouter } from 'vue-router';

const store = useStore();
const router = useRouter();
const fileInput = ref(null);
const profilePicture = ref('/src/assets/member.jpg'); // 預設圖片

const member = computed(() => store.getters.member);

onMounted(() => {
  if (!member.value) { // 檢查是否存在會員資料
    store.dispatch('fetchMemberProfile');
  }
});

function formatDate(dateString) {
  const date = new Date(dateString);
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0'); // 月份從 0 開始，所以需要加 1
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

function goToProfile() {
  router.push('/member-profile');
}

function goToReservation() {
  router.push('/booking');
}

function goToReservationQuery() {
  router.push('/orderlist');
}

function triggerFileInput() {
  fileInput.value.click();
}

function handleFileChange(event) {
  const file = event.target.files[0];
  if (file) {
    uploadFile(file);
  }
}

async function uploadFile(file) {
  const formData = new FormData();
  formData.append('file', file);

  try {
    const memberId = member.value.idNumber;
    const response = await fetch(`/ktv-app/api/upload-profile-image/${memberId}`, {
      method: 'POST',
      body: formData,
    });

    const contentType = response.headers.get('Content-Type');
    let result;

    if (contentType && contentType.includes('application/json')) {
      // 解析 JSON
      result = await response.json();
      console.log('上傳結果 (JSON):', result);
      updateProfilePicture(result.imageUrl);
    } else {
      // 解析純文本
      const text = await response.text();
      console.log('上傳結果 (純文本):', text);
      if (text.includes('成功')) {
        updateProfilePicture(`/ktv-app/api/profile-image/${member.value.idNumber}`);
        alert('圖片上傳成功！');
      } else {
        alert('圖片上傳失敗。');
      }
    }
  } catch (error) {
    console.error('圖片上傳錯誤:', error);
    alert('圖片上傳過程中發生錯誤。');
  }
}

function updateProfilePicture(url) {
  if (url) {
    // 更新為實際的圖片 URL
    profilePicture.value = `${url}?t=${new Date().getTime()}`; // 防止緩存
  } else {
    // 使用預設圖片
    profilePicture.value = '/src/assets/member.jpg';
  }
  localStorage.setItem('profilePicture', profilePicture.value);
  console.log('Updated profile picture URL:', profilePicture.value);
}

onMounted(async () => {
  // 確保從 API 獲得的會員資料
  await store.dispatch('fetchMemberProfile');
  const memberData = store.getters.member;

  if (memberData) {
    // 根據會員資料設置圖片
    if (memberData.image) {
      updateProfilePicture(`/ktv-app/api/profile-image/${memberData.idNumber}`);
    } else {
      // 如果沒有圖片，設置預設圖片
      updateProfilePicture(null);
    }
  }
});

</script>

<style scoped>
.member-container {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  max-width: 900px;
  margin: 0 auto;

  border-radius: 8px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
}

.member-profile {
  display: flex;
  flex-direction: column; /* 改變排列方向為縱向 */
  align-items: center;
  flex: 1;
  border-radius: 8px;
  padding: 20px;
}

.profile-picture {
  margin-left: -450px;
  width: 200px;
  height: 200px;
  border-radius: 50%;
  overflow: hidden;
  border: 2px solid orange;
  margin-bottom: 2px;
  cursor: pointer;
  position: relative;
}

.profile-picture img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.profile-info {
  width: 100%;
}

.profile-info h2 {
  margin-bottom: 4px;
  font-size: 36px;
  font-weight: 800;
  color: #ffffff
}

.info-list p {
  margin: 10px 0;
  font-size: 22px;
  font-weight: 800;
  color: #ffffff;
}
.member-actions {
 margin-top: 20px;
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  flex-basis: 200px;
}
.member-actions button {
  margin-bottom: 15px;
  padding: 12px 24px;
  font-size: 22px;
  cursor: pointer;
  border: none;
  border-radius: 5px;
  color: #fff;
  background-color: #ff85b3;
  font-weight: 800;
  transition: background-color 0.3s, transform 0.2s;
}

.member-actions button:hover {
  background-color: #681736;
}

.member-actions button:active {
  transform: scale(0.98);
}

.member-actions button:focus {
  outline: none;
}
.room-title {
  margin-top: 40px;
  text-align: center;
  color: #fff;
  margin-bottom: 20px;
  font-size: 28px;
  font-weight: bold;
  background: none;
  text-shadow: 3px 3px 6px orange;
}
</style>
