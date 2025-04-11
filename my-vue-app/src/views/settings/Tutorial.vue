<template>
  <div class="tutorial-container">
    <img src="../../assets/屏幕截图 2025-04-11 144120(1).png" alt="教程图片" class="full-image">
  </div>
</template>

<script>
export default {
  name: 'Tutorial'
}
</script>

<style scoped>
.tutorial-container {
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