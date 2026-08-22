import React, { useState } from 'react'
import { MOCK_CURRENT_EMPLOYEE, MOCK_NOTIFICATIONS } from '../../mock/employeeData'

interface EmployeeLayoutProps {
  currentPath: string
  onNavigate: (path: string) => void
  onLogout: () => void
  children: React.ReactNode
}

export const EmployeeLayout: React.FC<EmployeeLayoutProps> = ({
  currentPath,
  onNavigate,
  onLogout,
  children,
}) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [profileDropdownOpen, setProfileDropdownOpen] = useState(false)
  const [notificationsOpen, setNotificationsOpen] = useState(false)

  const unreadCount = MOCK_NOTIFICATIONS.filter((n) => !n.read).length

  const navItems = [
    { label: 'Dashboard', path: '/employee/dashboard', icon: '🏠' },
    { label: 'My Profile', path: '/employee/profile', icon: '👤' },
    { label: 'Attendance', path: '/employee/attendance', icon: '🕐' },
    { label: 'Leave', path: '/employee/leave', icon: '📅' },
    { label: 'Payroll', path: '/employee/payroll', icon: '💰' },
    { label: 'Notifications', path: '/employee/notifications', icon: '🔔', badge: unreadCount },
    { label: 'Settings', path: '/employee/settings', icon: '⚙' },
  ]

  const getPageTitle = () => {
    switch (currentPath) {
      case '/employee/dashboard':
        return 'Dashboard'
      case '/employee/profile':
        return 'My Profile'
      case '/employee/attendance':
        return 'Attendance Tracker'
      case '/employee/leave':
        return 'Leave Management'
      case '/employee/payroll':
        return 'Salary & Payroll'
      case '/employee/notifications':
        return 'Notification Center'
      case '/employee/settings':
        return 'Settings'
      default:
        return 'Employee Workspace'
    }
  }

  const handleNavClick = (path: string) => {
    onNavigate(path)
    setMobileMenuOpen(false)
  }

  return (
    <div className="employee-layout-wrapper">
      {/* Sidebar Overlay for Mobile */}
      {mobileMenuOpen && (
        <div className="mobile-overlay" onClick={() => setMobileMenuOpen(false)}></div>
      )}

      {/* ── Left Sidebar ── */}
      <aside className={`employee-sidebar ${mobileMenuOpen ? 'mobile-open' : ''}`}>
        <div className="sidebar-header">
          <div className="sidebar-brand" onClick={() => handleNavClick('/employee/dashboard')}>
            <span className="brand-icon">⚡</span>
            <span className="brand-title">DAYFLOW</span>
          </div>
          <button className="sidebar-close-mobile" onClick={() => setMobileMenuOpen(false)}>
            ✕
          </button>
        </div>

        <nav className="sidebar-nav">
          <ul className="nav-list">
            {navItems.map((item) => {
              const isActive = currentPath === item.path
              return (
                <li key={item.path}>
                  <button
                    className={`nav-item-btn ${isActive ? 'active' : ''}`}
                    onClick={() => handleNavClick(item.path)}
                  >
                    <span className="nav-item-icon">{item.icon}</span>
                    <span className="nav-item-label">{item.label}</span>
                    {item.badge && item.badge > 0 ? (
                      <span className="nav-item-badge">{item.badge}</span>
                    ) : null}
                  </button>
                </li>
              )
            })}
          </ul>
        </nav>

        <div className="sidebar-footer">
          <button className="logout-btn" onClick={onLogout}>
            <span className="logout-icon">🚪</span>
            <span>Logout</span>
          </button>
        </div>
      </aside>

      {/* ── Main Content Container ── */}
      <div className="employee-main-container">
        {/* Top Navbar */}
        <header className="employee-top-navbar">
          <div className="nav-left">
            <button
              className="hamburger-btn"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              title="Toggle Menu"
            >
              ☰
            </button>
            <h2 className="top-page-title">{getPageTitle()}</h2>
          </div>

          <div className="nav-center">
            <div className="nav-search-bar">
              <span className="search-icon">🔍</span>
              <input
                type="text"
                placeholder="Search requests, slips, documents..."
                className="search-input"
              />
            </div>
          </div>

          <div className="nav-right">
            {/* Notification Bell Button */}
            <div className="notif-dropdown-wrapper">
              <button
                className="icon-circle-btn"
                onClick={() => {
                  setNotificationsOpen(!notificationsOpen)
                  setProfileDropdownOpen(false)
                }}
                title="Notifications"
              >
                <span>🔔</span>
                {unreadCount > 0 && <span className="notif-red-dot">{unreadCount}</span>}
              </button>

              {notificationsOpen && (
                <div className="notif-popup">
                  <div className="popup-header">
                    <h4>Notifications</h4>
                    <button
                      className="text-btn-sm"
                      onClick={() => handleNavClick('/employee/notifications')}
                    >
                      View All
                    </button>
                  </div>
                  <div className="popup-list">
                    {MOCK_NOTIFICATIONS.slice(0, 3).map((n) => (
                      <div key={n.id} className="popup-item">
                        <span className="popup-icon">{n.icon}</span>
                        <div className="popup-text">
                          <p className="popup-title">{n.title}</p>
                          <span className="popup-time">{n.timestamp}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Employee Profile Dropdown */}
            <div className="profile-dropdown-wrapper">
              <button
                className="profile-trigger-btn"
                onClick={() => {
                  setProfileDropdownOpen(!profileDropdownOpen)
                  setNotificationsOpen(false)
                }}
              >
                <img
                  src={MOCK_CURRENT_EMPLOYEE.profileImage}
                  alt={MOCK_CURRENT_EMPLOYEE.name}
                  className="trigger-avatar"
                />
                <span className="trigger-name">{MOCK_CURRENT_EMPLOYEE.name}</span>
                <span className="trigger-arrow">▼</span>
              </button>

              {profileDropdownOpen && (
                <div className="profile-menu-popup">
                  <div className="menu-header">
                    <p className="menu-name">{MOCK_CURRENT_EMPLOYEE.name}</p>
                    <p className="menu-email">{MOCK_CURRENT_EMPLOYEE.email}</p>
                    <span className="menu-emp-id">ID: {MOCK_CURRENT_EMPLOYEE.id}</span>
                  </div>
                  <div className="menu-divider"></div>
                  <button
                    className="menu-item-btn"
                    onClick={() => {
                      handleNavClick('/employee/profile')
                      setProfileDropdownOpen(false)
                    }}
                  >
                    👤 My Profile
                  </button>
                  <button
                    className="menu-item-btn"
                    onClick={() => {
                      handleNavClick('/employee/settings')
                      setProfileDropdownOpen(false)
                    }}
                  >
                    ⚙ Settings
                  </button>
                  <div className="menu-divider"></div>
                  <button className="menu-item-btn logout" onClick={onLogout}>
                    🚪 Logout
                  </button>
                </div>
              )}
            </div>
          </div>
        </header>

        {/* Page Content View */}
        <main className="employee-page-content">{children}</main>
      </div>
    </div>
  )
}
