import { describe, it, expect, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import { DashboardPage } from '../src/renderer/pages/DashboardPage'

// Mock the hook
vi.mock('../src/renderer/hooks/useDashboardStats', () => ({
  useDashboardStats: () => ({
    stats: {
      totalStudents: 50,
      paidAmount: 500000,
      pendingAmount: 100000,
      totalFees: 20,
    },
    loading: false,
    error: null,
  }),
}))

describe('DashboardPage', () => {
  it('renders dashboard with stats', () => {
    render(<DashboardPage />)
    expect(screen.getByText('Dashboard')).toBeTruthy()
  })
})
