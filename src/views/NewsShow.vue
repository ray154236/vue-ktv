<template>
  <div class="container">
    <div class="news-details">
      <!-- 新聞標題 -->
      <h1 class="news-title">{{ news.title }}</h1>

      <!-- 新聞圖片 -->
      <div class="news-image">
        <img class="large-image" :src="`http://localhost:8080/ktv-app/news/news/image/${news.newsId}`" alt="新聞圖片">
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

      <!-- 返回按鈕 -->
      <button type="button" @click="goToNewsList" class="return-button button-large">返回最新消息</button>
    </div>
  </div>
</template>

<script>
import axios from 'axios';
import moment from 'moment';

export default {
  props: ['newsId'],
  data() {
    return {
      news: {
        title: '',
        content: '',
        status: '',
        startDate: '',
        endDate: '',
        url: '',
        imageUrl: null
      }
    };
  },
  created() {
    this.fetchNewsDetails();
  },
  methods: {
    fetchNewsDetails() {
      axios.get(`http://localhost:8080/ktv-app/news/news/find/${this.newsId}`)
        .then(response => {
          this.news = {
            ...response.data,
            startDate: this.formatDate(response.data.startDate),
            endDate: this.formatDate(response.data.endDate)
          };
        })
        .catch(error => {
          console.error('獲取新聞詳情時發生錯誤:', error);
        });
    },
    formatDate(dateString) {
      return moment(dateString).format('YYYY-MM-DD');
    },
    formatDateRange(startDate, endDate) {
      return `${this.formatDate(startDate)} 至 ${this.formatDate(endDate)}`;
    },
    goToNewsList() {
      this.$router.push({ name: 'NewsWebsite' });
    }
  }
};
</script>

<style scoped>
.container {
  max-width: 800px;
  margin: 0 auto;
  padding: 20px;
  background: #f9f9f9; /* 背景顏色 */
  border-radius: 8px; /* 圓角邊框 */
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1); /* 陰影效果 */
  animation: fadeIn 1s ease-in;
}

.news-details {
  margin-bottom: 20px;
}

.news-title {
  text-align: center;
  margin-bottom: 20px;
  font-size: 2.5rem; /* 大標題 */
  color: #333; /* 標題顏色 */
  font-weight: 700; /* 加粗 */
  border: 2px solid #007BFF; /* 標題邊框 */
  border-radius: 5px; /* 圓角邊框 */
  padding: 10px; /* 內邊距 */
  animation: slideInFromTop 1s ease-out;
}

.news-image {
  text-align: center;
  margin-bottom: 20px;
  animation: fadeIn 1s ease-in;
}

.large-image {
  width: 100%; /* 圖片寬度填滿容器 */
  height: auto; /* 高度自適應 */
  border-radius: 8px; /* 圓角圖片 */
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.1); /* 圖片陰影效果 */
}

.news-content {
  text-align: center;
  margin-bottom: 20px;
  font-size: 1.2rem; /* 內容字體大小 */
  color: #555; /* 內容顏色 */
  line-height: 1.6; /* 行高 */
  border: 1px solid #ddd; /* 內容邊框 */
  border-radius: 5px; /* 圓角邊框 */
  padding: 15px; /* 內邊距 */
  background: #fff; /* 背景顏色 */
  animation: fadeIn 1s ease-in;
}

.news-dates {
  text-align: center;
  margin-bottom: 20px; /* 增加底部間距 */
  font-size: 1.1rem; /* 日期字體大小 */
  color: #777; /* 日期顏色 */
  border: 1px solid #ddd; /* 日期邊框 */
  border-radius: 5px; /* 圓角邊框 */
  padding: 10px; /* 內邊距 */
  background: #fff; /* 背景顏色 */
}

.return-button {
  display: block;
  margin: 20px auto; /* 水平居中 */
  width: 200px;
  padding: 10px;
  background-color: #007BFF;
  color: white;
  border: none;
  border-radius: 3px;
  cursor: pointer;
  font-size: 16px;
  text-transform: uppercase; /* 大寫字母 */
  font-weight: 600; /* 加粗 */
  transition: background-color 0.3s, transform 0.3s; /* 過渡效果 */
}

.return-button:hover {
  background-color: #0056b3;
  transform: scale(1.05); /* 放大效果 */
}

/* 動畫效果 */
@keyframes fadeIn {
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
}

@keyframes slideInFromTop {
  from {
    transform: translateY(-20px);
    opacity: 0;
  }
  to {
    transform: translateY(0);
    opacity: 1;
  }
}
</style>
