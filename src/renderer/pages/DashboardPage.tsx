import { useDashboardStats } from '@/hooks/useDashboardStats'
import { useState } from 'react'
import { 
  Users, 
  DollarSign, 
  TrendingUp, 
  AlertCircle, 
  Plus, 
  FileText, 
  Download,
  ArrowUpRight,
  ArrowDownRight,
  Activity,
  Search,
  Printer,
  CheckCircle,
  Loader2,
  X
} from 'lucide-react'

export const DashboardPage = () => {
  const { stats, loading, error } = useDashboardStats()
  const [rollNo, setRollNo] = useState('')
  const [student, setStudent] = useState<any>(null)
  const [searchLoading, setSearchLoading] = useState(false)
  const [searchError, setSearchError] = useState('')
  const [collectingId, setCollectingId] = useState<number | null>(null)
  const [previewHtml, setPreviewHtml] = useState<string | null>(null)
  const [showPreview, setShowPreview] = useState(false)
  const [showSystemStatus, setShowSystemStatus] = useState(false)

  const handleSearch = async (e?: React.FormEvent) => {
    if (e) e.preventDefault()
    if (!rollNo.trim()) return
    
    if (!window.api) {
      setSearchError('API not available. Please restart the app.')
      return
    }

    setSearchLoading(true)
    setSearchError('')
    setStudent(null)
    
    try {
      const result = await window.api.getStudentByRollNo(rollNo.trim())
      if (result.success) {
        setStudent(result.data)
      } else {
        setSearchError(result.error || 'Student not found')
      }
    } catch (err) {
      console.error('Search error:', err)
      setSearchError('Failed to search student: ' + (err as Error).message)
    } finally {
      setSearchLoading(false)
    }
  }

  const handleCollect = async (feeId: number) => {
    if (!window.confirm('Are you sure you want to collect this fee?')) {
      return
    }

    setCollectingId(feeId)
    try {
      const result = await window.api.updateFee(feeId, { 
        status: 'paid',
        paymentMethod: 'cash',
        date: new Date()
      })
      if (result.success) {
        // Refresh student data
        const refreshResult = await window.api.getStudentByRollNo(rollNo.trim())
        if (refreshResult.success) {
          setStudent(refreshResult.data)
        }
        // Automatically print slip
        await handlePrint(feeId)
      }
    } catch (err) {
      console.error(err)
    } finally {
      setCollectingId(null)
    }
  }

  const handlePrint = async (feeId: number) => {
    try {
      const result = await window.api.previewSlip(feeId)
      if (result.success) {
        setPreviewHtml(result.html)
        setShowPreview(true)
      }
    } catch (err) {
      console.error('Preview error:', err)
    }
  }

  const handleActualPrint = () => {
    const printWindow = window.open('', '_blank')
    if (printWindow && previewHtml) {
      printWindow.document.write(previewHtml)
      printWindow.document.close()
      printWindow.onload = () => {
        printWindow.print()
      }
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin" />
          <p className="text-slate-500 font-medium">Loading dashboard data...</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="p-6 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-xl text-center">
        <AlertCircle className="w-12 h-12 text-red-500 mx-auto mb-3" />
        <h3 className="text-lg font-semibold text-red-700 dark:text-red-400">Failed to load dashboard</h3>
        <p className="text-red-600 dark:text-red-300 mt-1">{error}</p>
      </div>
    )
  }

  return (
    <div className="space-y-8">
      {/* Header Section */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-slate-900 dark:text-white tracking-tight">Dashboard Overview</h1>
          <p className="text-slate-500 dark:text-slate-400 mt-1">Welcome back, here's what's happening today.</p>
        </div>
        <div className="flex gap-3">
          <button className="inline-flex items-center gap-2 px-4 py-2 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors font-medium text-sm shadow-sm">
            <Download size={16} />
            Export Report
          </button>
          <button className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium text-sm shadow-sm shadow-blue-200 dark:shadow-none">
            <Plus size={16} />
            New Transaction
          </button>
        </div>
      </div>

      {/* Quick Fee Collection Section */}
      <div className="bg-white dark:bg-slate-800 rounded-2xl p-6 shadow-sm border border-slate-100 dark:border-slate-700">
        <div className="flex items-center gap-3 mb-6">
          <div className="p-2 bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 rounded-lg">
            <DollarSign size={24} />
          </div>
          <div>
            <h2 className="text-lg font-bold text-slate-900 dark:text-white">Quick Fee Collection</h2>
            <p className="text-sm text-slate-500 dark:text-slate-400">Enter roll number to view dues and collect fees</p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Search Box */}
          <div className="lg:col-span-1">
            <form onSubmit={handleSearch} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
                  Student Roll Number
                </label>
                <div className="relative">
                  <input
                    type="text"
                    value={rollNo}
                    onChange={(e) => setRollNo(e.target.value)}
                    placeholder="Enter Roll No (e.g. 101)"
                    className="w-full pl-10 pr-4 py-2.5 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
                  />
                  <Search className="absolute left-3 top-3 text-slate-400" size={18} />
                </div>
              </div>
              <button
                type="submit"
                disabled={searchLoading || !rollNo}
                className="w-full py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                {searchLoading ? (
                  <>
                    <Loader2 size={18} className="animate-spin" />
                    Searching...
                  </>
                ) : (
                  'Search Student'
                )}
              </button>
            </form>

            {searchError && (
              <div className="mt-4 p-3 bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 rounded-lg text-sm flex items-center gap-2">
                <AlertCircle size={16} />
                {searchError}
              </div>
            )}
          </div>

          {/* Results Area */}
          <div className="lg:col-span-2">
            {student ? (
              <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
                {/* Student Info */}
                <div className="flex items-start justify-between p-4 bg-slate-50 dark:bg-slate-900/50 rounded-xl border border-slate-100 dark:border-slate-700">
                  <div>
                    <h3 className="text-lg font-bold text-slate-900 dark:text-white">{student.name}</h3>
                    <div className="flex flex-wrap gap-4 mt-2 text-sm text-slate-500 dark:text-slate-400">
                      <span className="flex items-center gap-1">
                        <Users size={14} /> Class: {student.class} - {student.section}
                      </span>
                      <span className="flex items-center gap-1">
                        <FileText size={14} /> Roll No: {student.rollNo}
                      </span>
                      <span className="flex items-center gap-1">
                        <Users size={14} /> Parent: {student.parentName}
                      </span>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-sm text-slate-500 dark:text-slate-400">Total Pending</div>
                    <div className="text-2xl font-bold text-orange-600 dark:text-orange-400">
                      ₹{student.fees.filter((f: any) => f.status === 'unpaid').reduce((sum: number, f: any) => sum + f.amount, 0).toLocaleString()}
                    </div>
                  </div>
                </div>

                {/* Fees List */}
                <div className="space-y-3">
                  <h4 className="font-semibold text-slate-900 dark:text-white">Pending Dues</h4>
                  {student.fees.filter((f: any) => f.status === 'unpaid').length === 0 ? (
                    <div className="p-8 text-center border-2 border-dashed border-slate-200 dark:border-slate-700 rounded-xl">
                      <CheckCircle className="w-12 h-12 text-green-500 mx-auto mb-2" />
                      <p className="text-slate-600 dark:text-slate-400 font-medium">No pending dues!</p>
                    </div>
                  ) : (
                    <div className="space-y-3">
                      {student.fees.filter((f: any) => f.status === 'unpaid').map((fee: any) => (
                        <div key={fee.id} className="flex items-center justify-between p-4 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl hover:border-blue-300 transition-colors">
                          <div className="flex items-center gap-4">
                            <div className="p-2 bg-orange-100 dark:bg-orange-900/30 text-orange-600 dark:text-orange-400 rounded-lg">
                              <AlertCircle size={20} />
                            </div>
                            <div>
                              <p className="font-semibold text-slate-900 dark:text-white">
                                {new Date(0, fee.month - 1).toLocaleString('default', { month: 'long' })} {fee.year}
                              </p>
                              <p className="text-sm text-slate-500 dark:text-slate-400">Amount: ₹{fee.amount.toLocaleString()}</p>
                            </div>
                          </div>
                          <button
                            onClick={() => handleCollect(fee.id)}
                            disabled={collectingId === fee.id}
                            className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-sm font-medium transition-colors disabled:opacity-50 flex items-center gap-2"
                          >
                            {collectingId === fee.id ? (
                              <Loader2 size={16} className="animate-spin" />
                            ) : (
                              <DollarSign size={16} />
                            )}
                            Collect Fee
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                {/* Recent Payments (Optional - show last paid fee to print slip) */}
                {student.fees.some((f: any) => f.status === 'paid') && (
                   <div className="pt-4 border-t border-slate-100 dark:border-slate-700">
                      <h4 className="font-semibold text-slate-900 dark:text-white mb-3">Recent Payments</h4>
                      <div className="space-y-2">
                        {student.fees
                          .filter((f: any) => f.status === 'paid')
                          .slice(0, 1) // Show only the most recent one
                          .map((fee: any) => (
                          <div key={fee.id} className="flex items-center justify-between p-3 bg-emerald-50 dark:bg-emerald-900/10 border border-emerald-100 dark:border-emerald-900/30 rounded-lg">
                            <div className="flex items-center gap-3">
                              <CheckCircle size={16} className="text-emerald-600 dark:text-emerald-400" />
                              <span className="text-sm font-medium text-emerald-900 dark:text-emerald-300">
                                Paid: {new Date(0, fee.month - 1).toLocaleString('default', { month: 'short' })} {fee.year}
                              </span>
                            </div>
                            <button
                              onClick={() => handlePrint(fee.id)}
                              className="p-2 text-slate-600 dark:text-slate-400 hover:text-blue-600 dark:hover:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-900/30 rounded-lg transition-colors"
                              title="Print Slip"
                            >
                              <Printer size={18} />
                            </button>
                          </div>
                        ))}
                      </div>
                   </div>
                )}
              </div>
            ) : (
              <div className="h-full flex flex-col items-center justify-center text-slate-400 dark:text-slate-500 p-8 border-2 border-dashed border-slate-200 dark:border-slate-700 rounded-xl">
                <Search size={48} className="mb-4 opacity-20" />
                <p>Enter a roll number to search for student details</p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Stats Grid - Removed as per request */}

      {/* Floating System Status Button */}
      <button
        onClick={() => setShowSystemStatus(true)}
        className="fixed bottom-6 right-6 p-4 bg-slate-900 text-white rounded-full shadow-lg hover:bg-slate-800 transition-all hover:scale-110 z-40 flex items-center justify-center"
        title="System Status"
      >
        <Activity size={24} />
      </button>

      {/* System Status Modal */}
      {showSystemStatus && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-slate-900 text-white rounded-2xl p-6 shadow-2xl w-full max-w-md relative overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-blue-500 rounded-full blur-3xl opacity-20 -mr-10 -mt-10"></div>
            <div className="absolute bottom-0 left-0 w-24 h-24 bg-purple-500 rounded-full blur-3xl opacity-20 -ml-10 -mb-10"></div>
            
            <div className="relative z-10">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-bold">System Status</h3>
                <button 
                  onClick={() => setShowSystemStatus(false)}
                  className="p-2 hover:bg-white/10 rounded-full transition-colors"
                >
                  <X size={20} className="text-slate-400" />
                </button>
              </div>
              
              <p className="text-slate-400 text-sm mb-6">All systems operational</p>
              
              <div className="space-y-4">
                <div className="flex items-center justify-between p-3 bg-white/5 rounded-lg backdrop-blur-sm">
                  <span className="text-sm text-slate-300">Database</span>
                  <span className="flex items-center gap-2 text-xs font-bold text-emerald-400 bg-emerald-400/10 px-2 py-1 rounded">
                    <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
                    CONNECTED
                  </span>
                </div>
                
                <div className="flex items-center justify-between p-3 bg-white/5 rounded-lg backdrop-blur-sm">
                  <span className="text-sm text-slate-300">Sync Status</span>
                  <span className="flex items-center gap-2 text-xs font-bold text-blue-400 bg-blue-400/10 px-2 py-1 rounded">
                    ACTIVE
                  </span>
                </div>

                <div className="flex items-center justify-between p-3 bg-white/5 rounded-lg backdrop-blur-sm">
                  <span className="text-sm text-slate-300">Version</span>
                  <span className="text-xs font-mono text-slate-400">v1.0.0</span>
                </div>
              </div>
            </div>

            <div className="relative z-10 mt-6 pt-6 border-t border-white/10">
              <p className="text-xs text-slate-500 text-center">
                Last backup: Today, 09:00 AM
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Preview Modal */}
      {showPreview && previewHtml && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-2xl w-full max-w-3xl max-h-[90vh] flex flex-col overflow-hidden">
            <div className="flex items-center justify-between p-4 border-b border-slate-100 dark:border-slate-700">
              <h3 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <Printer size={20} className="text-blue-600" />
                Fee Receipt Preview
              </h3>
              <button 
                onClick={() => setShowPreview(false)}
                className="p-2 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-full transition-colors"
              >
                <X size={20} className="text-slate-500" />
              </button>
            </div>
            
            <div className="flex-1 overflow-auto p-6 bg-slate-50 dark:bg-slate-900/50">
              <div className="bg-white shadow-sm p-8 min-h-[600px] mx-auto max-w-[210mm]" dangerouslySetInnerHTML={{ __html: previewHtml }} />
            </div>

            <div className="p-4 border-t border-slate-100 dark:border-slate-700 flex justify-end gap-3 bg-white dark:bg-slate-800">
              <button
                onClick={() => setShowPreview(false)}
                className="px-4 py-2 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-lg font-medium transition-colors"
              >
                Close
              </button>
              <button
                onClick={handleActualPrint}
                className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition-colors flex items-center gap-2"
              >
                <Printer size={18} />
                Print Receipt
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
