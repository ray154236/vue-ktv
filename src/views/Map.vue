<template>
   <h5 class="room-title">門市資訊</h5>
  <div class="map-container">
    <div class="content-container">
      <!-- 插入圖片 -->
      <div class="image-container">
        <img :src="imageSrc" hidden alt="門市圖片" />
      </div>

      <!-- 門市資訊 -->
      <div class="store-info">
        <h2>{{ storeName }}</h2>
        <p><strong>電話:</strong> {{ phone }}</p>
        <p><strong>地址:</strong> {{ address }}</p>
        <p><strong>營業時間:</strong> {{ hours }}</p>
        <p><strong>包廂類型:</strong> {{ room }}</p>
        <p><strong>交通資訊:</strong> {{ transportInfo }}</p>
      </div>
      
      <!-- 按鈕 -->
      <button @click="showAlert" class="info-button">注意事項</button>

      <!-- 彈窗 -->
      <div v-if="isAlertVisible" class="overlay" @click.self="hideAlert">
        <div class="alert-popup">
          <p>
            憑本人有效會員可再享包廂費、續唱費、歡唱費及單點餐飲九折之優惠。(酒類、服務費恕不打折)
            當日消費若未出示會員及相關優惠券折抵，一經離店便無法再享其相關優惠內容。
            預訂 VIP 以上包廂型式需預付訂金，詳細活動辦法請洽詢門市人員。
            訪客計費方式：時間為10分鐘，若超過10分鐘，將依現場收費標準計價。
            自帶酒每間酌收開瓶費：小包廂400元、中包廂600元、大包廂800元、特大包1000元。
            包廂內若有蛋糕、飲料、佈置物等造成污損之情形，將視污損情況酌收包廂清潔費1000元起；器材損毀，照價賠償。
            因天然災害經行政院人事行政總處公告停班停課，當日會員日優惠暫停。
            為能維護所有消費顧客權益及飲食衛生考量，恕無法攜帶寵物進場消費(導盲犬除外)。
            配合政府政策，本場館全面禁菸；凌晨AM00:00～AM05:00謝絕未滿18歲之青少年入內消費。
            本公司保留對上述活動解釋與促銷品變動之權利，詳細活動辦法依門市現場公告為準，詳情請洽詢門市人員。
          </p>
          <button class="btn btn-close" @click.stop="hideAlert"></button>
        </div>
      </div>
    </div>
    <div class="map-frame">
      <iframe
        :src="mapSrc"
        width="100%"
        height="400"
        style="border:0;"
        allowfullscreen=""
        loading="lazy"
      ></iframe>
    </div>
  </div>
</template>

<script>
export default {
  name: 'Map',
  data() {
    return {
      storeName: 'GOLD PANDA大安旗艦店',
      phone: '(02) 6631-6588',
      address: '106台北市大安區復興南路一段390號2樓',
      hours: '24小時營業',
      room: '小型包廂(6人)、中型包廂(10人)、大型包廂(20人)',
      transportInfo: '靠近大安捷運站，方便搭乘公共交通。',
      mapSrc: 'https://www.google.com/maps/d/embed?mid=1xwDlUfH08eh1ya9atxxvSQZKepcEiSg&hl=zh-TW&ehbc=2E312F" width="640" height="480',
      imageSrc: '', // 替換圖片 URL
      isAlertVisible: false, // 控制彈窗顯示
    };
  },
  methods: {
    showAlert() {
      this.isAlertVisible = true; // 顯示彈窗
    },
    hideAlert() {
      this.isAlertVisible = false; // 隱藏彈窗
    }
  }
};
</script>

<style scoped>
.map-container {
  display: flex;
  padding: 20px;
  align-items: flex-start;
  overflow: hidden; /* 隱藏超出範圍的部分 */
}

.map-frame {
  flex: 1;
  width: 100%;
  height: 100%;
  margin-top: 15px;
  margin-right: 200px;
  clip-path: inset(17% 0 0 0); /* 裁切上方17% */
  /* 裁切形狀的百分比可以根據需求進行調整 */
}

.content-container {
  display: flex;
  flex-direction: column;
  flex: 1;
}

.image-container {
  margin-bottom: 20px;
}

.image-container img {
  max-width: 100%;
  height: auto;
}

.store-info {
  text-align: left;
  margin-left: 200px;
  color: #ffffff;
  margin-bottom: 40px;
}

.store-info h2 {
 margin-left: -20px;
  font-size: 48px;
  font-weight: 800;
  margin-bottom: 50px;
  background: none;
  text-shadow: 3px 3px 6px orange;
}

.store-info p {
  margin: 5px 0;
  font-size: 20px;
  font-weight: 800;
  height: 50px;
}

.info-button {
  margin-top: -20px;
  margin-left: 200px;
  font-size: 20px;
  cursor: pointer;
  width: 120px; /* 調整按鈕的寬度 */
  height: 50px; /* 調整按鈕的高度 */
  background-color: #ff85b3; /* 粉紅色 */
  color: white;
  border: none;
  border-radius: 5px;
  font-weight: 800;
}

.info-button:hover {
  background-color: #681736; /* 深粉紅色 */
}

.overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
}

.alert-popup {
  background: white;
  padding: 20px;
  border: 1px solid #ddd;
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
  max-width: 400px; /* 設定彈窗最大寬度 */
  width: 100%; /* 使彈窗寬度占滿 max-width 設定的寬度 */
  display: flex;
  flex-direction: column;
  align-items: center;
}

.alert-popup p {
  margin: 0 0 10px;
  font-size: 16px; /* 調整文字大小 */
  text-align: center; /* 文字置中 */
}

.btn-close {
  padding: 10px 30px;
  font-size: 16px; /* 調整按鈕文字大小 */
  background-color: #f06292; /* 粉紅色 */
  color: white;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  font-weight: 800;
  text-align: center; /* 文字居中 */
  display: block; /* 確保按鈕為塊級元素 */
  width: fit-content; /* 使按鈕寬度適應內容 */
  margin: 0 auto; /* 使按鈕水平居中 */
}

.btn-close:hover {
  font-weight: 800;
  background-color: #e91e63; /* 深粉紅色 */
}
.room-title {
  margin-top: 40px;
  text-align: center;
  color: #fff;
  margin-bottom: 20px;
  font-size: 28px;
  font-weight: bold;
  background: none;
  text-shadow: 3px 3px 6px orange;
}
</style>
