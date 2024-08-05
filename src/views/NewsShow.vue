<template>
  <div class="container">
    <div class="news-details">
      <!-- 新聞標題 -->
      <h1 class="news-title">{{ news.title }}</h1>

      <!-- 新聞圖片 -->
      <div class="news-image">
        <img :src="`/ktv-app/news/news/image/${newsId}`" class="news-image" alt="新聞圖片">
      </div>

      <!-- 新聞內容 -->
      <div class="news-content">
        {{ news.content }}
      </div>

      <!-- 有效期限 -->
      <div class="news-dates">
        <label>活動時間:</label>
        <div class="mid">{{ formatDateRange(news.activityStartDate, news.endDate) }}</div>
      </div>
      <!-- 返回按鈕 -->
      <button type="button" @click="goToNewsList" class="return-button button-large">返回最新消息</button>
    </div>
  </div>
</template>

<script>
import axios from 'axios';
import Swal from 'sweetalert2';
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
        activityStartDate:'',
        imageUrl: null
      }
    };
  },
  created() {
    this.fetchNewsDetails();
  },
  methods: {
    fetchNewsDetails() {
      axios.get(`/ktv-app/news/news/find/${this.newsId}`)
        .then(response => {
          const news = response.data || {};
          console.log('獲取到的新聞數據:', news); // 調試數據

          this.news = {
            ...news,
            activityStartDate: this.formatDate(news.activityStartDate),
            endDate: this.formatDate(news.endDate),
            imageUrl: news.image ? `data:image/jpeg;base64,${news.image}` : null
          };
        })
        .catch(error => {
          console.error('獲取新聞詳情時發生錯誤:', error);
          Swal.fire({
            icon: 'error',
            title: '錯誤',
            text: '無法獲取新聞資料，請稍後再試 - newShow。',
          });
        });
    },
    formatDate(dateString) {
      return moment(dateString).format('YYYY-MM-DD');
    },
    formatDateRange(activityStartDate, endDate) {
      return `${this.formatDate(activityStartDate)} 至 ${this.formatDate(endDate)}`;
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

  /* 背景顏色 */
  border-radius: 8px;
  /* 圓角邊框 */
  /* 陰影效果 */
  animation: fadeIn 1s ease-in;
}

.news-details {
  margin-bottom: 20px;
}

.news-title {
  text-align: center;
  margin-bottom: 20px;
  font-size: 2.5rem;
  /* 大標題 */
  color: #ffffff;
  /* 標題顏色 */
  font-weight: 700;
  /* 加粗 */
  /* 標題邊框 */
  border-radius: 5px;
  /* 圓角邊框 */
  padding: 10px;
  /* 內邊距 */
  animation: slideInFromTop 1s ease-out;
}

.news-image {
  text-align: center;
  margin-bottom: 20px;
  animation: fadeIn 1s ease-in;
}

.large-image {
  width: 100%;
  /* 圖片寬度填滿容器 */
  height: auto;
  /* 高度自適應 */
  border-radius: 8px;
  /* 圓角圖片 */
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.1);
  /* 圖片陰影效果 */
}

.news-content {
  text-align: center;
  margin-bottom: 20px;
  font-size: 1.2rem;
  /* 內容字體大小 */
  color: #ffffff;
  /* 內容顏色 */
  line-height: 1.6;
  /* 行高 */

  /* 內容邊框 */
  border-radius: 5px;
  /* 圓角邊框 */
  padding: 15px;
  /* 內邊距 */

  /* 背景顏色 */
  /* animation: fadeIn 1s ease-in; */
}

.news-dates {
  text-align: center;
  margin-bottom: 20px;
  /* 增加底部間距 */
  font-size: 1.1rem;
  /* 日期字體大小 */
  color: #ffffff;
  /* 日期顏色 */
  /* 日期邊框 */
  border-radius: 5px;
  /* 圓角邊框 */
  padding: 10px;
  /* 內邊距 */
  /* 背景顏色 */
}

.return-button {
  display: block;
  margin: 20px auto;
  /* 水平居中 */
  width: 200px;
  padding: 10px;
  background-color:#f06292;
  color: white;
  border: none;
  border-radius: 3px;
  cursor: pointer;
  font-size: 16px;
  text-transform: uppercase;
  /* 大寫字母 */
  font-weight: 600;
  /* 加粗 */
  transition: background-color 0.3s, transform 0.3s;
  /* 過渡效果 */
}

.return-button:hover {
  background-color: #681736;
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
  mid {
  text-align: center; /* 将输入框中的文本居中 */
  border: 1px solid #ddd; /* 可选: 设置边框 */
  border-radius: 5px; /* 可选: 设置圆角边框 */
  padding: 5px; /* 可选: 设置内边距 */
  width: 100%; /* 确保输入框宽度填满容器 */
}
}
</style>
