<template>
    <div class="upload-container">
      <h2 class="header">上傳照片</h2>
      <form @submit.prevent="uploadPhoto" class="upload-form">
        <div class="form-group">
          <label for="photoName" class="form-label">照片名稱：</label>
          <input
            type="text"
            v-model="photoName"
            id="photoName"
            placeholder="輸入照片名稱"
            required
            class="form-input"
          />
        </div>
        <div class="form-group file-upload ">
          <input
            type="file"
            id="photoFile"
            @change="handleFileUpload"
            ref="fileInput"
            style="display: none;"
          />
          <button
            type="button"
            @click="triggerFileInput"
            class="upload-button"
          >
            選擇照片
          </button>
          <span v-if="photoFile" class="file-name">{{ photoFile.name }}</span>
        </div>
        <button type="submit" class="submit-button">上傳</button>
      </form>
      <p v-if="uploadStatus" class="status">{{ uploadStatus }}</p>
    </div>
  </template>
  
  <script setup>
  import { ref } from 'vue';
  import axios from 'axios';
  
  // Define the function to reload the photo list
  function reloadPhotoList() {
    // Replace with your actual logic to reload the photo list
    // This could be a call to a function or a signal to update the list
    // Example: fetchPhotos(); or emit an event to refresh the list
    console.log('Reloading photo list...');
  }
  
  const photoName = ref('');
  const photoFile = ref(null);
  const uploadStatus = ref('');
  
  function handleFileUpload(event) {
    photoFile.value = event.target.files[0];
    photoName.value = photoFile.value.name; // 自动填充文件名
  }
  
  function uploadPhoto() {
    const formData = new FormData();
    formData.append('photoName', photoName.value);
    formData.append('photoFile', photoFile.value);
  
    axios.post('http://localhost:8080/ktv-app/photos/uploadPost', formData, {
      headers: { 'Content-Type': 'multipart/form-data' }
    })
    .then(function(response) {
      uploadStatus.value = '成功上傳';
      // Clear the form
      photoName.value = '';
      photoFile.value = null;
      document.querySelector('#photoFile').value = ''; // Clear the file input
      reloadPhotoList(); // Call function to reload the photo list
    })
    .catch(function(error) {
      uploadStatus.value = '上傳失敗: ' + error.message;
    });
  }
  
  function triggerFileInput() {
    const fileInput = document.getElementById('photoFile');
    fileInput.click();
  }
  </script>
  
  <style scoped>
  .upload-container {
    max-width: 600px;
    margin: 0 auto;
    padding: 20px;
    border: 1px solid #ddd;
    border-radius: 8px;
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
    background-color: #f9f9f9;
  }
  
  .header {
    text-align: center;
    color: #333;
    margin-bottom: 20px;
  }
  
  .upload-form {
    display: flex;
    flex-direction: column;
  }
  
  .form-group {
    margin-bottom: 15px;
  }
  
  .form-label {
    display: block;
    font-size: 16px;
    color: #333;
    margin-bottom: 8px;
  }
  
  .form-input {
    width: 100%;
    padding: 12px;
    border: 1px solid #ddd;
    border-radius: 4px;
    box-sizing: border-box;
    font-size: 16px;
  }
  
  .file-upload {
    display: flex;
    align-items: center;
  }
  
  .upload-button {
    display: inline-block;
    background-color: #4CAF50;
    color: white;
    padding: 12px 20px;
    border: none;
    border-radius: 4px;
    cursor: pointer;
    font-size: 16px;
    margin-right: 10px;
  }
  
  .upload-button:hover {
    background-color: #45a049;
  }
  
  .file-name {
    font-size: 16px;
    color: #555;
  }
  
  .submit-button {
    display: block;
    width: 100%;
    background-color: #008CBA;
    color: white;
    padding: 12px;
    border: none;
    border-radius: 4px;
    cursor: pointer;
    font-size: 16px;
    margin-top: 20px;
  }
  
  .submit-button:hover {
    background-color: #007bb5;
  }
  
  .status {
    margin-top: 10px;
    font-size: 16px;
    color: #555;
    text-align: center;
  }
  </style>
  