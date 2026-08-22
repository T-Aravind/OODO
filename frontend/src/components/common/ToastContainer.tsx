import React from 'react'
import { CheckCircle2, AlertCircle, Info, XCircle, X } from 'lucide-react'
import { useToast } from '../../context/ToastContext'

export const ToastContainer: React.FC = () => {
  const { toasts, removeToast } = useToast()

  if (toasts.length === 0) return null

  const getIcon = (type: string) => {
    switch (type) {
      case 'success':
        return <CheckCircle2 className="toast-icon text-emerald-500" size={20} />
      case 'warning':
        return <AlertCircle className="toast-icon text-amber-500" size={20} />
      case 'error':
        return <XCircle className="toast-icon text-rose-500" size={20} />
      case 'info':
      default:
        return <Info className="toast-icon text-blue-500" size={20} />
    }
  }

  return (
    <div className="toast-container" aria-live="polite">
      {toasts.map((toast) => (
        <div key={toast.id} className={`toast-card toast-${toast.type}`}>
          <div className="toast-content">
            {getIcon(toast.type)}
            <div className="toast-text">
              <div className="toast-title">{toast.title}</div>
              {toast.message && <div className="toast-message">{toast.message}</div>}
            </div>
          </div>
          <button
            onClick={() => removeToast(toast.id)}
            className="toast-close-btn"
            aria-label="Close notification"
          >
            <X size={16} />
          </button>
        </div>
      ))}
    </div>
  )
}
