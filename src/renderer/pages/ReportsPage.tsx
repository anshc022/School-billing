export const ReportsPage = () => {
  return (
    <div>
      <h1 className="text-4xl font-bold text-slate-900 dark:text-slate-50 mb-8">Reports</h1>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white dark:bg-slate-800 rounded-2xl p-6 shadow-subtle border border-slate-100 dark:border-slate-700">
          <h2 className="text-xl font-bold text-slate-900 dark:text-slate-50 mb-4">
            Monthly Report
          </h2>
          <div className="space-y-4">
            <select className="w-full px-4 py-2 border border-slate-300 dark:border-slate-600 rounded-lg dark:bg-slate-700 dark:text-white">
              <option>January 2024</option>
              <option>February 2024</option>
              <option>March 2024</option>
            </select>
            <button className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700">
              Generate Report
            </button>
          </div>
        </div>

        <div className="bg-white dark:bg-slate-800 rounded-2xl p-6 shadow-subtle border border-slate-100 dark:border-slate-700">
          <h2 className="text-xl font-bold text-slate-900 dark:text-slate-50 mb-4">
            Student History
          </h2>
          <div className="space-y-4">
            <select className="w-full px-4 py-2 border border-slate-300 dark:border-slate-600 rounded-lg dark:bg-slate-700 dark:text-white">
              <option>Select Student</option>
            </select>
            <button className="w-full bg-green-600 text-white py-2 rounded-lg hover:bg-green-700">
              View History
            </button>
          </div>
        </div>

        <div className="bg-white dark:bg-slate-800 rounded-2xl p-6 shadow-subtle border border-slate-100 dark:border-slate-700">
          <h2 className="text-xl font-bold text-slate-900 dark:text-slate-50 mb-4">
            Export as CSV
          </h2>
          <button className="w-full bg-purple-600 text-white py-2 rounded-lg hover:bg-purple-700">
            Export CSV
          </button>
        </div>

        <div className="bg-white dark:bg-slate-800 rounded-2xl p-6 shadow-subtle border border-slate-100 dark:border-slate-700">
          <h2 className="text-xl font-bold text-slate-900 dark:text-slate-50 mb-4">
            Export as Excel
          </h2>
          <button className="w-full bg-orange-600 text-white py-2 rounded-lg hover:bg-orange-700">
            Export Excel
          </button>
        </div>
      </div>
    </div>
  )
}
