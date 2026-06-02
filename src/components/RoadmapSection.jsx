import { useState } from 'react'
import {
  MapPin, CheckCircle, Circle, Calendar, AlertCircle,
  ChevronDown, ChevronUp, Trophy, Clock, Zap, BookOpen,
  Code2, Layers, Users, Brain, Target, Star, RotateCcw, Info,
  Flame, XCircle, AlertTriangle
} from 'lucide-react'
import { useProgress } from '../hooks/useProgress'

const ROUNDS = [
  { round: 'Screening Call', duration: '30 min', format: 'HR / Recruiter (Phone)', color: 'bg-blue-900/30 text-blue-300 border-blue-700/50', dot: 'bg-blue-500', topics: ['Background & experience walk-through', 'Why Oracle?', 'Current tech stack', '1–2 basic Java questions'], tips: 'Be concise. Know what Oracle does (Cloud, DB, ERP). Prepare your "tell me about yourself" in 2 minutes.' },
  { round: 'Round 1 – Online Assessment', duration: '90 min', format: 'HackerRank / CodeSignal', color: 'bg-purple-900/30 text-purple-300 border-purple-700/50', dot: 'bg-purple-500', topics: ['2 DSA problems (Easy to Medium)', 'Multiple choice: Java, OOP, Collections', 'SQL queries (basic to intermediate)'], tips: 'Practice LeetCode Easy-Medium. Focus on correctness first. All test cases must pass.' },
  { round: 'Round 2 – Technical Interview 1', duration: '60 min', format: 'Video Call (CoderPad)', color: 'bg-violet-900/30 text-violet-300 border-violet-700/50', dot: 'bg-violet-500', topics: ['1–2 Medium DSA problems (live coding)', 'Java core: Collections, Streams, Concurrency', 'Data structures from scratch'], tips: 'Think aloud. Start brute force → optimise. State complexity after every solution.' },
  { round: 'Round 3 – Technical Interview 2', duration: '60–75 min', format: 'Video Call', color: 'bg-indigo-900/30 text-indigo-300 border-indigo-700/50', dot: 'bg-indigo-500', topics: ['System Design (1 problem end-to-end)', 'Spring Boot internals & architecture', 'Microservices patterns', 'Database design & indexing'], tips: 'Framework: Requirements → Scale → API → DB → High-level design → Deep dives.' },
  { round: 'Round 4 – Technical + Managerial', duration: '60 min', format: 'Video Call (senior eng + manager)', color: 'bg-emerald-900/30 text-emerald-300 border-emerald-700/50', dot: 'bg-emerald-500', topics: ['Deep dive into past projects', 'Behavioral STAR questions', 'Team fit & collaboration', 'Career goals & why Oracle'], tips: 'Prepare 5–6 STAR stories. Research Oracle culture. Have 3 thoughtful questions for the manager.' },
]

