'use client'

import { useEffect, useRef, useState } from 'react'

type Direction = 'top' | 'bottom' | 'left' | 'right' | 'none'

interface ScrollRevealProps {
  children: React.ReactNode
  direction?: Direction
  delay?: number // ms
  duration?: number // ms
  distance?: string // e.g. "60px"
  className?: string
  once?: boolean
}

const directionMap: Record<Direction, string> = {
  top: 'translateY(-60px)',
  bottom: 'translateY(60px)',
  left: 'translateX(-60px)',
  right: 'translateX(60px)',
  none: 'none',
}

export default function ScrollReveal({
  children,
  direction = 'bottom',
  delay = 0,
  duration = 700,
  className = '',
  once = true,
}: ScrollRevealProps) {
  const ref = useRef<HTMLDivElement>(null)
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    const el = ref.current
    if (!el) return

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true)
          if (once) observer.disconnect()
        } else if (!once) {
          setVisible(false)
        }
      },
      { threshold: 0.12 }
    )

    observer.observe(el)
    return () => observer.disconnect()
  }, [once])

  return (
    <div
      ref={ref}
      className={className}
      style={{
        opacity: visible ? 1 : 0,
        transform: visible ? 'none' : directionMap[direction],
        transition: `opacity ${duration}ms ease, transform ${duration}ms ease`,
        transitionDelay: `${delay}ms`,
        willChange: 'opacity, transform',
      }}
    >
      {children}
    </div>
  )
}
