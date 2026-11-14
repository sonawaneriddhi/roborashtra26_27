import { NextResponse } from 'next/server'

export async function POST(request) {
  try {
    const body = await request.json()
    const { username, password } = body

    const expectedUser = (process.env.ADMIN_USERNAME || '').trim()
    const expectedPass = (process.env.ADMIN_PASSWORD || '').trim()

    if (!expectedUser || !expectedPass) {
      console.error(
        'Admin credentials not configured: ADMIN_USERNAME and ADMIN_PASSWORD must be defined in .env.local'
      )
      return NextResponse.json(
        { success: false, error: 'Authentication service not properly configured on server.' },
        { status: 500 }
      )
    }

    const inputUser = (username || '').toString().trim()
    const inputPass = (password || '').toString().trim()

    if (!inputUser || !inputPass) {
      return NextResponse.json(
        { success: false, error: 'Both username and password are required.' },
        { status: 400 }
      )
    }

    if (inputUser === expectedUser && inputPass === expectedPass) {
      return NextResponse.json({
        success: true,
        message: 'Admin session authenticated successfully',
        user: {
          username: expectedUser,
          role: 'SUPERADMIN',
          loginTime: new Date().toISOString(),
        },
      })
    }

    return NextResponse.json(
      { success: false, error: 'ACCESS DENIED // INVALID USERNAME OR PASSWORD' },
      { status: 401 }
    )
  } catch (err) {
    return NextResponse.json(
      { success: false, error: 'Internal authentication server error' },
      { status: 500 }
    )
  }
}
