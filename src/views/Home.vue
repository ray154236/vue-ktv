<template>
    <div class="fade-in">
  <!-- 大圖輪播區域 -->
  <div class="carousel-inner">
    <div v-for="(slide, index) in activeSlides" :key="index"
      :class="['carousel-item', { active: index === activeIndex }]">
      <img class="d-block mx-auto w-30" :src="slide.image" :alt="slide.altText" @click="goToNewsShow(slide.newsId)"
        @mouseleave="startCarousel" @mouseover="stopCarousel">
    </div>
  </div>

  <!-- 小圖輪播區域 -->
  <div class="carousel-smallImage mt-3">
    <img v-for="(slide, index) in activeSlides" :key="index" class="smallImage" :src="slide.smallImage"
      :alt="slide.altText" @click="goToSlide(index)" @mouseleave="startCarousel" @mouseover="stopCarousel"
      :style="{ opacity: slide.active ? 1 : 0.6 }">
  </div>

  <!-- 歌曲排行榜表格區域 -->
  <div class="song-ranking mt-4">
    <h1 class="title">本周歌曲排行榜</h1>
    <table>
      <thead>
        <tr>
          <th>排名</th>
          <th>歌名</th>
          <th>歌手</th>
          <th>上周排名</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="song in pagedSongs" :key="song.id" @click="openVideo(song.videoUrl)" class="clickable-row">
          <td>{{ song.id }}</td>
          <td>{{ song.title }}</td>
          <td>{{ song.artist }}</td>
          <td>{{ song.lastWeekRank }}</td>
        </tr>
      </tbody>
    </table>
    <div class="page">第 {{ currentPage }} 頁/共 {{ totalPages }} 頁</div>
    <div class="changepage">
      <div class="pagination">
                <button @click="goToPage(1)" :disabled="currentPage === 1">
                  << </button>
                    <button @click="goToPage(currentPage - 1)" :disabled="currentPage === 1">
                      < </button>
                        <button @click="goToPage(currentPage + 1)" :disabled="currentPage === totalPages">></button>
                        <button @click="goToPage(totalPages)" :disabled="currentPage === totalPages">>></button><br>

      </div>
    </div>
  </div>
      <!-- 跳轉到頂部 -->
      <button class="scroll-to-top" @click="scrollToTop">▲</button>
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
      songs:[
  { id: 1, title: '在加納共和國離婚', artist: '菲道爾、Dior大穎', lastWeekRank: "1 -",videoUrl: 'https://www.youtube.com/watch?v=wlSvIL-H1GQ'},
  { id: 2, title: '擱淺', artist: '周杰倫', lastWeekRank: "3 ↑",videoUrl: 'https://www.youtube.com/watch?v=YJfHuATJYsQ' },
  { id: 3, title: '妥協', artist: '蔡依林', lastWeekRank: "4 ↑",videoUrl: 'https://www.youtube.com/watch?v=M00rcJ9gMEc'},
  { id: 4, title: '字字句句', artist: '盧盧快閉嘴', lastWeekRank: "5 ↓" ,videoUrl: 'https://www.youtube.com/watch?v=N9XgnvGaZxk'},
  { id: 5, title: '星期五晚上', artist: 'Energy', lastWeekRank: "2 ↓" ,videoUrl: 'https://www.youtube.com/watch?v=btPv0-d3NbE'},
  { id: 6, title: '毒藥', artist: '蕭秉治', lastWeekRank: "10 ↑" ,videoUrl: 'https://www.youtube.com/watch?v=rgTQYCo0WCM'},
  { id: 7, title: '天后', artist: '陳勢安', lastWeekRank: "6 ↓" ,videoUrl: 'https://www.youtube.com/watch?v=cRVDT_MdLpY&list=OLAK5uy_nuRKdzR0hA1I687dRAN4HUeJz9iQ3Xp24'},
  { id: 8, title: '倒帶', artist: '蔡依林', lastWeekRank: "9 ↑" ,videoUrl: 'https://www.youtube.com/watch?v=cB7DIIG0ykk'},
  { id: 9, title: '如果可以', artist: '韋禮安', lastWeekRank: "14 ↑" ,videoUrl: 'https://www.youtube.com/watch?v=8MG--WuNW1Y'},
  { id: 10, title: '訣愛', artist: 'Faye 詹雯婷', lastWeekRank: "8 ↓" ,videoUrl: 'https://www.youtube.com/watch?v=ivqVNORpylY'},
  { id: 11, title: '嘉賓', artist: '張遠', lastWeekRank: "11 -" ,videoUrl: 'https://www.youtube.com/watch?v=8ux25IcLr8w'},
  { id: 12, title: '慢冷', artist: '梁靜茹', lastWeekRank: "15 ↑" ,videoUrl: 'https://www.youtube.com/watch?v=TpF0wNlopp8'},
  { id: 13, title: '從前說', artist: '小阿七', lastWeekRank: "12 ↓" ,videoUrl: 'https://www.youtube.com/watch?v=hEMRM6J7LlY'},
  { id: 14, title: '我很好騙', artist: '動力火車', lastWeekRank: "16 ↑" ,videoUrl: 'https://www.youtube.com/watch?v=3HsIaWuNeX0'},
  { id: 15, title: '離開的一路上', artist: '理想混蛋', lastWeekRank: "13 ↓" ,videoUrl: 'https://www.youtube.com/watch?v=3hLESh77fSg'},
  { id: 16, title: '想和你看五月的晚霞', artist: '陳華 Hua Chen', lastWeekRank: "18 ↑" ,videoUrl: 'https://www.youtube.com/watch?v=ljd9ISixsWo'},
  { id: 17, title: '我會等', artist: '承桓', lastWeekRank: "17 -" ,videoUrl: 'https://www.youtube.com/watch?v=yaNPy3xKw1M'},
  { id: 18, title: '家家酒', artist: '家家', lastWeekRank: "20 ↑" ,videoUrl: 'https://www.youtube.com/watch?v=T-Xk_xirUlo'},
  { id: 19, title: '痴心絕對', artist: '李聖傑', lastWeekRank: "21 ↑" ,videoUrl: 'https://www.youtube.com/watch?v=7NIsBeVRAgk'},
  { id: 20, title: '我懷念的', artist: '孫燕姿', lastWeekRank: "19 ↓" ,videoUrl: 'https://www.youtube.com/watch?v=3Xj6QoLmoF0'},
  { id: 21, title: '摯友', artist: 'A-Lin', lastWeekRank: "23 ↑" ,videoUrl: 'https://www.youtube.com/watch?v=vGqpGFH3vh8'},
  { id: 22, title: '十年', artist: '陳奕迅', lastWeekRank: "28 ↑" ,videoUrl: 'https://www.youtube.com/watch?v=JM9rx_hN1Ko'},
  { id: 23, title: '專屬天使', artist: 'TANK', lastWeekRank: "22 ↓" ,videoUrl: 'https://www.youtube.com/watch?v=QdWRuFQZ8RI'},
  { id: 24, title: '雨愛', artist: '楊丞琳', lastWeekRank: "25 ↓" ,videoUrl: 'https://www.youtube.com/watch?v=oec9R5ypf-o'},
  { id: 25, title: '體面', artist: '于文文', lastWeekRank: "27 ↑" ,videoUrl: 'https://www.youtube.com/watch?v=-kfVp3tqYvc'},
  { id: 26, title: 'Without You', artist: '高爾宣OSN', lastWeekRank: "26 -" ,videoUrl: 'https://www.youtube.com/watch?v=HQDDlgGy2hg'},
  { id: 27, title: '總會有人', artist: '向思思', lastWeekRank: "24 ↓" ,videoUrl: 'https://www.youtube.com/watch?v=BdhZWffz0ZM'},
  { id: 28, title: '孤勇者', artist: '陳奕迅', lastWeekRank: "33 ↑" ,videoUrl: 'https://www.youtube.com/watch?v=Hlp8XD0R5qo'},
  { id: 29, title: '修煉愛情', artist: '林俊傑', lastWeekRank: "29 -" ,videoUrl: 'https://www.youtube.com/watch?v=LWV-f6dMN3Q'},
  { id: 30, title: '給我一個理由忘記', artist: 'A-Lin', lastWeekRank: "25 ↓" ,videoUrl: 'https://www.youtube.com/watch?v=F5FlN-NBGo8'}
],
      currentPage: 1,   // 當前頁碼
      pageSize: 10       // 每頁顯示的項目數量
    };
  },
  computed: {
    totalPages() {
      return Math.ceil(this.songs.length / this.pageSize);
    },
    pagedSongs() {
      const start = (this.currentPage - 1) * this.pageSize;
      const end = start + this.pageSize;
      return this.songs.slice(start, end);
    }
  },
  created() {
    this.fetchSlides();  // 在組件創建時，調用 fetchSlides 方法獲取輪播項目數據
  },
  mounted() {
    this.startCarousel();  // 在組件掛載後開始自動輪播

    this.$nextTick(() => {
    // 确保 DOM 元素已经渲染
    document.querySelector('.fade-in').classList.add('fade-in');
  });
  },
  beforeDestroy() {
    clearInterval(this.intervalId);  // 在組件銷毀前清除定時器，避免內存洩漏
  },
  methods: {
    fetchSlides() {
      axios.get('/ktv-app/news/news')
        .then(response => {
          if (response.data && Array.isArray(response.data.list)) {
            this.activeSlides = response.data.list
              .filter(news => news.status === 'active')
              .map((news, index) => ({
                image: `/ktv-app/news/news/image/${news.newsId}`,
                smallImage: `/ktv-app/news/news/${news.newsId}/smallImage`,
                altText: `Slide ${index + 1}`,
                newsId: news.newsId,
                active: index === 0
              }));
          } else {
            console.error('響應數據或格式不為空:', response.data);
          }
        })
        .catch(error => {
          console.error('數據獲取失敗:', error);
        });
},
scrollToTop() {
      window.scrollTo({
        top: 0,
        behavior: 'smooth' // 平滑滚动
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
    },
    goToPage(page) {
      if (page < 1 || page > this.totalPages) return;  // 檢查頁碼是否合法
      this.currentPage = page;
    },
    openVideo(videoUrl) {
    window.open(videoUrl, '_blank'); // 在新分頁打開影片
  },
  },
  watch: {
    activeIndex(newIndex) {
      // 監聽 activeIndex 的變化，更新小圖的狀態
      this.activeSlides.forEach((slide, index) => {
        slide.active = index === newIndex;
      });
    }
  }
};

</script>

<style>

/* 定义开场动画 */
@keyframes fadeIn {
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
}

/* 应用动画 */
.fade-in {
  animation: fadeIn 2s ease-in-out;
}


.carousel-inner {
  margin-top: 5px;
}

.carousel-item img {
  width: 80%;
  height: 600px;
  border-radius: 8px;
}

.carousel-indicators li {
  font-size: 0;
  /* 設置字體大小為0 */
  line-height: 0;
  /* 設置行高為0 */
  color: transparent;
  /* 設置文本顏色為透明 */
}

.carousel-control-prev,
.carousel-control-next {
  background-color: rgba(0, 0, 0, 0.3);
  /* 設置背景色 */
  border: none;
  /* 去除邊框 */
  z-index: 1;
  /* 確保按鈕在上層 */
  width: 50px;
  /* 設置寬度 */
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
  transition: opacity 0.3s ease;
  /* 添加過渡效果 */
}

/* 歌曲排行榜表格樣式 */
.song-ranking {
  margin-top: 20px;
  padding: 10px;
  /* 替換為你的背景圖片路徑 */
  background-size: cover;
  /* 使背景圖片覆蓋整個區域 */
  background-position: center;
  /* 使背景圖片居中顯示 */
  border-radius: 5px;
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.3);
  color: white;
  /* 設置文字顏色為白色 */
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
  background-color: rgba(0, 0, 0, 0.5);
  /* 使表頭背景稍微透明，增加對比度 */
}

