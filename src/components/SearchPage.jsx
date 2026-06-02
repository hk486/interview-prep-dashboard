import { useState } from 'react'
import { Search, Zap, BookOpen, Code2, Brain, Users } from 'lucide-react'

const FEATURED = ['Oracle', 'Amazon', 'Google']

const features = [
  { icon: Code2, title: 'Real DSA Questions', desc: 'Verified questions from the last 6 months with difficulty, frequency & Java tips.' },
  { icon: Brain, title: 'System Design Prep', desc: 'Architecture breakdowns, estimations, and key components for each problem.' },
  { icon: Zap, title: 'Mock Interviews', desc: 'Practice with real questions. Get instant AI-style keyword feedback & weak spot analysis.' },
  { icon: Users, title: 'Behavioral Cheat Sheet', desc: 'STAR-format guidance for the most-asked behavioral questions with Oracle-specific tips.' },
]

export default function SearchPage({ onSearch }) {
  const [query, setQuery] = useState('')

  const handleSubmit = (e) => {
    e.preventDefault()
    if (query.trim()) onSearch(query.trim())
  }

  return (
    <div className="min-h-screen flex flex-col">
      {/* ── Hero ── */}
      <div className="bg-hero text-white py-20 px-4 text-center relative overflow-hidden">
        {/* decorative circles */}
        <div className="absolute -top-16 -left-16 w-64 h-64 rounded-full bg-white opacity-5" />
        <div className="absolute -bottom-20 -right-20 w-80 h-80 rounded-full bg-white opacity-5" />

        <div className="relative z-10 max-w-2xl mx-auto">
          <div className="inline-flex items-center gap-2 bg-white/10 border border-white/20 rounded-full px-4 py-1.5 text-sm mb-6 backdrop-blur-sm">
            <Zap size={14} className="text-yellow-300" />
            <span>Updated May 2026 · Oracle, Amazon, Google</span>
          </div>

          <h1 className="text-4xl sm:text-5xl font-extrabold leading-tight mb-4">
            Ace Your Next<br />
            <span className="text-purple-200">Tech Interview</span>
          </h1>
          <p className="text-purple-100 text-lg mb-10">
            Search any company for real DSA &amp; System Design questions, mock interviews,
            and a behavioral cheat sheet — all in one place.
          </p>

          {/* Search bar */}
          <form onSubmit={handleSubmit} className="flex items-center gap-2 bg-gray-900/80 border border-purple-700/40 rounded-2xl p-2 shadow-2xl max-w-lg mx-auto backdrop-blur-sm">
            <Search size={20} className="text-purple-400 ml-2 shrink-0" />
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search company (e.g. Oracle, Amazon…)"
              className="flex-1 text-gray-100 placeholder-gray-500 bg-transparent outline-none text-base py-1 px-1"
              autoFocus
            />
            <button
              type="submit"
              className="bg-purple-600 hover:bg-purple-700 text-white font-semibold px-5 py-2.5 rounded-xl text-sm transition-colors"
            >
              Search
            </button>
          </form>

          {/* Quick picks */}
          <div className="flex flex-wrap justify-center gap-2 mt-5">
            {FEATURED.map((c) => (
              <button
                key={c}
                onClick={() => onSearch(c)}
                className="bg-white/10 hover:bg-white/20 border border-white/20 text-white text-sm px-4 py-1.5 rounded-full transition-colors backdrop-blur-sm"
              >
                {c}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* ── Features grid ── */}
      <div className="max-w-5xl mx-auto px-4 py-16">
          <h2 className="text-center text-2xl font-bold text-gray-100 mb-2">Everything you need to crack it</h2>
        <p className="text-center text-gray-400 mb-10">All curated from Glassdoor, LeetCode Discuss, Blind &amp; more.</p>
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {features.map(({ icon: Icon, title, desc }) => (
            <div key={title} className="card p-5 flex flex-col gap-3">
              <div className="w-10 h-10 bg-purple-900/50 rounded-xl flex items-center justify-center shrink-0 border border-purple-700/30">
                <Icon size={20} className="text-purple-400" />
              </div>
              <div>
                <h3 className="font-semibold text-gray-100 mb-1">{title}</h3>
                <p className="text-sm text-gray-400 leading-relaxed">{desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* ── CTA ── */}
      <div className="pb-12 text-center">
        <p className="text-sm text-gray-400">
          Data sourced from&nbsp;
          <a href="https://www.glassdoor.com" target="_blank" rel="noreferrer" className="text-purple-500 hover:underline">Glassdoor</a>,&nbsp;
          <a href="https://leetcode.com/discuss" target="_blank" rel="noreferrer" className="text-purple-500 hover:underline">LeetCode Discuss</a>,&nbsp;
          <a href="https://www.teamblind.com" target="_blank" rel="noreferrer" className="text-purple-500 hover:underline">TeamBlind</a> &amp;&nbsp;
          <a href="https://www.geeksforgeeks.org" target="_blank" rel="noreferrer" className="text-purple-500 hover:underline">GeeksForGeeks</a>.
        </p>
      </div>
    </div>
  )
}
