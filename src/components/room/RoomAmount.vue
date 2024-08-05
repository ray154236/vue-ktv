<template>
    <div class="pricing-table">
      <h3>包廂費用:</h3>
      <table>
        <thead>
          <tr>
            <th>包廂尺寸</th>
            <th>坪數</th>
            <th>人數建議</th>
            <th>金額(3小時)</th>
            <th>加時</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>溫馨小包廂</td>
            <td>6坪</td>
            <td>2-6人</td>
            <td>$5000</td>
            <td>$1000/小時</td>
          </tr>
          <tr>
            <td>舒適中包廂</td>
            <td>9坪</td>
            <td>6-10人</td>
            <td>$8000</td>
            <td>$1500/小時</td>
          </tr>
          <tr>
            <td>豪華大包廂</td>
            <td>15坪</td>
            <td>11-20人</td>
            <td>$10000</td>
            <td>$2000/小時</td>
          </tr>
        </tbody>
      </table>
    </div>
  </template>
  
  <script setup>
  </script>
  
  <style scoped>
  .pricing-table {
    max-width: 800px;
    margin: 20px auto;
    padding: 20px;
    background-color: #f9f9f9;
    border-radius: 8px;
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  }
  
  .pricing-table h3 {
    text-align: center;
    color: #333;
    font-size: 24px;
    margin-bottom: 20px;
  }
  
  .pricing-table table {
    width: 100%;
    border-collapse: collapse;
  }
  
  .pricing-table th, .pricing-table td {
    padding: 12px;
    text-align: center;
    border: 1px solid #ddd;
  }
  
  .pricing-table thead th {
    background-color: #f5a623;
    color: #fff;
    font-weight: bold;
  }
  
  .pricing-table tbody tr:nth-child(even) {
    background-color: #f9f9f9;
  }
  
  .pricing-table tbody tr:nth-child(odd) {
    background-color: #fff;
  }
  
  .pricing-table tbody tr:hover {
    background-color: #f1f1f1;
  }
  </style>
  