import crypto from 'crypto'

const GITHUB_API_BASE = 'https://api.github.com'

function verifyToken(token, adminPassword) {
  const expected = crypto.createHash('sha256').update(adminPassword + ':mao-nav-auth').digest('hex')
  return token === expected
}

function encodePath(path) {
  return path.split('/').map((s) => encodeURIComponent(s)).join('/')
}

async function githubFetch(url, options, timeoutMs = 15000) {
  const controller = new AbortController()
  const timeoutId = setTimeout(() => controller.abort(), timeoutMs)
  options.headers = { 'User-Agent': 'mao-nav-server', ...options.headers }
  try {
    const response = await fetch(url, { ...options, signal: controller.signal })
    clearTimeout(timeoutId)
    return response
  } catch (error) {
    clearTimeout(timeoutId)
    if (error.name === 'AbortError') throw new Error('GitHub API 请求超时')
    throw error
  }
}

function getRepoConfig(body) {
  return {
    owner: body.owner || process.env.GITHUB_OWNER || '',
    repo: body.repo || process.env.GITHUB_REPO || '',
    branch: body.branch || process.env.GITHUB_BRANCH || 'master',
  }
}

const actions = {
  async getFile({ path, isBinary }, token, { owner, repo }) {
    const url = `${GITHUB_API_BASE}/repos/${owner}/${repo}/contents/${encodePath(path)}`
    const response = await githubFetch(url, {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${token}`,
        Accept: 'application/vnd.github.v3+json',
        'X-GitHub-Api-Version': '2022-11-28',
      },
    })
    if (!response.ok) {
      const error = await response.json().catch(() => ({}))
      throw new Error(error.message || `HTTP ${response.status}: ${response.statusText}`)
    }
    const data = await response.json()
    if (!data.content) throw new Error('GitHub API 返回的数据中没有 content 字段')

    let content = data.content
    if (!isBinary) {
      const raw = Buffer.from(data.content, 'base64').toString('utf-8')
      content = raw
    }
    return { content, sha: data.sha, path: data.path }
  },

  async updateFile({ path, content, message, sha }, token, { owner, repo, branch }) {
    const url = `${GITHUB_API_BASE}/repos/${owner}/${repo}/contents/${encodePath(path)}`
    const base64Content = Buffer.from(content, 'utf-8').toString('base64')
    const response = await githubFetch(url, {
      method: 'PUT',
      headers: {
        Authorization: `Bearer ${token}`,
        Accept: 'application/vnd.github.v3+json',
        'X-GitHub-Api-Version': '2022-11-28',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ message, content: base64Content, sha, branch }),
    })
    if (!response.ok) {
      const error = await response.json().catch(() => ({}))
      throw new Error(error.message || `HTTP ${response.status}`)
    }
    return await response.json()
  },

  async uploadBinary({ path, content, message }, token, { owner, repo, branch }) {
    const url = `${GITHUB_API_BASE}/repos/${owner}/${repo}/contents/${encodePath(path)}`
    let sha = null
    try {
      const checkResponse = await githubFetch(url, {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${token}`,
          Accept: 'application/vnd.github.v3+json',
          'X-GitHub-Api-Version': '2022-11-28',
        },
      })
      if (checkResponse.ok) {
        const existing = await checkResponse.json()
        sha = existing.sha
      }
    } catch { /* file doesn't exist */ }

    const requestBody = { message, content, branch }
    if (sha) requestBody.sha = sha

    const response = await githubFetch(url, {
      method: 'PUT',
      headers: {
        Authorization: `Bearer ${token}`,
        Accept: 'application/vnd.github.v3+json',
        'X-GitHub-Api-Version': '2022-11-28',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(requestBody),
    }, 30000)
    if (!response.ok) {
      const error = await response.json().catch(() => ({}))
      throw new Error(error.message || `HTTP ${response.status}`)
    }
    return await response.json()
  },

  async verifyConnection(_, token, { owner, repo }) {
    const url = `${GITHUB_API_BASE}/repos/${owner}/${repo}`
    const response = await githubFetch(url, {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${token}`,
        Accept: 'application/vnd.github.v3+json',
      },
    })
    if (!response.ok) {
      const error = await response.json().catch(() => ({}))
      throw new Error(`GitHub 连接失败 (${response.status}): ${error.message || response.statusText}`)
    }
    const repoInfo = await response.json()
    return { connected: true, repo: repoInfo.full_name, permissions: repoInfo.permissions }
  },
}

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*')
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS')
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization')

  if (req.method === 'OPTIONS') return res.status(200).end()
  if (req.method !== 'POST') return res.status(405).json({ success: false, error: 'Method not allowed' })

  try {
    const githubToken = (process.env.GITHUB_TOKEN || '').trim()
    if (!githubToken) {
      return res.status(500).json({ success: false, error: '服务端 GITHUB_TOKEN 未配置' })
    }

    const authHeader = req.headers.authorization
    const token = authHeader?.replace('Bearer ', '')
    if (!token || !verifyToken(token, process.env.ADMIN_PASSWORD)) {
      return res.status(401).json({ success: false, error: '认证失败，请重新登录' })
    }

    const { action, ...params } = req.body

    if (!action || !actions[action]) {
      return res.status(400).json({ success: false, error: `未知操作: ${action}` })
    }

    const repoConfig = getRepoConfig(req.body)
    const result = await actions[action](params, githubToken, repoConfig)

    return res.status(200).json({ success: true, data: result })
  } catch (error) {
    return res.status(500).json({ success: false, error: error.message })
  }
}
