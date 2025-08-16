<template>
  <div class="system-settings">
    <div class="settings-header">
      <h2>⚙️ 系统设置</h2>
      <p>管理导航站的系统配置和GitHub集成</p>
    </div>

    <!-- GitHub连接状态 -->
    <div class="settings-section">
      <h3>🔗 GitHub 集成状态</h3>
      <div class="github-status" :class="{ connected: connectionStatus?.connected }">
        <div class="status-info">
          <div class="status-indicator">
            <span class="status-dot" :class="{ active: connectionStatus?.connected }"></span>
            <span class="status-text">
              {{ connectionStatus?.connected ? 'GitHub 连接正常' : 'GitHub 连接失败' }}
            </span>
          </div>
          <div v-if="connectionStatus?.connected" class="repo-info">
            <p><strong>仓库:</strong> {{ connectionStatus.repo }}</p>
            <p><strong>权限:</strong>
              <span v-if="connectionStatus.permissions?.push" class="permission-badge success">写入权限</span>
              <span v-else class="permission-badge warning">只读权限</span>
            </p>
          </div>
          <div v-else-if="connectionStatus?.error" class="error-info">
            <p>错误信息: {{ connectionStatus.error }}</p>
          </div>
        </div>
        <div class="status-actions">
          <button @click="testConnection" :disabled="testing" class="test-btn">
            {{ testing ? '测试中...' : '🔄 重新测试' }}
          </button>
        </div>
      </div>
    </div>

    <!-- 网站设置 -->
    <div class="settings-section">
      <h3>🌐 网站设置</h3>
      <div class="website-settings">
        <!-- 网站标题设置 -->
        <div class="setting-group">
          <label>网站标题:</label>
          <div class="title-input-group">
            <input
              v-model="websiteTitle"
              type="text"
              placeholder="请输入网站标题"
              class="title-input"
              maxlength="50"
            >
            <button
              @click="saveTitleToGitHub"
              :disabled="titleSaving || !websiteTitle.trim()"
              class="save-title-btn"
            >
              {{ titleSaving ? '保存中...' : '💾 保存标题' }}
            </button>
          </div>
          <p class="setting-description">当前标题: {{ currentTitle || '未设置' }}</p>
        </div>

        <!-- 默认搜索引擎设置 -->
        <div class="setting-group">
          <label>默认搜索引擎:</label>
          <div class="search-engine-input-group">
            <select v-model="searchEngine" class="search-engine-select">
              <option
                v-for="option in searchEngineOptions"
                :key="option.value"
                :value="option.value"
              >
                {{ option.label }}
              </option>
            </select>
            <button
              @click="saveSearchEngineToGitHub"
              :disabled="searchEngineSaving || searchEngine === currentSearchEngine"
              class="save-search-engine-btn"
            >
              {{ searchEngineSaving ? '保存中...' : '💾 保存设置' }}
            </button>
          </div>
          <p class="setting-description">当前搜索引擎: {{ searchEngineOptions.find(opt => opt.value === currentSearchEngine)?.label || '未设置' }}</p>
        </div>

        <!-- Logo设置 -->
        <div class="setting-group">
          <label>网站Logo:</label>
          <div class="logo-upload-area">
            <div class="logo-preview">
              <img
                v-if="logoPreview"
                :src="logoPreview"
                alt="Logo预览"
                class="logo-preview-img"
              >
              <img
                v-else-if="currentLogo"
                :src="currentLogo"
                alt="当前Logo"
                class="logo-preview-img"
              >
              <div v-else class="logo-placeholder">
                <span>🖼️</span>
                <p>暂无Logo</p>
              </div>
            </div>
            <div class="logo-upload-controls">
              <input
                ref="logoFileInput"
                type="file"
                accept="image/png"
                @change="handleLogoSelect"
                style="display: none"
              >
              <button @click="selectLogo" class="select-logo-btn">
                📁 选择PNG文件
              </button>
              <button
                @click="saveLogoToGitHub"
                :disabled="logoSaving || !selectedLogoFile"
                class="save-logo-btn"
                v-if="selectedLogoFile"
              >
                {{ logoSaving ? '上传中...' : '🚀 上传Logo' }}
              </button>
            </div>
          </div>
          <p class="setting-description">仅支持PNG格式，建议尺寸: 128x128px</p>
        </div>
      </div>
    </div>

    <!-- 环境变量配置 -->
    <div class="settings-section">
      <h3>🌍 环境变量配置</h3>
      <div class="env-config">
        <div class="config-item">
          <label>管理员密钥 (VITE_ADMIN_PASSWORD):</label>
          <div class="config-value">
            <span v-if="envConfig.adminPassword" class="value-set">✅ 已配置</span>
            <span v-else class="value-missing">❌ 未配置</span>
          </div>
        </div>
        <div class="config-item">
          <label>GitHub Token (VITE_GITHUB_TOKEN):</label>
          <div class="config-value">
            <span v-if="envConfig.githubToken" class="value-set">✅ 已配置</span>
            <span v-else class="value-missing">❌ 未配置</span>
          </div>
        </div>
        <div class="config-item">
          <label>GitHub 仓库所有者 (VITE_GITHUB_OWNER):</label>
          <div class="config-value">
            <span class="value-display">{{ envConfig.githubOwner || '默认: maodeyu180' }}</span>
          </div>
        </div>
        <div class="config-item">
          <label>GitHub 仓库名称 (VITE_GITHUB_REPO):</label>
          <div class="config-value">
            <span class="value-display">{{ envConfig.githubRepo || '默认: mao_nav' }}</span>
          </div>
        </div>
        <div class="config-item">
          <label>GitHub 分支 (VITE_GITHUB_BRANCH):</label>
          <div class="config-value">
            <span class="value-display">{{ envConfig.githubBranch || '默认: master' }}</span>
          </div>
        </div>
      </div>
    </div>

    <!-- 配置说明 -->
    <div class="settings-section">
      <h3>📖 配置说明</h3>
      <div class="config-guide">
        <div class="guide-step">
          <h4>1. 获取 GitHub Personal Access Token</h4>
          <ol>
            <li>访问 <a href="https://github.com/settings/tokens" target="_blank" rel="noopener noreferrer">GitHub Settings → Developer settings → Personal access tokens</a></li>
            <li>点击 "Generate new token" → "Generate new token (fine-grained token)"</li>
            <li>设置 Token 名称，选择过期时间,仓库只选择mao_nav 防止token 泄露影响自己其他工程</li>
            <li>
              <strong>在 <span style="color:#3498db">Repository permissions (仓库权限)</span> 部分，勾选以下权限：</strong>
              <ul>
                <li>
                  <code>Contents</code> - <strong>Read and write</strong> ✅<br>
                  <span style="color:#888;font-size:13px;">用于读取和修改 <code>src/mock/mock_data.js</code> 文件，这是管理系统的核心功能</span>
                </li>
                <li>
                  <code>Metadata</code> - <strong>Read</strong> ✅<br>
                  <span style="color:#888;font-size:13px;">用于访问仓库基本信息，GitHub API 的基础权限</span>
                </li>
              </ul>
              <div style="margin-top:8px;">
                <strong>在 <span style="color:#f39c12">Account permissions (账户权限)</span> 部分：</strong><br>
                <span style="color:#888;font-size:13px;">不需要勾选任何账户权限 ❌，我们只操作特定仓库，不需要账户级别的权限</span>
              </div>
            </li>
            <li>点击 "Generate token" 并复制 Token</li>
          </ol>
        </div>

        <div class="guide-step">
          <h4>2. 配置环境变量</h4>
          <p>
            <strong>如果你在 <span style="color:#3498db">自己的服务器</span> 部署：</strong><br>
            在项目根目录创建 <code>.env</code> 文件，添加以下配置：
          </p>
          <p>
            <strong>如果你使用 <span style="color:#27ae60">Vercel</span> 或 <span style="color:#f39c12">Cloudflare Pages</span> 部署：</strong><br>
            请在对应平台的「环境变量」设置界面，添加下方这些变量，无需在项目中创建 <code>.env</code> 文件。
          </p>
          <div class="code-block">
            <pre><code># 管理员密钥（自定义）
