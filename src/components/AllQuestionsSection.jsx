import { useState } from 'react'
import { ChevronDown, ChevronUp, Zap, ExternalLink, CheckCircle, Circle, Search, Filter } from 'lucide-react'
import { useProgress } from '../hooks/useProgress'

const CATEGORY_COLORS = {
  'Java Core':      { bg: 'bg-amber-900/30',   text: 'text-amber-300',   border: 'border-amber-700/50',   dot: 'bg-amber-400'   },
  'Spring Boot':    { bg: 'bg-emerald-900/30', text: 'text-emerald-300', border: 'border-emerald-700/50', dot: 'bg-emerald-400' },
  'Microservices':  { bg: 'bg-blue-900/30',    text: 'text-blue-300',    border: 'border-blue-700/50',    dot: 'bg-blue-400'    },
  'SQL':            { bg: 'bg-rose-900/30',    text: 'text-rose-300',    border: 'border-rose-700/50',    dot: 'bg-rose-400'    },
}

const DIFF_COLORS = {
  Easy:   'text-emerald-300 bg-emerald-900/30 border-emerald-700/50',
  Medium: 'text-amber-300   bg-amber-900/30   border-amber-700/50',
  Hard:   'text-red-300     bg-red-900/30     border-red-700/50',
}

const CATEGORIES = ['All', 'Java Core', 'Spring Boot', 'Microservices', 'SQL']
const DIFFS = ['All', 'Easy', 'Medium', 'Hard']

function freqBadge(score) {
  if (score >= 90) return 'text-purple-300 bg-purple-900/30 border border-purple-700/50'
  if (score >= 75) return 'text-blue-300 bg-blue-900/30 border border-blue-700/50'
  return 'text-gray-400 bg-gray-800 border border-gray-700'
}