.song-ranking tr:hover {
  background-color: rgba(255, 255, 255, 0.2);
  /* 懸停行的背景顏色 */
}

.table {
  width: 100%;
  border-collapse: collapse;
}

.table th,
.table td {
  border: 1px solid #ddd;
  padding: 8px;
}

.table th {
  background-color: #f2f2f2;
  text-align: left;
}

.pagination button {
  background-color: transparent;
  /* 使按鈕背景透明 */
  border: 1px solid #ddd;
  /* 設置邊框顏色 */
  color: white;
  /* 設置按鈕文字顏色為白色 */
  padding: 5px 10px;
  /* 添加內邊距 */
  cursor: pointer;
  /* 鼠標懸停時顯示手形光標 */
  transition: background-color 0.3s ease, color 0.3s ease;
  /* 添加過渡效果 */
  color: white;
  /* 設置文字顏色為白色 */
  margin-top: 10px;
  /* 添加上邊距 */
}

.pagination button:hover {
  background-color: rgba(255, 255, 255, 0.2);
  /* 懸停時的背景顏色 */
  color: white;
  /* 懸停時的文字顏色 */
}

/* 使中間標顯示為白色 */
.page {
  text-align: center
}

.title {
  text-align: center;
  color: #fff;
  background: none;
  text-shadow: 3px 3px 6px orange;
  font-size: 40px;
}

