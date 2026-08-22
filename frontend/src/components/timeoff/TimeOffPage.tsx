import React from 'react'
import { useApp } from '../../context/AppContext'
import { EmployeeTimeOffView } from './EmployeeTimeOffView'
import { AdminTimeOffView } from './AdminTimeOffView'

export const TimeOffPage: React.FC = () => {
  const { currentUser } = useApp()
  const isAdmin = currentUser?.role === 'admin'

  return isAdmin ? <AdminTimeOffView /> : <EmployeeTimeOffView />
}
