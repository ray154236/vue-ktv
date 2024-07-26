<template>
    <div class="container">
      <!-- Store Information Section -->
      <div class="store-info">
        <!-- <h3>包廂照片</h3> -->
        <h5 class="room-title">包廂照片</h5>
        <ListPhoto></ListPhoto>
        <!-- YouTube 影片載入 -->
        <!-- <div class="video-container">
          <iframe
            width="560"
            height="315"
            src="https://www.youtube.com/embed/TbxibzpHyDA"
            title="YouTube video player"
            frameborder="0"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowfullscreen
          ></iframe>
        </div> -->
      </div>
  
      <!-- Room Details Section -->
      <div class="room-detail-container">
        <!-- 按鈕容器 -->
        <div class="button-container">
          <!-- 按鈕 -->
          <button @click="showInformation" class="info-button">包廂介紹</button>
           <!-- 顯示/隱藏 RoomAmount 的按鈕 -->
          <button @click="toggleRoomAmount" class="info-button">包廂價目表</button>
          <!-- 跳轉至訂位資訊 -->
          <router-link to="/booking" class="info-button">線上訂位</router-link> <!-- 修改為 info-button -->
        </div>

          <!-- RoomAmount 組件 -->
      <RoomAmount v-if="isRoomAmountVisible"></RoomAmount>

        <!-- 彈窗 -->
        <div v-if="isInformationVisible" class="overlay" @click.self="hideInformation">
          <div class="alert-popup">
            <p>
                <h5>包廂類型：</h5>
                小型包廂：適合小型聚會，通常可以容納6人。<br>  
                中型包廂：適合家庭或小型聚會，容納7-10人。<br>
                大型包廂：適合較大的團體，容納11-20人。<br>
            </p>
            <p>
                <h5>設施：</h5>
                音響設備：高品質的音響系統，提供清晰的音效和深沉的低音。<br>
                點歌系統：先進的點歌系統，支持多語言歌曲和歌詞顯示。<br>
                娛樂設備：如電子遊戲、桌上足球等娛樂設施。<br>
                舒適座椅：舒適的沙發或座椅，提供良好的休息體驗。<br>
                燈光效果：多彩的燈光效果，創造出氣氛活潑的環境。<br>
            </p>
            <p>
                <h5>包廂裝潢：</h5>
                主題風格：不同主題的裝潢，如現代風、豪華風、復古風等。<br>
                裝飾元素：包括牆面裝飾、地毯、窗簾等，提升視覺效果。<br>
            </p>
            <p>
                <h5>服務：</h5>
                餐飲服務：提供多樣的飲料和小吃，或是完整的餐點服務。<br>
                專業服務：如歌唱指導、音響調試等專業服務。<br>
            </p>
            <button @click.stop="hideInformation" class="btn btn-outline-danger">關閉</button>
          </div>
        </div>
        <hr>
        <!-- Room Type Descriptions -->
        <div class="room-type-container">
          <p>小包-建議人數6位</p>
          <p>中包-建議人數7-10位</p>
          <p>大包-建議人數11-20位</p>
        </div>
        
        <!-- Photo Grid -->
        <div class="photo-grid">
          <div 
            v-for="photo in photos" 
            :key="photo.id" 
            class="photo-item"
            @click="showPhotoDetails(photo)"
          >
            <img :src="`data:image/jpeg;base64,${photo.photoFile}`" :alt="photo.description" />
          </div>
        </div>
  
        <!-- Photo Details Modal -->
        <div v-if="selectedPhoto" class="photo-details" @click="closePhotoDetails">
          <div class="photo-details-content" @click.stop>
            <button @click="closePhotoDetails" class="close-button">&times;</button>
            <img :src="`data:image/jpeg;base64,${selectedPhoto.photoFile}`" :alt="selectedPhoto.description" class="detail-image" />
            <p class="detail-description">{{ selectedPhoto.description }}</p>
          </div>
        </div>
      </div>
    </div>
  </template>

  <script setup>
  import { ref, onMounted } from 'vue';
  import axios from 'axios';
  import ListPhoto from './ListPhoto.vue';
  import RoomAmount from './RoomAmount.vue';

  const photos = ref([]);
  const selectedPhoto = ref(null);
  const isInformationVisible = ref(false);
  const isRoomAmountVisible = ref(false);
  
  async function fetchPhotos() {
    try {
      const response = await axios.get('http://localhost:8080/ktv-app/photos/findAll');
      photos.value = response.data;
    } catch (error) {
      console.error('Error fetching photos:', error);
      photos.value = [];
    }
  }
  
  function showPhotoDetails(photo) {
    selectedPhoto.value = photo;
  }
  
  function closePhotoDetails() {
    selectedPhoto.value = null;
  }
  
  function showInformation() {
    isInformationVisible.value = true;
  }
  
  function hideInformation() {
    isInformationVisible.value = false;
  }
  
  function toggleRoomAmount() {
    isRoomAmountVisible.value = !isRoomAmountVisible.value; // 切換顯示狀態
  }

  onMounted(fetchPhotos);
  </script>

