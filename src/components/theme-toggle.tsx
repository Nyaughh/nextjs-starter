"use client"

import * as React from "react"
import { useTheme } from "next-themes"
import { motion, AnimatePresence } from "framer-motion"

const ModernSunIcon = () => (
  <svg 
    viewBox="0 0 24 24" 
    fill="none" 
    className="h-[1.2rem] w-[1.2rem] stroke-current"
    strokeWidth="2"
    strokeLinecap="round"
  >
    <path d="M12 3.5v1M12 19.5v1M18.5 12h1M4.5 12h1M16.5 7.5l0.5-0.5M7 16l0.5-0.5M16.5 16.5L16 16M7 7l0.5 0.5M12 7a5 5 0 100 10 5 5 0 000-10z" />
  </svg>
)

const ModernMoonIcon = () => (
  <svg 
    viewBox="0 0 24 24" 
    fill="none" 
    className="h-[1.2rem] w-[1.2rem] stroke-current"
    strokeWidth="2"
    strokeLinecap="round"
  >
    <path d="M13 4.069V4a8 8 0 100 16 8.062 8.062 0 005.288-2A9 9 0 0113 4.069z" />
  </svg>
)

export function ThemeToggle() {
  const { theme, setTheme } = useTheme()
  const [mounted, setMounted] = React.useState(false)
  const buttonRef = React.useRef<HTMLButtonElement>(null)

  React.useEffect(() => {
    setMounted(true)
  }, [])

  const toggleTheme = () => {
    const nextTheme = theme === "dark" ? "light" : "dark"
    if (!mounted || !buttonRef.current) return

    const rect = buttonRef.current.getBoundingClientRect()
    const centerX = rect.left + rect.width / 2
    const centerY = rect.top + rect.height / 2

    // Create rays of light (sunburst effect)
    const rays = Array.from({ length: 12 }).map((_, i) => {
      const ray = document.createElement('div')
      ray.className = 'fixed z-50 pointer-events-none'
      ray.style.width = '2px'
      ray.style.height = '150px'
      ray.style.transformOrigin = 'center top'
      ray.style.background = theme === 'dark' 
        ? 'linear-gradient(180deg, rgba(0, 0, 0, 0.9) 0%, transparent 100%)'
        : 'linear-gradient(180deg, rgba(255, 255, 255, 0.9) 0%, transparent 100%)'
      ray.style.filter = theme === 'dark'
        ? 'drop-shadow(0 0 2px rgba(255, 255, 255, 0.5))'
        : 'drop-shadow(0 0 2px rgba(0, 0, 0, 0.5))'
      document.body.appendChild(ray)
      
      const angle = (i / 12) * Math.PI * 2
      
      ray.style.position = 'fixed'
      ray.style.left = `${centerX}px`
      ray.style.top = `${centerY}px`
      ray.style.transition = 'all 0.8s cubic-bezier(0.4, 0, 0.2, 1)'
      ray.style.transform = `rotate(${angle}rad) scale(0)`
      ray.style.opacity = '0'
      
      requestAnimationFrame(() => {
        ray.style.transform = `rotate(${angle}rad) scale(1)`
        ray.style.opacity = '1'
      })
      
      return ray
    })

    // Switch theme immediately
    setTheme(nextTheme)

    // Cleanup rays after animation
    setTimeout(() => {
      rays.forEach(ray => {
        ray.style.opacity = '0'
        ray.style.transform = ray.style.transform.replace('scale(1)', 'scale(1.5)')
      })
      
      setTimeout(() => {
        rays.forEach(ray => document.body.removeChild(ray))
      }, 800)
    }, 400)
  }

  if (!mounted) {
    return (
      <button className="relative rounded-md w-6 h-6 flex items-center justify-center">
        <div className="h-[1.2rem] w-[1.2rem]" />
      </button>
    )
  }

  return (
    <button
      ref={buttonRef}
      onClick={toggleTheme}
      className="relative rounded-md w-6 h-6 flex items-center justify-center"
    >
      {theme === 'dark' ? <ModernMoonIcon /> : <ModernSunIcon />}
      <span className="sr-only">Toggle theme</span>
    </button>
  )
} 