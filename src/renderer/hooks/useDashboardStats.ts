import { useState, useEffect } from 'react'

interface DashboardStats {
  totalStudents: number
  totalFees: number
  paidFees: number
  totalAmount: number
  paidAmount: number
  pendingAmount: number
}

export const useDashboardStats = () => {
  const [stats, setStats] = useState<DashboardStats | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const result = await window.api.getDashboardStats()
        if (result.success) {
          setStats(result.data)
        } else {
          setError(result.error)
        }
      } catch (err) {
        setError((err as Error).message)
      } finally {
        setLoading(false)
      }
    }

    fetchStats()
  }, [])

  return { stats, loading, error }
}
