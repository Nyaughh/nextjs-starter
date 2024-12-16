'use client'

import { useState } from 'react'
import { signIn } from 'next-auth/react'
import { ThemeToggle } from "@/components/theme-toggle"
import { Github, LogIn } from "lucide-react"
import Link from "next/link"
import { useRouter } from 'next/navigation'

export default function AuthPage() {
  const [isLogin, setIsLogin] = useState(true)
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const router = useRouter()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')

    try {
      if (isLogin) {
        const result = await signIn('credentials', {
          username,
          password,
          redirect: false
        })

        if (result?.error) {
          setError('Invalid credentials')
          return
        }

        router.push('/')
        router.refresh()
      } else {
        // Register
        const res = await fetch('/api/auth/register', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ username, password })
        })

        const data = await res.json()

        if (!res.ok) {
          throw new Error(data.error || 'Registration failed')
        }

        // Auto login after registration
        await signIn('credentials', {
          username,
          password,
          redirect: false
        })

        router.push('/')
        router.refresh()
      }
    } catch (err: any) {
      setError(err.message)
    }
  }

  return (
    <div className="grid grid-rows-[20px_1fr_20px] items-center justify-items-center min-h-screen p-8 pb-20 gap-16 sm:p-20 font-[family-name:var(--font-geist-sans)]">
      <div className="absolute top-5 right-5">
        <ThemeToggle />
      </div>
      <main className="flex flex-col gap-8 row-start-2 items-center w-full max-w-md">
        <h2 className="text-3xl font-extrabold">
          {isLogin ? 'Sign in' : 'Create account'}
        </h2>
        <form className="w-full space-y-4" onSubmit={handleSubmit}>
          {error && (
            <div className="text-red-500 text-sm text-center">{error}</div>
          )}
          <div className="space-y-2">
            <input
              type="text"
              required
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="w-full px-3 py-2 bg-black/[.05] dark:bg-white/[.06] rounded focus:outline-none focus:ring-2 focus:ring-indigo-500"
              placeholder="Username"
            />
            <input
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-3 py-2 bg-black/[.05] dark:bg-white/[.06] rounded focus:outline-none focus:ring-2 focus:ring-indigo-500"
              placeholder="Password"
            />
          </div>
          <button
            type="submit"
            className="w-full py-2 px-4 bg-black dark:bg-white text-white dark:text-black rounded hover:bg-black/90 dark:hover:bg-white/90 transition-colors"
          >
            {isLogin ? 'Sign in' : 'Create account'}
          </button>
        </form>
        <button
          onClick={() => setIsLogin(!isLogin)}
          className="text-sm text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100"
        >
          {isLogin ? 'Need an account? Create one' : 'Already have an account? Sign in'}
        </button>
      </main>
      <footer className="row-start-3 flex gap-6 flex-wrap items-center justify-center">
        <a
          className="flex items-center gap-2 hover:underline hover:underline-offset-4"
          href="https://github.com/Nyaughh/nextjs-starter"
          target="_blank"
          rel="noopener noreferrer"
        >
          <Github aria-hidden width={16} height={16} />
          GitHub →
        </a>
        <Link
          href="/"
          className="flex items-center gap-2 hover:underline hover:underline-offset-4"
        >
          Home →
        </Link>
      </footer>
    </div>
  )
} 