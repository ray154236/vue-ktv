<template>
  <div class="news-container">
    <h1 class="room-title">最新消息</h1>
    <div class="search-sort-container">
      <!-- 標題模糊查詢 -->
      <div class="d-flex align-items-center">
        <input type="text" v-model="searchKeyword" placeholder="請輸入標題關鍵字" class="form-control me-2">
      </div>

      <!-- 排序方式 -->
      <div class="ms-auto">
        <select v-model="sortOrder" class="form-select">
          <option value="newest">新到舊 (上架日期)</option>
          <option value="oldest">舊到新 (上架日期)</option>
        </select>
      </div>
    </div>

    <div class="news-grid">
      <div v-for="news in filteredNews" :key="news.newsId" class="news-item" @click="newsShow(news.newsId)">
        <img :src="`/ktv-app/news/news/image/${news.newsId}`" class="news-image" alt="新聞圖片">
        <div class="news-details">
          <p class="news-date">{{ formatDate(news.activityStartDate) }} 至 {{ formatDate(news.endDate) }}</p>
          <h3 class="news-title">{{ news.title }}</h3>
        </div>
      </div>
    </div>
    <div class="button-group">
    <!-- 返回按鈕 -->
    <button type="button" @click="goHome" >回首頁</button>
  </div>
  </div>
</template>

<script>
import axios from 'axios';
import Swal from 'sweetalert2';

export default {
  data() {
    return {
      newsList: [],
      searchKeyword: '',
      sortOrder: 'newest',
    };
  },
  mounted() {
    this.fetchNews();
  },
  computed: {
    filteredNews() {
      let filtered = [...this.newsList];

      // 根據排序方式排序
      if (this.sortOrder === 'newest') {
        filtered.sort((a, b) => new Date(b.startDate) - new Date(a.startDate));
      } else if (this.sortOrder === 'oldest') {
        filtered.sort((a, b) => new Date(a.startDate) - new Date(b.startDate));
      }

      // 根據標題模糊查詢
      if (this.searchKeyword) {
        filtered = filtered.filter(news => news.title.toLowerCase().includes(this.searchKeyword.toLowerCase()));
      }

      return filtered;
    }
  },
  methods: {
    formatDate(date) {
      if (!date) return '';
      return new Date(date).toLocaleDateString('zh-TW');
    },
    fetchNews() {
  axios.get('/ktv-app/news/news')
    .then(response => {
      this.newsList = response.data.list.filter(news => news.status === 'active').map(news => {
        return {
          ...news,
          url: news.url ? news.url : '#',
        };
      });
    })
    .catch(error => {
      Swal.fire({
        icon: 'error',
        title: '錯誤',
        text: '無法獲取新聞資料，請稍後再試。',
      });
    });
},
    newsShow(newsId) {
      this.$router.push({ name: 'NewsShow', params: { newsId: newsId } });
    },
    searchByTitle() {
      if (this.searchKeyword.trim() !== '') {
        axios.get(`/ktv-app/news/news/searchByTitle?keyword=${this.searchKeyword}`)
          .then(response => {
            this.newsList = response.data.filter(news => news.status === 'active').map(news => {
              return {
                ...news,
                url: news.url ? news.url : '#',
              };
            });
          })
          .catch(error => {
            Swal.fire({
              icon: 'error',
              title: '搜尋錯誤',
              text: '標題搜尋失敗，請稍後再試。',
            });
          });
      } else {
        this.fetchNews();
      }
    },
    goHome() {
      this.$router.push({ path: '/' });
    }
  }
};
</script>

<style scoped>
.news-container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 20px;
}

.room-title {
  text-align: center;
  color: #fff;
  margin-bottom: 20px;
  margin-top: 20px;
  font-size: 28px;
  font-weight: bold;
  background: none;
  text-shadow: 3px 3px 6px orange;
}  

.search-sort-container {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 20px;
}

.search-sort-container .form-control {
  width: 300px;
}

.news-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(360px, 1fr));
  gap: 20px;
}

.news-item {
  background-color: #ffffff;
  border: 1px solid #e0e0e0;
  box-shadow: 0px 4px 6px rgba(0, 0, 0, 0.1);
  border-radius: 8px;
  transition: transform 0.3s ease-in-out, box-shadow 0.3s ease;
  cursor: pointer;
  overflow: hidden;
  position: relative;
}

.news-item:hover {
  transform: translateY(-5px);
  box-shadow: 0px 8px 12px rgba(0, 0, 0, 0.2);
}

.news-image {
  width: 100%;
  height: auto;
  display: block;
}

.news-details {
  padding: 15px;
}

.news-title {
  font-size: 1.4rem;
  margin-bottom: 10px;
  color: #333;
  font-weight: bold;
}

.news-date {
  font-size: 1rem;
  color: #888;
  margin-bottom: 15px;
}
.button-group {
  display: flex;
  justify-content: space-around; /* 按钮均匀分布 */
  flex-wrap: wrap; /* 使按钮在小屏幕上换行 */
  gap: 20px; /* 按钮之间的间距 */
  margin-top: 20px; /* 在按钮组顶部增加间距 */
}

.button-group button {
  flex: 1 1 auto; /* 按钮在容器中自动调整大小 */
  min-width: 150px; /* 按钮的最小宽度 */
  max-width: 300px; /* 按钮的最大宽度 */
  padding: 10px;
  font-size: 16px;
  cursor: pointer;
  font-weight: 800;
  border-radius: 4px;
  background-color: #f06292;
  color: white;
  border: none;
  text-align: center;
}

.button-group button:hover {
  background-color: #681736;
}
</style>
