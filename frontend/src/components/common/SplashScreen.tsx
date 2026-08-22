import React, { useState, useEffect } from 'react'
import logoAsset from '../../assets/dayflow-logo.png'
import '../../styles/splash.css'

interface SplashScreenProps {
  onComplete: () => void
  durationMs?: number
}

export const SplashScreen: React.FC<SplashScreenProps> = ({
  onComplete,
  durationMs = 2100
}) => {
  const [isFadingOut, setIsFadingOut] = useState(false)

  useEffect(() => {
    // 1. Timer to start fade out after logo reveal sequence completes (~2.1s)
    const fadeTimer = setTimeout(() => {
      setIsFadingOut(true)
    }, durationMs)

    // 2. Timer to complete transition and unmount splash screen (~2.6s)
    const exitTimer = setTimeout(() => {
      onComplete()
    }, durationMs + 550)

    return () => {
      clearTimeout(fadeTimer)
      clearTimeout(exitTimer)
    }
  }, [durationMs, onComplete])

  return (
    <div
      className={`splash-screen-overlay ${isFadingOut ? 'splash-fade-out' : ''}`}
      role="region"
      aria-label="DayFlow Introduction"
    >
      {/* Subtle Ambient Radial Glow */}
      <div className="splash-ambient-glow" aria-hidden="true" />

      {/* Logo Flow Reveal Container */}
      <div className="splash-logo-wrapper">
        <img
          src={logoAsset}
          alt="DayFlow - Employee Management System"
          className="splash-logo-image"
          decoding="async"
          loading="eager"
        />
      </div>
    </div>
  )
}