VITE_ADMIN_PASSWORD=your_admin_password_here

# GitHub Token
VITE_GITHUB_TOKEN=your_github_token_here
# Github 仓库所有者
VITE_GITHUB_OWNER=your_github_owner_here
VITE_GITHUB_REPO=your_github_repo_here
VITE_GITHUB_BRANCH=your_github_branch_here</code></pre>
          </div>
        </div>

        <div class="guide-step">
          <h4>3. 安全注意事项</h4>
          <ul>
            <li>🔒 <strong>不要</strong>将 <code>.env</code> 文件提交到 Git 仓库</li>
            <li>🔑 GitHub Token 具有写入权限，请妥善保管</li>
            <li>🚫 定期更新和轮换 Token</li>
            <li>📝 在生产环境中，建议使用更安全的密钥管理方案</li>
          </ul>
        </div>
      </div>
    </div>

    <!-- 系统信息 -->
    <div class="settings-section">
      <h3>ℹ️ 系统信息</h3>
      <div class="system-info">
        <div class="info-grid">
          <div class="info-item">
            <span class="info-label">Vue 版本:</span>
            <span class="info-value">{{ systemInfo.vueVersion }}</span>
          </div>
          <div class="info-item">
            <span class="info-label">构建工具:</span>
            <span class="info-value">Vite</span>
          </div>
          <div class="info-item">
            <span class="info-label">部署时间:</span>
            <span class="info-value">{{ systemInfo.buildTime }}</span>
          </div>
          <div class="info-item">
            <span class="info-label">浏览器:</span>
            <span class="info-value">{{ systemInfo.userAgent }}</span>
          </div>
        </div>
      </div>
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
import { useGitHubAPI } from '../../apis/useGitHubAPI.js'
import CustomDialog from './CustomDialog.vue'