const CRASH_PLAN = [
  {
    phase: 'Phase 1', title: 'Java Core', subtitle: 'Day 1–3', color: 'purple', emoji: '☕',
    days: [
      { id: 'cp1', day: 'Day 1', date: 'May 21', title: 'Java Basics + OOP + Collections', priority: 'CRITICAL', hoursNeeded: 6,
        tasks: ['OOP in 30 min: 4 pillars — Encapsulation, Inheritance, Polymorphism, Abstraction (write 1 code example each)', 'HashMap internals: hashing → bucket index → chaining → Java 8 TreeNode at size 8 → resize at 0.75 load (THIS is in every Oracle interview)', 'ArrayList vs LinkedList: O(1) index vs O(1) add-at-ends — know when to pick each', 'String vs StringBuilder vs StringBuffer: immutable vs mutable — always use StringBuilder in loops', 'Practice: Reverse a String using StringBuilder. Two Sum using HashMap (solve completely)'],
        skip: 'Skip: Generics wildcards, fail-fast vs fail-safe iterators, WeakHashMap — not worth today',
        quickWin: '"HashMap uses an array of buckets, Java 8 converts chains to Red-Black Trees when a bucket hits 8 entries"' },
      { id: 'cp2', day: 'Day 2', date: 'May 22', title: 'Java Concurrency + Streams', priority: 'CRITICAL', hoursNeeded: 5,
        tasks: ['Thread lifecycle in 20 min: NEW → RUNNABLE → WAITING/TIMED_WAITING → TERMINATED', 'synchronized vs volatile vs ReentrantLock: synchronized = mutex + visibility, volatile = visibility only (NOT atomic)', 'Deadlock: understand 4 conditions (mutual exclusion, hold-and-wait, no preemption, circular wait), break it via lock ordering', 'AtomicInteger: why i++ is NOT safe even on volatile (read-modify-write = 3 ops)', 'Java 8 Streams: practice 5 examples — filter/map/collect, groupingBy, averagingDouble, distinct, findFirst'],
        skip: 'Skip: Semaphore, CyclicBarrier, Phaser, ForkJoinPool — too deep for 10 days',
        quickWin: '"volatile only guarantees visibility, not atomicity. Use AtomicInteger for thread-safe counters"' },
      { id: 'cp3', day: 'Day 3', date: 'May 23', title: 'SQL Crash Course (Zero to Interview-Ready)', priority: 'CRITICAL', hoursNeeded: 6,
        tasks: ['SELECT, WHERE, ORDER BY, LIMIT — basic queries (30 min)', 'JOINs: INNER JOIN, LEFT JOIN, RIGHT JOIN with simple examples (1 hour — very important)', 'GROUP BY + HAVING vs WHERE — HAVING filters groups, WHERE filters rows', 'Window functions: ROW_NUMBER(), RANK(), DENSE_RANK() OVER (ORDER BY salary DESC) — Oracle LOVES these', '2nd highest salary: SELECT salary FROM (SELECT salary, DENSE_RANK() OVER (ORDER BY salary DESC) rnk FROM emp) WHERE rnk=2', 'Indexes: B-Tree (high cardinality, OLTP) vs Bitmap (low cardinality, read-heavy) — conceptual only', 'Practice: do 10 Easy SQL problems on leetcode.com/studyplan/top-sql-50'],
        skip: 'Skip: Stored procedures, PL/SQL, triggers, partitioning — DBA territory, not asked in dev interviews',
        quickWin: '"DENSE_RANK handles ties correctly: 1,1,2,3 unlike RANK which gives 1,1,3,4"' },
    ],
  },
  {
    phase: 'Phase 2', title: 'DSA Sprint', subtitle: 'Day 4–6', color: 'amber', emoji: '🧠',
    days: [
      { id: 'cp4', day: 'Day 4', date: 'May 24', title: 'Arrays, Strings, Two Pointers', priority: 'CRITICAL', hoursNeeded: 6,
        tasks: ['Two Sum (HashMap, O(n)) — most common Oracle question, solve it perfectly in under 10 min', 'Maximum Subarray — Kadane\'s algorithm: track currentMax and globalMax, O(n)', 'Container With Most Water — two pointers approach from both ends', 'Merge Intervals — sort by start time, merge overlapping. Very frequent at Oracle', 'Find All Anagrams — sliding window + char frequency array', 'Valid Parentheses — stack: push open brackets, pop and compare on close bracket'],
        skip: 'Skip: Trie problems, Bit manipulation, Segment Tree, Monotonic Stack problems — too rare in Oracle rounds',
        quickWin: '"Two Sum: one-pass HashMap — for each number, check if its complement already exists in the map"' },
      { id: 'cp5', day: 'Day 5', date: 'May 25', title: 'Linked Lists, Stacks, LRU Cache', priority: 'HIGH', hoursNeeded: 5,
        tasks: ['Reverse Linked List — iterative (3 pointers: prev, curr, next) and recursive — know BOTH', 'Detect cycle — Floyd\'s slow/fast pointer algorithm', 'Queue using Two Stacks — push to stack1, pop from stack2 (refill when empty)', 'LRU Cache (HashMap + DoublyLinkedList) — THE Oracle favourite. Spend 2 hours here. HashMap=O(1) lookup, DLL=O(1) move-to-front', 'Min Stack — track minimums with an auxiliary stack alongside the main stack'],
        skip: 'Skip: Skip lists, LFU cache variants, complex deque problems',
        quickWin: '"LRU Cache: HashMap gives O(1) lookup, Doubly Linked List gives O(1) eviction and move-to-front"' },
      { id: 'cp6', day: 'Day 6', date: 'May 26', title: 'Trees + Graphs + DP Basics', priority: 'HIGH', hoursNeeded: 6,
        tasks: ['Binary Tree Level Order Traversal — BFS using a queue. Foundational and frequently asked', 'Number of Islands — DFS on a 2D grid, mark visited cells as \'0\'', 'Course Schedule — detect cycle in directed graph using DFS with visited/inStack arrays', 'Coin Change — bottom-up DP: dp[i] = min coins to make amount i', 'Climbing Stairs — 1D DP (dp[i] = dp[i-1] + dp[i-2]), the hello-world of DP', 'Design HashMap from scratch — array of buckets + chaining (LinkedList) — Oracle asks this in Round 2'],
        skip: 'Skip: Dijkstra, Bellman-Ford, Segment Trees, Heavy-Light Decomposition, Knapsack variants, hard DP',
        quickWin: '"DP approach: define the state, write the recurrence relation, set base cases, fill bottom-up"' },
    ],
  },
  {
    phase: 'Phase 3', title: 'Spring Boot + Microservices', subtitle: 'Day 7–8', color: 'emerald', emoji: '🌿',
    days: [
      { id: 'cp7', day: 'Day 7', date: 'May 27', title: 'Spring Boot Core (Fastest Path)', priority: 'CRITICAL', hoursNeeded: 6,
        tasks: ['@SpringBootApplication = @Configuration + @ComponentScan + @EnableAutoConfiguration — just memorise this', 'DI types: constructor injection (preferred) vs field injection. Constructor is better: testable, immutable, no null surprises', 'Build a CRUD REST API mentally: @Entity → @Repository → @Service → @RestController. Know each annotation', '@Transactional deep dive: REQUIRED propagation (join or create), self-invocation bypasses proxy (classic Oracle question), only RuntimeException rolls back by default', 'N+1 problem: 100 departments + 100 queries for employees = 101 total. Fix: JOIN FETCH in JPQL or @EntityGraph on repository', 'Spring Security + JWT: filter chain → custom filter extracts token → validates → sets SecurityContextHolder'],
        skip: 'Skip: Reactive WebFlux, Spring Batch, Spring Integration, Actuator internals, OAuth2 PKCE flow',
        quickWin: '"The self-invocation problem: calling @Transactional method B from within the same class bypasses the Spring AOP proxy, so the transaction is never started"' },
      { id: 'cp8', day: 'Day 8', date: 'May 28', title: 'Microservices Patterns (Concepts)', priority: 'HIGH', hoursNeeded: 5,
        tasks: ['What is a microservice? Independent deployable service with its own DB. No shared DB between services', 'API Gateway: single entry point, handles auth/routing/rate-limiting. Spring Cloud Gateway is non-blocking (WebFlux)', 'Circuit Breaker: CLOSED (normal) → OPEN (failures exceeded threshold, return fallback) → HALF_OPEN (probe if service recovered). Resilience4j in Spring', 'Saga pattern: distributed transactions without 2PC. Choreography (events, decentralized) vs Orchestration (central coordinator)', 'Service Discovery: Eureka — services register on startup with heartbeat, clients query for live addresses', 'Why NOT 2PC in microservices: blocking, coordinator is SPOF, not cloud-native. Prefer Saga + eventual consistency', 'Outbox Pattern: save domain event to DB in same transaction, separate process reads and publishes — prevents lost events'],
        skip: 'Skip: Implementing Saga from scratch, deep Kafka internals (ISR/partition leader), Kubernetes YAML, Istio service mesh',
        quickWin: '"I prefer Saga over 2PC: distributed ACID is expensive and brittle. Eventual consistency with proper compensation is fine for most business flows"' },
    ],
  },
  {
    phase: 'Phase 4', title: 'System Design + Mock', subtitle: 'Day 9–10', color: 'blue', emoji: '🏗️',
    days: [
      { id: 'cp9', day: 'Day 9', date: 'May 29', title: 'System Design Crash Course', priority: 'HIGH', hoursNeeded: 6,
        tasks: ['Framework to memorise: Functional Req → Non-Functional Req → Scale Estimates → API Design → DB Schema → High-Level Diagram → Deep Dives', 'Core building blocks: Load Balancer, CDN, Cache (Redis), Message Queue (Kafka), SQL DB (PostgreSQL) vs NoSQL (Cassandra/MongoDB)', 'CAP Theorem: can only guarantee 2 of {Consistency, Availability, Partition Tolerance}. Cassandra=AP, HBase=CP, most SQL=CA', 'Design URL Shortener (30 min timed): Base-62 encoding, write to Cassandra, Redis cache hot URLs, CDN at edge', 'Design Notification System: Kafka → worker services → push/email/SMS. Handle retries + deduplication with idempotency keys', 'Rate Limiter: Token Bucket algorithm. Redis INCR + EXPIRE for distributed counting across servers', 'Caching strategies: Cache-Aside (app checks cache, fetch DB on miss) is most common. Know write-through too'],
        skip: 'Skip: Raft/Paxos consensus, consistent hashing deep implementation, CRDT data structures',
        quickWin: '"Always start with: what are the functional requirements? Non-functional? What scale — reads/writes per second, data size, latency targets?"' },
      { id: 'cp10', day: 'Day 10', date: 'May 30–31', title: 'Full Mock + Behavioral Polish', priority: 'CRITICAL', hoursNeeded: 8,
        tasks: ['Mock DSA round: pick 2 LeetCode Mediums, set 60-min timer, solve both, review where you got stuck and why', 'Mock verbal round: explain HashMap, @Transactional, volatile OUT LOUD with no notes — under 90 seconds each', 'STAR stories (prepare all 6): challenge faced, teammate disagreement, deadline pressure, mistake made + recovery, learning something new fast, leadership or initiative', 'Oracle-specific behavioral: "Why Oracle?" (Cloud scale, DB leader, enterprise stability, 24-25 LPA growth role), "What do you know about Oracle Cloud?"', 'Questions to ask Oracle interviewer: "What does the team\'s tech stack look like?", "How are code reviews done?", "What does success look like in 6 months?"', 'Final day: set up clean desk, test camera/mic/internet, print a cheat sheet of 10 key concepts, sleep 8 hours'],
        skip: 'No skips today. This is integration day. Every task is load-bearing',
        quickWin: '"Thinking out loud is more valuable than the right answer. Interviewers want to see how you approach problems — not just the solution"' },
    ],
  },
]

