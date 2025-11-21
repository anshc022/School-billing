import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from 'react'

interface AuthUser {
  id: number
  username: string
  role: string
}

interface AuthContextValue {
  isAuthenticated: boolean
  user: AuthUser | null
  loading: boolean
  login: (username: string, password: string) => Promise<{ success: boolean; error?: string }>
  logout: () => void
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined)

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [user, setUser] = useState<AuthUser | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const storedUser = localStorage.getItem('user')
    if (storedUser) {
      try {
        const parsed = JSON.parse(storedUser) as AuthUser
        setUser(parsed)
        setIsAuthenticated(true)
      } catch {
        localStorage.removeItem('user')
      }
    }
    setLoading(false)
  }, [])

  const login = useCallback(async (username: string, password: string) => {
    try {
      const api = (window as any)?.api
      if (!api) {
        return { success: false, error: 'API bridge not available' }
      }

      const result = await api.login(username, password)
      if (result?.success) {
        setUser(result.user)
        setIsAuthenticated(true)
        localStorage.setItem('user', JSON.stringify(result.user))
        return { success: true }
      }

      return { success: false, error: result?.error ?? 'Invalid credentials' }
    } catch (error) {
      return { success: false, error: (error as Error).message }
    }
  }, [])

  const logout = useCallback(() => {
    setUser(null)
    setIsAuthenticated(false)
    localStorage.removeItem('user')

    try {
      const api = (window as any)?.api
      api?.logout()
    } catch (error) {
      console.error('Logout error:', error)
    }
  }, [])

  const value = useMemo<AuthContextValue>(
    () => ({ isAuthenticated, user, loading, login, logout }),
    [isAuthenticated, user, loading, login, logout]
  )

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}
