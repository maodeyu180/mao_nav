<template>
  <div class="admin-container">
    <!-- 登录界面 -->
    <div v-if="!isAuthenticated" class="login-container">
      <div class="login-box">
        <h1>🔐 管理员登录</h1>
        <form @submit.prevent="handleLogin">
          <div class="form-group">
            <label for="password">管理密钥:</label>
            <input
              id="password"
              type="password"
              v-model="loginPassword"
              placeholder="请输入管理密钥"
              required
              class="form-input"
            />
          </div>
          <button type="submit" class="login-btn" :disabled="loading">
            {{ loading ? '验证中...' : '登录' }}
          </button>
        </form>
        <div v-if="loginError" class="error-message">
          {{ loginError }}
        </div>
      </div>
    </div>

    <!-- 管理界面 -->
    <div v-else class="admin-dashboard">
      <!-- 顶部导航 -->
      <header class="admin-header">
        <div class="header-content">
          <h1>🛠️ 导航站管理</h1>
          <div class="header-actions">
            <button @click="emergencyReset" class="emergency-btn" hidden="true">🚨 紧急重置</button>
            <button @click="debugLoadData" class="debug-btn" hidden="true">🔍 调试加载</button>
            <span class="user-info">管理员</span>
            <button @click="logout" class="logout-btn">退出</button>
          </div>
        </div>
      </header>

      <!-- 主要内容 -->
      <main class="admin-main">
        <!-- 加载状态显示 -->
        <div v-if="loading" class="loading-overlay">
          <div class="loading-content">
            <div class="loading-spinner"></div>
            <p>正在加载数据...</p>
            <button @click="skipLoading" class="skip-loading-btn">跳过加载</button>
          </div>
        </div>

        <div class="admin-tabs">
          <button
            class="tab-btn"
            :class="{ active: activeTab === 'categories' }"
            @click="activeTab = 'categories'"
          >
            📁 分类管理
          </button>
          <button
            class="tab-btn"
            :class="{ active: activeTab === 'sites' }"
            @click="switchToSiteTab"
          >
            🌐 站点管理
          </button>
          <button
            class="tab-btn"
            :class="{ active: activeTab === 'settings' }"
            @click="activeTab = 'settings'"
          >
            ⚙️ 系统设置
          </button>
        </div>

        <!-- 分类管理 -->
        <div v-if="activeTab === 'categories'" class="tab-content">
          <CategoryManager
            :categories="categories"
            @update="handleCategoriesUpdate"
            @save="saveToGitHub"
            @viewSites="switchToSiteManager"
            :loading="saving"
          />
        </div>

        <!-- 站点管理 -->
        <div v-if="activeTab === 'sites'" class="tab-content">
          <SiteManager
            :categories="categories"
            :initialSelectedCategoryId="selectedCategoryId"
            @update="handleCategoriesUpdate"
            @save="saveToGitHub"
            :loading="saving"
          />
        </div>

        <!-- 系统设置 -->
        <div v-if="activeTab === 'settings'" class="tab-content">
          <SystemSettings />
        </div>
      </main>
    </div>

    <!-- 自定义弹框 -->
    <CustomDialog
      :visible="dialogVisible"
      :type="dialogType"
      :title="dialogTitle"
      :message="dialogMessage"
      :details="dialogDetails"
      @close="closeDialog"
      @confirm="closeDialog"
    />
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import CategoryManager from '../components/admin/CategoryManager.vue'
import SiteManager from '../components/admin/SiteManager.vue'
import SystemSettings from '../components/admin/SystemSettings.vue'
import CustomDialog from '../components/admin/CustomDialog.vue'
import { useGitHubAPI, setAuthToken, clearAuthToken } from '../apis/useGitHubAPI.js'

const router = useRouter()
const { saveCategoriesToGitHub, loadCategoriesFromGitHub } = useGitHubAPI()

// 认证状态
const isAuthenticated = ref(false)
const loginPassword = ref('')
const loginError = ref('')
const loading = ref(false)
const saving = ref(false)

// 管理界面状态
const activeTab = ref('categories')
const categories = ref([])
const navTitle = ref('猫猫导航') // 保存网站标题
const selectedCategoryId = ref('') // 用于站点管理的选中分类

