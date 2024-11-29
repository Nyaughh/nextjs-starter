"use client"

import * as React from "react"
import { ThemeProvider as NextThemesProvider } from "next-themes"
import { type ThemeProviderProps } from "next-themes"
import { motion, AnimatePresence } from "framer-motion"

export function ThemeProvider({ children, ...props }: ThemeProviderProps) {
  const [mounted, setMounted] = React.useState(false)
  const [isTransitioning, setIsTransitioning] = React.useState(false)
  const [transitionPosition, setTransitionPosition] = React.useState({ x: 0, y: 0 })
  const [currentTheme, setCurrentTheme] = React.useState(props.defaultTheme)

  React.useEffect(() => {
    setMounted(true)
  }, [])

  React.useEffect(() => {
    const handleThemeChange = (event: CustomEvent) => {
      setIsTransitioning(true)
      setTransitionPosition(event.detail.position)
      setCurrentTheme(event.detail.theme)
      
      setTimeout(() => {
        setIsTransitioning(false)
      }, 1000)
    }

    window.addEventListener('theme-change' as any, handleThemeChange)
    return () => window.removeEventListener('theme-change' as any, handleThemeChange)
  }, [])

  return (
    <>
      <AnimatePresence>
        {isTransitioning && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 1, ease: [0.4, 0, 0.2, 1] }}
            className="pointer-events-none fixed inset-0 z-40"
            style={{
              background: currentTheme === 'dark' 
                ? `radial-gradient(circle at ${transitionPosition.x}px ${transitionPosition.y}px, transparent 0%, rgba(0, 0, 0, 0.98) 20%, rgba(0, 0, 0, 0.98) 100%)`
                : `radial-gradient(circle at ${transitionPosition.x}px ${transitionPosition.y}px, transparent 0%, rgba(255, 255, 255, 0.98) 20%, rgba(255, 255, 255, 0.98) 100%)`
            }}
          />
        )}
      </AnimatePresence>
      
      <NextThemesProvider {...props}>{children}</NextThemesProvider>
    </>
  )
} 