export default function AllQuestionsSection({ javaQuestions = [] }) {
  const [search, setSearch] = useState('')
  const [catFilter, setCatFilter] = useState('All')
  const [diffFilter, setDiffFilter] = useState('All')
  const [expanded, setExpanded] = useState({})
  const { completed: done, toggle: toggleDone } = useProgress('oracle_java_done')

  const toggle = (id) => setExpanded((p) => ({ ...p, [id]: !p[id] }))

  const filtered = javaQuestions.filter((q) => {
    const catOk = catFilter === 'All' || q.category === catFilter
    const diffOk = diffFilter === 'All' || q.difficulty === diffFilter
    const searchOk = !search || q.question.toLowerCase().includes(search.toLowerCase()) || q.category.toLowerCase().includes(search.toLowerCase())
    return catOk && diffOk && searchOk
  })

  // Sort by frequencyScore desc
  const sorted = [...filtered].sort((a, b) => b.frequencyScore - a.frequencyScore)

  const counts = CATEGORIES.slice(1).reduce((acc, c) => {
    acc[c] = javaQuestions.filter((q) => q.category === c).length
    return acc
  }, {})

  return (
    <div className="animate-fade-in">
      {/* Header */}
      <div className="mb-6">
        <h2 className="text-xl font-bold text-gray-100">All Interview Questions</h2>
        <p className="text-sm text-gray-400 mt-0.5">
          {javaQuestions.length} questions across Java Core, Spring Boot, Microservices &amp; Oracle DB ·{' '}
          <span className="text-emerald-600 font-medium">{done.size} answered</span>
        </p>
      </div>

      {/* Category stat cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-6">
        {CATEGORIES.slice(1).map((cat) => {
          const cc = CATEGORY_COLORS[cat]
          const catDone = javaQuestions.filter((q) => q.category === cat && done.has(String(q.id))).length
          return (
            <button key={cat} onClick={() => setCatFilter(catFilter === cat ? 'All' : cat)}
              className={`card p-3 text-left transition-all hover:shadow-md ${catFilter === cat ? `ring-2 ring-purple-400` : ''}`}>
              <div className={`w-2 h-2 rounded-full ${cc.dot} mb-2`} />
              <p className="text-xs font-bold text-gray-200 leading-snug">{cat}</p>
              <p className="text-lg font-extrabold text-gray-100 mt-0.5">{counts[cat]}</p>
              <p className="text-xs text-gray-500">{catDone} answered</p>
            </button>
          )
        })}
      </div>

      {/* Search + Filters */}
      <div className="flex flex-col sm:flex-row gap-3 mb-5">
        <div className="relative flex-1">
          <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search questions..."
            className="w-full pl-9 pr-4 py-2 text-sm bg-gray-800 text-gray-100 border border-gray-700 rounded-xl placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-purple-600/50"
          />
        </div>
        <div className="flex flex-wrap gap-2 items-center">
          <Filter size={13} className="text-gray-400" />
          {DIFFS.map((d) => (
            <button key={d} onClick={() => setDiffFilter(d)}
              className={`text-xs px-3 py-1.5 rounded-xl border font-medium transition-colors ${
                diffFilter === d ? 'bg-purple-600 text-white border-purple-600' : 'bg-gray-800 text-gray-400 border-gray-700 hover:border-purple-500'
              }`}>
              {d}
            </button>
          ))}
        </div>
      </div>

      {/* Category filter pills */}
      <div className="flex flex-wrap gap-2 mb-5">
        {CATEGORIES.map((c) => {
          const cc = CATEGORY_COLORS[c]
          const isActive = catFilter === c
          return (
            <button key={c} onClick={() => setCatFilter(c)}
              className={`text-xs px-3.5 py-1.5 rounded-xl border font-semibold transition-all ${
                  isActive
                  ? cc ? `${cc.bg} ${cc.text} ${cc.border}` : 'bg-purple-600 text-white border-purple-600'
                  : 'bg-gray-800 text-gray-400 border-gray-700 hover:border-purple-500'
              }`}>
              {c} {c !== 'All' && `(${counts[c]})`}
            </button>
          )
        })}
      </div>

      {sorted.length === 0 && (
        <div className="text-center py-16 text-gray-400">No questions match your filters.</div>
      )}

      {/* Questions list */}
      <div className="space-y-3">
        {sorted.map((q, idx) => {
          const isOpen = expanded[q.id]
          const isDone = done.has(String(q.id))
          const cc = CATEGORY_COLORS[q.category] || { bg: 'bg-gray-100', text: 'text-gray-700', border: 'border-gray-200', dot: 'bg-gray-400' }

          return (
            <div className={`card overflow-hidden transition-all ${isDone ? 'border-emerald-800/50 bg-emerald-900/10' : ''}`}>
              {/* Question header */}
              <div className="flex items-start gap-3 p-4">
                {/* Number */}
                <div className={`w-8 h-8 rounded-xl flex items-center justify-center text-xs font-bold shrink-0 ${
                  isDone ? 'bg-emerald-500 text-white' : 'bg-purple-900/50 text-purple-300'
                }`}>
                  {isDone ? <CheckCircle size={15} /> : idx + 1}
                </div>

                <div className="flex-1 min-w-0">
                  {/* Badges */}
                  <div className="flex items-center gap-2 flex-wrap mb-1.5">
                    <span className={`text-xs font-bold px-2.5 py-0.5 rounded-full border ${cc.bg} ${cc.text} ${cc.border}`}>
                      {q.category}
                    </span>
                    <span className={`text-xs font-semibold px-2 py-0.5 rounded-full border ${DIFF_COLORS[q.difficulty]}`}>
                      {q.difficulty}
                    </span>
                    <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${freqBadge(q.frequencyScore)}`}>
                      <Zap size={9} className="inline mr-0.5" />{q.frequencyScore}% asked
                    </span>
                    <span className="text-xs text-gray-400">{q.round} · {q.recentDate}</span>
                  </div>

                  {/* Question text */}
                  <p className={`text-sm font-semibold leading-snug ${isDone ? 'line-through text-gray-500' : 'text-gray-100'}`}>
                    {q.question}
                  </p>
                </div>

                {/* Expand button */}
                <button onClick={() => toggle(q.id)} className="shrink-0 text-gray-500 hover:text-gray-300 p-1 mt-0.5">
                  {isOpen ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
                </button>
              </div>

              {/* Expanded answer */}
              {isOpen && (
                <div className="border-t border-[#1C2A3A] px-4 pb-4 pt-4 space-y-4 animate-fade-in">

                  {/* Answer */}
                  <div className={`rounded-xl border p-4 ${cc.bg} ${cc.border}`}>
                    <p className={`text-xs font-bold uppercase tracking-wide mb-2 ${cc.text}`}>Model Answer</p>
                    <p className="text-sm text-gray-300 leading-relaxed">{q.answer}</p>
                  </div>

                  {/* Key Points */}
                  {q.keyPoints?.length > 0 && (
                    <div>
                      <p className="text-xs font-bold text-gray-400 uppercase tracking-wide mb-2">Key Points to Hit in Your Answer</p>
                      <div className="flex flex-wrap gap-2">
                        {q.keyPoints.map((kp) => (
                          <span key={kp} className="text-xs bg-purple-50 text-purple-700 border border-purple-100 px-2.5 py-1 rounded-full">
                            {kp}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Tips */}
                  {q.tips && (
                    <div className="bg-amber-900/20 border border-amber-700/40 rounded-xl px-4 py-3">
                      <p className="text-xs font-bold text-amber-400 mb-1">Oracle-Specific Tip</p>
                      <p className="text-sm text-amber-200 leading-relaxed">{q.tips}</p>
                    </div>
                  )}

                  {/* Source links */}
                  {q.sourceLinks?.length > 0 && (
                    <div className="flex flex-wrap gap-3 text-xs">
                      <span className="font-semibold text-gray-400">Resources:</span>
                      {q.sourceLinks.map((s) => (
                        <a key={s.name} href={s.url} target="_blank" rel="noreferrer"
                          className="flex items-center gap-1 text-purple-400 hover:underline">
                          <ExternalLink size={10} />{s.name}
                        </a>
                      ))}
                    </div>
                  )}
                </div>
              )}

              {/* Footer */}
              <div className="px-4 pb-3 flex items-center gap-2 border-t border-[#1C2A3A] pt-2.5">
                <button
                  onClick={() => toggleDone(String(q.id))}
                  className={`flex items-center gap-1 text-xs font-semibold px-3 py-1.5 rounded-lg transition-colors ${
                    isDone ? 'bg-emerald-900/40 text-emerald-300 hover:bg-emerald-800/50' : 'bg-gray-800 text-gray-400 hover:bg-purple-900/30 hover:text-purple-300'
                  }`}
                >
                  {isDone ? <CheckCircle size={11} /> : <Circle size={11} />}
                  {isDone ? 'Covered ✓' : 'Mark covered'}
                </button>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