const { verifyGitHubConnection, loadCategoriesFromGitHub, saveCategoriesToGitHub, uploadBinaryFile } = useGitHubAPI()

// 连接状态
const connectionStatus = ref(null)
const testing = ref(false)

// 环境变量配置
const envConfig = ref({
  adminPassword: '',
  githubToken: '',
  githubOwner: '',
  githubRepo: '',
  githubBranch: ''
})

// 系统信息
const systemInfo = ref({
  vueVersion: '',
  buildTime: '',
  userAgent: ''
})

// 网站设置
const websiteTitle = ref('')
const currentTitle = ref('')
const titleSaving = ref(false)

// 搜索引擎设置
const searchEngine = ref('baidu')
const currentSearchEngine = ref('baidu')
const searchEngineSaving = ref(false)

// 搜索引擎选项
const searchEngineOptions = [
  { value: 'baidu', label: '百度' }, 
  { value: 'bing', label: 'Bing' },
  { value: 'google', label: 'Google' },
  { value: 'taobao', label: '淘宝' },
  { value: 'jingdong', label: '京东' },
  { value: 'jiexi', label: '蜜码' },
  { value: 'juzipan', label: '橘子盘搜' },
  { value: 'limao', label: '猫狸盘搜' }
]

// Logo设置
const logoFileInput = ref(null)
const selectedLogoFile = ref(null)
const logoPreview = ref('')
const currentLogo = ref('/logo.png')
const logoSaving = ref(false)

// 自定义弹框状态
const dialogVisible = ref(false)
const dialogType = ref('success')
const dialogTitle = ref('')
const dialogMessage = ref('')
const dialogDetails = ref([])

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

