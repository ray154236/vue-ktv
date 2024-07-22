<template>
    <div class="container">
      <div class="news-details">
        <!-- 新聞標題 -->
        <h1 class="news-title">{{ news.title }}</h1>
  
        <!-- 新聞圖片 -->
        <div class="news-image">
          <img class="small-image" :src="`http://localhost:8080/ktv-app/news/news/image/${news.newsId} `" alt="" >
        </div>
  
        <!-- 新聞內容 -->
        <div class="news-content">
          {{ news.content }}
        </div>
  
        <!-- 有效期限 -->
        <div class="news-dates">
          <label>活動時間:</label>
          <input type="text" :value="formatDateRange(news.startDate, news.endDate)" disabled>
        </div>
      </div>
  
      <!-- 返回按鈕 -->
      <button type="button" @click="goToNewsList" class="return-button button-large">返回最新消息</button>
    </div>
  </template>
  <script>
  import axios from 'axios';
  import moment from 'moment'; // 引入 Moment.js
  
  export default {
    props: ['newsId'],  // 定義接收的 props，用於接收新聞ID
    data() {
        return {
            news: {
                title: '',
                content: '',
                status: '',
                startDate: '',
                endDate: '',
                url: '',
                imageUrl:  null
            }
        };
    },
    created() {
        // 在組件創建時，立即調用 fetchNewsDetails 方法
        this.fetchNewsDetails();
    },
    methods: {
        fetchNewsDetails() {
            axios.get(`http://localhost:8080/ktv-app/news/news/find/${this.newsId}`)
                .then(response => {
                    // 將日期格式轉換為符合 input[type="date"] 的格式
                    this.news = {
                        ...response.data,
                        startDate: this.formatDate(response.data.startDate),
                        endDate: this.formatDate(response.data.endDate)
                    };
                })
                .catch(error => {
                    console.error('Error fetching news details:', error);
                });
        },
        formatDate(dateString) {
            // 使用 Moment.js 將日期字符串轉換為 input[type="date"] 需要的格式 yyyy-MM-dd
            return moment(dateString).format('YYYY-MM-DD');
        },
        goToNewsList() {
            // 使用路由導航回首頁
            this.$router.push({ name: 'NewsWebsite' });
        },
        formatDateRange(startDate, endDate) {
      return `${this.formatDate(startDate)} 至 ${this.formatDate(endDate)}`;
       },
       showImage(newsId) {
        axios.get(`http://localhost:8080/ktv-app/news/news/image/${newsId}`, { responseType: 'arraybuffer' })
          .then(response => {
            let blob = new Blob([response.data], { type: 'image/jpeg' });
            this.modalImageUrl = URL.createObjectURL(blob); 
                      // 將imageUrl賦值给news.image
                      this.news.image = imageUrl;
          })
          .catch(error => {
            console.error('獲取圖片失敗：', error);
          });
      },
    }
  };
  </script>
  
  
  
  <style>
  .container {
    max-width: 800px;
    margin: 0 auto;
    padding: 20px;
  }
  
  .news-details {
    margin-bottom: 20px;
  }
  
  .news-title {
    text-align: center;
    margin-bottom: 10px;
  }
  
  .news-image {
    text-align: center;
    margin-bottom: 20px;
  }
  
  .news-content {
    text-align: center;
    margin-bottom: 20px;
  
  }
  
  .news-dates {
    text-align: center;
  }
  
  .return-button {
    display: block;
    margin: 20px auto;
    width: 200px;
    padding: 10px;
    background-color: #007BFF;
    color: white;
    border: none;
    border-radius: 3px;
    cursor: pointer;
    font-size: 16px;
  }
  
  .return-button:hover {
    background-color: #0056b3;
  }
  .small-image {
      width: 750px; /* 設置寬度 */
      height: auto; /* 保持高度自適應 */
  }
  </style>