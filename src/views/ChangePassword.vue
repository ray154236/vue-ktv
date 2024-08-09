<template>
    <div class="change-password">
        <h5 class="room-title">修改密碼</h5>
        <div class="input-group">
            <label for="oldPassword">舊密碼:</label>
            <input v-model="oldPassword" type="password" id="oldPassword" placeholder="請輸入舊密碼" />
            <label for="newPassword">新密碼:</label>
            <input v-model="newPassword" type="password" id="newPassword" placeholder="請輸入新密碼" />
            <label for="confirmPassword">確認新密碼:</label>
            <input v-model="confirmPassword" type="password" id="confirmPassword" placeholder="請確認新密碼" />
            <div class="button-group">
                <button @click="goBack">回上一頁</button>
                <button @click="submitForm">保存變更</button>
            </div>
            <p v-if="message" :class="{ success: success, error: !success }">{{ message }}</p>
        </div>
    </div>
</template>

<script>
import axios from '../axios';

export default {
    data() {
        return {
            oldPassword: '',
            newPassword: '',
            confirmPassword: '',
            message: '',
            success: false
        };
    },
    methods: {
        async submitForm() {
            if (this.newPassword !== this.confirmPassword) {
                this.message = '新密碼和確認密碼不一致';
                this.success = false;
                return;
            }

            try {
                const idNumber = this.$store.getters.member.idNumber; // 根據實際情況獲取會員 ID
                const response = await axios.put('/api/change-password', {
                    idNumber: idNumber,
                    oldPassword: this.oldPassword,
                    newPassword: this.newPassword
                });

                if (response && response.data) {
                    this.message = response.data;
                    this.success = true;
                    alert(this.message);
                    this.$router.push('/member');
                } else {
                    this.message = '密碼更新失敗';
                    this.success = false;
                }
            } catch (error) {
                console.error('Error during password change:', error);
                this.message = error.response?.data || '更新密碼時出錯';
                this.success = false;
            }
        },
        goBack() {
            this.$router.go(-1); // 返回上一頁
        }
    }
};
</script>

<style scoped>
.change-password {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    min-height: 60vh;
    background: none;
    padding: 20px;
    border-radius: 5px;
    box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
    width: 400px;
    margin: 0 auto;
    /* 確保它在頁面中水平居中 */
}


.room-title {
    margin-top: -95px;
    margin-bottom: 20px;
    font-size: 28px;
    font-weight: bold;
    color: #fff;
    text-shadow: 3px 3px 6px orange;
    text-align: center;
}

.input-group {
    width: 100%;
}

.input-group label {
    display: block;
    margin-bottom: 5px;
    font-size: 22px;
    font-weight: bold;
    color: #fff;
}

.input-group input {
    width: 100%;
    padding: 8px;
    margin-bottom: 15px;
    border-radius: 5px;
    box-sizing: border-box;
}

.button-group {
    display: flex;
    justify-content: space-between;
    margin-top: 20px;
    padding-left: 30px;
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

.button-group button:hover {
    background-color: #681736;
}

p.success {
    color: green;
    margin-top: 20px;
    text-align: center;
}

p.error {
    color: red;
    margin-top: 20px;
    text-align: center;
}
</style>