<style scoped>
.container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 20px;
  background-color: transparent; /* 去掉白底 */
}

.store-info {
  margin-bottom: 40px;
  text-align: center;
}

.store-info h3 {
  font-size: 28px;
  color: #ff69b4; /* 粉色 */
  font-weight: bold;
  text-shadow: 3px 3px 6px rgba(0, 0, 0, 0.7); /* 加深陰影 */
}

.store-info .svg-icon {
  background: url('/ezfiles/907/1907/img/3887/arrow-down.svg') no-repeat center center;
  width: 27px;
  height: 14px;
  display: inline-block;
}

.store-info p {
  color: #333;
  line-height: 1.6;
}

.beautified-text {
  font-family: 'Arial', sans-serif;
  text-align: justify;
  margin: 0 auto;
  max-width: 800px;
}

.smaller-text {
  font-size: 16px; /* 調整字體大小 */
}

.video-container {
  margin: 20px auto;
  text-align: center;
}

.video-container iframe {
  width: 1000px; /* 增大影片寬度 */
  height: 563px; /* 增大影片高度 */
}

.room-detail-container {
  background-color: transparent; /* 去掉灰底 */
  border-radius: 8px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  padding: 20px;
}

.room-title {
  text-align: center;
  color: #fff;
  margin-bottom: 20px;
  font-size: 28px;
  font-weight: bold;
  background: none; /* 去掉背景 */
  text-shadow: 3px 3px 6px orange; /* 加深陰影 */
}

.room-type-container {
  display: flex;
  justify-content: space-around;
  margin-bottom: 20px;
}

.room-type-container p {
  font-size: 20px; /* 增大字體大小 */
  color:white;
  font-weight: bold; /* 加粗字體 */
}

.photo-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr); /* 四格顯示 */
  gap: 25px; /* 增大間距 */
}

.photo-item {
  cursor: pointer;
  border-radius: 8px;
  overflow: hidden;
  position: relative;
  height: 200px; /* 設置一致的高度 */
  border: 4px dashed white; /* 外框顏色 */
  transition: border-color 0.3s ease; /* 外框顏色變化 */
}

.photo-item img {
  width: 100%;
  height: 100%; /* 確保圖片填滿容器 */
  object-fit: cover;
  transition: transform 0.3s ease;
}

.photo-item:hover {
  border-color: #ff69b4; /* 鼠標懸停時外框顏色 */
}

.photo-item:hover img {
  transform: scale(1.05);
}

.photo-details {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.8);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
}

.photo-details-content {
  position: relative;
  background: rgba(0, 0, 0, 0.9);
  border-radius: 8px;
  padding: 20px;
  text-align: center;
  max-width: 80%; /* 確保圖片最大寬度 */
  max-height: 80%; /* 確保圖片最大高度 */
}

.close-button {
  position: absolute;
  top: 10px;
  right: 10px;
  font-size: 36px;
  color: #fff;
  background: none;
  border: none;
  cursor: pointer;
}

.detail-image {
  max-width: 100%;
  max-height: 60vh; /* 調整圖片高度 */
  object-fit: contain;
}

.detail-description {
  color: #fff;
  margin-top: 10px;
  font-size: 16px;
}

.button-container {
  text-align: center; /* 使按鈕居中 */
}

.info-button {
  display: inline-block;
  background-color: #ff69b4; /* 粉色背景 */
  color: #fff;
  border: none;
  padding: 10px 20px;
  font-size: 16px;
  font-weight: bold;
  border-radius: 5px;
  text-decoration: none;
  transition: background-color 0.3s ease;
  margin: 0 10px; /* 按鈕間距 */
}

.info-button:hover {
  background-color: #ff85b3; /* 鼠標懸停時的顏色 */
}

.info-button:focus {
  outline: none;
}

.overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
}

.alert-popup {
  background: #fff;
  padding: 20px;
  border-radius: 8px;
  width: 80%;
  max-width: 600px;
  text-align: center;
  position: relative;
}
</style>
