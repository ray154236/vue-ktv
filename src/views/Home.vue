<template>
  <!-- 大圖輪播區域 -->
  <div class="carousel-inner">
    <!-- 使用 v-for 循環顯示大圖輪播項目，並根據 activeIndex 決定是否顯示為 active 狀態 -->
    <div v-for="(slide, index) in activeSlides" :key="index" :class="['carousel-item', { active: index === activeIndex }]">
      <img class="d-block mx-auto w-30" :src="slide.image" :alt="slide.altText" @click="goToNewsShow(slide.newsId)" @mouseleave="startCarousel" @mouseover="stopCarousel">
    </div>
  </div>
  
  <!-- 小圖輪播區域 -->
  <div class="carousel-smallImage mt-3">
    <!-- 使用 v-for 循環顯示小圖輪播項目，並根據 activeIndex 決定是否顯示為激活狀態 -->
    <img v-for="(slide, index) in activeSlides" :key="index" class="smallImage" :src="slide.smallImage" :alt="slide.altText" @click="goToSlide(index)" @mouseleave="startCarousel" @mouseover="stopCarousel" :style="{ opacity: slide.active ? 1 : 0.6 }">
  </div>


</template>


<script>
import axios from 'axios';

export default {
name: 'BootstrapCarousel',
data() {
  return {
    activeSlides: [],  // 存儲所有激活的輪播項目
    activeIndex: 0,    // 初始化為第一個輪播項目的索引
    intervalId: null   // 存儲定時器 ID，用於控制自動輪播
  };
},
created() {
  this.fetchSlides();  // 在組件創建時，調用 fetchSlides 方法獲取輪播項目數據
},
mounted() {
  this.startCarousel();  // 在組件掛載後開始自動輪播
},
beforeDestroy() {
  clearInterval(this.intervalId);  // 在組件銷毀前清除定時器，避免內存洩漏
},
methods: {
  fetchSlides() {
    // 通過 axios 發送 HTTP GET 請求，獲取輪播項目數據
    axios.get('http://localhost:8080/ktv-app/news/news')
      .then(response => {
        if (response.data && Array.isArray(response.data)) {
          // 過濾出狀態為 active 的新聞數據，並轉換為適當的格式存儲到 activeSlides 中
          this.activeSlides = response.data
            .filter(news => news.status === 'active')
            .map((news, index) => {
              return {
                image: `http://localhost:8080/ktv-app/news/news/image/${news.newsId}`,
                smallImage: `http://localhost:8080/ktv-app/news/news/${news.newsId}/smallImage`,
                altText: `Slide ${index + 1}`,
                newsId: news.newsId,
                active: index === 0  // 第一個項目默認為激活狀態
              };
            });
        } else {
          console.error('響應數據為空或不是數組:', response.data);
        }
      })
      .catch(error => {
        console.error('數據獲取失敗:', error); // 錯誤處理，捕獲並打印錯誤信息
      });
  },
  startCarousel() {
    // 使用定時器每隔一段時間（這裡是4秒）切換到下一張大圖
    this.intervalId = setInterval(() => {
      this.nextSlide();
    }, 1000);
  },
  stopCarousel() {
    // 停止自動輪播
    clearInterval(this.intervalId);
  },
  goToNewsShow(newsId) {
    // 跳轉到新聞詳情頁面，根據 newsId 進行路由跳轉
    this.$router.push({ name: 'NewsShow', params: { newsId } });
  },
  goToSlide(index) {
    // 當點擊小圖時，切換到對應的大圖，同時停止自動輪播
    this.activeIndex = index;
    clearInterval(this.intervalId);
  },
  prevSlide() {
    // 切換到上一張大圖輪播項目
    this.activeIndex = (this.activeIndex - 1 + this.activeSlides.length) % this.activeSlides.length;
  },
  nextSlide() {
    // 切換到下一張大圖輪播項目
    this.activeIndex = (this.activeIndex + 1) % this.activeSlides.length;
  }
},

watch: {
  activeIndex(newIndex) {
    // 監聽 activeIndex 的變化，更新小圖的激活狀態
    this.activeSlides.forEach((slide, index) => {
      slide.active = index === newIndex;
    });
  }
}
};
</script>



<style>
.carousel-inner {
margin-top: 5px;
}
.carousel-item img {
width: 50%;
height: auto;
border-radius: 8px;
}
.carousel-indicators li {
font-size: 0; /* 設置字體大小為0 */
line-height: 0; /* 設置行高為0 */
color: transparent; /* 設置文本顏色為透明 */
}
.carousel-control-prev,
.carousel-control-next {
background-color: rgba(0, 0, 0, 0.3); /* 設置背景色 */
border: none; /* 去除邊框 */
z-index: 1; /* 確保按鈕在上層 */
width: 50px; /* 設置寬度 */
position: absolute;
margin: 10%;
margin-top: 0%;
}
.carousel-control-prev-icon,
.carousel-control-next-icon {
background-color: rgb(10, 10, 10);
border-radius: 50%;
}
.carousel-smallImage {
display: flex;
justify-content: center;
gap: 10px;
}
.smallImage {
width: 80px;
height: auto;
cursor: pointer;
transition: opacity 0.3s ease; /* 添加過渡效果 */
}
</style>
