import { prisma } from '@/lib/prisma'
import { NextResponse } from 'next/server'
import * as bcrypt from 'bcrypt'
import { cookies } from 'next/headers'

export async function GET() {
  try {
    const cookieStore = await cookies()
    const userId = cookieStore.get('userId')?.value
    
    if (!userId) {
      return NextResponse.json({ error: 'Not authenticated' }, { status: 401 })
    }

    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        username: true,
      }
    })

    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 401 })
    }

    return NextResponse.json(user)
  } catch (error) {
    return NextResponse.json(
      { error: 'Authentication check failed' },
      { status: 500 }
    )
  }
}

export async function POST(request: Request) {
  try {
    const { username, password, action } = await request.json()

    if (action === 'register') {
      // Check if user already exists
      const existingUser = await prisma.user.findUnique({
        where: { username }
      })

      if (existingUser) {
        return NextResponse.json(
          { error: 'Username already exists' },
          { status: 400 }
        )
      }

      // Hash password and create user
      const hashedPassword = await bcrypt.hash(password, 10)
      const user = await prisma.user.create({
        data: {
          username,
          password: hashedPassword,
        },
        select: {
          id: true,
          username: true,
          createdAt: true,
        },
      })

      // Set cookie in response
      const response = NextResponse.json(user)
      response.cookies.set('userId', user.id)
      return response
    }

    if (action === 'login') {
      // Find user and verify password
      const user = await prisma.user.findUnique({
        where: { username }
      })

      if (!user) {
        return NextResponse.json(
          { error: 'Invalid credentials' },
          { status: 401 }
        )
      }

      const passwordMatch = await bcrypt.compare(password, user.password)
      
      if (!passwordMatch) {
        return NextResponse.json(
          { error: 'Invalid credentials' },
          { status: 401 }
        )
      }

      // Return user data (excluding password) with cookie
      const { password: _, ...userWithoutPassword } = user
      const response = NextResponse.json(userWithoutPassword)
      response.cookies.set('userId', user.id)
      return response
    }

    return NextResponse.json(
      { error: 'Invalid action' },
      { status: 400 }
    )
  } catch (error) {
    return NextResponse.json(
      { error: 'Authentication failed' },
      { status: 500 }
    )
  }
} 