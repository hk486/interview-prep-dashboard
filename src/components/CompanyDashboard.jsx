import { useState } from 'react'
import { ArrowLeft, Code2, Layers, Mic, Users, BookOpen, TrendingUp, Clock, CheckCircle, Search, Map, ListChecks } from 'lucide-react'
import DSASection from './DSASection'
import SystemDesignSection from './SystemDesignSection'
import MockInterviewSection from './MockInterviewSection'
import BehavioralSection from './BehavioralSection'
import ResourcesSection from './ResourcesSection'
import RoadmapSection from './RoadmapSection'
import AllQuestionsSection from './AllQuestionsSection'
import LeetCodeTrackerSection from './LeetCodeTrackerSection'

const TABS = [
  { id: 'roadmap',  label: 'Roadmap',       icon: Map         },
  { id: 'all',      label: 'All Questions', icon: BookOpen    },
  { id: 'dsa',      label: 'DSA',           icon: Code2       },
  { id: 'leetcode', label: 'LeetCode 214',  icon: ListChecks  },
  { id: 'design',   label: 'System Design', icon: Layers      },
  { id: 'mock',     label: 'Mock Interview',icon: Mic         },
  { id: 'behavioral',label: 'Behavioral',   icon: Users       },
]

export default function CompanyDashboard({ company, onBack }) {
  const [activeTab, setActiveTab] = useState('roadmap')

  const hasFullData = company.mockQuestions?.length > 0

  return (
    <div className="animate-fade-in">
      {/* ── Top Nav ── */}
      <div className="bg-[#070C17]/95 backdrop-blur-md border-b border-[#1C2A3A] sticky top-0 z-30">
        <div className="max-w-6xl mx-auto px-4 py-3 flex items-center gap-4">
          <button onClick={onBack} className="flex items-center gap-1.5 text-purple-400 hover:text-purple-300 text-sm font-medium shrink-0">
            <ArrowLeft size={16} />
            <span className="hidden sm:inline">Back</span>
          </button>
          <div className="flex-1 overflow-x-auto">
            <div className="flex gap-1 min-w-max">
              {TABS.map(({ id, label, icon: Icon }) => (
                <button
                  key={id}
                  onClick={() => setActiveTab(id)}
                  className={`flex items-center gap-1.5 px-3.5 py-2 rounded-lg text-sm transition-all whitespace-nowrap
                    ${activeTab === id ? 'tab-active' : 'tab-inactive'}
                    ${id === 'roadmap' && activeTab !== 'roadmap' ? 'text-purple-600 font-semibold bg-purple-50' : ''}`}
                >
                  <Icon size={15} />
                  {label}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* ── Company Banner ── */}
      <div className="bg-hero text-white">
        <div className="max-w-6xl mx-auto px-4 py-8">
          <div className="flex flex-col sm:flex-row sm:items-center gap-4">
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-1">
                <span className="text-purple-200 text-sm font-medium">{company.ticker}</span>
                <span className="bg-white/10 border border-white/20 rounded-full px-2.5 py-0.5 text-xs text-white/80">
                  {company.difficulty}
                </span>
              </div>
              <h1 className="text-3xl font-extrabold">{company.name}</h1>
              <p className="text-purple-100 text-sm mt-1">{company.role}</p>
              <p className="text-purple-200/80 text-sm mt-2 max-w-xl leading-relaxed">{company.overview}</p>
            </div>

            {/* Stats cards */}
            <div className="grid grid-cols-2 gap-3 sm:w-auto shrink-0">
              <StatCard icon={<Search size={14} />} label="Questions Tracked" value={company.stats.questionsTracked} />
              <StatCard icon={<CheckCircle size={14} />} label="Success Rate" value={company.stats.successRate} />
              <StatCard icon={<Clock size={14} />} label="Avg Duration" value={company.stats.avgDuration} />
              <StatCard icon={<TrendingUp size={14} />} label="Hot Topic" value={company.stats.hotTopic} small />
            </div>
          </div>

          {/* Topic weights */}
          {company.topTopics && (
            <div className="mt-6 flex flex-wrap gap-3">
              {company.topTopics.map(({ label, weight }) => (
                <div key={label} className="flex items-center gap-2">
                  <div className="flex flex-col items-center bg-white/10 rounded-lg px-3 py-2 border border-white/10">
                    <span className="text-white font-bold text-sm">{weight}%</span>
                    <span className="text-purple-200 text-xs">{label}</span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* ── Tab Content ── */}
      <div className="max-w-6xl mx-auto px-4 py-8">
        {activeTab === 'roadmap' && <RoadmapSection />}
        {activeTab === 'all' && <AllQuestionsSection javaQuestions={company.javaQuestions || []} />}
        {activeTab === 'dsa' && <DSASection questions={company.dsaQuestions} />}
        {activeTab === 'leetcode' && <LeetCodeTrackerSection />}
        {activeTab === 'design' && <SystemDesignSection questions={company.systemDesign} />}
        {activeTab === 'mock' && (
          hasFullData
            ? <MockInterviewSection questions={company.mockQuestions} />
            : <ComingSoon feature="Mock Interview" company={company.name} />
        )}
        {activeTab === 'behavioral' && (
          company.behavioral?.length > 0
            ? <BehavioralSection questions={company.behavioral} />
            : <ComingSoon feature="Behavioral Cheat Sheet" company={company.name} />
        )}
        {activeTab === 'resources' && <ResourcesSection resources={company.resources} company={company.name} />}
      </div>

      {/* Footer note */}
      <div className="border-t border-[#1C2A3A] py-6 text-center">
        <p className="text-xs text-gray-400">
          Data curated from Glassdoor, LeetCode Discuss, TeamBlind, GeeksForGeeks &amp; InterviewBit · Last updated {company.lastUpdated}
        </p>
      </div>
    </div>
  )
}

function StatCard({ icon, label, value, small }) {
  return (
    <div className="bg-white/10 border border-white/15 rounded-xl px-4 py-3 backdrop-blur-sm">
      <div className="flex items-center gap-1.5 text-purple-200 mb-0.5">
        {icon}
        <span className="text-xs">{label}</span>
      </div>
      <span className={`font-bold text-white ${small ? 'text-sm' : 'text-lg'}`}>{value}</span>
    </div>
  )
}

function ComingSoon({ feature, company }) {
  return (
    <div className="text-center py-20">
      <div className="text-5xl mb-4">🚧</div>
      <h3 className="text-xl font-bold text-gray-200">{feature} for {company}</h3>
      <p className="text-gray-500 mt-2">Full data is available for Oracle. Other companies coming soon.</p>
    </div>
  )
}