// 测试GitHub连接
const testConnection = async () => {
  testing.value = true
  try {
    connectionStatus.value = await verifyGitHubConnection()
  } catch (error) {
    connectionStatus.value = {
      connected: false,
      error: error.message
    }
  } finally {
    testing.value = false
  }
}

// 检查环境变量配置
const checkEnvConfig = () => {
  envConfig.value = {
    adminPassword: import.meta.env.VITE_ADMIN_PASSWORD ? '***' : '',
    githubToken: import.meta.env.VITE_GITHUB_TOKEN ? '***' : '',
    githubOwner: import.meta.env.VITE_GITHUB_OWNER || '',
    githubRepo: import.meta.env.VITE_GITHUB_REPO || '',
    githubBranch: import.meta.env.VITE_GITHUB_BRANCH || ''
  }
}

// 获取系统信息
const getSystemInfo = () => {
  systemInfo.value = {
    vueVersion: '3.x',
    buildTime: new Date().toLocaleString('zh-CN'),
    userAgent: navigator.userAgent
  }
}

// 加载当前网站设置
const loadWebsiteSettings = async () => {
  try {
    const data = await loadCategoriesFromGitHub()
    currentTitle.value = data.title || '小牛搜索'
    websiteTitle.value = currentTitle.value

    // 加载搜索引擎设置
    currentSearchEngine.value = data.search || 'baidu'
    searchEngine.value = currentSearchEngine.value
  } catch (error) {
    console.error('加载网站设置失败:', error)
    currentTitle.value = '小牛搜索'
    websiteTitle.value = '小牛搜索'
    currentSearchEngine.value = 'bing'
    searchEngine.value = 'bing'
  }
}

// 保存标题到GitHub
const saveTitleToGitHub = async () => {
  if (!websiteTitle.value.trim()) {
    showDialog(
      'error',
      '❌ 输入错误',
      '请输入网站标题',
      []
    )
    return
  }

  titleSaving.value = true
  try {
    // 加载当前数据
    const data = await loadCategoriesFromGitHub()

    // 更新标题
    data.title = websiteTitle.value.trim()

    // 保存到GitHub
    await saveCategoriesToGitHub(data)

    currentTitle.value = websiteTitle.value.trim()
    showDialog(
      'success',
      '🎉 网站标题保存成功',
      '您的网站标题已成功保存到GitHub仓库！',
      [
        '• 更改将在 2-3 分钟内自动部署到线上',
        '• 部署完成后，您可以在前台页面看到最新标题',
        '• 如有问题，请检查Vercel或CFpage是否触发自动部署'
      ]
    )
  } catch (error) {
    console.error('保存标题失败:', error)
    showDialog(
      'error',
      '❌ 保存失败',
      '网站标题保存过程中发生错误，请重试',
      [`• 错误详情: ${error.message}`]
    )
  } finally {
    titleSaving.value = false
  }
}

// 保存搜索引擎设置到GitHub
const saveSearchEngineToGitHub = async () => {
  searchEngineSaving.value = true
  try {
    // 加载当前数据
    const data = await loadCategoriesFromGitHub()

    // 更新搜索引擎
    data.search = searchEngine.value

    // 保存到GitHub
    await saveCategoriesToGitHub(data)

    currentSearchEngine.value = searchEngine.value
    showDialog(
      'success',
      '🎉 默认搜索引擎保存成功',
      '您的默认搜索引擎设置已成功保存到GitHub仓库！',
      [
        '• 更改将在 2-3 分钟内自动部署到线上',
        '• 部署完成后，用户访问网站时将默认使用新的搜索引擎',
        '• 如有问题，请检查Vercel或CFpage是否触发自动部署'
      ]
    )
  } catch (error) {
    console.error('保存搜索引擎设置失败:', error)
    showDialog(
      'error',
      '❌ 保存失败',
      '默认搜索引擎设置保存过程中发生错误，请重试',
      [`• 错误详情: ${error.message}`]
    )
  } finally {
    searchEngineSaving.value = false
  }
}

