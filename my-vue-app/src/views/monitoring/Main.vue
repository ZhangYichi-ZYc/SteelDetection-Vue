<template>
     <div class="monitoring-container">
       <nav>
         <router-link :to="{ name: 'Overview' }">数据全览</router-link>
         <router-link :to="{ name: 'Realtime' }">实时监测</router-link>
         <router-link :to="{ name: 'Upload' }">上传监测</router-link>
         <router-link :to="{ name: 'History' }">历史记录</router-link>
         <router-link :to="{ name: 'SettingsBase' }">系统设置</router-link>
       </nav>

       <router-view></router-view>
     </div>
   </template>

   <style scoped>
   .monitoring-container {
     padding: 2rem;
   }
   nav {
     margin-bottom: 2rem;
   }
   </style>