// 紧急兜底：如果5秒后loading还是true，强制重置
setTimeout(() => {
  if (loading.value) {
    console.warn('检测到loading状态异常，强制重置')
    loading.value = false
    // 确保至少有基本数据
    if (categories.value.length === 0) {
      categories.value = [
        {
          id: 'default',
          name: '默认分类',
          icon: '📁',
          order: 0,
          sites: []
        }
      ]
    }
  }
}, 5000)

// 自定义弹框状态
const dialogVisible = ref(false)
const dialogType = ref('success')
const dialogTitle = ref('')
const dialogMessage = ref('')
const dialogDetails = ref([])

// 验证管理员密钥（通过服务端验证）
const handleLogin = async () => {
  loading.value = true
  loginError.value = ''

  try {
    const response = await fetch('/api/verify', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ password: loginPassword.value }),
    })

    const result = await response.json()

    if (!result.success) {
      throw new Error(result.error || '验证失败')
    }

    // Store auth token and mark as authenticated
    setAuthToken(result.token)
    isAuthenticated.value = true
    localStorage.setItem('admin_authenticated', 'true')

    // Load data after login
    setTimeout(async () => {
      try {
        await loadCategories()
      } catch (error) {
        console.error('登录后数据加载失败:', error)
        loading.value = false
      }
    }, 500)
  } catch (error) {
    loginError.value = error.message
  } finally {
    if (!isAuthenticated.value) {
      loading.value = false
    }
  }
}

// 退出登录
const logout = () => {
  isAuthenticated.value = false
  localStorage.removeItem('admin_authenticated')
  clearAuthToken()
  loginPassword.value = ''
  router.push('/')
}

// 调试加载数据
const debugLoadData = async () => {
  console.log('=== 开始调试加载数据 ===')

  try {
    console.log('通过代理调用GitHub API...')
    const data = await loadCategoriesFromGitHub()
    console.log('调用成功，返回数据:', data)

    showDialog(
      'success',
      '🎉 调试成功',
      '通过代理调用GitHub API成功',
      [`• 数据类型: ${typeof data}`, `• 包含categories: ${!!data.categories}`, `• 分类数量: ${data.categories?.length || 0}`]
    )
  } catch (error) {
    console.error('调用失败:', error)
    showDialog(
      'error',
      '❌ 调试失败',
      '调用GitHub API失败',
      [`• 错误信息: ${error.message}`, `• 错误类型: ${error.constructor.name}`]
    )
  }
}

// 加载分类数据（简化版本，暂时只加载本地数据）
const loadCategories = async () => {
  console.log('🔍 开始加载分类数据（简化版本）')
  loading.value = true

  try {
    // 直接加载本地数据，避免GitHub API调用
    const { mockData } = await import('../mock/mock_data.js')
    categories.value = mockData.categories || []
    navTitle.value = mockData.title || '猫猫导航'
    console.log('✅ 本地数据加载成功，分类数量:', categories.value.length)
  } catch (error) {
    console.error('❌ 本地数据加载失败:', error)
    // 最后兜底：使用空数组
    categories.value = []
    navTitle.value = '猫猫导航'
  } finally {
    // 确保loading状态被重置
    loading.value = false
    console.log('🔍 数据加载完成，loading状态重置')
  }
}

// 处理分类更新
const handleCategoriesUpdate = (newCategories) => {
  categories.value = newCategories
}

// 切换到站点管理并选中对应分类
const switchToSiteManager = (categoryId) => {
  selectedCategoryId.value = categoryId
  activeTab.value = 'sites'
}

// 手动切换到站点管理标签
const switchToSiteTab = () => {
  selectedCategoryId.value = '' // 清空选中分类，显示所有站点
  activeTab.value = 'sites'
}

// 显示弹框
const showDialog = (type, title, message, details = []) => {
  dialogType.value = type
  dialogTitle.value = title
  dialogMessage.value = message
  dialogDetails.value = details
  dialogVisible.value = true
}

// 关闭弹框
const closeDialog = () => {
  dialogVisible.value = false
}