// 选择Logo文件
const selectLogo = () => {
  logoFileInput.value?.click()
}

// 处理Logo文件选择
const handleLogoSelect = (event) => {
  const file = event.target.files[0]
  if (!file) return

  // 验证文件类型
  if (file.type !== 'image/png') {
    showDialog(
      'error',
      '❌ 文件格式错误',
      '请选择PNG格式的图片文件',
      []
    )
    return
  }

  // 验证文件大小 (限制为2MB)
  if (file.size > 2 * 1024 * 1024) {
    showDialog(
      'error',
      '❌ 文件过大',
      '图片文件大小不能超过2MB',
      [`• 当前文件大小: ${(file.size / 1024 / 1024).toFixed(2)}MB`]
    )
    return
  }

  selectedLogoFile.value = file

  // 创建预览
  const reader = new FileReader()
  reader.onload = (e) => {
    logoPreview.value = e.target.result
  }
  reader.readAsDataURL(file)
}

// 保存Logo到GitHub
const saveLogoToGitHub = async () => {
  if (!selectedLogoFile.value) {
    showDialog(
      'error',
      '❌ 未选择文件',
      '请先选择Logo文件',
      []
    )
    return
  }

  logoSaving.value = true
  try {
    // 读取文件为ArrayBuffer
    const arrayBuffer = await selectedLogoFile.value.arrayBuffer()

    // 上传到GitHub
    const githubPath = 'public/logo.png'
    const message = `chore: 更新网站Logo - ${new Date().toLocaleString('zh-CN')}`

    await uploadBinaryFile(githubPath, arrayBuffer, message)

    // 更新当前Logo显示
    currentLogo.value = logoPreview.value

    // 清理选择的文件
    selectedLogoFile.value = null
    logoPreview.value = ''
    logoFileInput.value.value = ''

    showDialog(
      'success',
      '🎉 Logo上传成功',
      '您的网站Logo已成功保存到GitHub仓库！',
      [
        '• 更改将在 2-3 分钟内自动部署到线上',
        '• 部署完成后，刷新页面即可看到新Logo',
        '• 如有问题，请检查Vercel或CFpage是否触发自动部署'
      ]
    )
  } catch (error) {
    console.error('上传Logo失败:', error)
    showDialog(
      'error',
      '❌ 上传失败',
      'Logo上传过程中发生错误，请重试',
      [`• 错误详情: ${error.message}`]
    )
  } finally {
    logoSaving.value = false
  }
}

// 组件挂载时执行
onMounted(() => {
  checkEnvConfig()
  getSystemInfo()
  testConnection()
  loadWebsiteSettings()
})
</script>

<style scoped>
.system-settings {
  padding: 20px 0;
}

.settings-header {
  margin-bottom: 40px;
}

.settings-header h2 {
  color: #2c3e50;
  margin: 0 0 10px 0;
  font-size: 24px;
}

.settings-header p {
  color: #7f8c8d;
  margin: 0;
  font-size: 16px;
}

.settings-section {
  margin-bottom: 40px;
  padding: 25px;
  background: #f8f9fa;
  border-radius: 8px;
  border: 1px solid #e9ecef;
}

.settings-section h3 {
  color: #2c3e50;
  margin: 0 0 20px 0;
  font-size: 18px;
  font-weight: 600;
}

/* GitHub状态样式 */
.github-status {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  padding: 20px;
  background: white;
  border-radius: 6px;
  border: 1px solid #e9ecef;
}

.github-status.connected {
  border-color: #27ae60;
  background: #f8fff9;
}

.status-indicator {
  display: flex;
  align-items: center;
  gap: 10px;
  margin-bottom: 15px;
}

