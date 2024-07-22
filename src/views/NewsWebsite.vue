<template>
    <div class="news-container">
      <h1 class="news-heading">最新消息</h1>
      <div>
        <!-- 標題模糊查詢 -->
        <input type="text" v-model="searchKeyword" placeholder="標題關鍵字">
        <button @click="searchByTitle">搜尋</button>
        
        <!-- 排序方式 -->
        <label>排列方式:</label>
        <select v-model="sortOrder">
          <option value="newest">新到舊 (上架日期)</option>
          <option value="oldest">舊到新 (上架日期)</option>
        </select>
      </div>
      <div class="news-grid">
        <div v-for="news in filteredNews" :key="news.newsId" class="news-item" @dblclick="newsShow(news.newsId)">
          <img :src="`http://localhost:8080/ktv-app/news/news/image/${news.newsId}`" class="news-image" alt="News Image">
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
            console.error('獲取新聞失敗：', error);
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
              console.error('標題模糊查詢失敗：', error);
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
    font-size: 2rem;
    margin-bottom: 30px;
  }
  
  .news-grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(360px, 1fr));
    gap: 20px;
  }
  
  .news-item {
    background-color: #f9f9f9;
    border: 1px solid #ddd;
    transition: transform 0.3s ease-in-out;
    cursor: pointer;
    overflow: hidden;
    position: relative;
  }
  
  .news-item:hover {
    transform: translateY(-5px);
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
    font-size: 1.0rem;
    margin-bottom: 10px;
  }
  
  .news-date {
    font-size: 0.9rem;
    color: #888;
    margin-bottom: 15px;
  }
  
  .news-excerpt {
    font-size: 1rem;
    line-height: 1.6;
  }
    
  .return-button {
    display: block;
    margin: 20px auto;
    padding: 10px 20px;
    background-color: #007BFF;
    color: white;
    border: none;
    border-radius: 3px;
    cursor: pointer;
    font-size: 1rem;
  }
  
  .return-button:hover {
    background-color: #0056b3;
  }
  </style>
  