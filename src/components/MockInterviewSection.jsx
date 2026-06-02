import { useState } from 'react'
import {
  Mic, CheckCircle, XCircle, ChevronRight, ChevronLeft,
  AlertTriangle, RotateCcw, Trophy, Clock, Target, Eye, EyeOff
} from 'lucide-react'

function analyzeAnswer(userAnswer, keyPoints) {
  const lower = userAnswer.toLowerCase()
  return keyPoints.map((kp) => ({
    text: kp.text,
    covered: kp.keywords.some((kw) => lower.includes(kw.toLowerCase())),
  }))
}

function diffClass(d) {
  if (d === 'Easy') return 'badge-easy'
  if (d === 'Hard') return 'badge-hard'
  return 'badge-medium'
}

const CATEGORIES = ['All', 'Java Core', 'Spring Boot', 'Microservices', 'Database']

// States: 'start' | 'interview' | 'results'
export default function MockInterviewSection({ questions }) {
  const [phase, setPhase] = useState('start')
  const [catFilter, setCatFilter] = useState('All')
  const [qIndex, setQIndex] = useState(0)
  const [answers, setAnswers] = useState({})
  const [feedbacks, setFeedbacks] = useState({})
  const [showModel, setShowModel] = useState({})
  const [timeLeft, setTimeLeft] = useState(null)

  const filteredQs = catFilter === 'All'
    ? questions
    : questions.filter((q) => q.category === catFilter)

  const current = filteredQs[qIndex]
  const totalQ = filteredQs.length

  const handleSubmit = () => {
    if (!answers[current.id]?.trim()) return
    const result = analyzeAnswer(answers[current.id], current.keyPoints)
    setFeedbacks((prev) => ({ ...prev, [current.id]: result }))
  }

  const handleNext = () => {
    if (qIndex < totalQ - 1) {
      setQIndex(qIndex + 1)
    } else {
      setPhase('results')
    }
  }

  const handleRestart = () => {
    setPhase('start')
    setQIndex(0)
    setAnswers({})
    setFeedbacks({})
    setShowModel({})
  }

  // ── START SCREEN ──
  if (phase === 'start') {
    return (
      <div className="animate-fade-in max-w-3xl mx-auto">
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-purple-900/50 rounded-2xl flex items-center justify-center mx-auto mb-4 border border-purple-700/30">
            <Mic size={28} className="text-purple-400" />
          </div>
          <h2 className="text-2xl font-bold text-gray-100 mb-2">Mock Interview</h2>
          <p className="text-gray-400">
            Real Oracle Java Full Stack Developer questions. Type your answer, get instant keyword feedback, and see where you stand.
          </p>
        </div>

        {/* Category filter */}
        <div className="card p-5 mb-5">
          <h3 className="font-semibold text-gray-800 mb-3">Select Category</h3>
          <div className="flex flex-wrap gap-2">
            {CATEGORIES.map((c) => (
              <button key={c} onClick={() => setCatFilter(c)}
                className={`text-sm px-4 py-2 rounded-xl border font-medium transition-colors ${
          catFilter === c
                    ? 'bg-purple-600 text-white border-purple-600'
                    : 'bg-gray-800 text-gray-400 border-gray-700 hover:border-purple-500'
                }`}>
                {c}
              </button>
            ))}
          </div>
          <p className="text-sm text-gray-400 mt-3">
            {catFilter === 'All' ? questions.length : questions.filter(q => q.category === catFilter).length} questions selected
          </p>
        </div>

        {/* How it works */}
        <div className="card p-5 mb-6">
          <h3 className="font-semibold text-gray-100 mb-3">How it works</h3>
          <div className="space-y-3">
            {[
              { n: '1', text: 'Read the question carefully. Think before you type.' },
              { n: '2', text: 'Type your answer in your own words (no need to be perfect).' },
              { n: '3', text: 'Submit to see which key concepts you covered ✅ and missed ❌.' },
              { n: '4', text: 'Toggle the model answer to fill in gaps.' },
              { n: '5', text: 'After all questions, see your weak spots summary.' },
            ].map(({ n, text }) => (
              <div key={n} className="flex items-start gap-3">
                <span className="w-6 h-6 rounded-full bg-purple-900/50 text-purple-300 text-xs font-bold flex items-center justify-center shrink-0">{n}</span>
                <span className="text-sm text-gray-300">{text}</span>
              </div>
            ))}
          </div>
        </div>

        <button onClick={() => { setPhase('interview'); setQIndex(0) }} className="btn-primary w-full py-3 text-base">
          Start Mock Interview →
        </button>
      </div>
    )
  }

  // ── RESULTS SCREEN ──
  if (phase === 'results') {
    const allScores = filteredQs.map((q) => {
      const fb = feedbacks[q.id]
      if (!fb) return { category: q.category, score: 0, total: q.keyPoints.length, skipped: true }
      const covered = fb.filter((f) => f.covered).length
      return { category: q.category, score: covered, total: q.keyPoints.length, skipped: false }
    })

    const catScores = {}
    allScores.forEach(({ category, score, total, skipped }) => {
      if (!catScores[category]) catScores[category] = { score: 0, total: 0, count: 0 }
      if (!skipped) {
        catScores[category].score += score
        catScores[category].total += total
        catScores[category].count++
      }
    })

    const overallScore = allScores.reduce((s, a) => s + a.score, 0)
    const overallTotal = allScores.reduce((s, a) => s + a.total, 0)
    const pct = overallTotal ? Math.round((overallScore / overallTotal) * 100) : 0

    const weakCategories = Object.entries(catScores)
      .filter(([, v]) => v.total > 0 && (v.score / v.total) < 0.6)
      .map(([cat]) => cat)

    return (
      <div className="animate-fade-in max-w-2xl mx-auto">
        {/* Score card */}
        <div className="card p-8 text-center mb-6">
          <Trophy size={40} className="text-yellow-500 mx-auto mb-3" />
          <h2 className="text-2xl font-bold text-gray-100 mb-1">Interview Complete!</h2>
          <p className="text-gray-400 mb-5">Here's how you performed across {filteredQs.length} questions</p>
          <div className="text-6xl font-extrabold text-gradient mb-2">{pct}%</div>
          <p className="text-sm text-gray-400">
            {overallScore} of {overallTotal} key concepts covered
          </p>
          <div className="h-3 bg-gray-800 rounded-full overflow-hidden mt-4 mx-4">
            <div
              className={`h-full rounded-full transition-all ${pct >= 70 ? 'bg-emerald-500' : pct >= 40 ? 'bg-amber-500' : 'bg-red-500'}`}
              style={{ width: `${pct}%` }}
            />
          </div>
        </div>

        {/* Category breakdown */}
        <div className="card p-5 mb-5">
          <h3 className="font-semibold text-gray-100 mb-4">Performance by Category</h3>
          <div className="space-y-3">
            {Object.entries(catScores).map(([cat, v]) => {
              if (v.total === 0) return null
              const p = Math.round((v.score / v.total) * 100)
              return (
                <div key={cat}>
                  <div className="flex justify-between text-sm mb-1">
                    <span className="font-medium text-gray-300">{cat}</span>
                    <span className={`font-semibold ${p >= 70 ? 'text-emerald-600' : p >= 40 ? 'text-amber-600' : 'text-red-600'}`}>
                      {p}%
                    </span>
                  </div>
                    <div className="h-2 bg-gray-800 rounded-full overflow-hidden">
                    <div
                      className={`h-full rounded-full ${p >= 70 ? 'bg-emerald-500' : p >= 40 ? 'bg-amber-500' : 'bg-red-500'}`}
                      style={{ width: `${p}%` }}
                    />
                  </div>
                </div>
              )
            })}
          </div>
        </div>

        {/* Weak spots */}
        {weakCategories.length > 0 && (
          <div className="card p-5 mb-5 border-l-4 border-amber-400">
            <div className="flex items-center gap-2 mb-3">
              <AlertTriangle size={18} className="text-amber-500" />
              <h3 className="font-semibold text-gray-100">Weak Spots — Focus Here</h3>
            </div>
            <div className="flex flex-wrap gap-2">
              {weakCategories.map((c) => (
                <span key={c} className="bg-amber-900/30 text-amber-300 border border-amber-700/50 text-sm px-3 py-1 rounded-full font-medium">
                  {c}
                </span>
              ))}
            </div>
            <p className="text-sm text-gray-500 mt-3">
              Revisit these topics. Use the Resources tab for targeted study material.
            </p>
          </div>
        )}

        <button onClick={handleRestart} className="btn-primary w-full py-3 flex items-center justify-center gap-2">
          <RotateCcw size={16} />
          Retry Mock Interview
        </button>
      </div>
    )
  }

  // ── INTERVIEW SCREEN ──
  const fb = feedbacks[current.id]
  const covered = fb ? fb.filter((f) => f.covered).length : 0
  const scoreColor = fb
    ? covered / current.keyPoints.length >= 0.7
      ? 'text-emerald-600'
      : covered / current.keyPoints.length >= 0.4
      ? 'text-amber-600'
      : 'text-red-600'
    : ''

  return (
    <div className="animate-fade-in max-w-3xl mx-auto">
      {/* Progress bar */}
      <div className="mb-6">
        <div className="flex items-center justify-between text-sm text-gray-500 mb-2">
          <span>Question {qIndex + 1} of {totalQ}</span>
          <div className="flex items-center gap-1.5">
            <Target size={13} className="text-purple-500" />
            <span className="text-purple-600 font-medium">{catFilter}</span>
          </div>
        </div>
          <div className="h-2 bg-gray-800 rounded-full overflow-hidden">
          <div
            className="h-full rounded-full bg-gradient-to-r from-purple-400 to-purple-600 transition-all"
            style={{ width: `${((qIndex + 1) / totalQ) * 100}%` }}
          />
        </div>
      </div>

      {/* Question card */}
      <div className="card p-6 mb-4">
        <div className="flex items-center gap-2 flex-wrap mb-3">
          <span className={`text-xs font-semibold px-2 py-0.5 rounded-full border ${diffClass(current.difficulty)}`}>
            {current.difficulty}
          </span>
          <span className="bg-purple-900/40 text-purple-300 text-xs font-medium px-2.5 py-0.5 rounded-full">
            {current.category}
          </span>
          <span className="text-xs text-gray-400 flex items-center gap-1">
            <Clock size={11} />Aim for {current.timeLimit} min
          </span>
        </div>
        <h3 className="text-lg font-semibold text-gray-100 leading-snug">{current.question}</h3>
      </div>

      {/* Answer area */}
      <div className="card p-5 mb-4">
        <label className="block text-sm font-semibold text-gray-300 mb-2">Your Answer</label>
        <textarea
          value={answers[current.id] || ''}
          onChange={(e) => setAnswers((prev) => ({ ...prev, [current.id]: e.target.value }))}
          disabled={!!fb}
          placeholder="Type your answer here… Be thorough. Cover the key concepts."
          className="w-full min-h-36 resize-y text-sm text-gray-100 placeholder-gray-600 bg-gray-800 border border-gray-700 rounded-xl p-3 outline-none focus:border-purple-500 focus:ring-2 focus:ring-purple-600/30 disabled:opacity-60 disabled:cursor-not-allowed transition-colors leading-relaxed"
        />
        {!fb && (
          <button
            onClick={handleSubmit}
            disabled={!answers[current.id]?.trim()}
            className="btn-primary mt-3 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Submit Answer →
          </button>
        )}
      </div>

      {/* Feedback panel */}
      {fb && (
        <div className="card p-5 mb-4 animate-fade-in">
          <div className="flex items-center justify-between mb-4">
            <h4 className="font-semibold text-gray-100">Feedback</h4>
            <span className={`text-lg font-bold ${scoreColor}`}>
              {covered}/{current.keyPoints.length} concepts covered
            </span>
          </div>

          <div className="space-y-2 mb-4">
            {fb.map((item, i) => (
              <div key={i} className={`flex items-start gap-2.5 rounded-lg px-3 py-2.5 text-sm ${
                item.covered ? 'bg-emerald-900/30 border border-emerald-700/50' : 'bg-red-900/30 border border-red-700/50'
              }`}>
                {item.covered
                  ? <CheckCircle size={15} className="text-emerald-500 shrink-0 mt-0.5" />
                  : <XCircle size={15} className="text-red-400 shrink-0 mt-0.5" />}
                <span className={item.covered ? 'text-emerald-300' : 'text-red-300'}>{item.text}</span>
              </div>
            ))}
          </div>

          {/* Model answer toggle */}
          <button
            onClick={() => setShowModel((prev) => ({ ...prev, [current.id]: !prev[current.id] }))}
            className="flex items-center gap-2 text-sm text-purple-400 hover:text-purple-300 font-medium mb-3"
          >
            {showModel[current.id] ? <><EyeOff size={14} />Hide Model Answer</> : <><Eye size={14} />Show Model Answer</>}
          </button>

          {showModel[current.id] && (
            <div className="bg-purple-900/20 border border-purple-700/40 rounded-xl p-4 text-sm text-gray-300 whitespace-pre-line leading-relaxed">
              {current.modelAnswer}
            </div>
          )}
        </div>
      )}

      {/* Navigation */}
      <div className="flex items-center justify-between">
        <button
          onClick={() => { if (qIndex > 0) setQIndex(qIndex - 1) }}
          disabled={qIndex === 0}
          className="btn-outline flex items-center gap-1.5 disabled:opacity-40"
        >
          <ChevronLeft size={16} />Prev
        </button>
        {fb && (
          <button onClick={handleNext} className="btn-primary flex items-center gap-1.5">
            {qIndex < totalQ - 1 ? <>Next <ChevronRight size={16} /></> : <>See Results <Trophy size={16} /></>}
          </button>
        )}
      </div>
    </div>
  )
}