const SKIP_LIST = [
  { topic: 'Reactive / WebFlux', reason: 'Niche, takes weeks to understand well' },
  { topic: 'Kubernetes YAML / Helm', reason: 'Ops topic, not in Java dev interviews' },
  { topic: 'Segment Trees / Fenwick Trees', reason: 'Almost never appears in Oracle Java rounds' },
  { topic: 'GraphQL', reason: 'Rarely asked at Oracle for this role' },
  { topic: 'JVM tuning (-XX flags)', reason: 'Nice to know, but not where interviews are won or lost' },
  { topic: 'PL/SQL / Stored Procedures', reason: 'DBA territory — you are applying as a developer' },
  { topic: 'Kafka internals (ISR, leaders)', reason: 'Knowing the concept is enough' },
  { topic: 'Distributed tracing (Zipkin)', reason: 'Mention it, do not study it' },
  { topic: 'OAuth2 PKCE / SAML', reason: 'JWT knowledge is sufficient for this interview' },
  { topic: 'Spring Batch / Spring Integration', reason: 'Too specialised for a general Java Full Stack role' },
]

const INTERVIEW_CHECKLIST = [
  { id: 'ic1', text: 'Test mic, camera, and internet 30 min before the call' },
  { id: 'ic2', text: 'Keep blank paper + pen ready for drawing diagrams' },
  { id: 'ic3', text: 'Have water within reach' },
  { id: 'ic4', text: 'Close all distracting apps and notifications' },
  { id: 'ic5', text: 'Read the problem FULLY before coding — ask clarifying questions first' },
  { id: 'ic6', text: 'Think aloud the entire time — silence during coding worries interviewers' },
  { id: 'ic7', text: 'State time and space complexity after every solution' },
  { id: 'ic8', text: 'Have 3 thoughtful questions ready to ask the interviewer at the end' },
  { id: 'ic9', text: 'If stuck: say it, fall back to brute force, then optimise step by step' },
  { id: 'ic10', text: 'Review your 2-min "Tell me about yourself" pitch one last time' },
]

