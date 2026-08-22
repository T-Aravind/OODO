import React, { useState } from 'react'
import {
  MOCK_NOTIFICATIONS,
} from '../../mock/employeeData'
import type { EmployeeNotification } from '../../mock/employeeData'

export const EmployeeNotifications: React.FC = () => {
  const [notifications, setNotifications] = useState<EmployeeNotification[]>(MOCK_NOTIFICATIONS)

  const toggleRead = (id: string) => {
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, read: !n.read } : n))
    )
  }

  const markAllRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })))
  }

  return (
    <div className="notif-view-container">
      {/* Header */}
      <div className="page-header-row">
        <div>
          <h2>Notification Center</h2>
          <p className="sub-text">Updates regarding your leaves, attendance, and payroll</p>
        </div>
        <button className="btn-sm-outline" onClick={markAllRead}>
          ✓ Mark All as Read
        </button>
      </div>

      {/* Notifications List */}
      <div className="card-box notif-list-box">
        <div className="notif-items-wrapper">
          {notifications.map((item) => (
            <div
              key={item.id}
              className={`notif-card-item ${item.read ? 'read' : 'unread'}`}
              onClick={() => toggleRead(item.id)}
            >
              <div className="notif-icon-circle">{item.icon}</div>
              <div className="notif-info">
                <div className="notif-top">
                  <h4>{item.title}</h4>
                  <span className="notif-time">{item.timestamp}</span>
                </div>
                <p>{item.description}</p>
              </div>
              {!item.read && <div className="unread-dot-badge"></div>}
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
