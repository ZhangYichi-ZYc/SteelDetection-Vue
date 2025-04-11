<template>
  <div class="device-container">
    <img src="../../assets/屏幕截图 2025-04-11 144528.png" alt="设备管理图片" class="full-image">
  </div>
</template>

<script>
export default {
  name: 'Device'
}
</script>

<style scoped>
.device-container {
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
}

.full-image {
  width: 100%;
  height: 100%;
  object-fit: cover;
}
</style>