.status-dot {
  width: 12px;
  height: 12px;
  border-radius: 50%;
  background: #e74c3c;
  display: inline-block;
}

.status-dot.active {
  background: #27ae60;
}

.status-text {
  font-weight: 500;
  color: #2c3e50;
}

.repo-info p {
  margin: 5px 0;
  color: #7f8c8d;
  font-size: 14px;
}

.permission-badge {
  padding: 2px 8px;
  border-radius: 12px;
  font-size: 12px;
  font-weight: 500;
}

.permission-badge.success {
  background: #d4edda;
  color: #155724;
}

.permission-badge.warning {
  background: #fff3cd;
  color: #856404;
}

.error-info p {
  color: #e74c3c;
  font-size: 14px;
  margin: 5px 0;
}

.test-btn {
  padding: 8px 16px;
  background: #3498db;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-size: 14px;
  transition: background-color 0.3s ease;
}

.test-btn:hover:not(:disabled) {
  background: #2980b9;
}

.test-btn:disabled {
  background: #bdc3c7;
  cursor: not-allowed;
}

/* 环境变量配置样式 */
.env-config {
  display: flex;
  flex-direction: column;
  gap: 15px;
}

.config-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 15px;
  background: white;
  border-radius: 6px;
  border: 1px solid #e9ecef;
}

.config-item label {
  font-weight: 500;
  color: #2c3e50;
  flex: 1;
}

.config-value {
  display: flex;
  align-items: center;
  gap: 10px;
}

.value-set {
  color: #27ae60;
  font-weight: 500;
}

.value-missing {
  color: #e74c3c;
  font-weight: 500;
}

.value-display {
  color: #7f8c8d;
  font-family: monospace;
  background: #f8f9fa;
  padding: 4px 8px;
  border-radius: 4px;
  font-size: 13px;
}

/* 配置说明样式 */
.config-guide {
  background: white;
  border-radius: 6px;
  border: 1px solid #e9ecef;
  overflow: hidden;
}

.guide-step {
  padding: 20px;
  border-bottom: 1px solid #e9ecef;
}

.guide-step:last-child {
  border-bottom: none;
}

.guide-step h4 {
  color: #2c3e50;
  margin: 0 0 15px 0;
  font-size: 16px;
}

.guide-step ol, .guide-step ul {
  margin: 10px 0 0 20px;
  color: #555;
}

.guide-step ol li, .guide-step ul li {
  margin-bottom: 8px;
  line-height: 1.5;
}

.guide-step p {
  color: #555;
  line-height: 1.6;
  margin: 10px 0;
}

.guide-step a {
  color: #3498db;
  text-decoration: none;
}

.guide-step a:hover {
  text-decoration: underline;
}

.guide-step code {
  background: #f8f9fa;
  padding: 2px 6px;
  border-radius: 3px;
  font-family: 'Consolas', 'Monaco', monospace;
  color: #e74c3c;
  font-size: 13px;
}

.code-block {
  background: #f8f9fa;
  border: 1px solid #e9ecef;
  border-radius: 6px;
  padding: 15px;
  margin: 15px 0;
  overflow-x: auto;
}

.code-block pre {
  margin: 0;
  font-family: 'Consolas', 'Monaco', monospace;
  font-size: 13px;
  line-height: 1.4;
  color: #2c3e50;
}

/* 系统信息样式 */
.system-info {
  background: white;
  border-radius: 6px;
  border: 1px solid #e9ecef;
  padding: 20px;
}

.info-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 15px;
}

.info-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 10px;
  background: #f8f9fa;
  border-radius: 4px;
}

.info-label {
  font-weight: 500;
  color: #2c3e50;
}