const PHASE_COLORS = {
  purple: { bg: 'bg-purple-600', light: 'bg-purple-900/20', border: 'border-purple-700/50', text: 'text-purple-300', badge: 'bg-purple-900/40 text-purple-300' },
  amber:  { bg: 'bg-amber-500',  light: 'bg-amber-900/20',  border: 'border-amber-700/50',  text: 'text-amber-300',  badge: 'bg-amber-900/40 text-amber-300'  },
  emerald:{ bg: 'bg-emerald-600',light: 'bg-emerald-900/20',border: 'border-emerald-700/50',text: 'text-emerald-300',badge: 'bg-emerald-900/40 text-emerald-300'},
  blue:   { bg: 'bg-blue-600',   light: 'bg-blue-900/20',   border: 'border-blue-700/50',   text: 'text-blue-300',   badge: 'bg-blue-900/40 text-blue-300'   },
}
const PRIORITY_STYLE = {
  CRITICAL: 'bg-red-900/30 text-red-300 border-red-700/50',
  HIGH:     'bg-amber-900/30 text-amber-300 border-amber-700/50',
}

export default function RoadmapSection() {
  const [activePhase, setActivePhase] = useState(0)
  const [expandedRound, setExpandedRound] = useState(null)
  const [expandedDay, setExpandedDay] = useState(null)
  const { completed: dayDone, toggle: toggleDay, reset: resetDays } = useProgress('oracle_roadmap_days')
  const { completed: checkDone, toggle: toggleCheck } = useProgress('oracle_interview_checklist')

  const totalDays = CRASH_PLAN.flatMap((p) => p.days).length
  const doneDays = CRASH_PLAN.flatMap((p) => p.days).filter((d) => dayDone.has(d.id)).length
  const pct = Math.round((doneDays / totalDays) * 100)

  const phase = CRASH_PLAN[activePhase]
  const pc = PHASE_COLORS[phase.color]

  return (
    <div className="animate-fade-in max-w-4xl mx-auto space-y-8">

      {/* Reality Check Banner */}
        <div className="card overflow-hidden border-2 border-red-800/50">
        <div className="bg-gradient-to-r from-red-600 to-rose-500 p-5 text-white">
          <div className="flex items-center gap-2 mb-2">
            <Flame size={18} className="text-red-200" />
            <span className="text-red-100 text-xs font-bold uppercase tracking-wide">10-Day Oracle Interview Crash Plan · May 21 → June 1</span>
          </div>
          <h2 className="text-xl font-bold mb-1">Zero to Interview-Ready in 10 Days.</h2>
          <p className="text-red-100 text-sm leading-relaxed max-w-2xl">
            You know a little Java. Zero SQL, DSA, Design, Spring Boot.{' '}
            <strong className="text-white">Honest truth:</strong> you cannot master all of it.
            But you CAN learn enough of the RIGHT things to pass each round with confidence.
            This plan tells you exactly what to study, what to skip, and what to say.
          </p>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-4 divide-x divide-y sm:divide-y-0 border-t border-[#1C2A3A]">
          {[
            { label: 'Days Left', count: '10', sub: 'May 21–30', emoji: '⏰' },
            { label: 'Hours/Day', count: '5–7h', sub: 'non-negotiable', emoji: '🔥' },
            { label: 'Focus Areas', count: '4', sub: 'laser-focused', emoji: '🎯' },
            { label: 'Progress', count: `${pct}%`, sub: `${doneDays}/${totalDays} days done`, emoji: '📈' },
          ].map(({ label, count, sub, emoji }) => (
            <div key={label} className="px-4 py-3 text-center">
              <span className="text-xl">{emoji}</span>
              <div className="text-lg font-bold text-gray-100">{count}</div>
              <div className="text-xs font-semibold text-gray-400">{label}</div>
              <div className="text-xs text-gray-400">{sub}</div>
            </div>
          ))}
        </div>
        <div className="px-5 py-3 bg-gray-900/50 border-t border-gray-800">
          <div className="flex items-center justify-between mb-1">
            <span className="text-xs font-semibold text-gray-400">Crash Plan Progress</span>
            <span className="text-xs font-bold text-purple-600">{pct}%</span>
          </div>
          <div className="w-full h-2.5 bg-gray-700 rounded-full overflow-hidden">
            <div className="h-full bg-gradient-to-r from-purple-500 to-emerald-500 rounded-full transition-all duration-500" style={{ width: `${pct}%` }} />
          </div>
        </div>
      </div>

      {/* Honest Expectations */}
      <div className="grid sm:grid-cols-2 gap-4">
        <div className="card p-4 border-emerald-800/50 bg-emerald-900/20">
          <h4 className="font-bold text-emerald-300 flex items-center gap-1.5 mb-3"><CheckCircle size={15} />What you CAN achieve in 10 days</h4>
          <ul className="space-y-1.5 text-sm text-emerald-200">
            {['Pass the Online Assessment (HackerRank)', 'Answer 80% of Java Core questions confidently', 'Solve Easy-Medium DSA problems on the spot', 'Explain Spring Boot and @Transactional clearly', 'Design URL Shortener and Notification System', 'Ace the behavioral / HR round completely'].map((t) => (
              <li key={t} className="flex items-start gap-2"><div className="w-1.5 h-1.5 bg-emerald-500 rounded-full mt-1.5 shrink-0" />{t}</li>
            ))}
          </ul>
        </div>
        <div className="card p-4 border-amber-800/50 bg-amber-900/20">
          <h4 className="font-bold text-amber-300 flex items-center gap-1.5 mb-3"><AlertTriangle size={15} />Honest limits (it is OK)</h4>
          <ul className="space-y-1.5 text-sm text-amber-200">
            {['Hard LeetCode problems under live pressure will be tough', 'Deep Microservices architecture takes 4+ weeks ideally', 'System Design at senior level requires months', 'Oracle DB internals (PL/SQL) cannot be covered in 10 days', 'Be upfront: "I am actively strengthening X" — interviewers respect that', 'You are not expected to be perfect — show you can learn fast'].map((t) => (
              <li key={t} className="flex items-start gap-2"><div className="w-1.5 h-1.5 bg-amber-500 rounded-full mt-1.5 shrink-0" />{t}</li>
            ))}
          </ul>
        </div>
      </div>

      {/* Interview Process */}
      <div>
        <h3 className="text-lg font-bold text-gray-100 mb-1 flex items-center gap-2"><Trophy size={18} className="text-purple-500" />Oracle Interview Process</h3>
        <p className="text-sm text-gray-400 mb-4">Click any round to see what is covered and how to prepare.</p>
        <div className="relative">
          <div className="absolute left-4 top-6 bottom-6 w-0.5 bg-gray-700 hidden sm:block" />
          <div className="space-y-3">
            {ROUNDS.map((r, i) => {
              const isOpen = expandedRound === i
              return (
                <div key={i} className="relative sm:pl-12">
                  <div className={`absolute left-2.5 top-4 w-3 h-3 rounded-full border-2 border-[#0F1724] shadow ${r.dot} hidden sm:block`} />
                  <div className="card overflow-hidden">
                    <button onClick={() => setExpandedRound(isOpen ? null : i)} className="w-full flex items-center justify-between gap-3 p-4 text-left hover:bg-[#1C2A3A]/50 transition-colors">
                      <div className="flex items-center gap-3 flex-1 min-w-0">
                        <span className={`text-xs font-bold px-2.5 py-1 rounded-full border shrink-0 ${r.color}`}>R{i + 1}</span>
                        <div className="min-w-0">
                          <p className="font-semibold text-gray-100 text-sm truncate">{r.round}</p>
                          <p className="text-xs text-gray-400 flex items-center gap-1.5 mt-0.5"><Clock size={10} />{r.duration} · {r.format}</p>
                        </div>
                      </div>
                      {isOpen ? <ChevronUp size={16} className="text-gray-400 shrink-0" /> : <ChevronDown size={16} className="text-gray-400 shrink-0" />}
                    </button>
                    {isOpen && (
                      <div className="px-4 pb-4 border-t border-[#1C2A3A] pt-3 grid sm:grid-cols-2 gap-4 animate-fade-in">
                        <div>
                          <h4 className="text-xs font-semibold text-gray-400 uppercase tracking-wide mb-2">What is covered</h4>
                          <ul className="space-y-1.5">{r.topics.map((t) => (<li key={t} className="flex items-start gap-2 text-sm text-gray-300"><div className="w-1.5 h-1.5 rounded-full bg-purple-400 shrink-0 mt-1.5" />{t}</li>))}</ul>
                        </div>
                        <div className="bg-amber-900/20 border border-amber-700/40 rounded-xl p-3">
                          <h4 className="text-xs font-semibold text-amber-400 uppercase tracking-wide mb-1.5 flex items-center gap-1"><Zap size={11} />Prep Tip</h4>
                          <p className="text-sm text-amber-200 leading-relaxed">{r.tips}</p>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      </div>

      {/* 10-Day Crash Plan */}
      <div>
        <div className="flex items-center justify-between mb-1">
          <h3 className="text-lg font-bold text-gray-100 flex items-center gap-2"><Calendar size={18} className="text-purple-500" />Your 10-Day Crash Plan</h3>
          <button onClick={resetDays} className="text-xs text-gray-400 hover:text-red-500 flex items-center gap-1 transition-colors"><RotateCcw size={12} />Reset</button>
        </div>
        <p className="text-sm text-gray-400 mb-4">Each day has clear tasks, a "skip this" note to save time, and a quick-win line to say in the interview.</p>

        <div className="flex flex-wrap gap-2 mb-5">
          {CRASH_PLAN.map((p, idx) => {
            const pc2 = PHASE_COLORS[p.color]
            const pDone = p.days.filter((d) => dayDone.has(d.id)).length
            const isActive = activePhase === idx
            return (
              <button key={idx} onClick={() => setActivePhase(idx)}
                className={`flex flex-col items-start px-4 py-2.5 rounded-xl border transition-all text-left ${isActive ? `${pc2.bg} text-white border-transparent shadow-md` : `bg-[#0F1724] ${pc2.text} ${pc2.border}`}`}>
                <span className="text-xs font-bold">{p.emoji} {p.phase}</span>
                <span className={`text-xs mt-0.5 ${isActive ? 'text-white/80' : 'text-gray-400'}`}>{p.subtitle} · {pDone}/{p.days.length} done</span>
              </button>
            )
          })}
        </div>

        <div className={`rounded-xl p-4 mb-4 ${pc.light} border ${pc.border} flex items-center justify-between gap-3`}>
          <div>
            <h4 className={`font-bold ${pc.text}`}>{phase.emoji} {phase.phase}: {phase.title}</h4>
            <p className="text-sm text-gray-500">{phase.subtitle}</p>
          </div>
          <div className={`text-right shrink-0 ${pc.text}`}>
            <div className="text-lg font-bold">{phase.days.filter((d) => dayDone.has(d.id)).length}/{phase.days.length}</div>
            <div className="text-xs opacity-70">days</div>
          </div>
        </div>

        <div className="space-y-3">
          {phase.days.map((day) => {
            const isDone = dayDone.has(day.id)
            const isOpen = expandedDay === day.id
            return (
              <div key={day.id} className={`card overflow-hidden border transition-all ${isDone ? 'border-emerald-800/50 bg-emerald-900/10' : 'border-[#1C2A3A]'}`}>
                <div className="flex items-center gap-3 p-4">
                  <button onClick={() => toggleDay(day.id)} className="shrink-0 focus:outline-none">
                    {isDone ? <CheckCircle size={22} className="text-emerald-500" /> : <Circle size={22} className="text-gray-300 hover:text-purple-400 transition-colors" />}
                  </button>
                  <button onClick={() => setExpandedDay(isOpen ? null : day.id)} className="flex items-center justify-between gap-3 flex-1 text-left min-w-0">
                    <div className="min-w-0">
                      <div className="flex items-center gap-2 flex-wrap mb-0.5">
                        <span className={`text-xs font-semibold ${pc.badge} px-2 py-0.5 rounded-full`}>{day.day} · {day.date}</span>
                        <span className={`text-xs font-bold px-2 py-0.5 rounded-full border ${PRIORITY_STYLE[day.priority]}`}>{day.priority}</span>
                        <span className="text-xs text-gray-400 flex items-center gap-1"><Clock size={9} />{day.hoursNeeded}h</span>
                      </div>
                      <span className={`font-semibold text-sm ${isDone ? 'line-through text-gray-500' : 'text-gray-100'}`}>{day.title}</span>
                    </div>
                    {isOpen ? <ChevronUp size={15} className="text-gray-400 shrink-0" /> : <ChevronDown size={15} className="text-gray-400 shrink-0" />}
                  </button>
                </div>
                {isOpen && (
                  <div className="px-4 pb-4 pt-0 border-t border-[#1C2A3A] animate-fade-in space-y-3 mt-2">
                    <div>
                      <h4 className="text-xs font-bold text-gray-400 uppercase tracking-wide mb-2">What to do today</h4>
                      <ul className="space-y-2">
                        {day.tasks.map((task, ti) => (
                          <li key={ti} className="flex items-start gap-2.5 text-sm text-gray-300">
                            <div className={`w-5 h-5 rounded-full ${pc.bg} text-white text-xs flex items-center justify-center shrink-0 mt-0.5 font-bold`}>{ti + 1}</div>
                            {task}
                          </li>
                        ))}
                      </ul>
                    </div>
                    <div className="bg-red-900/30 border border-red-700/50 rounded-xl px-4 py-3">
                      <p className="text-xs font-bold text-red-400 mb-1 flex items-center gap-1"><XCircle size={11} />Skip this — save your time</p>
                      <p className="text-sm text-red-300">{day.skip}</p>
                    </div>
                    <div className="bg-purple-900/30 border border-purple-700/40 rounded-xl px-4 py-3">
                      <p className="text-xs font-bold text-purple-400 mb-1 flex items-center gap-1"><Zap size={11} />Quick Win — say this in the interview</p>
                      <p className="text-sm text-purple-300 italic">{day.quickWin}</p>
                    </div>
                  </div>
                )}
              </div>
            )
          })}
        </div>
      </div>

      {/* Skip List */}
      <div>
        <h3 className="text-lg font-bold text-gray-100 mb-1 flex items-center gap-2"><XCircle size={18} className="text-red-500" />Topics to Skip Entirely (10-Day Reality)</h3>
        <p className="text-sm text-gray-400 mb-4">Real topics — but studying them now costs time without proportional return.</p>
        <div className="grid sm:grid-cols-2 gap-2">
          {SKIP_LIST.map(({ topic, reason }) => (
            <div key={topic} className="flex items-start gap-3 p-3 bg-red-900/20 border border-red-700/40 rounded-xl">
              <XCircle size={14} className="text-red-400 shrink-0 mt-0.5" />
              <div><p className="text-sm font-semibold text-red-300">{topic}</p><p className="text-xs text-red-400">{reason}</p></div>
            </div>
          ))}
        </div>
      </div>

      {/* Priority Map */}
      <div>
        <h3 className="text-lg font-bold text-gray-100 mb-1 flex items-center gap-2"><Target size={18} className="text-purple-500" />Oracle Topic Priority Map</h3>
        <p className="text-sm text-gray-400 mb-4">If you only have 2 hours left, study the red column first.</p>
        <div className="grid sm:grid-cols-3 gap-3">
          {[
            { priority: '🔴 Must Know', color: 'bg-red-900/20 border-red-700/40', badge: 'bg-red-900/30 text-red-300',
              topics: ['HashMap internals (hashing, chaining, resize)', 'volatile vs synchronized vs AtomicInteger', 'Java 8 Streams: filter/map/collect/groupingBy', '@Transactional: propagation + self-invocation bug', 'LRU Cache: HashMap + Doubly Linked List', 'Two Sum + Merge Intervals + Valid Parentheses', 'SQL: JOINs + GROUP BY + Window functions (DENSE_RANK)', 'Spring Boot: @RestController, DI, IoC container'] },
            { priority: '🟡 Should Know', color: 'bg-amber-900/20 border-amber-700/40', badge: 'bg-amber-900/30 text-amber-300',
              topics: ['GC: Young Gen, Old Gen, G1GC (30 sec explanation)', 'N+1 problem in JPA + JOIN FETCH fix', 'Spring Security + JWT filter chain', 'Circuit Breaker: CLOSED/OPEN/HALF_OPEN states', 'Saga pattern: choreography vs orchestration', 'Binary Tree Level Order BFS, Graph DFS/cycle detection', 'Coin Change DP, Climbing Stairs DP', 'System Design: URL Shortener end-to-end'] },
            { priority: '🟢 Good to Mention', color: 'bg-blue-900/20 border-blue-700/40', badge: 'bg-blue-900/30 text-blue-300',
              topics: ['Design Patterns: Singleton (Bill Pugh), Builder', 'Microservices: API Gateway, Service Discovery (Eureka)', 'Outbox Pattern for reliable event publishing', 'Rate Limiter: Token Bucket + Redis', 'Oracle DB: B-Tree vs Bitmap index', 'MVCC in Oracle: readers never block writers', 'HikariCP connection pool sizing', 'CAP theorem with real examples'] },
          ].map(({ priority, color, badge, topics }) => (
            <div key={priority} className={`card p-4 ${color} border`}>
              <span className={`text-xs font-bold px-2.5 py-1 rounded-full block w-fit mb-3 ${badge}`}>{priority}</span>
              <ul className="space-y-1.5">
                {topics.map((t) => (<li key={t} className="flex items-start gap-2 text-sm text-gray-300"><div className="w-1.5 h-1.5 rounded-full bg-current shrink-0 mt-1.5 opacity-40" />{t}</li>))}
              </ul>
            </div>
          ))}
        </div>
      </div>

      {/* Interview Day Checklist */}
      <div>
        <h3 className="text-lg font-bold text-gray-100 mb-1 flex items-center gap-2"><Star size={18} className="text-purple-500" />Interview Day Checklist</h3>
        <p className="text-sm text-gray-400 mb-4">Check these off on the day of each round.</p>
        <div className="card p-5">
          <div className="space-y-2">
            {INTERVIEW_CHECKLIST.map((item) => {
              const done = checkDone.has(item.id)
              return (
                <button key={item.id} onClick={() => toggleCheck(item.id)}
                  className={`w-full flex items-center gap-3 p-3 rounded-xl border text-left transition-all ${done ? 'bg-emerald-900/20 border-emerald-700/40' : 'bg-[#0F1724] border-[#1C2A3A] hover:border-purple-700/50'}`}>
                  {done ? <CheckCircle size={18} className="text-emerald-500 shrink-0" /> : <Circle size={18} className="text-gray-300 shrink-0" />}
                  <span className={`text-sm ${done ? 'line-through text-gray-500' : 'text-gray-300'}`}>{item.text}</span>
                </button>
              )
            })}
          </div>
          <div className="mt-4 flex items-center gap-2 bg-purple-900/30 border border-purple-700/40 rounded-xl px-4 py-2.5">
            <Info size={14} className="text-purple-400 shrink-0" />
            <p className="text-sm text-purple-300"><strong>Remember:</strong> Interviewers want to hire you. Think out loud, show your reasoning, stay calm. That matters more than a perfect answer.</p>
          </div>
        </div>
      </div>

    </div>
  )
}
