<template>
    <div>
      <h2>搜尋單張圖片</h2>
      <input type="text" v-model="photoId" placeholder="輸入圖片ID" />
      <button @click="fetchPhoto">顯示圖片</button>
      <div v-if="photoUrl">
        <img :src="photoUrl" alt="圖片" />
      </div>
      <p v-if="fetchStatus">{{ fetchStatus }}</p>
    </div>
  </template>
  
  <script setup>
  import { ref } from 'vue';
  import axios from 'axios';
  
  const photoId = ref('');
  const photoUrl = ref('');
  const fetchStatus = ref('');

  function fetchPhoto() {
    if (!photoId.value) {
      fetchStatus.value = '請輸入圖片ID';
      return;
    }
  
    // 重置圖片 URL 以便顯示新的圖片
    photoUrl.value = '';
    fetchStatus.value = '';
  
    axios.get(`http://localhost:8080/ktv-app/photos/findImage/${photoId.value}`, {
      responseType: 'blob' // 確保接收的數據是二進位形式
    })
    .then(function(response) {
      // 將二進位數據轉為 URL
      const url = URL.createObjectURL(response.data);
      photoUrl.value = url;
      fetchStatus.value = '圖片載入成功';
    })
    .catch(function(error) {
      console.log("error=", error);
      fetchStatus.value = '載入失敗: ' + error.message;
    });
  }
  </script>
  
  <style scoped>
img {
  width: 300px; /* 設置圖片寬度 */
  height: 200px; /* 設置圖片高度 */
  object-fit: cover; /* 確保圖片以適當的方式填滿容器 */
}
</style>
