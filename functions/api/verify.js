const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type, Authorization',
  'Content-Type': 'application/json',
}

// CORS preflight
export async function onRequestOptions() {
  return new Response(null, { headers: corsHeaders })
}

// Generate auth token from password
async function generateToken(password) {
  const encoder = new TextEncoder()
  const data = encoder.encode(password + ':mao-nav-auth')
  const hashBuffer = await crypto.subtle.digest('SHA-256', data)
  const hashArray = Array.from(new Uint8Array(hashBuffer))
  return hashArray.map((b) => b.toString(16).padStart(2, '0')).join('')
}

// POST /api/verify
export async function onRequestPost(context) {
  const { request, env } = context

  try {
    const { password } = await request.json()
    const adminPassword = env.ADMIN_PASSWORD

    if (!adminPassword) {
      return new Response(
        JSON.stringify({ success: false, error: '服务端未配置管理员密钥' }),
        { status: 500, headers: corsHeaders },
      )
    }

    if (!password || password !== adminPassword) {
      return new Response(
        JSON.stringify({ success: false, error: '密钥错误，请重新输入' }),
        { status: 401, headers: corsHeaders },
      )
    }

    const token = await generateToken(adminPassword)

    return new Response(JSON.stringify({ success: true, token }), {
      status: 200,
      headers: corsHeaders,
    })
  } catch (error) {
    return new Response(
      JSON.stringify({ success: false, error: error.message }),
      { status: 500, headers: corsHeaders },
    )
  }
}
