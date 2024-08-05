<template>
  <div class="member-profile">
    <h5 class="room-title">修改基本資料</h5>
    <div v-if="member">
      <p><strong>會員編號:</strong> {{ member.memberId }}</p>
      <p><strong>會員名稱:</strong> {{ member.memberName }}</p>
      <p><strong>身分證字號:</strong> {{ maskedIdNumber }}</p>
      <p><strong>密碼:</strong> ***********</p> <!-- 密碼不顯示 -->
      <p><strong>會員名稱:</strong> {{ editable ? editedMember.memberName : member.memberName }}</p>
      <p><strong>電話:</strong> {{ editable ? editedMember.phone : member.phone }}</p>
      <p><strong>生日:</strong> {{ editable ? formatDate(editedMember.birth) : formatDate(member.birth) }}</p>
      <p><strong>Email:</strong> {{ editable ? editedMember.email : member.email }}</p>
      <p><strong>狀態:</strong> {{ member.status }}</p>
    </div>
    <div v-else>
      <p>請登入</p>
    </div>

    <!-- 修改資料表單 -->
    <div v-if="editable">
      <label>會員名稱:</label>
      <input v-model="editedMember.memberName" type="text" placeholder="請輸入會員名稱">
      <label>電話:</label>
      <input v-model="editedMember.phone" type="text" placeholder="請輸入電話" @input="validatePhone" maxlength="10"
        pattern="\d{10}" title="電話號碼必須是10位數字" />
      <label>生日:</label>
      <input v-model="editedMember.birth" type="date">
      <label>Email:</label>
      <input v-model="editedMember.email" type="email" placeholder="請輸入Email">
      <div class="button-group">
        <button @click="cancelChanges">取消</button>
        <button @click="saveChanges">保存變更</button>
      </div>
    </div>

    <!-- 修改資料&回上頁 按鈕 -->
    <div v-else class="button-group">
      <button @click="goBack">回上一頁</button>
      <button @click="enableEdit">修改資料</button>
    </div>

  </div>
</template>

<script>
import { mapGetters } from 'vuex';

export default {
  computed: {
    ...mapGetters(['member']),
    maskedIdNumber() {
      if (this.member && this.member.idNumber) {
        const idNumber = this.member.idNumber;
        return idNumber.length > 4 ? `${idNumber.slice(0, -4)}****` : '****';
      }
      return '****';
    }
  },
  data() {
    return {
      editable: false,
      editedMember: {
        memberName: '',
        phone: '',
        birth: '',
        email: ''
      }
    };
  },
  created() {
    // 檢查是否登入，如果沒有則重定向到登入頁面
    if (!this.member) {
      this.$router.push('/login');
    }
  },
  methods: {
    enableEdit() {
      // 啟用編輯模式，將原始會員資料複製到編輯用的數據中
      this.editable = true;
      this.editedMember = {
        ...this.member,
        birth: this.formatDate(this.member.birth) // 格式化日期顯示
      };
    },
    saveChanges() {
      // 驗證電話號碼長度
      if (this.editedMember.phone.length !== 10) {
        alert('電話號碼必須是10位數字');
        return;
      }
      // 呼叫 Vuex 的 action 並確保返回一個 Promise
      this.$store.dispatch('updateMemberInfo', this.editedMember)
        .then(() => {
          this.editable = false;
          // 更新成功後，更新本地的會員資料
          this.$store.commit('setMember', this.editedMember);
          this.message = '修改成功!';
          alert(this.message);
        })
        .catch(error => {
          console.error('更新會員資料失敗', error);
          // 可以根據具體情況顯示錯誤訊息給使用者
        });
    },

    cancelChanges() {
      // 取消編輯，恢復為原始會員資料
      this.editable = false;
    },
    formatDate(value) {
      if (!value) return '';
      // 將 ISO 8601 格式的日期轉換為 Date 對象
      const dateObj = new Date(value);
      // 使用 Date 對象的方法來獲取 YYYY-MM-DD 格式的日期
      return dateObj.toISOString().split('T')[0];
    },
    goBack() {
      this.$router.go(-1); // 返回上一頁
    },
    validatePhone(event) {
      const input = event.target;
      const value = input.value;
      // 只允許輸入數字，並且強制長度為10
      input.value = value.replace(/\D/g, '').slice(0, 10);
      this.editedMember.phone = input.value;
    }
  }
};
</script>

<style scoped>
/* 會員資料頁面樣式 */
.member-profile {
  max-width: 800px;
  /* 調整最大寬度以適應新布局 */
  margin: 0 auto;
  padding: 20px;
  border-radius: 4px;
  text-align: left;
  /* 讓文本靠左對齊 */
  font-weight: 800;
  color: #ffffff;
  display: flex;
  /* 使用 Flexbox */
  flex-direction: column;
  /* 垂直方向排列 */
}

.member-profile .content {
  display: flex;
  /* 使用 Flexbox */
  justify-content: space-between;
  /* 內容兩邊對齊 */
}

.member-profile .form-container {
  flex: 1;
  /* 表單部分占據剩餘空間 */
  margin-left: 20px;
  /* 表單與會員資料部分之間的間距 */
}

p {
  margin: 10px 0;
  font-weight: 800;
  font-size: 20px;
}

input {
  margin: 5px 0;
  padding: 8px;
  width: 100%;
  box-sizing: border-box;
  font-weight: 800;
}

.room-title {
  margin-top: 20px;
  text-align: center;
  color: #fff;
  margin-bottom: 20px;
  font-size: 28px;
  font-weight: bold;
  background: none;
  text-shadow: 3px 3px 6px orange;
}

.button-group {
  display: flex;
  justify-content: space-between;
  /* 使按鈕兩邊對齊，並分開 */
  margin-top: 20px;
  /* 調整按鈕組的上邊距 */
}

.button-group button {
  flex: 1;
  /* 按鈕寬度填滿父容器的寬度 */
  margin: 0 10px;
  /* 在按鈕左右增加間距 */
  padding: 10px 20px;
  font-size: 22px;
  cursor: pointer;
  font-weight: 800;
  border-radius: 5px;
  background-color: #f06292;
  display: flex;
  /* 使用 Flexbox 來對齊文字 */
  align-items: center;
  /* 垂直置中 */
  justify-content: center;
  /* 水平置中 */
}

button:hover {
  background-color: #681736;
  /* 滑鼠懸停時的背景顏色 */
}
</style>
