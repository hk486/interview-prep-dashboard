import { useState } from 'react'
import { ExternalLink, ChevronDown, ChevronUp, Zap, CheckSquare } from 'lucide-react'

function freqBadge(score) {
  if (score >= 85) return 'bg-purple-900/30 text-purple-300 border-purple-700/50'
  if (score >= 70) return 'bg-blue-900/30 text-blue-300 border-blue-700/50'
  return 'bg-gray-800 text-gray-400 border-gray-700'
}

export default function SystemDesignSection({ questions }) {
  const [expanded, setExpanded] = useState({})

  if (!questions?.length) {
    return (
      <div className="text-center py-20 text-gray-400">
        <div className="text-4xl mb-3">📐</div>
        <p>System Design data for this company coming soon.</p>
      </div>
    )
  }

  const toggle = (id) => setExpanded((prev) => ({ ...prev, [id]: !prev[id] }))

  return (
    <div className="animate-fade-in">
      <div className="mb-6">
        <h2 className="text-xl font-bold text-gray-100">System Design Questions</h2>
        <p className="text-sm text-gray-400 mt-0.5">
          {questions.length} design problems · with key components &amp; estimations
        </p>
      </div>

      <div className="grid md:grid-cols-2 gap-5">
        {questions
          .sort((a, b) => b.frequencyScore - a.frequencyScore)
          .map((q) => {
            const isOpen = expanded[q.id]
            return (
              <div key={q.id} className="card flex flex-col">
                <div className="p-5 flex-1">
                  {/* Header */}
                  <div className="flex items-start justify-between gap-3 mb-3">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 flex-wrap mb-2">
                        <span className={`text-xs font-semibold px-2.5 py-0.5 rounded-full border ${freqBadge(q.frequencyScore)}`}>
                          {q.frequency}
                        </span>
                        <span className="text-xs text-gray-400 flex items-center gap-1">
                          <Zap size={10} />{q.recentDate}
                        </span>
                      </div>
                      <h3 className="font-bold text-gray-100 text-base leading-snug">{q.title}</h3>
                    </div>
                  </div>

                  {/* Description */}
                  <p className="text-sm text-gray-400 leading-relaxed mb-4">{q.description}</p>

                  {/* Frequency bar */}
                  <div className="mb-4">
                    <div className="flex justify-between text-xs text-gray-500 mb-1">
                      <span>Frequency</span>
                      <span>{q.frequencyScore}%</span>
                    </div>
                    <div className="h-1.5 bg-gray-800 rounded-full overflow-hidden">
                      <div
                        className="h-full rounded-full bg-gradient-to-r from-indigo-400 to-purple-600"
                        style={{ width: `${q.frequencyScore}%` }}
                      />
                    </div>
                  </div>

                  {/* Key components */}
                  <div className="mb-4">
                    <h4 className="text-xs font-semibold text-gray-400 uppercase tracking-wide mb-2">
                      Key Components
                    </h4>
                    <div className="space-y-1.5">
                      {q.keyComponents.map((kc) => (
                        <div key={kc} className="flex items-start gap-2">
                          <CheckSquare size={13} className="text-purple-500 shrink-0 mt-0.5" />
                          <span className="text-sm text-gray-300">{kc}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Expandable: Estimations + Follow-ups + Sources */}
                  {isOpen && (
                    <div className="border-t border-[#1C2A3A] pt-4 space-y-4">
                      <div>
                        <h4 className="text-xs font-semibold text-gray-400 uppercase tracking-wide mb-1">
                          Back-of-Envelope Estimation
                        </h4>
                        <p className="text-sm text-gray-300 bg-gray-800/60 rounded-lg px-3 py-2 font-mono leading-relaxed">{q.estimations}</p>
                      </div>
                      <div>
                        <h4 className="text-xs font-semibold text-gray-400 uppercase tracking-wide mb-2">
                          Common Follow-Up Questions
                        </h4>
                        <div className="flex flex-wrap gap-2">
                          {q.followUps.map((f) => (
                            <span key={f} className="text-xs bg-purple-50 text-purple-600 border border-purple-100 px-2.5 py-1 rounded-full">
                              {f}
                            </span>
                          ))}
                        </div>
                      </div>
                      {q.sourceLinks?.length > 0 && (
                        <div>
                          <h4 className="text-xs font-semibold text-gray-400 uppercase tracking-wide mb-2">Resources</h4>
                          <div className="flex flex-col gap-1.5">
                            {q.sourceLinks.map((s) => (
                              <a key={s.name} href={s.url} target="_blank" rel="noreferrer"
                                className="flex items-center gap-1.5 text-sm text-purple-400 hover:text-purple-300 hover:underline">
                                <ExternalLink size={12} />{s.name}
                              </a>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  )}
                </div>

                {/* Card footer */}
                <div className="px-5 pb-4 flex items-center gap-2">
                  {q.sourceLinks?.[0] && (
                    <a href={q.sourceLinks[0].url} target="_blank" rel="noreferrer"
                      className="flex items-center gap-1 text-xs font-semibold text-purple-400 hover:text-purple-300 bg-purple-900/30 hover:bg-purple-900/50 px-3 py-1.5 rounded-lg transition-colors">
                      <ExternalLink size={11} />Resource
                    </a>
                  )}
                  <button onClick={() => toggle(q.id)}
                    className="flex items-center gap-1 text-xs text-gray-500 hover:text-gray-300 ml-auto">
                    {isOpen ? <><ChevronUp size={14} />Less</> : <><ChevronDown size={14} />Estimations & Follow-ups</>}
                  </button>
                </div>
              </div>
            )
          })}
      </div>
    </div>
  )
}
