import { useState, useMemo } from 'react'
import { ExternalLink, CheckCircle2, Circle } from 'lucide-react'
import { ORACLE_LC_QUESTIONS } from '../data/leetcodeData'

const STORAGE_KEY = 'oracle_lc_solved_v1'

const getSolved = () => {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    return raw ? new Set(JSON.parse(raw)) : new Set()
  } catch { return new Set() }
}
const saveSolved = (set) => {
  try { localStorage.setItem(STORAGE_KEY, JSON.stringify([...set])) } catch {}
}

const DIFF_STYLE = {
  Easy:   { badge: 'bg-emerald-900/50 text-emerald-300 border border-emerald-700/50', dot: 'bg-emerald-400' },
  Medium: { badge: 'bg-yellow-900/50  text-yellow-300  border border-yellow-700/50',  dot: 'bg-yellow-400'  },
  Hard:   { badge: 'bg-red-900/50     text-red-300     border border-red-700/50',     dot: 'bg-red-400'     },
}

const FILTERS = [
  { key: 'all',      label: 'All 214' },
  { key: 'hot',      label: '🔥 Recent (86)' },
  { key: 'Easy',     label: '🟢 Easy' },
  { key: 'Medium',   label: '🟡 Medium' },
  { key: 'Hard',     label: '🔴 Hard' },
  { key: 'unsolved', label: '⬜ Unsolved' },
]