// 跳过加载
const skipLoading = async () => {
  console.log('用户选择跳过加载')
  loading.value = false

  // 尝试加载本地数据
  try {
    const { mockData } = await import('../mock/mock_data.js')
    categories.value = mockData.categories || []
    navTitle.value = mockData.title || '猫猫导航'
    console.log('跳过加载后，使用本地数据:', categories.value.length)
  } catch (error) {
    console.error('跳过加载时，本地数据加载失败:', error)
    // 最基本的兜底数据
    categories.value = [
      {
        id: 'default',
        name: '默认分类',
        icon: '📁',
        order: 0,
        sites: []
      }
    ]
    navTitle.value = '猫猫导航'
  }

  showDialog(
    'info',
    '⏭️ 已跳过加载',
    '已跳过GitHub数据加载，当前使用本地数据',
    [`• 分类数量: ${categories.value.length}`, `• 可在系统设置中重新尝试连接GitHub`]
  )
}

// 保存到GitHub
const saveToGitHub = async () => {
  saving.value = true
  try {
    // 先从 GitHub 加载当前完整数据，保留 search 等其他字段
    let currentData = {}
    try {
      currentData = await loadCategoriesFromGitHub()
    } catch (error) {
      console.warn('加载当前数据失败，使用默认值:', error)
    }

    // 保存完整的数据结构，保留 search 字段
    await saveCategoriesToGitHub({
      categories: categories.value,
      title: navTitle.value,
      search: currentData.search || 'bing'  // 保留搜索引擎设置
    })
    showDialog(
      'success',
      '🎉 保存成功',
      '您的更改已成功保存到GitHub仓库！',
      [
        '• 更改将在 2-3 分钟内自动部署到线上',
        '• 部署完成后，您可以在前台页面看到最新内容',
        '• 如有问题，请检查Vercel或CFpage是否触发自动部署'
      ]
    )
  } catch (error) {
    showDialog(
      'error',
      '❌ 保存失败',
      '保存过程中发生错误，请重试',
      [`• 错误详情: ${error.message}`]
    )
  } finally {
    saving.value = false
  }
}

// 紧急重置加载状态
const emergencyReset = () => {
  console.log('用户点击紧急重置按钮，强制重置loading状态')
  loading.value = false
  // 强制DOM更新，确保loading状态同步到模板
  setTimeout(() => {
    console.log('🔍 延迟检查loading状态:', loading.value)
    console.log('🔍 DOM中loading元素:', document.querySelector('.loading-overlay'))
    console.log('🔍 DOM中tab按钮:', document.querySelectorAll('.tab-btn'))

    // 如果loading overlay仍然存在，强制隐藏
    const loadingOverlay = document.querySelector('.loading-overlay')
    if (loadingOverlay) {
      console.warn('🔍 发现loading overlay仍然存在，强制隐藏')
      loadingOverlay.style.display = 'none'
    }
  }, 100)
  showDialog(
    'info',
    '⚠️ 加载状态已重置',
    '已强制重置加载状态，请刷新页面查看效果。',
    []
  )
}

// 组件挂载时检查认证状态
onMounted(() => {
  loading.value = false

  const savedAuth = localStorage.getItem('admin_authenticated')
  const savedToken = localStorage.getItem('admin_token')

  if (savedAuth === 'true' && savedToken) {
    isAuthenticated.value = true

    // Load local data for initial display
    import('../mock/mock_data.js').then(({ mockData }) => {
      categories.value = mockData.categories || []
      navTitle.value = mockData.title || '猫猫导航'
    }).catch(() => {
      categories.value = []
      navTitle.value = '猫猫导航'
    })
  } else {
    // Clean up stale auth state
    localStorage.removeItem('admin_authenticated')
    clearAuthToken()
  }
})
</script>

<style scoped>
.admin-container {
  min-height: 100vh;
  background: #2c3e50;
}

/* 登录界面样式 */
.login-container {
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: 100vh;
  padding: 20px;
}

.login-box {
  background: white;
  padding: 40px;
  border-radius: 12px;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.3);
  width: 100%;
  max-width: 400px;
}

.login-box h1 {
  text-align: center;
  margin-bottom: 30px;
  color: #2c3e50;
  font-size: 24px;
}

.form-group {
  margin-bottom: 20px;
}

.form-group label {
  display: block;
  margin-bottom: 8px;
  color: #555;
  font-weight: 500;
}