.info-value {
  color: #7f8c8d;
  font-family: monospace;
  font-size: 13px;
  max-width: 200px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

/* 网站设置样式 */
.website-settings {
  display: flex;
  flex-direction: column;
  gap: 30px;
}

.setting-group {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.setting-group label {
  font-weight: 600;
  color: #2c3e50;
  font-size: 16px;
}

.setting-description {
  color: #7f8c8d;
  font-size: 13px;
  margin: 5px 0 0 0;
}

/* 标题设置样式 */
.title-input-group {
  display: flex;
  gap: 10px;
  align-items: center;
}

.title-input {
  flex: 1;
  padding: 10px 15px;
  border: 2px solid #e9ecef;
  border-radius: 6px;
  font-size: 14px;
  transition: border-color 0.3s ease;
}

.title-input:focus {
  outline: none;
  border-color: #3498db;
}

.save-title-btn {
  padding: 10px 20px;
  background: #3498db;
  color: white;
  border: none;
  border-radius: 6px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.3s ease;
  white-space: nowrap;
}

.save-title-btn:hover:not(:disabled) {
  background: #2980b9;
}

.save-title-btn:disabled {
  background: #bdc3c7;
  cursor: not-allowed;
}

/* 搜索引擎设置样式 */
.search-engine-input-group {
  display: flex;
  gap: 10px;
  align-items: center;
}

.search-engine-select {
  flex: 1;
  padding: 10px 15px;
  border: 2px solid #e9ecef;
  border-radius: 6px;
  font-size: 14px;
  transition: border-color 0.3s ease;
  background: white;
  cursor: pointer;
}

.search-engine-select:focus {
  outline: none;
  border-color: #3498db;
}

.save-search-engine-btn {
  padding: 10px 20px;
  background: #3498db;
  color: white;
  border: none;
  border-radius: 6px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.3s ease;
  white-space: nowrap;
}

.save-search-engine-btn:hover:not(:disabled) {
  background: #2980b9;
}

.save-search-engine-btn:disabled {
  background: #bdc3c7;
  cursor: not-allowed;
}

/* Logo设置样式 */
.logo-upload-area {
  display: flex;
  gap: 20px;
  align-items: flex-start;
}

.logo-preview {
  width: 128px;
  height: 128px;
  border: 2px dashed #e9ecef;
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: #f8f9fa;
  overflow: hidden;
}

.logo-preview-img {
  width: 100%;
  height: 100%;
  object-fit: contain;
}

.logo-placeholder {
  display: flex;
  flex-direction: column;
  align-items: center;
  color: #7f8c8d;
  text-align: center;
}

.logo-placeholder span {
  font-size: 32px;
  margin-bottom: 8px;
}

.logo-placeholder p {
  margin: 0;
  font-size: 13px;
}

.logo-upload-controls {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.select-logo-btn, .save-logo-btn {
  padding: 10px 20px;
  border: none;
  border-radius: 6px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.3s ease;
  white-space: nowrap;
}

.select-logo-btn {
  background: #95a5a6;
  color: white;
}

.select-logo-btn:hover {
  background: #7f8c8d;
}

.save-logo-btn {
  background: #27ae60;
  color: white;
}

.save-logo-btn:hover:not(:disabled) {
  background: #219a52;
}

.save-logo-btn:disabled {
  background: #bdc3c7;
  cursor: not-allowed;
}

/* 响应式设计 */
@media (max-width: 768px) {
  .github-status {
    flex-direction: column;
    gap: 15px;
  }

  .config-item {
    flex-direction: column;
    align-items: flex-start;
    gap: 10px;
  }

  .info-grid {
    grid-template-columns: 1fr;
  }

  .info-item {
    flex-direction: column;
    align-items: flex-start;
    gap: 5px;
  }

  .info-value {
    max-width: none;
    word-break: break-all;
  }

  .title-input-group {
    flex-direction: column;
    align-items: stretch;
  }

  .search-engine-input-group {
    flex-direction: column;
    align-items: stretch;
  }

  .logo-upload-area {
    flex-direction: column;
    align-items: center;
  }

  .logo-upload-controls {
    align-items: center;
  }
}
</style>
