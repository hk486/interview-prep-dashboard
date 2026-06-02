import { useState } from 'react'
import { interviewData } from './data/interviewData'
import SearchPage from './components/SearchPage'
import CompanyDashboard from './components/CompanyDashboard'

export default function App() {
  const [selectedCompany, setSelectedCompany] = useState(null)

  const handleSearch = (query) => {
    const key = query.toLowerCase().trim()
    if (interviewData[key]) {
      setSelectedCompany(key)
    } else {
      setSelectedCompany('__notfound__')
    }
  }

  const handleBack = () => setSelectedCompany(null)

  return (
    <div className="min-h-screen bg-[#070C17]">
      {!selectedCompany ? (
        <SearchPage onSearch={handleSearch} />
      ) : selectedCompany === '__notfound__' ? (
        <div className="min-h-screen flex flex-col items-center justify-center gap-4">
          <div className="text-6xl">🔍</div>
          <h2 className="text-2xl font-bold text-gray-100">Company not found</h2>
          <p className="text-gray-400">We currently have data for Oracle, Amazon, and Google.</p>
          <button onClick={handleBack} className="btn-primary mt-2">← Back to Search</button>
        </div>
      ) : (
        <CompanyDashboard
          company={interviewData[selectedCompany]}
          companyKey={selectedCompany}
          onBack={handleBack}
        />
      )}
    </div>
  )
}
