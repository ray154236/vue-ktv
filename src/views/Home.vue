<template>
  <!-- 大圖輪播區域 -->
  <div class="carousel-inner">
    <div v-for="(slide, index) in activeSlides" :key="index" :class="['carousel-item', { active: index === activeIndex }]">
      <img class="d-block mx-auto w-30" :src="slide.image" :alt="slide.altText" @click="goToNewsShow(slide.newsId)" @mouseleave="startCarousel" @mouseover="stopCarousel">
    </div>
  </div>
  
  <!-- 小圖輪播區域 -->
  <div class="carousel-smallImage mt-3">
    <img v-for="(slide, index) in activeSlides" :key="index" class="smallImage" :src="slide.smallImage" :alt="slide.altText" @click="goToSlide(index)" @mouseleave="startCarousel" @mouseover="stopCarousel" :style="{ opacity: slide.active ? 1 : 0.6 }">
  </div>
  
  <!-- 歌曲排行榜表格區域 -->
  <div class="song-ranking mt-4">
    <h2>熱門歌曲 Top 10</h2>
    <table>
      <thead>
        <tr>
          <th>排名</th>
          <th>歌曲標題</th>
          <th>歌手</th>
          <th>專輯</th>
          <th>播放次數</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="(song, index) in songs" :key="index">
          <td>{{ index + 1 }}</td>
          <td>{{ song.title }}</td>
          <td>{{ song.artist }}</td>
          <td>{{ song.album }}</td>
          <td>{{ song.plays }}</td>
        </tr>
      </tbody>
    </table>
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
      intervalId: null, // 存儲定時器 ID，用於控制自動輪播
      songs: [  // 硬編碼的歌曲排行榜數據
        { title: '在加納共和國離婚', artist: '菲道爾、Dior大穎', album: '單曲', plays: '29251' },
        { title: '星期五晚上', artist: 'Energy', album: '單曲', plays: '20196' },
        { title: '擱淺', artist: '周杰倫', album: '單曲', plays: '67060' },
        { title: '妥協', artist: '蔡依林', album: '單曲', plays: '44474' },
        { title: '字字句句', artist: '盧盧快閉嘴', album: '單曲', plays: '28770' },
        { title: '天后', artist: '陳勢安', album: '單曲', plays: '45744' },
        { title: '如果可以', artist: '韋禮安', album: '單曲', plays: '27349' },
        { title: '訣愛', artist: 'Faye 詹雯婷', album: '單曲', plays: '28432' },
        { title: '倒帶', artist: '蔡依林', album: '單曲', plays: '66844' },
        { title: '毒藥', artist: '蕭秉治', album: '單曲', plays: '27530' },
      ]
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
      }, 4000);
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
  width: 80%;
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

/* 歌曲排行榜表格樣式 */
.song-ranking {
  margin-top: 20px;
  padding: 10px;
  background-image: url('http://localhost:8080/ktv-app/news/news/image/background-image.jpg'); /* 替換為你的背景圖片路徑 */
  background-size: cover; /* 使背景圖片覆蓋整個區域 */
  background-position: center; /* 使背景圖片居中顯示 */
  border-radius: 5px;
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.3);
  color: white; /* 設置文字顏色為白色 */
}
.song-ranking h2 {
  font-size: 1.5rem;
  margin-bottom: 15px;
}
.song-ranking table {
  width: 100%;
  border-collapse: collapse;
}
.song-ranking th,
.song-ranking td {
  padding: 10px;
  text-align: left;
  border-bottom: 1px solid #ddd;
}
.song-ranking th {
  background-color: rgba(0, 0, 0, 0.5); /* 使表頭背景稍微透明，增加對比度 */
}
.song-ranking tr:hover {
  background-color: rgba(255, 255, 255, 0.2); /* 懸停行的背景顏色 */
}
</style>

