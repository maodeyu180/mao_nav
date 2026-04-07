import crypto from 'crypto'

async function generateToken(password) {
  return crypto.createHash('sha256').update(password + ':mao-nav-auth').digest('hex')
}

export default async function handler(req, res) {
  // CORS
  res.setHeader('Access-Control-Allow-Origin', '*')
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS')
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization')

  if (req.method === 'OPTIONS') return res.status(200).end()
  if (req.method !== 'POST') return res.status(405).json({ success: false, error: 'Method not allowed' })

  try {
    const { password } = req.body
    const adminPassword = process.env.ADMIN_PASSWORD

    if (!adminPassword) {
      return res.status(500).json({ success: false, error: '服务端未配置管理员密钥' })
    }

    if (!password || password !== adminPassword) {
      return res.status(401).json({ success: false, error: '密钥错误，请重新输入' })
    }

    const token = await generateToken(adminPassword)
    return res.status(200).json({ success: true, token })
  } catch (error) {
    return res.status(500).json({ success: false, error: error.message })
  }
}