export default function LeetCodeTrackerSection() {
  const [solved, setSolved]     = useState(getSolved)
  const [filter, setFilter]     = useState('all')
  const [search, setSearch]     = useState('')
  const [sortBy, setSortBy]     = useState('freq') // 'freq' | 'num' | 'diff'

  const sorted = useMemo(() => {
    const copy = [...ORACLE_LC_QUESTIONS]
    if (sortBy === 'num')  copy.sort((a, b) => a.num - b.num)
    if (sortBy === 'diff') copy.sort((a, b) => {
      const order = { Easy: 0, Medium: 1, Hard: 2 }
      return order[a.diff] - order[b.diff]
    })
    // default 'freq': already sorted in data file by descending frequency
    return copy
  }, [sortBy])

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase()
    return sorted.filter(item => {
      if (filter === 'hot'    && !item.hot)                   return false
      if (filter === 'Easy'   && item.diff !== 'Easy')        return false
      if (filter === 'Medium' && item.diff !== 'Medium')      return false
      if (filter === 'Hard'   && item.diff !== 'Hard')        return false
      if (filter === 'unsolved' && solved.has(item.num))      return false
      if (q && !item.title.toLowerCase().includes(q) && !String(item.num).includes(q)) return false
      return true
    })
  }, [sorted, filter, search, solved])

  const toggleSolved = (num, e) => {
    e.stopPropagation()
    setSolved(prev => {
      const next = new Set(prev)
      next.has(num) ? next.delete(num) : next.add(num)
      saveSolved(next)
      return next
    })
  }

  const total       = ORACLE_LC_QUESTIONS.length
  const solvedCount = solved.size
  const pct         = total ? Math.round((solvedCount / total) * 100) : 0

  const easyCount   = ORACLE_LC_QUESTIONS.filter(q => q.diff === 'Easy').length
  const medCount    = ORACLE_LC_QUESTIONS.filter(q => q.diff === 'Medium').length
  const hardCount   = ORACLE_LC_QUESTIONS.filter(q => q.diff === 'Hard').length

  return (
    <div className="space-y-4">
      {/* ── Header & Progress ── */}
      <div className="bg-gray-800 rounded-xl p-5 border border-gray-700">
        <div className="flex flex-wrap items-start justify-between gap-3 mb-4">
          <div>
            <h2 className="text-xl font-bold text-white flex items-center gap-2">
              Oracle LeetCode Questions
              <span className="text-xs font-normal bg-purple-900/50 text-purple-300 border border-purple-700/50 rounded-full px-2.5 py-0.5">
                Company Tag
              </span>
            </h2>
            <p className="text-gray-400 text-sm mt-1">
              All verified Oracle-tagged questions from LeetCode's company list.
              Click any row to open it on LeetCode. Check the box when you solve it.
            </p>
          </div>
          <div className="text-right shrink-0">
            <p className="text-2xl font-bold text-white">{solvedCount}<span className="text-gray-500 text-base font-normal">/{total}</span></p>
            <p className="text-gray-400 text-xs">{pct}% solved</p>
          </div>
        </div>

        {/* Progress bar */}
        <div className="w-full bg-gray-700 rounded-full h-2.5 mb-3">
          <div
            className="h-2.5 rounded-full bg-gradient-to-r from-green-500 to-emerald-400 transition-all duration-300"
            style={{ width: `${pct}%` }}
          />
        </div>

        {/* Diff breakdown + legend */}
        <div className="flex flex-wrap gap-4 text-xs">
          <span className="text-gray-400">
            🟢 <span className="text-emerald-300 font-semibold">{easyCount}</span> Easy &nbsp;
            🟡 <span className="text-yellow-300  font-semibold">{medCount}</span> Medium &nbsp;
            🔴 <span className="text-red-300     font-semibold">{hardCount}</span> Hard
          </span>
          <span className="text-gray-500">·</span>
          <span className="text-gray-400">
            🔥 <span className="text-orange-300 font-semibold">86 questions</span> = asked at Oracle in last 6 months (hot list)
          </span>
          <span className="text-gray-500">·</span>
          <span className="text-gray-500 italic">
            LeetCode currently shows ~323 total; ~109 newer additions not in this dataset
          </span>
        </div>
      </div>

      {/* ── Filters + Search + Sort ── */}
      <div className="flex flex-wrap gap-2 items-center">
        {FILTERS.map(({ key, label }) => (
          <button
            key={key}
            onClick={() => setFilter(key)}
            className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-all ${
              filter === key
                ? 'bg-purple-600 text-white shadow-md'
                : 'bg-gray-800 text-gray-300 border border-gray-700 hover:border-gray-500'
            }`}
          >
            {label}
          </button>
        ))}

        <div className="flex items-center gap-2 ml-auto">
          <select
            value={sortBy}
            onChange={e => setSortBy(e.target.value)}
            className="px-3 py-1.5 bg-gray-800 text-gray-300 rounded-lg text-sm border border-gray-700 outline-none focus:border-purple-500 cursor-pointer"
          >
            <option value="freq">Sort: Frequency ↓</option>
            <option value="num">Sort: LC Number ↑</option>
            <option value="diff">Sort: Difficulty ↑</option>
          </select>
          <input
            type="text"
            placeholder="Search title or #…"
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="px-3 py-1.5 bg-gray-800 text-white rounded-lg text-sm border border-gray-700 focus:border-purple-500 outline-none w-44 placeholder-gray-600"
          />
        </div>
      </div>

      {/* ── Result count ── */}
      <p className="text-gray-500 text-xs px-1">
        Showing {filtered.length} of {total} questions
        {solved.size > 0 && <span className="ml-2 text-emerald-500">· {solved.size} solved ✓</span>}
      </p>

      {/* ── Table ── */}
      <div className="bg-gray-800 rounded-xl border border-gray-700 overflow-hidden">
        {/* Header */}
        <div className="grid grid-cols-[3rem_3.5rem_1fr_6rem_5.5rem_3rem] px-4 py-2.5 text-xs text-gray-500 font-semibold uppercase tracking-wide border-b border-gray-700 bg-gray-900/60">
          <span>#</span>
          <span>LC</span>
          <span>Title</span>
          <span>Difficulty</span>
          <span>Asked</span>
          <span className="text-center">Done</span>
        </div>

        {/* Rows */}
        <div className="divide-y divide-gray-700/40 max-h-[620px] overflow-y-auto">
          {filtered.length === 0 && (
            <p className="text-center text-gray-500 py-12 text-sm">No questions match your filters.</p>
          )}
          {filtered.map((q, i) => {
            const isSolved = solved.has(q.num)
            const ds = DIFF_STYLE[q.diff]
            return (
              <div
                key={q.num}
                onClick={() => window.open(`https://leetcode.com/problems/${q.slug}/`, '_blank', 'noopener,noreferrer')}
                className={`grid grid-cols-[3rem_3.5rem_1fr_6rem_5.5rem_3rem] px-4 py-2.5 items-center cursor-pointer transition-colors group
                  ${isSolved ? 'bg-emerald-950/20 hover:bg-emerald-950/30' : 'hover:bg-gray-750/60 hover:bg-gray-700/30'}`}
              >
                {/* Row index */}
                <span className="text-gray-600 text-xs">{i + 1}</span>

                {/* LeetCode number */}
                <span className="font-mono text-sm text-blue-400 group-hover:text-blue-300 transition-colors">
                  {q.num}
                </span>

                {/* Title */}
                <span className={`text-sm font-medium pr-2 flex items-center gap-1.5 ${isSolved ? 'line-through text-gray-500' : 'text-gray-100 group-hover:text-white'}`}>
                  {q.title}
                  <ExternalLink size={11} className="opacity-0 group-hover:opacity-40 shrink-0 transition-opacity" />
                </span>

                {/* Difficulty badge */}
                <span className={`text-xs px-2 py-0.5 rounded-md font-medium w-fit ${ds.badge}`}>
                  {q.diff}
                </span>

                {/* Asked when */}
                <span className="text-xs">
                  {q.hot
                    ? <span className="text-orange-400 font-semibold">🔥 Recent</span>
                    : <span className="text-gray-600">Historical</span>
                  }
                </span>

                {/* Solved checkbox */}
                <div className="flex justify-center" onClick={e => toggleSolved(q.num, e)}>
                  {isSolved
                    ? <CheckCircle2 size={18} className="text-emerald-400 hover:text-emerald-300 transition-colors" />
                    : <Circle      size={18} className="text-gray-600    hover:text-gray-400    transition-colors" />
                  }
                </div>
              </div>
            )
          })}
        </div>
      </div>

      {/* Footer */}
      <p className="text-gray-600 text-xs text-center pb-2">
        Data source: Oracle company tag · LeetCode Premium (6-month + all-time) · Dataset compiled 2022–2024
        &nbsp;·&nbsp; Progress saved in browser
      </p>
    </div>
  )
}
