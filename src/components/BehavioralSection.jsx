import { useState } from 'react'
import { ChevronDown, ChevronUp, Lightbulb, Star } from 'lucide-react'

const ALL_CATS = ['All', 'Technical Challenge', 'Leadership & Conflict', 'Project Achievement',
  'Pressure & Deadlines', 'Mentoring & Collaboration', 'Failure & Learning',
  'Technical Growth', 'Process Improvement', 'Communication', 'Technical Debt']

const STAR_COLORS = {
  situation: 'bg-blue-900/30 border-blue-700/40 text-blue-300',
  task:      'bg-purple-900/30 border-purple-700/40 text-purple-300',
  action:    'bg-amber-900/30 border-amber-700/40 text-amber-300',
  result:    'bg-emerald-900/30 border-emerald-700/40 text-emerald-300',
}

export default function BehavioralSection({ questions }) {
  const [catFilter, setCatFilter] = useState('All')
  const [expanded, setExpanded] = useState({})

  const filtered = catFilter === 'All' ? questions : questions.filter((q) => q.category === catFilter)
  const toggle = (id) => setExpanded((prev) => ({ ...prev, [id]: !prev[id] }))

  const cats = [...new Set(questions.map((q) => q.category))]

  return (
    <div className="animate-fade-in">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4 mb-6">
        <div>
          <h2 className="text-xl font-bold text-gray-100">Behavioral Cheat Sheet</h2>
          <p className="text-sm text-gray-400 mt-0.5">
            {questions.length} most-asked questions · STAR format guidance
          </p>
        </div>
        {/* STAR legend */}
        <div className="flex flex-wrap gap-2">
          {Object.entries(STAR_COLORS).map(([k, cls]) => (
            <span key={k} className={`text-xs font-semibold px-2.5 py-1 rounded-full border uppercase ${cls}`}>
              {k}
            </span>
          ))}
        </div>
      </div>

      {/* Category filters */}
      <div className="flex flex-wrap gap-2 mb-6">
        {['All', ...cats].map((c) => (
          <button key={c} onClick={() => setCatFilter(c)}
            className={`text-sm px-3.5 py-1.5 rounded-xl border font-medium transition-colors ${
              catFilter === c
                ? 'bg-purple-600 text-white border-purple-600'
                : 'bg-[#0F1724] text-gray-400 border-[#1C2A3A] hover:border-purple-600/50 hover:text-gray-200'
            }`}>
            {c}
          </button>
        ))}
      </div>

      {/* Question list */}
      <div className="space-y-3">
        {filtered.map((q, idx) => {
          const isOpen = expanded[q.id]
          return (
            <div key={q.id} className="card overflow-hidden">
              {/* Question header – always visible */}
              <button
                onClick={() => toggle(q.id)}
                className="w-full flex items-start justify-between gap-4 p-5 text-left hover:bg-[#1C2A3A]/50 transition-colors"
              >
                <div className="flex items-start gap-3 flex-1">
                  <span className="w-7 h-7 rounded-lg bg-purple-900/50 text-purple-300 text-sm font-bold flex items-center justify-center shrink-0">
                    {idx + 1}
                  </span>
                  <div>
                    <span className="text-xs font-medium text-purple-300 bg-purple-900/40 border border-purple-700/40 px-2 py-0.5 rounded-full block w-fit mb-1.5">
                      {q.category}
                    </span>
                    <p className="font-semibold text-gray-100 text-sm leading-snug">{q.question}</p>
                  </div>
                </div>
                <div className="shrink-0 mt-1">
                  {isOpen ? <ChevronUp size={18} className="text-gray-400" /> : <ChevronDown size={18} className="text-gray-400" />}
                </div>
              </button>

              {/* Expanded STAR guide */}
              {isOpen && (
                <div className="px-5 pb-5 border-t border-[#1C2A3A] pt-4 animate-fade-in">
                  {/* STAR hints */}
                  <div className="grid sm:grid-cols-2 gap-3 mb-4">
                    {Object.entries(q.starHints).map(([key, hint]) => (
                      <div key={key} className={`border rounded-xl px-3 py-2.5 ${STAR_COLORS[key]}`}>
                        <span className="text-xs font-bold uppercase tracking-wide opacity-70 block mb-1">{key}</span>
                        <p className="text-sm leading-relaxed">{hint}</p>
                      </div>
                    ))}
                  </div>

                  {/* Key points to mention */}
                  <div className="mb-4">
                    <h4 className="text-xs font-semibold text-gray-400 uppercase tracking-wide mb-2 flex items-center gap-1.5">
                      <Star size={12} className="text-purple-400" />Key Points to Mention
                    </h4>
                    <div className="flex flex-wrap gap-2">
                      {q.keyPoints.map((kp) => (
                        <span key={kp} className="text-xs bg-gray-800 text-gray-300 border border-gray-700 px-2.5 py-1 rounded-full">
                          {kp}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Oracle-specific tip */}
                  {q.oracleTip && (
                    <div className="flex items-start gap-2.5 bg-purple-900/20 border border-purple-700/40 rounded-xl px-4 py-3">
                      <Lightbulb size={15} className="text-purple-400 shrink-0 mt-0.5" />
                      <div>
                        <span className="text-xs font-semibold text-purple-300 block mb-0.5">Oracle Tip</span>
                        <p className="text-sm text-purple-200">{q.oracleTip}</p>
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>
          )
        })}
      </div>

      {/* Footer tip */}
      <div className="mt-8 card p-5 bg-gradient-to-r from-purple-900/20 to-indigo-900/20 border border-purple-700/40">
        <div className="flex items-start gap-3">
          <div className="w-10 h-10 bg-purple-900/50 rounded-xl flex items-center justify-center shrink-0 border border-purple-700/30">
            <Lightbulb size={18} className="text-purple-400" />
          </div>
          <div>
            <h4 className="font-semibold text-gray-100 mb-1">Pro Tips for Oracle Behavioral Rounds</h4>
            <ul className="text-sm text-gray-400 space-y-1.5 list-none">
              <li>• Always quantify results: "reduced latency by 35%", "cut onboarding time from 2 weeks to 3 days"</li>
              <li>• Use "I" not "we" — interviewers need to know your specific contribution</li>
              <li>• Prepare 6–8 stories that can flex across multiple questions (challenge, achievement, conflict, failure)</li>
              <li>• Oracle values collaborative problem-solving — mention team dynamics positively</li>
              <li>• Keep each answer under 3 minutes; be crisp and impactful</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  )
}