.form-input {
  width: 100%;
  padding: 12px;
  border: 2px solid #e1e1e1;
  border-radius: 6px;
  font-size: 16px;
  transition: border-color 0.3s ease;
}

.form-input:focus {
  outline: none;
  border-color: #3498db;
}

.login-btn {
  width: 100%;
  padding: 12px;
  background: #3498db;
  color: white;
  border: none;
  border-radius: 6px;
  font-size: 16px;
  font-weight: 500;
  cursor: pointer;
  transition: background-color 0.3s ease;
}

.login-btn:hover:not(:disabled) {
  background: #2980b9;
}

.login-btn:disabled {
  background: #bdc3c7;
  cursor: not-allowed;
}

.error-message {
  margin-top: 15px;
  padding: 10px;
  background: #ffebee;
  color: #c62828;
  border-radius: 4px;
  text-align: center;
  font-size: 14px;
}

/* 管理界面样式 */
.admin-dashboard {
  min-height: 100vh;
  background: #f5f7fa;
}

.admin-header {
  background: white;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
  position: sticky;
  top: 0;
  z-index: 100;
}

.header-content {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 15px 30px;
  max-width: 1200px;
  margin: 0 auto;
}

.header-content h1 {
  color: #2c3e50;
  margin: 0;
  font-size: 20px;
}

.header-actions {
  display: flex;
  align-items: center;
  gap: 15px;
}

.user-info {
  color: #7f8c8d;
  font-size: 14px;
}

.emergency-btn {
  padding: 8px 16px;
  background: #e74c3c;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-size: 14px;
  transition: background-color 0.3s ease;
  margin-right: 15px;
}

.emergency-btn:hover {
  background: #c0392b;
}

.debug-btn {
  padding: 8px 16px;
  background: #f39c12;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-size: 14px;
  transition: background-color 0.3s ease;
  margin-right: 15px;
}

.debug-btn:hover {
  background: #e67e22;
}

.logout-btn {
  padding: 8px 16px;
  background: #e74c3c;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-size: 14px;
  transition: background-color 0.3s ease;
}

.logout-btn:hover {
  background: #c0392b;
}

.admin-main {
  max-width: 1200px;
  margin: 0 auto;
  padding: 30px;
}

/* loading overlay 样式 */
.loading-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(255, 255, 255, 0.9);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 9999;
  backdrop-filter: blur(3px);
}

.loading-content {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  text-align: center;
  background: white;
  padding: 40px;
  border-radius: 12px;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.2);
}

.loading-spinner {
  width: 40px;
  height: 40px;
  border: 4px solid #f3f3f3;
  border-top: 4px solid #3498db;
  border-radius: 50%;
  animation: spin 1s linear infinite;
  margin-bottom: 20px;
}

@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}

.admin-tabs {
  display: flex;
  background: white;
  border-radius: 8px;
  padding: 5px;
  margin-bottom: 30px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
}

.tab-btn {
  flex: 1;
  padding: 12px 20px;
  background: none;
  border: none;
  cursor: pointer;
  font-size: 14px;
  font-weight: 500;
  color: #7f8c8d;
  border-radius: 4px;
  transition: all 0.3s ease;
}

.tab-btn.active {
  background: #3498db;
  color: white;
}

.tab-btn:hover:not(.active) {
  background: #f8f9fa;
  color: #2c3e50;
}

.tab-content {
  background: white;
  border-radius: 8px;
  padding: 30px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
}

/* 跳过加载按钮样式 */
.skip-loading-btn {
  margin-top: 20px;
  padding: 10px 20px;
  background: #f39c12;
  color: white;
  border: none;
  border-radius: 6px;
  cursor: pointer;
  font-size: 14px;
  transition: background-color 0.3s ease;
}

.skip-loading-btn:hover {
  background: #e67e22;
}

/* 响应式设计 */
@media (max-width: 768px) {
  .header-content {
    padding: 15px 20px;
  }

  .admin-main {
    padding: 20px 15px;
  }

  .tab-content {
    padding: 20px 15px;
  }

  .admin-tabs {
    flex-direction: column;
  }

  .tab-btn {
    margin-bottom: 5px;
  }
}
</style>
