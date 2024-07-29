<template>
  <div class="news-container">
    <h1 class="news-heading">最新消息</h1>
    <div class="search-sort-container">
      <!-- 標題模糊查詢 -->
      <div class="d-flex align-items-center">
        <input type="text" v-model="searchKeyword" placeholder="標題關鍵字" class="form-control me-2">
        <button @click="searchByTitle" class="btn btn-primary">搜尋</button>
      </div>

      <!-- 排序方式 -->
      <div class="ms-auto">
        <label class="me-2">排列方式:</label>
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
          <p class="news-date">{{ formatDate(news.startDate) }} 至 {{ formatDate(news.endDate) }}</p>
          <h3 class="news-title">{{ news.title }}</h3>
        </div>
      </div>
    </div>

    <!-- 返回按鈕 -->
    <button type="button" @click="goHome" class="return-button">返回首頁</button>
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
      axios.get('http://localhost:8080/ktv-app/news/news')
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
        axios.get(`http://localhost:8080/ktv-app/news/news/searchByTitle?keyword=${this.searchKeyword}`)
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

.news-heading {
  text-align: center;
  font-size: 2.5rem;
  margin-bottom: 30px;
  font-family: 'Roboto', sans-serif;
  color: #ffffff;
  text-transform: uppercase;
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

.return-button {
  display: inline-block;
  margin-top: 20px;
  padding: 12px 24px;
  background-color: #007BFF;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-size: 1rem;
  transition: background-color 0.3s, box-shadow 0.3s;
}

.return-button:hover {
  background-color: #0056b3;
  box-shadow: 0px 4px 8px rgba(0, 0, 0, 0.2);
}
</style>
