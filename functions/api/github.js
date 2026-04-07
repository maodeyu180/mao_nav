const GITHUB_API_BASE = 'https://api.github.com'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type, Authorization',
  'Content-Type': 'application/json',
}

export async function onRequestOptions() {
  return new Response(null, { headers: corsHeaders })
}

async function verifyToken(token, adminPassword) {
  const encoder = new TextEncoder()
  const data = encoder.encode(adminPassword + ':mao-nav-auth')
  const hashBuffer = await crypto.subtle.digest('SHA-256', data)
  const hashArray = Array.from(new Uint8Array(hashBuffer))
  const expected = hashArray.map((b) => b.toString(16).padStart(2, '0')).join('')
  return token === expected
}

function encodePath(path) {
  return path
    .split('/')
    .map((segment) => encodeURIComponent(segment))
    .join('/')
}

async function githubFetch(url, options, timeoutMs = 15000) {
  const controller = new AbortController()
  const timeoutId = setTimeout(() => controller.abort(), timeoutMs)
  // GitHub API 要求必须带 User-Agent 头，否则返回 403
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

// Get repo config: prefer request body, fallback to env vars
function getRepoConfig(body, env) {
  return {
    owner: body.owner || env.GITHUB_OWNER || '',
    repo: body.repo || env.GITHUB_REPO || '',
    branch: body.branch || env.GITHUB_BRANCH || 'master',
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
      const raw = atob(data.content)
      content = decodeURIComponent(
        raw.split('').map((c) => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2)).join(''),
      )
    }
    return { content, sha: data.sha, path: data.path }
  },

  async updateFile({ path, content, message, sha }, token, { owner, repo, branch }) {
    const url = `${GITHUB_API_BASE}/repos/${owner}/${repo}/contents/${encodePath(path)}`
    const base64Content = btoa(
      encodeURIComponent(content).replace(/%([0-9A-F]{2})/g, (_, p1) => String.fromCharCode('0x' + p1)),
    )
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

export async function onRequestPost(context) {
  const { request, env } = context

  try {
    const githubToken = (env.GITHUB_TOKEN || '').trim()
    if (!githubToken) {
      return new Response(
        JSON.stringify({ success: false, error: '服务端 GITHUB_TOKEN 未配置，请在 CF Pages 环境变量中添加 GITHUB_TOKEN（不带 VITE_ 前缀）' }),
        { status: 500, headers: corsHeaders },
      )
    }

    const authHeader = request.headers.get('Authorization')
    const token = authHeader?.replace('Bearer ', '')
    if (!token || !(await verifyToken(token, env.ADMIN_PASSWORD))) {
      return new Response(
        JSON.stringify({ success: false, error: '认证失败，请重新登录' }),
        { status: 401, headers: corsHeaders },
      )
    }

    const body = await request.json()
    const { action, ...params } = body

    if (!action || !actions[action]) {
      return new Response(
        JSON.stringify({ success: false, error: `未知操作: ${action}` }),
        { status: 400, headers: corsHeaders },
      )
    }

    const repoConfig = getRepoConfig(body, env)
    const result = await actions[action](params, githubToken, repoConfig)

    return new Response(JSON.stringify({ success: true, data: result }), {
      status: 200, headers: corsHeaders,
    })
  } catch (error) {
    return new Response(JSON.stringify({ success: false, error: error.message }), {
      status: 500, headers: corsHeaders,
    })
  }
}
