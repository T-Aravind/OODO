import React, { createContext, useContext, useState, useCallback } from 'react'
import type { ToastMessage } from '../types'

interface ToastContextType {
  toasts: ToastMessage[]
  addToast: (type: 'success' | 'info' | 'warning' | 'error', title: string, message?: string) => void
  removeToast: (id: string) => void
}

const ToastContext = createContext<ToastContextType | undefined>(undefined)

export const ToastProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [toasts, setToasts] = useState<ToastMessage[]>([])

  const removeToast = useCallback((id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id))
  }, [])

  const addToast = useCallback((type: 'success' | 'info' | 'warning' | 'error', title: string, message?: string) => {
    const id = `toast-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`
    const newToast: ToastMessage = {
      id,
      type,
      title,
      message,
      timestamp: Date.now()
    }
    setToasts((prev) => [...prev, newToast])

    setTimeout(() => {
      removeToast(id)
    }, 4200)
  }, [removeToast])

  return (
    <ToastContext.Provider value={{ toasts, addToast, removeToast }}>
      {children}
    </ToastContext.Provider>
  )
}

export const useToast = () => {
  const context = useContext(ToastContext)
  if (!context) {
    throw new Error('useToast must be used within a ToastProvider')
  }
  return context
}
