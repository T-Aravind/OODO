import React, { useState, useRef, useEffect } from 'react'
import { User, LogOut, Menu, X, Users, CalendarCheck2, Clock, Sparkles } from 'lucide-react'
import { useApp } from '../../context/AppContext'
import { CheckInOutWidget } from '../attendance/CheckInOutWidget'

interface NavbarProps {
  currentPage: 'employees' | 'employee-detail' | 'profile' | 'attendance' | 'time-off'
  onNavigate: (page: 'employees' | 'profile' | 'attendance' | 'time-off') => void
}

export const Navbar: React.FC<NavbarProps> = ({ currentPage, onNavigate }) => {
  const { currentUser, logout } = useApp()
  const [isDropdownOpen, setIsDropdownOpen] = useState(false)
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const dropdownRef = useRef<HTMLDivElement>(null)

  const isEmployeeRole = currentUser?.role === 'employee'
  const isHRRole = currentUser?.role === 'hr'
  const isAdminRole = currentUser?.role === 'admin'

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsDropdownOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  const handleLogout = () => {
    setIsDropdownOpen(false)
    logout()
  }

  const handleProfileClick = () => {
    setIsDropdownOpen(false)
    onNavigate('profile')
  }

  // Active tab check
  const isEmployeesActive = currentPage === 'employees' || currentPage === 'employee-detail'
  const isProfileActive = currentPage === 'profile'
  const isAttendanceActive = currentPage === 'attendance'
  const isTimeOffActive = currentPage === 'time-off'

  return (
    <header className="corporate-navbar">
      <div className="navbar-container">
        {/* Left: Brand Identity */}
        <div className="navbar-left">
          <div
            className="brand-badge-logo"
            onClick={() => onNavigate(isEmployeeRole ? 'profile' : 'employees')}
            role="button"
            tabIndex={0}
          >
            <div className="brand-icon-wrapper">
              <Sparkles className="brand-icon text-indigo-600" size={18} />
            </div>
            <div className="brand-text-block">
              <span className="brand-title">DayFlow</span>
              <span className="brand-subtitle">HRMS</span>
            </div>
          </div>

          {/* Navigation Links (Desktop) */}
          <nav className="navbar-nav-links" aria-label="Main Navigation">
            {/* RBAC: 'Employees' directory is ONLY visible to Admin and HR */}
            {!isEmployeeRole && (
              <button
                onClick={() => onNavigate('employees')}
                className={`nav-tab-btn ${isEmployeesActive ? 'active' : ''}`}
                id="nav-employees-tab"
              >
                <Users size={16} />
                <span>Employees</span>
                {isEmployeesActive && <span className="active-tab-indicator" />}
              </button>
            )}

            {/* If Employee role, show My Profile in main nav */}
            {isEmployeeRole && (
              <button
                onClick={() => onNavigate('profile')}
                className={`nav-tab-btn ${isProfileActive ? 'active' : ''}`}
                id="nav-my-profile-tab"
              >
                <User size={16} />
                <span>My Profile</span>
                {isProfileActive && <span className="active-tab-indicator" />}
              </button>
            )}

            <button
              onClick={() => onNavigate('attendance')}
              className={`nav-tab-btn ${isAttendanceActive ? 'active' : ''}`}
              id="nav-attendance-tab"
            >
              <Clock size={16} />
              <span>{isEmployeeRole ? 'My Attendance' : 'Attendance'}</span>
              {isAttendanceActive && <span className="active-tab-indicator" />}
            </button>

            <button
              onClick={() => onNavigate('time-off')}
              className={`nav-tab-btn ${isTimeOffActive ? 'active' : ''}`}
              id="nav-timeoff-tab"
            >
              <CalendarCheck2 size={16} />
              <span>{isEmployeeRole ? 'My Time Off' : 'Time Off'}</span>
              {isTimeOffActive && <span className="active-tab-indicator" />}
            </button>
          </nav>
        </div>

        {/* Right: Systray Check-in Widget & Profile Avatar */}
        <div className="navbar-right">
          {/* Check-In / Check-Out Systray */}
          <CheckInOutWidget />

          {/* User Profile Avatar Dropdown */}
          <div className="user-profile-menu-container" ref={dropdownRef}>
            <button
              onClick={() => setIsDropdownOpen(!isDropdownOpen)}
              className="user-avatar-btn"
              aria-label="Open User Menu"
              aria-expanded={isDropdownOpen}
              id="user-avatar-menu-btn"
            >
              <div className="avatar-image-wrapper">
                {currentUser?.profileImage ? (
                  <img
                    src={currentUser.profileImage}
                    alt={currentUser.name || 'User Avatar'}
                    className="navbar-avatar-img"
                  />
                ) : (
                  <div className="navbar-avatar-fallback">
                    {(currentUser?.name || 'U').charAt(0).toUpperCase()}
                  </div>
                )}
                <span className="avatar-online-dot" />
              </div>
              <div className="user-meta-condensed">
                <span className="user-meta-name">{currentUser?.name || 'Aravind T'}</span>
                <span className="user-meta-role">
                  {isAdminRole ? '👑 Admin' : isHRRole ? '💼 HR Manager' : '👨‍💻 Employee'}
                </span>
              </div>
            </button>

            {/* Profile Dropdown Menu */}
            {isDropdownOpen && (
              <div className="profile-dropdown-menu">
                <div className="profile-dropdown-header">
                  <div className="user-dropdown-info">
                    <div className="user-dropdown-name">{currentUser?.name || 'Aravind T'}</div>
                    <div className="user-dropdown-email">{currentUser?.email || 'aravind.t@dayflow.io'}</div>
                    <span className={`role-tag-badge role-${currentUser?.role}`}>
                      {isAdminRole
                        ? '👑 HR Administrator'
                        : isHRRole
                        ? '💼 HR Manager'
                        : '👨‍💻 Employee Account'}
                    </span>
                  </div>
                </div>

                <div className="profile-dropdown-divider" />

                <div className="profile-dropdown-items">
                  <button
                    onClick={handleProfileClick}
                    className="dropdown-menu-item"
                    id="menu-my-profile"
                  >
                    <User size={16} className="text-slate-500" />
                    <span>My Profile</span>
                  </button>

                  <div className="profile-dropdown-divider" />

                  <button
                    onClick={handleLogout}
                    className="dropdown-menu-item logout-item"
                    id="menu-logout"
                  >
                    <LogOut size={16} className="text-rose-500" />
                    <span>Log Out</span>
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Mobile Menu Toggle Button */}
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="mobile-hamburger-btn"
            aria-label="Toggle navigation menu"
          >
            {isMobileMenuOpen ? <X size={22} /> : <Menu size={22} />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {isMobileMenuOpen && (
        <div className="mobile-nav-drawer">
          <div className="mobile-nav-links">
            {!isEmployeeRole && (
              <button
                onClick={() => {
                  onNavigate('employees')
                  setIsMobileMenuOpen(false)
                }}
                className={`mobile-tab-btn ${isEmployeesActive ? 'active' : ''}`}
              >
                <Users size={18} />
                <span>Employees</span>
              </button>
            )}

            <button
              onClick={() => {
                onNavigate('profile')
                setIsMobileMenuOpen(false)
              }}
              className={`mobile-tab-btn ${isProfileActive ? 'active' : ''}`}
            >
              <User size={18} />
              <span>My Profile</span>
            </button>

            <button
              onClick={() => {
                onNavigate('attendance')
                setIsMobileMenuOpen(false)
              }}
              className={`mobile-tab-btn ${isAttendanceActive ? 'active' : ''}`}
            >
              <Clock size={18} />
              <span>{isEmployeeRole ? 'My Attendance' : 'Attendance'}</span>
            </button>

            <button
              onClick={() => {
                onNavigate('time-off')
                setIsMobileMenuOpen(false)
              }}
              className={`mobile-tab-btn ${isTimeOffActive ? 'active' : ''}`}
            >
              <CalendarCheck2 size={18} />
              <span>{isEmployeeRole ? 'My Time Off' : 'Time Off'}</span>
            </button>

            <div className="mobile-divider" />

            <button
              onClick={() => {
                handleLogout()
                setIsMobileMenuOpen(false)
              }}
              className="mobile-tab-btn logout-mobile"
            >
              <LogOut size={18} />
              <span>Log Out</span>
            </button>
          </div>
        </div>
      )}
    </header>
  )
}
