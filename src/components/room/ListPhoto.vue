<template>
    <div class="room-detail-container">
      <!-- <h1 class="room-title">包廂照片</h1> -->
      <div class="carousel" 
           @mouseenter="stopAutoSlide" 
           @mouseleave="startAutoSlide">
        <div class="carousel-images" :style="carouselStyles">
          <div v-for="photo in photos" :key="photo.id" class="carousel-slide">
            <img :src="`data:image/jpeg;base64,${photo.photoFile}`" :alt="photo.description" @click="callout" />
          </div>
        </div>
        <button @click="prevSlide" class="carousel-button prev">&#10094;</button>
        <button @click="nextSlide" class="carousel-button next">&#10095;</button>
      </div>
      <div class="photo-description">
        <p v-if="currentPhoto">{{ currentPhoto.description }}</p>
      </div>
      <div class="thumbnail-container">
        <div 
          v-for="index in visibleThumbnailIndices" 
          :key="index" 
          class="thumbnail"
          :class="{ active: index === currentIndex.value }"
          @click="goToSlide(index)"
        >
          <img :src="`data:image/jpeg;base64,${photos[index].photoFile}`" :alt="photos[index].description" />
        </div>
      </div>
    </div>
  </template>
  
  <script setup>
  import { ref, onMounted, computed, onUnmounted } from 'vue';
  import axios from 'axios';
  
  function fetchPhotos() {
    return axios.get('http://localhost:8080/ktv-app/photos/findAll')
      .then(response => response.data)
      .catch(error => {
        console.error('Error fetching photos:', error);
        return [];
      });
  }
  
  const photos = ref([]);
  const currentIndex = ref(0);
  
  const currentPhoto = computed(() => photos.value[currentIndex.value]);
  
  const carouselStyles = computed(() => {
    return {
      transform: `translateX(-${currentIndex.value * 100}%)`,
      transition: 'transform 0.5s ease-in-out'
    };
  });
  
  // Define how many thumbnails to show
  const visibleThumbnailCount = 7;
  
  const visibleThumbnailIndices = computed(() => {
    const totalPhotos = photos.value.length;
    if (totalPhotos === 0) return [];
  
    const halfVisibleCount = Math.floor(visibleThumbnailCount / 2);
    const startIndex = Math.max(0, currentIndex.value - halfVisibleCount);
    const endIndex = Math.min(totalPhotos, startIndex + visibleThumbnailCount);
  
    // Adjust startIndex if endIndex is less than visibleThumbnailCount
    const adjustedStartIndex = Math.max(0, endIndex - visibleThumbnailCount);
  
    return Array.from({ length: visibleThumbnailCount }, (_, i) => adjustedStartIndex + i).filter(index => index < totalPhotos);
  });
  
  // Set up automatic slide change every 3 seconds
  let intervalId = null;
  
  function callout(){
    console.log("看要不要製作跳轉介面");
  }

  function startAutoSlide() {
    if (!intervalId) {
      intervalId = setInterval(nextSlide, 2000);
    }
  }
  
  function stopAutoSlide() {
    if (intervalId) {
      clearInterval(intervalId);
      intervalId = null;
    }
  }
  
  function goToSlide(index) {
    if (index >= 0 && index < photos.value.length) {
      currentIndex.value = index;
    }
  }
  
  function prevSlide() {
    if (photos.value.length > 0) {
      currentIndex.value = (currentIndex.value - 1 + photos.value.length) % photos.value.length;
    }
  }
  
  function nextSlide() {
    if (photos.value.length > 0) {
      currentIndex.value = (currentIndex.value + 1) % photos.value.length;
    }
  }
  
  onMounted(async function() {
    photos.value = await fetchPhotos();
    startAutoSlide();
  });
  
  onUnmounted(() => {
    stopAutoSlide();
  });
  </script>
  
  <style scoped>
.room-detail-container {
  max-width: 900px;
  margin: 0 auto;
  padding: 20px;
  background-color: #f5f5f5;
  border-radius: 8px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
}

.room-title {
  text-align: center;
  color: #333;
  margin-bottom: 20px;
}

.carousel {
  position: relative;
  overflow: hidden;
  border-radius: 8px;
  width: 100%;
}

.carousel-images {
  display: flex;
  width: 100%;
}

.carousel-slide {
  min-width: 100%;
  box-sizing: border-box;
}

.carousel-slide img {
  width: 100%; /* 確保圖片寬度填滿容器 */
  height: 400px; /* 固定高度為 400px，可根據需要調整 */
  object-fit: cover; /* 確保圖片按比例縮放，不會變形 */
  border-radius: 8px;
}

.carousel-button {
  position: absolute;
  top: 50%;
  transform: translateY(-50%);
  background-color: rgba(0, 0, 0, 0.3); /* 半透明背景 */
  color: white;
  border: none;
  width: 50px; /* 小圓球寬度 */
  height: 50px; /* 小圓球高度 */
  border-radius: 50%; /* 變成圓形 */
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  font-size: 30px; /* 圓球內的箭頭字型大小 */
  z-index: 1;
  transition: background-color 0.3s ease;
}

.carousel-button:hover {
  background-color: rgba(0, 0, 0, 0.6); /* 懸停時更深的透明背景 */
}

.carousel-button.prev {
  left: 10px; /* 左邊位置 */
}

.carousel-button.next {
  right: 10px; /* 右邊位置 */
}

.photo-description {
  text-align: center;
  margin-top: 20px;
}

.photo-description p {
  font-size: 16px;
  color: #555;
}

.thumbnail-container {
  display: flex;
  justify-content: center;
  margin-top: 20px;
  gap: 10px;
  overflow-x: auto;
}

.thumbnail {
  cursor: pointer;
  border: 2px solid transparent;
  border-radius: 4px;
  transition: border 0.3s ease;
}

.thumbnail img {
  width: 80px;
  height: 60px;
  object-fit: cover;
  border-radius: 4px;
}

.thumbnail.active {
  border: 2px solid #007bff;
}
</style>

  