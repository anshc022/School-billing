import { ReactNode } from 'react'
import { LayoutSidebar } from './LayoutSidebar'

interface LayoutProps {
  children: ReactNode
  currentPage: string
  onPageChange: (page: string) => void
  user: any
  onLogout: () => void
}

export const Layout = ({ children, currentPage, onPageChange, user, onLogout }: LayoutProps) => {
  return (
    <div className="flex h-screen bg-slate-50 dark:bg-slate-950">
      <LayoutSidebar
        currentPage={currentPage}
        onPageChange={onPageChange}
        user={user}
        onLogout={onLogout}
      />
      <main className="flex-1 overflow-auto">
        <div className="p-8">{children}</div>
      </main>
    </div>
  )
}
