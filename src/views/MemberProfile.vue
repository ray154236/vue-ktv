<template>
  <div class="member-profile">
    <h1 style="color: white;">會員基本資料</h1>
    <div v-if="member">
      <p><strong>會員編號:</strong> {{ member.memberId }}</p>
      <p><strong>會員名稱:</strong> {{ member.memberName }}</p>
      <p><strong>帳號:</strong> {{ member.idNumber }}</p>
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
      <input v-model="editedMember.phone" type="text" placeholder="請輸入電話">
      <label>生日:</label>
      <input v-model="editedMember.birth" type="date">
      <label>Email:</label>
      <input v-model="editedMember.email" type="email" placeholder="請輸入Email">
      <button @click="saveChanges">保存變更</button>
      <button @click="cancelChanges">取消</button>
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
    ...mapGetters(['member'])
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
  // 呼叫 Vuex 的 action 並確保返回一個 Promise
  this.$store.dispatch('updateMemberInfo', this.editedMember)
    .then(() => {
      this.editable = false;
      // 更新成功後，更新本地的會員資料
      this.$store.commit('setMember', this.editedMember);
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
    }
  }
};
</script>

<style scoped>
/* 會員資料頁面樣式 */
.member-profile {
  max-width: 600px;
  margin: 0 auto;
  padding: 20px;
  border: 1px solid #ccc;
  border-radius: 4px;
  text-align: center;
  font-weight: 800;
  color: #ffffff;
}

p {
  margin: 10px 0;
  font-weight: 800;
}

button {
  margin-top: 10px;
  padding: 10px 20px;
  font-size: 16px;
  cursor: pointer;
  font-weight: 800;
}

input {
  margin: 5px 0;
  padding: 8px;
  width: 100%;
  box-sizing: border-box;
  font-weight: 800;
}
.title {
  color: #ffffff;
}
</style>
