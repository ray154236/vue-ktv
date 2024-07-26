<template>
  <div id="app">
    <Navbar />
    <router-view />
  </div>
</template>

<script>
import Navbar from './components/Navbar.vue'

export default {
  name: 'App',
  components: {
    Navbar
  }
}
</script>

<style>
/* 設置全局背景圖片 */
body {
  background: url('/src/assets/background16.jpg') no-repeat center center fixed;
  background-size: cover;
  margin: 0;
  font-family: Arial, sans-serif;
}
</style>
