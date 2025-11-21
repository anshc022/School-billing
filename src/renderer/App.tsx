import React, { useState, useEffect } from 'react'
import './index.css'
import { useAuth } from '@/hooks/useAuth'
import LoginPage from '@/pages/LoginPage'
import { DashboardPage } from '@/pages/DashboardPage'
import { StudentsPage } from '@/pages/StudentsPage'
import { FeesPage } from '@/pages/FeesPage'
import { ReportsPage } from '@/pages/ReportsPage'
import { SettingsPage } from '@/pages/SettingsPage'
import { Layout } from '@/components/Layout'
import { ToastProvider } from '@/components/ToastProvider'

function App() {
  const { isAuthenticated, user, logout, loading } = useAuth()
  const [currentPage, setCurrentPage] = useState('dashboard')
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    // Log app state for debugging
    console.log('App state:', { isAuthenticated, loading, hasUser: !!user })
  }, [isAuthenticated, loading, user])

  // Show loading screen while checking auth
  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-slate-900 dark:to-slate-800">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
          <p className="mt-4 text-slate-600 dark:text-slate-400">Loading...</p>
        </div>
      </div>
    )
  }

  if (!isAuthenticated) {
    return (
      <ToastProvider>
        <LoginPage />
      </ToastProvider>
    )
  }

  return (
    <ToastProvider>
      <Layout currentPage={currentPage} onPageChange={setCurrentPage} user={user} onLogout={logout}>
        {currentPage === 'dashboard' && <DashboardPage />}
        {currentPage === 'students' && <StudentsPage />}
        {currentPage === 'fees' && <FeesPage />}
        {currentPage === 'reports' && <ReportsPage />}
        {currentPage === 'settings' && <SettingsPage />}
      </Layout>
    </ToastProvider>
  )
}

export default App
