import { ExternalLink, BookOpen } from 'lucide-react'

const CAT_ICONS = {
  'DSA Practice': '🧩',
  'Interview Reports': '🏢',
  'Java Deep Dive': '☕',
  'System Design': '⚙️',
  'Mock Interview Practice': '🎭',
}

const CAT_COLORS = {
  'DSA Practice': 'from-purple-100 to-purple-50 border-purple-200',
  'Interview Reports': 'from-blue-50 to-blue-25 border-blue-200',
  'Java Deep Dive': 'from-amber-50 to-orange-50 border-amber-200',
  'System Design': 'from-emerald-50 to-green-50 border-emerald-200',
  'Mock Interview Practice': 'from-pink-50 to-rose-50 border-pink-200',
}

const CAT_TEXT = {
  'DSA Practice': 'text-purple-600',
  'Interview Reports': 'text-blue-600',
  'Java Deep Dive': 'text-amber-600',
  'System Design': 'text-emerald-600',
  'Mock Interview Practice': 'text-pink-600',
}

export default function ResourcesSection({ resources, company }) {
  return (
    <div className="animate-fade-in">
      <div className="mb-6">
        <h2 className="text-xl font-bold text-gray-900">Resources & References</h2>
        <p className="text-sm text-gray-500 mt-0.5">
          All sources used to compile {company} interview data — plus curated study materials.
        </p>
      </div>

      <div className="space-y-8">
        {resources.map(({ category, items }) => (
          <div key={category}>
            {/* Category header */}
            <div className="flex items-center gap-2 mb-4">
              <span className="text-xl">{CAT_ICONS[category] || '📌'}</span>
              <h3 className="font-bold text-gray-800 text-base">{category}</h3>
              <span className="text-xs text-gray-400 bg-gray-100 px-2 py-0.5 rounded-full">{items.length}</span>
            </div>

            {/* Resource cards */}
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {items.map(({ name, url, description, icon }) => (
                <a
                  key={name}
                  href={url}
                  target="_blank"
                  rel="noreferrer"
                  className={`card p-4 flex flex-col gap-2 bg-gradient-to-br ${CAT_COLORS[category] || 'from-gray-50 to-white border-gray-200'} hover:shadow-md hover:-translate-y-0.5 transition-all duration-150 group`}
                >
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex items-center gap-2">
                      <span className="text-xl leading-none">{icon}</span>
                      <span className={`font-semibold text-sm group-hover:underline ${CAT_TEXT[category] || 'text-gray-800'}`}>
                        {name}
                      </span>
                    </div>
                    <ExternalLink size={13} className="text-gray-400 group-hover:text-gray-600 shrink-0 mt-0.5" />
                  </div>
                  <p className="text-xs text-gray-500 leading-relaxed">{description}</p>
                </a>
              ))}
            </div>
          </div>
        ))}
      </div>

      {/* Disclaimer */}
      <div className="mt-10 p-4 bg-gray-50 border border-gray-200 rounded-xl text-xs text-gray-500 flex items-start gap-2">
        <BookOpen size={14} className="text-gray-400 shrink-0 mt-0.5" />
        <p>
          This app aggregates publicly available information from job sites, developer forums, and open-source resources.
          We do not claim ownership of any external content. All links open the original source.
          Interview question patterns are based on community reports and may vary by role, experience level, and hiring cycle.
        </p>
      </div>
    </div>
  )
}
