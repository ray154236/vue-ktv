<template>
    <div class="map-container">
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
  
      <div class="content-container">
        <!-- 插入圖片 -->
        <div class="image-container">
          <img :src="imageSrc" alt="門市圖片" />
        </div>
  
        <!-- 門市資訊 -->
        <div class="store-info">
          <h2>{{ storeName }}</h2>
          <p><strong>電話:</strong> {{ phone }}</p>
          <p><strong>地址:</strong> {{ address }}</p>
          <p><strong>營業時間:</strong> {{ hours }}</p>
          <p><strong>交通資訊:</strong> {{ transportInfo }}</p>
        </div>
        
        <!-- 按鈕 -->
        <button @click="showAlert">注意事項</button>
  
        <!-- 彈窗 -->
        <div v-if="isAlertVisible" class="overlay" @click.self="hideAlert">
          <div class="alert-popup">
            <p>
              憑本人有效威力卡可再享包廂費、續唱費、歡唱費及單點餐飲九折之優惠。(酒類、服務費恕不打折)
              當日消費若未出示威力卡及相關優惠券折抵，一經離店便無法再享其相關優惠內容。
              連續假日比照週六計費；例假日前夕比照週五計費；例假日(含連假最後一日)比照週日計費。(特殊節日/春節將另行公告)
              預訂 VIP 以上包廂型式需預付訂金，詳細活動辦法請洽詢門市人員。
              兒童計費標準：5歲(含)以下兒童免費，6歲~12歲半價，13歲(含)以上以成人計費。
              訪客計費方式：時間為10分鐘，若超過10分鐘，將依現場收費標準計價。
              自帶酒每間酌收開瓶費：小包廂400元、中包廂600元、大包廂800元、特大包1000元。
              包廂內若有蛋糕、飲料、佈置物等造成污損之情形，將視污損情況酌收包廂清潔費1000元起；器材損毀，照價賠償。
              因天然災害經行政院人事行政總處公告停班停課，當日會員日優惠暫停。
              為能維護所有消費顧客權益及飲食衛生考量，恕無法攜帶寵物進場消費(導盲犬除外)。
              配合政府政策，本場館全面禁菸；凌晨AM00:00～AM05:00謝絕未滿18歲之青少年入內消費。
              本公司保留對上述活動解釋與促銷品變動之權利，詳細活動辦法依門市現場公告為準，詳情請洽詢門市人員。
            </p>
            <button @click.stop="hideAlert">關閉</button>
          </div>
        </div>
      </div>
    </div>
  </template>
  
  <script>
  export default {
    name: 'Map',
    data() {
      return {
        storeName: '資展KTV大安旗艦店',
        phone: '(02) 6631-6588',
        address: '106台北市大安區復興南路一段390號2樓',
        hours: '24小時營業',
        transportInfo: '靠近地鐵站，方便搭乘公共交通。',
        mapSrc: 'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3615.0046035395794!2d121.54083797607859!3d25.033917838293455!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3442abd379a5ec97%3A0xedc006d25a9e35df!2z6LOH5bGV5ZyL6Zqb6IKh5Lu95pyJ6ZmQ5YWs5Y-4!5e0!3m2!1szh-TW!2stw!4v1721628094134!5m2!1szh-TW!2stw',
        imageSrc: 'https://example.com/your-image.jpg', // 替換圖片 URL
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
  }
  
  .map-frame {
    flex: 1;
    margin-right: 20px;
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
  }
  
  .store-info h2 {
    margin-bottom: 10px;
    font-size: 24px;
    color: #333;
  }
  
  .store-info p {
    margin: 5px 0;
    font-size: 16px;
    color: #555;
  }
  
  button {
    padding: 10px 20px;
    margin-top: 10px;
    font-size: 16px;
    cursor: pointer;
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
  }
  
  .alert-popup p {
    margin: 0 0 10px;
  }
  
  .alert-popup button {
    padding: 5px 10px;
  }
  </style>
  