.changepage {
  display: flex;
  justify-content: center;
  /* 置中水平排列 */
  margin: 20px 0;
  /* 上下邊距 */
}

.pagination {
  display: flex;
  gap: 10px;
  /* 按鈕之間的間距 */
}

button {
  padding: 10px 20px;
  /* 按鈕的內邊距 */
  border: 1px solid #ccc;
  /* 按鈕的邊框 */
  border-radius: 5px;
  /* 按鈕的圓角 */
  background-color: #f0f0f0;
  /* 按鈕的背景色 */
  cursor: pointer;
  /* 鼠標懸停時顯示手形光標 */
  transition: background-color 0.3s;
  /* 背景色過渡效果 */
}

button:hover {
  background-color: #e0e0e0;
  /* 鼠標懸停時的背景色 */
}

button:disabled {
  background-color: #d0d0d0;
  /* 禁用狀態下的背景色 */
  cursor: not-allowed;
  /* 禁用狀態下顯示不可點擊光標 */
}
.scroll-to-top,
.scroll-to-bottom {
  position: fixed;
  right: 20px;
  width: 50px; /* 確保寬度和高度相等 */
  height: 50px;
  border: none;
  border-radius: 50%; /* 圓形按鈕 */
  background-color: #011c3a;
  color: white;
  display: flex;
  align-items: center; /* 垂直居中對齊文本 */
  justify-content: center; /* 水平居中對齊文本 */
  cursor: pointer;
  z-index: 1000; /* 確保按鈕在上層 */
  font-size: 16px; /* 設置字體大小 */
}

.scroll-to-bottom {
  bottom: 20px; /* 距離底部 20px */
}

.scroll-to-top {
  bottom: 80px; /* 距離底部 80px，確保與底部按鈕不重疊 */
}

.scroll-to-top:hover,
.scroll-to-bottom:hover {
  background-color: #0056b3; /* 懸停時的背景顏色 */
}
</style>
