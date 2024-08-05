import { createStore } from 'vuex';
import axios from '../axios'; // 確保引入 axios 實例

export default createStore({
    state: {
        idNumber: localStorage.getItem('idNumber') || '', // 從 localStorage 獲取 ID Number
        member: null, // 會員資料
    },
    mutations: {
        setIdNumber(state, idNumber) {
            state.idNumber = idNumber; // 更新 ID Number
        },
        setMember(state, member) {
            state.member = member; // 更新會員資料
        },
        clearUser(state) {
            state.idNumber = ''; // 清空 ID Number
            state.member = null; // 清空會員資料
        }
    },
    actions: {
        async fetchMemberProfile({ commit, state }) {
            try {
                const response = await axios.get(`/members/${state.idNumber}`); // 確保 URL 正確
                if (response.status === 200) {
                    commit('setMember', response.data); // 更新會員資料
                } else {
                    console.error('無法獲取會員資料', response.status);
                }
            } catch (error) {
                console.error('獲取會員資料失敗', error.message);
            }
        },
        async updateMemberInfo({ commit }, updatedMemberInfo) {
            try {
                const response = await axios.put(`/members/${updatedMemberInfo.idNumber}`, updatedMemberInfo);
                if (response.status === 200) {
                    commit('setMember', response.data); // 更新會員資料
                } else {
                    console.error('更新會員資料失敗', response.status);
                }
            } catch (error) {
                console.error('更新會員資料失敗', error.message);
                throw error; // 可選的，根據情況決定是否拋出錯誤
            }
        },
        setIdNumber({ commit }, idNumber) {
            commit('setIdNumber', idNumber); // 設置 ID Number
        },

        async logout({ commit }) {
            try {
                const response = await axios.post('/logout');
                if (response.status === 200) {
                    commit('clearUser'); // 清空用戶資料
                    localStorage.removeItem('idNumber'); // 清除 localStorage 中的 ID Number
                    localStorage.removeItem('token'); // 確保清除 token
                    sessionStorage.removeItem('idNumber'); // 清除 sessionStorage 中的 ID Number
                    sessionStorage.removeItem('token'); // 確保清除 token
                } else {
                    console.error('登出失敗', response.statusText);
                }
            } catch (error) {
                console.error('登出失敗', error.message);
            }
        }
    },
    getters: {
        member(state) {
            return state.member; // 獲取會員資料
        },
        isLoggedIn(state) {
            return !!state.idNumber; // 根據 ID Number 判斷是否登入
        }
    },
});
