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
function getRepoConfig() {
  return {
    owner: import.meta.env.VITE_GITHUB_OWNER || '',
    repo: import.meta.env.VITE_GITHUB_REPO || '',
    branch: import.meta.env.VITE_GITHUB_BRANCH || 'master',
  }
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
  const getFileContent = async (path, isBinaryFile = false) => {
    return await callProxy('getFile', { path, isBinary: isBinaryFile })
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

  // Load categories from GitHub
  const loadCategoriesFromGitHub = async () => {
    const file = await getFileContent('src/mock/mock_data.js')
    const content = file.content
    const exportMatch = content.match(/export const mockData = ({[\s\S]*})/)

    if (!exportMatch) {
      throw new Error('无法解析 mock_data.js 文件格式')
    }

    const data = JSON.parse(exportMatch[1])

    return {
      ...data,
      _fileSha: file.sha,
    }
  }

  // Save categories to GitHub
  const saveCategoriesToGitHub = async (data) => {
    const currentFile = await getFileContent('src/mock/mock_data.js')
    const formattedData = JSON.stringify(data, null, 2)
    const newContent = `export const mockData = ${formattedData}\n`
    const message = `chore: 更新导航数据 - ${new Date().toLocaleString('zh-CN')}`

    return await updateFileContent('src/mock/mock_data.js', newContent, message, currentFile.sha)
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
