<template>
  <div class="test-page">
    <h1>🔍 环境变量调试页面</h1>

    <div class="test-section">
      <h2>环境变量检查</h2>
      <button @click="checkEnvVars">检查环境变量</button>
      <div v-if="envResult" class="results">
        <pre>{{ envResult }}</pre>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'

const envResult = ref('')

const checkEnvVars = () => {
  const result = {
    '当前环境': import.meta.env.MODE,
    '构建时间': new Date().toLocaleString(),
    '域名': window.location.hostname,
    '说明': '敏感环境变量已迁移至服务端 (CF Pages Functions)，前端不可见',
    '前端环境变量': {
      VITE_OPEN_LOCK: import.meta.env.VITE_OPEN_LOCK || '未配置',
      VITE_GITHUB_OWNER: import.meta.env.VITE_GITHUB_OWNER || '未配置',
      VITE_GITHUB_REPO: import.meta.env.VITE_GITHUB_REPO || '未配置',
      VITE_GITHUB_BRANCH: import.meta.env.VITE_GITHUB_BRANCH || '未配置',
    },
    '服务端环境变量': '(ADMIN_PASSWORD, GITHUB_TOKEN) — 仅通过 /api/* 接口使用，前端不可见'
  }

  envResult.value = JSON.stringify(result, null, 2)
}
</script>

<style scoped>
.test-page {
  padding: 20px;
  max-width: 1200px;
  margin: 0 auto;
}

.test-section {
  margin-bottom: 40px;
  padding: 20px;
  border: 1px solid #ddd;
  border-radius: 8px;
}

.test-section h2 {
  margin-top: 0;
  color: #333;
}

.results {
  margin-top: 20px;
  padding: 15px;
  background: #f8f9fa;
  border-radius: 5px;
  max-height: 400px;
  overflow-y: auto;
}

pre {
  background: white;
  padding: 10px;
  border-radius: 3px;
  overflow-x: auto;
  font-size: 12px;
  line-height: 1.4;
}

button {
  padding: 10px 20px;
  background: #007bff;
  color: white;
  border: none;
  border-radius: 5px;
  cursor: pointer;
}

button:hover {
  background: #0056b3;
}
</style>
