// Auth token management
function getAuthToken() {
  return localStorage.getItem('admin_token') || ''
}

export function setAuthToken(token) {
  localStorage.setItem('admin_token', token)
}

export function clearAuthToken() {
  localStorage.removeItem('admin_token')
}

// Repo config from frontend env vars (not sensitive)
const STATIC_USER_DATA_PATH = 'src/mock/user_data.js'
const USER_DATA_DIRECTORY = 'src/mock/user_data'
const DEFAULT_DATA_PATH = 'src/mock/mock_data.js'

function normalizePathSegment(value) {
  return value.trim().toLowerCase().replace(/[^a-z0-9._-]/g, '-')
}

function getRepoConfig() {
  return {
    owner: import.meta.env.VITE_GITHUB_OWNER || '',
    repo: import.meta.env.VITE_GITHUB_REPO || '',
    branch: import.meta.env.VITE_GITHUB_BRANCH || 'master',
  }
}

function getUserDataPath() {
  const { owner, repo } = getRepoConfig()
  const normalizedOwner = normalizePathSegment(owner)
  const normalizedRepo = normalizePathSegment(repo)

  if (!normalizedOwner || !normalizedRepo) {
    throw new Error('VITE_GITHUB_OWNER 或 VITE_GITHUB_REPO 未配置，无法定位个人导航文件')
  }
  return `${USER_DATA_DIRECTORY}/${normalizedOwner}__${normalizedRepo}.js`
}

// Call the server-side proxy (works on both CF Pages and Vercel)
async function callProxy(action, params = {}) {
  const token = getAuthToken()
  const repoConfig = getRepoConfig()

  const response = await fetch('/api/github', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({ action, ...repoConfig, ...params }),
  })

  const result = await response.json()

  if (!result.success) {
    throw new Error(result.error || '请求失败')
  }

  return result.data
}

export function useGitHubAPI() {
  // Get file content
  const getFileContent = async (path, isBinaryFile = false, allowMissing = false) => {
    return await callProxy('getFile', { path, isBinary: isBinaryFile, allowMissing })
  }

  // Update file content
  const updateFileContent = async (path, content, message, sha) => {
    return await callProxy('updateFile', { path, content, message, sha })
  }

  // Upload binary file
  const uploadBinaryFile = async (path, binaryData, message) => {
    const bytes = new Uint8Array(binaryData)
    let binary = ''
    for (let i = 0; i < bytes.length; i++) {
      binary += String.fromCharCode(bytes[i])
    }
    const base64Content = btoa(binary)

    return await callProxy('uploadBinary', { path, content: base64Content, message })
  }

  // Verify GitHub connection
  const verifyGitHubConnection = async () => {
    try {
      return await callProxy('verifyConnection')
    } catch (error) {
      return { connected: false, error: error.message }
    }
  }

  const parseDataFile = (file) => {
    const exportMatch = file.content.match(/export const mockData = ({[\s\S]*})/)

    if (!exportMatch) {
      throw new Error(`无法解析 ${file.path || '导航数据文件'} 的格式`)
    }

    return JSON.parse(exportMatch[1])
  }

  // 优先读取仓库专属数据；再回退到静态版用户文件和旧 Fork 的原数据文件。
  const loadCategoriesFromGitHub = async () => {
    const userDataPath = getUserDataPath()
    const scopedUserFile = await getFileContent(userDataPath, false, true)
    const staticUserFile = scopedUserFile.exists === false
      ? await getFileContent(STATIC_USER_DATA_PATH, false, true)
      : { exists: false }
    const file = scopedUserFile.exists !== false
      ? scopedUserFile
      : staticUserFile.exists !== false
        ? staticUserFile
        : await getFileContent(DEFAULT_DATA_PATH)
    const data = parseDataFile(file)
    const dataSource = file === scopedUserFile ? 'scoped-user' : file === staticUserFile ? 'static-user' : 'default'

    return {
      ...data,
      _fileSha: dataSource === 'default' ? null : file.sha,
      _dataSource: dataSource,
    }
  }

  // 始终保存到 Fork 专属文件。文件不存在时 GitHub Contents API 会创建它。
  const saveCategoriesToGitHub = async (data) => {
    const userDataPath = getUserDataPath()
    const currentFile = await getFileContent(userDataPath, false, true)
    const dataToSave = { ...data }
    delete dataToSave._fileSha
    delete dataToSave._dataSource
    const formattedData = JSON.stringify(dataToSave, null, 2)
    const newContent = `export const mockData = ${formattedData}\n`
    const message = `chore: 更新导航数据 - ${new Date().toLocaleString('zh-CN')}`

    return await updateFileContent(
      userDataPath,
      newContent,
      message,
      currentFile.exists === false ? undefined : currentFile.sha,
    )
  }

  return {
    loadCategoriesFromGitHub,
    saveCategoriesToGitHub,
    verifyGitHubConnection,
    getFileContent,
    updateFileContent,
    uploadBinaryFile,
  }
}
