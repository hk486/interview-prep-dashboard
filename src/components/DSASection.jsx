import { useState } from 'react'
import { ExternalLink, ChevronDown, ChevronUp, Clock, Zap, Tag, CheckCircle, Circle, BookOpen, Map, BarChart2, Info, Lightbulb } from 'lucide-react'
import { useProgress } from '../hooks/useProgress'

// ── Difficulty helpers ───────────────────────────────────────────────────────
const DIFFICULTIES = ['All', 'Easy', 'Medium', 'Hard']

function diffClass(d) {
  if (d === 'Easy') return 'badge-easy'
  if (d === 'Hard') return 'badge-hard'
  return 'badge-medium'
}

function freqLabel(score) {
  if (score >= 85) return { label: 'Very Frequently Asked', color: 'text-purple-300 bg-purple-900/30' }
  if (score >= 70) return { label: 'Frequently Asked', color: 'text-blue-300 bg-blue-900/30' }
  if (score >= 55) return { label: 'Occasionally Asked', color: 'text-gray-400 bg-gray-800' }
  return { label: 'Rarely Asked', color: 'text-gray-500 bg-gray-800/50' }
}

// ── Pattern guide (beginner-friendly explanations) ──────────────────────────
const PATTERNS_GUIDE = [
  {
    name: 'Two Pointers',
    emoji: '👆',
    color: 'bg-sky-900/30 border-sky-700/40 text-sky-300',
    dot: 'bg-sky-400',
    simple: 'Use two index variables that move toward each other or at different speeds. Perfect for sorted arrays when you want to find a pair or reduce space.',
    when: 'When asked about pairs in a sorted array, or finding water/container area.',
    example: 'Container With Most Water, Trapping Rain Water',
  },
  {
    name: 'Sliding Window',
    emoji: '🪟',
    color: 'bg-violet-900/30 border-violet-700/40 text-violet-300',
    dot: 'bg-violet-400',
    simple: 'Maintain a "window" (subarray/substring) and slide it forward one step at a time, adding new elements on the right and removing old ones on the left.',
    when: 'When asked about longest/shortest subarray/substring with a condition.',
    example: 'Find All Anagrams in a String',
  },
  {
    name: 'HashMap / Hashing',
    emoji: '🗂️',
    color: 'bg-amber-900/30 border-amber-700/40 text-amber-300',
    dot: 'bg-amber-400',
    simple: 'Store values in a HashMap for instant O(1) lookup later. Useful for counting frequencies, finding duplicates, or caching results.',
    when: 'When you need to look up values quickly or count occurrences.',
    example: 'LRU Cache, Design HashMap, Top K Frequent Elements',
  },
  {
    name: 'BFS / DFS',
    emoji: '🌳',
    color: 'bg-emerald-900/30 border-emerald-700/40 text-emerald-300',
    dot: 'bg-emerald-400',
    simple: 'BFS (queue) goes level by level — great for shortest path or level order. DFS (recursion/stack) explores as deep as possible first — great for connected components.',
    when: 'Tree or graph traversal, finding connected regions, detecting cycles.',
    example: 'Binary Tree Level Order, Number of Islands, Course Schedule',
  },
  {
    name: 'Heap',
    emoji: '⛰️',
    color: 'bg-rose-900/30 border-rose-700/40 text-rose-300',
    dot: 'bg-rose-400',
    simple: 'A Heap (Priority Queue) always gives you the smallest or largest element in O(log n). Use a Min-Heap to track the top-K largest elements.',
    when: 'When you need the "top K" items, or need to repeatedly get the min/max.',
    example: 'Top K Frequent Elements, Meeting Rooms II',
  },
  {
    name: 'Dynamic Programming',
    emoji: '🧩',
    color: 'bg-purple-900/30 border-purple-700/40 text-purple-300',
    dot: 'bg-purple-400',
    simple: 'Break a big problem into smaller subproblems. Store answers to subproblems in an array (dp[]) so you don\'t re-compute. Build up from the smallest case.',
    when: 'When the problem asks for min/max count, and future choices depend on past choices.',
    example: 'Coin Change, Word Break, Maximum Subarray, Longest Palindromic',
  },
  {
    name: 'Java Concurrency',
    emoji: '⚙️',
    color: 'bg-orange-900/30 border-orange-700/40 text-orange-300',
    dot: 'bg-orange-400',
    simple: 'Multiple threads running at the same time can corrupt shared data. Use synchronized, volatile, or high-level tools like BlockingQueue to make code thread-safe.',
    when: 'Oracle asks this for Java roles — Singleton, Producer-Consumer are the top two.',
    example: 'Thread-Safe Singleton, Producer-Consumer',
  },
  {
    name: 'Stack & Queue Design',
    emoji: '📚',
    color: 'bg-teal-900/30 border-teal-700/40 text-teal-300',
    dot: 'bg-teal-400',
    simple: 'Design questions ask you to build a data structure from scratch. Think about what operations are needed and what internal storage will make them fast.',
    when: 'When asked to "implement" or "design" a data structure.',
    example: 'Queue using Two Stacks, Design HashMap, LRU Cache',
  },
  {
    name: 'Backtracking',
    emoji: '🌿',
    color: 'bg-lime-900/30 border-lime-700/40 text-lime-300',
    dot: 'bg-lime-400',
    simple: 'Try all possible choices at each step. If a choice leads to a dead end, undo it (backtrack) and try the next option. Like navigating a maze — try a path, hit a wall, go back and try another.',
    when: 'When asked to generate ALL combinations, permutations, or valid configurations.',
    example: 'Generate Parentheses',
  },
]

// ── Per-question beginner enrichment (pattern, learn order, simple steps) ───
const QUESTION_META = {
  12: {
    pattern: 'HashMap / Hashing',
    learnOrder: 1,
    prereqs: 'Arrays, basic idea of what a HashMap is',
    steps: [
      '🪣  Create an array of "buckets" (e.g., 1000 slots) — this is your storage.',
      '🔑  To store a key: compute bucket index = key % 1000 (this is the hash function).',
      '💥  Multiple keys can land in the same bucket (called a collision) — store them as a small list inside that bucket.',
      '🔍  For get/remove: jump to the right bucket, then scan the short list to find the exact key.',
      '💡  Oracle expects you to mention: load factor (0.75), rehashing when full, and equals()/hashCode() contract.',
    ],
  },
  16: {
    pattern: 'Stack & Queue Design',
    learnOrder: 2,
    prereqs: 'What a Stack is (LIFO), what a Queue is (FIFO)',
    steps: [
      '📥  Create two stacks: call them "inbox" (for push) and "outbox" (for pop).',
      '➕  push(x): just push onto inbox. Simple!',
      '📤  pop() or peek(): if outbox is EMPTY, pour ALL items from inbox into outbox (this reverses their order — making it FIFO!).',
      '✅  Then pop/peek from outbox as normal.',
      '⚡  Cost: each item moves at most twice total — so it\'s O(1) amortized per operation.',
    ],
  },
  13: {
    pattern: 'Dynamic Programming',
    learnOrder: 3,
    prereqs: 'Basic array iteration',
    steps: [
      '🤔  The question: find the contiguous subarray (consecutive elements) with the biggest sum.',
      '💡  Kadane\'s idea: at each position, ask yourself — "Is it better to start fresh here, or extend from the last position?"',
      '📝  currentSum = max(nums[i],  currentSum + nums[i])  — take whichever is bigger.',
      '🏆  Keep track of the overall maxSum = max(maxSum, currentSum) as you go.',
      '🔚  One pass through the array — done! O(n) time, O(1) space.',
    ],
  },
  2: {
    pattern: 'HashMap / Hashing',
    learnOrder: 4,
    prereqs: 'Sorting arrays, basic list operations',
    steps: [
      '📋  Sort all intervals by their start time — this groups overlapping ones together.',
      '🔖  Take the first interval as your "current" interval to track.',
      '🔁  For each next interval: check if it overlaps with current (next.start ≤ current.end).',
      '🔗  If they overlap: merge by updating end = max(current.end, next.end).',
      '✅  If no overlap: save current interval, make next interval the new current.',
    ],
  },
  14: {
    pattern: 'Two Pointers',
    learnOrder: 5,
    prereqs: 'Array indexing, Math.min()',
    steps: [
      '📏  The area between two vertical lines = width × height of the shorter line.',
      '👈👉  Use two pointers: left at index 0, right at the last index.',
      '📐  Calculate area = min(height[left], height[right]) × (right - left). Update maximum.',
      '↩️  Move the pointer with the SHORTER height inward (moving the taller one can only make area smaller).',
      '🔁  Repeat until left and right pointers meet.',
    ],
  },
  15: {
    pattern: 'Sliding Window',
    learnOrder: 6,
    prereqs: 'String character arrays, frequency counting',
    steps: [
      '🔤  An anagram uses the exact same letters — "eat" and "tea" are anagrams.',
      '📊  Count letter frequencies in pattern p using an int[26] array (one slot per letter a-z).',
      '🪟  Create a sliding window of exact size p.length() over string s.',
      '🔄  Slide it one position at a time: add the new right character, remove the old left character.',
      '✅  At each position, compare window\'s int[26] with p\'s int[26] using Arrays.equals() — if match, record the start index.',
    ],
  },
  3: {
    pattern: 'BFS / DFS',
    learnOrder: 7,
    prereqs: 'What a binary tree is, what a Queue (FIFO) is',
    steps: [
      '🏢  Think of a tree level by level — like floors of a building, top to bottom.',
      '📦  Use a Queue: start by putting the root node in.',
      '📏  At the start of each "level round": note the current queue size — that\'s how many nodes are on this level.',
      '🔁  Process exactly that many nodes: collect their values, add their left & right children to the queue.',
      '⏩  Repeat until the queue is empty — each round gives you one level\'s values.',
    ],
  },
  7: {
    pattern: 'BFS / DFS',
    learnOrder: 8,
    prereqs: 'Basic recursion, 2D arrays',
    steps: [
      '🗺️  Scan the grid cell by cell. When you find a \'1\' (land), you\'ve found a new island — increment counter.',
      '🔥  Start a DFS from that cell to explore the entire island.',
      '👣  DFS: mark each visited \'1\' as \'0\' (or \'visited\') so you don\'t count it again.',
      '📡  From each cell, DFS in 4 directions: up, down, left, right.',
      '🏝️  When DFS finishes, the whole island is marked. Continue scanning for the next \'1\'.',
    ],
  },
  5: {
    pattern: 'Heap',
    learnOrder: 9,
    prereqs: 'HashMap for counting, basic idea of a PriorityQueue',
    steps: [
      '📊  Step 1: Count how many times each number appears — use a HashMap<Integer, Integer>.',
      '⛰️  Step 2: Use a Min-Heap (PriorityQueue) of size k to find the top k frequent.',
      '➕  For each (number, count) pair: add it to the heap. If heap grows beyond k, remove the one with the lowest count.',
      '🏆  At the end, the heap contains exactly the k most frequent elements.',
      '💡  Java: PriorityQueue<int[]> pq = new PriorityQueue<>((a,b)->a[1]-b[1]). Each int[] = {number, count}.',
    ],
  },
  6: {
    pattern: 'Heap',
    learnOrder: 10,
    prereqs: 'Sorting, Min-Heap concept',
    steps: [
      '📅  Sort all meetings by their start time.',
      '⛰️  Use a Min-Heap to track when each room becomes FREE (heap stores end times).',
      '🔁  For each meeting: peek at the heap top (= earliest a room becomes free).',
      '♻️  If that room frees up before this meeting starts (heap.top ≤ meeting.start): reuse it (poll from heap).',
      '🚪  Always add current meeting\'s end time to heap. Heap size at the end = rooms needed.',
    ],
  },
  8: {
    pattern: 'Dynamic Programming',
    learnOrder: 11,
    prereqs: 'String indexing, basic loops',
    steps: [
      '🪞  A palindrome reads the same forwards and backwards — "racecar", "abba".',
      '🎯  For every character in the string, try expanding outward from it.',
      '🔍  Odd-length palindromes: expand from index i in both directions while chars match.',
      '🔍  Even-length palindromes: expand starting between index i and i+1.',
      '📏  Track the longest palindrome found during ALL expansions and return it.',
    ],
  },
  1: {
    pattern: 'HashMap / Hashing',
    learnOrder: 12,
    prereqs: 'HashMap internals, Doubly Linked List concept',
    steps: [
      '🕐  LRU = Least Recently Used. When cache is full, evict the item used LONGEST ago.',
      '⚡  You need: fast lookup (HashMap) AND order tracking (who was used most recently).',
      '🎯  Java shortcut: extend LinkedHashMap(capacity, 0.75f, true) and override removeEldestEntry() → return size() > capacity.',
      '🔧  Manual approach: HashMap<Key, Node> + Doubly Linked List. Head = oldest, Tail = most recent.',
      '📝  get() moves node to tail; put() adds to tail, removes head if over capacity.',
    ],
  },
  17: {
    pattern: 'Java Concurrency',
    learnOrder: 13,
    prereqs: 'What a class is, basic idea of multiple threads',
    steps: [
      '🔒  Singleton = only ONE instance of a class should ever exist in the JVM.',
      '⚠️  Problem: two threads could both call getInstance() at the same time and create two instances.',
      '✅  Best approach — Static Inner Class: Java loads the inner class lazily and thread-safely. Zero extra sync needed.',
      '🔄  Alternative — Double-Checked Locking: check null → lock → check null again → create. MUST mark field as volatile.',
      '🏆  Bonus approach — Enum: one-liner, handles thread safety AND serialization. Simplest but unusual-looking.',
    ],
  },
  9: {
    pattern: 'Dynamic Programming',
    learnOrder: 14,
    prereqs: 'String contains/substring, boolean arrays',
    steps: [
      '📋  Create a boolean dp[] of size (s.length + 1). Set dp[0] = true (empty string always "breaks" into nothing).',
      '🔁  For each position i from 1 to s.length(): you want to know if s[0..i] can be broken into words.',
      '🔍  Inner loop: for each j from 0 to i — if dp[j] is true AND s.substring(j, i) is in the word dictionary, set dp[i] = true.',
      '📖  Use a HashSet for the dictionary so word lookups are O(1).',
      '🏁  Return dp[s.length()] — true means the whole string can be broken into words.',
    ],
  },
  10: {
    pattern: 'BFS / DFS',
    learnOrder: 15,
    prereqs: 'Graph basics (nodes + edges), recursion',
    steps: [
      '🗺️  Model it: each course is a node. "A must come before B" = directed edge from A to B.',
      '❓  The question becomes: does this directed graph have a cycle? If yes → impossible to finish all courses.',
      '🎨  DFS with 3 states per node: 0 = not visited, 1 = currently visiting (in this DFS path), 2 = fully done.',
      '🔴  Cycle detected when: during DFS you reach a node that\'s already in state 1 (you\'re visiting it again in same path).',
      '✅  If all nodes reach state 2 without a cycle — return true.',
    ],
  },
  11: {
    pattern: 'BFS / DFS',
    learnOrder: 16,
    prereqs: 'Graph traversal, HashMap, recursion',
    steps: [
      '🗺️  You need to make a complete copy of the graph — all nodes AND all edges.',
      '📓  Use a HashMap<originalNode, cloneNode> to remember what you\'ve already cloned.',
      '🔁  Start DFS from the given node. Create a new clone node for it.',
      '👥  For each neighbor of the original: if it\'s not in the HashMap yet, recursively clone it. Then connect it to the current clone.',
      '🔁  The HashMap prevents infinite loops (graphs can have cycles) and tracks all clones.',
    ],
  },
  20: {
    pattern: 'Dynamic Programming',
    learnOrder: 17,
    prereqs: 'Basic loops, integer arrays',
    steps: [
      '🪙  You want the MINIMUM number of coins to make a target amount (unlimited supply of each coin).',
      '📋  Create dp[] of size (amount + 1). Set dp[0] = 0. Set everything else to a large number (infinity).',
      '🔁  For each amount from 1 to target: try every coin denomination.',
      '📐  For each coin: if coin ≤ current amount, then dp[amount] = min(dp[amount], dp[amount - coin] + 1).',
      '🏁  Return dp[amount]. If it\'s still "infinity", the amount can\'t be made.',
    ],
  },
  4: {
    pattern: 'Two Pointers',
    learnOrder: 18,
    prereqs: 'Two pointers pattern, min/max concepts',
    steps: [
      '💧  Each position can hold water = min(tallest wall to its left, tallest wall to its right) minus its own height.',
      '🔨  Brute force: for each index, scan left and right for tallest walls. O(n²) — too slow.',
      '👈👉  Better: use two pointers — left starts at 0, right starts at end.',
      '🧮  If left wall is shorter: water at left = leftMax - height[left]. Add to total. Move left pointer right.',
      '🔄  If right wall is shorter: water at right = rightMax - height[right]. Add to total. Move right pointer left.',
    ],
  },
  18: {
    pattern: 'Java Concurrency',
    learnOrder: 19,
    prereqs: 'Threads, synchronized keyword, while loops',
    steps: [
      '🏭  Producers add items to a shared buffer. Consumers take items from it. Buffer has a max size.',
      '🚦  Easy way (Java): use BlockingQueue — put() automatically BLOCKS when buffer is full. take() BLOCKS when empty.',
      '🔧  Manual way: use a synchronized block + while(!hasSpace) wait(). Then notify() after adding an item.',
      '⚠️  ALWAYS use while(condition) — not if — around wait(). Reason: "spurious wakeups" can happen.',
      '💡  In interview: show BlockingQueue first (production-ready), then offer to show wait/notify (demonstrates deeper knowledge).',
    ],
  },
  19: {
    pattern: 'BFS / DFS',
    learnOrder: 20,
    prereqs: 'Binary trees, BFS/DFS traversal, String operations',
    steps: [
      '📤  Serialize = convert the tree to a string you can store/send. Deserialize = rebuild the tree from that string.',
      '🔍  Pre-order DFS serialize: visit root → left → right. Write each node\'s value. Write "null" (or "N") for missing children.',
      '💡  The "null" markers are CRUCIAL — they tell you exactly where children are missing when you rebuild.',
      '📥  Deserialize: split the string by comma. Use a Queue<String> and process values one by one.',
      '🔁  For each value: if it\'s "null" return null; otherwise create a node, then recursively build its left and right.',
    ],
  },

  // ── NEW 2025–2026 QUESTIONS ──────────────────────
  21: {
    pattern: 'Sliding Window',
    learnOrder: 21,
    prereqs: 'Sliding window basics (Find All Anagrams), character frequency maps',
    steps: [
      '🎯  Goal: find the SMALLEST window in string s that contains ALL characters of string t.',
      '🗺️  First, count all characters needed from t in a frequency map. Note how many unique chars need to be "satisfied".',
      '👉  Expand the RIGHT pointer: add character to window. If its count now meets what t needs, increment "formed" counter.',
      '👈  When formed == total unique chars in t (window is valid): record size, then SHRINK from the LEFT to find smaller window.',
      '🔁  Keep shrinking left while window stays valid. Then expand right again. Repeat until right reaches end.',
      '📏  Answer = the shortest valid window recorded. (Jan 2026 Oracle ask)',
    ],
  },
  22: {
    pattern: 'Heap',
    learnOrder: 22,
    prereqs: 'Max-Heap concept, distance formula',
    steps: [
      '📍  Distance from origin = x² + y² (skip the sqrt — comparing squared values gives same result).',
      '🎯  Goal: keep only the k closest points from the full list.',
      '⛰️  Use a Max-Heap of size k — it always shows you the FARTHEST point among your current k candidates.',
      '🔁  For each new point: if heap has fewer than k points, just add it.',
      '🔄  If heap is already full: compare new point distance with heap top. If new point is CLOSER, pop the top and add new point.',
      '✅  After processing all points, the heap contains exactly the k closest ones. (Feb 2026 Oracle ask)',
    ],
  },
  23: {
    pattern: 'Sliding Window',
    learnOrder: 23,
    prereqs: 'Sliding window basics, Deque (double-ended queue concept)',
    steps: [
      '📊  Goal: for every window of size k sliding across the array, return the maximum value.',
      '🤔  Brute force: scan all k elements per window → O(n×k). Too slow for large inputs.',
      '📦  Smart approach: use a Deque (double-ended queue) that stores INDICES (not values).',
      '📐  Rule: deque always stays in decreasing order of VALUES — so deque.front = index of current maximum.',
      '🧹  Before adding index i: remove from the BACK any indices whose value ≤ nums[i] (they can never win again).',
      '🗑️  Remove from the FRONT any index that has slid out of the current window (index ≤ i − k).',
      '✅  deque.peekFirst() = window max. Record it once window reaches size k. (Mar 2026 Oracle ask)',
    ],
  },
  24: {
    pattern: 'Heap',
    learnOrder: 24,
    prereqs: 'Min-Heap and Max-Heap, average calculation',
    steps: [
      '🎯  Goal: after each number added, return the median of all numbers seen so far.',
      '💡  Key idea: split all numbers into two halves — a lower half and an upper half.',
      '⬇️  Lower half → Max-Heap (instantly gives the LARGEST of the small numbers).',
      '⬆️  Upper half → Min-Heap (instantly gives the SMALLEST of the large numbers).',
      '⚖️  After each insert, rebalance so the two heaps differ in size by at most 1.',
      '📊  Odd total → median = top of the bigger heap. Even total → median = average of both tops.',
      '💡  Java: new PriorityQueue<>(Collections.reverseOrder()) gives a Max-Heap. (Nov 2025 Oracle ask)',
    ],
  },
  25: {
    pattern: 'Backtracking',
    learnOrder: 25,
    prereqs: 'Recursion, basic string building',
    steps: [
      '🎯  Goal: generate all VALID bracket combinations for n pairs — like "(())", "()()" for n=2.',
      '🌿  Build the string one character at a time using recursion.',
      '📏  Rule 1: add "(" only if you\'ve used fewer than n opening brackets so far.',
      '📏  Rule 2: add ")" only if you have MORE "(" than ")" in the string so far (prevents premature closing).',
      '✅  Base case: when open count = n AND close count = n → string is complete and valid. Add to result list.',
      '🔁  These two rules automatically prune every invalid path — no extra check needed. (Dec 2025 Oracle ask)',
    ],
  },
}

export default function DSASection({ questions }) {
  const [viewMode, setViewMode] = useState('learn')          // 'learn' | 'frequency'
  const [diffFilter, setDiffFilter] = useState('All')
  const [topicFilter, setTopicFilter] = useState('All')      // pattern filter in learn mode
  const [expanded, setExpanded] = useState({})
  const [showPatternGuide, setShowPatternGuide] = useState(false)
  const { completed: done, toggle: toggleDone } = useProgress('oracle_dsa_done')

  const toggle = (id) => setExpanded((prev) => ({ ...prev, [id]: !prev[id] }))

  // Enrich questions with meta
  const enriched = questions.map((q) => ({ ...q, ...(QUESTION_META[q.id] || { pattern: 'Other', learnOrder: 99, prereqs: '', steps: [] }) }))

  // All pattern names for filter pills
  const allPatterns = ['All', ...Array.from(new Set(enriched.map((q) => q.pattern)))]

  // ── LEARN MODE: sorted by learnOrder, filtered by pattern & difficulty
  const learnList = enriched
    .filter((q) => {
      const pOk = topicFilter === 'All' || q.pattern === topicFilter
      const dOk = diffFilter === 'All' || q.difficulty === diffFilter
      return pOk && dOk
    })
    .sort((a, b) => a.learnOrder - b.learnOrder)

  // ── FREQUENCY MODE: sorted by frequencyScore
  const ALL_TOPICS = ['All Topics', 'Arrays', 'Tree', 'Graph', 'DP', 'Design', 'Java', 'String', 'Concurrency']
  const [freqTopic, setFreqTopic] = useState('All Topics')
  const freqList = enriched
    .filter((q) => {
      const dOk = diffFilter === 'All' || q.difficulty === diffFilter
      const tOk = freqTopic === 'All Topics' || q.topics.some((t) => t.includes(freqTopic) || freqTopic.includes(t.split(' ')[0]))
      return dOk && tOk
    })
    .sort((a, b) => b.frequencyScore - a.frequencyScore)

  const counts = { Easy: 0, Medium: 0, Hard: 0 }
  questions.forEach((q) => { if (counts[q.difficulty] !== undefined) counts[q.difficulty]++ })

  return (
    <div className="animate-fade-in">
      {/* ── Header ── */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-5">
        <div>
          <h2 className="text-xl font-bold text-gray-100">DSA Interview Questions</h2>
          <p className="text-sm text-gray-400 mt-0.5">
            {questions.length} questions · <span className="text-emerald-400 font-medium">{done.size} solved</span>
          </p>
        </div>
        <div className="flex gap-2">
          {Object.entries(counts).map(([d, n]) => (
            <span key={d} className={`text-xs font-semibold px-2.5 py-1 rounded-full border ${diffClass(d)}`}>{d}: {n}</span>
          ))}
        </div>
      </div>

      {/* ── View Mode Toggle ── */}
      <div className="flex items-center gap-2 p-1 bg-[#0F1724] border border-[#1C2A3A] rounded-xl w-fit mb-5">
        <button
          onClick={() => setViewMode('learn')}
          className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-semibold transition-all ${
            viewMode === 'learn' ? 'bg-[#1C2A3A] shadow text-purple-400' : 'text-gray-500 hover:text-gray-200'
          }`}
        >
          <Map size={14} /> Learning Path
        </button>
        <button
          onClick={() => setViewMode('frequency')}
          className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-semibold transition-all ${
            viewMode === 'frequency' ? 'bg-[#1C2A3A] shadow text-purple-400' : 'text-gray-500 hover:text-gray-200'
          }`}
        >
          <BarChart2 size={14} /> By Frequency
        </button>
      </div>

      {/* ════════════════════════════════════════════
          LEARNING PATH MODE
      ════════════════════════════════════════════ */}
      {viewMode === 'learn' && (
        <div>
          {/* How to approach any DSA problem */}
          <div className="card mb-5 overflow-hidden border-purple-800/30">
            <button
              onClick={() => setShowPatternGuide((p) => !p)}
              className="w-full flex items-center justify-between gap-3 p-4 hover:bg-purple-900/20 transition-colors"
            >
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-purple-600 rounded-lg flex items-center justify-center shrink-0">
                  <Lightbulb size={15} className="text-white" />
                </div>
                <div className="text-left">
                  <p className="font-semibold text-gray-100 text-sm">DSA Patterns Guide — Start Here If You're New</p>
                  <p className="text-xs text-gray-400 mt-0.5">8 core patterns behind ALL Oracle DSA questions. Understand patterns first, then solve problems.</p>
                </div>
              </div>
              {showPatternGuide
                ? <ChevronUp size={16} className="text-gray-400 shrink-0" />
                : <ChevronDown size={16} className="text-gray-400 shrink-0" />}
            </button>

            {showPatternGuide && (
              <div className="border-t border-[#1C2A3A] p-4 animate-fade-in">
                {/* General tips */}
                <div className="bg-amber-900/20 border border-amber-700/40 rounded-xl p-3 mb-4">
                  <p className="text-xs font-bold text-amber-400 mb-1">📌 How to approach ANY DSA problem (5-step method)</p>
                  <ol className="text-xs text-amber-200 space-y-0.5 list-decimal list-inside">
                    <li>Understand & restate — repeat the problem in your own words, ask clarifying questions</li>
                    <li>Examples — walk through 1–2 examples manually</li>
                    <li>Brute force first — state the simple O(n²) solution and its complexity</li>
                    <li>Optimize — identify the pattern (see below), improve to O(n) or O(n log n)</li>
                    <li>Code + test — write clean code, test edge cases (empty input, single element)</li>
                  </ol>
                </div>
                <div className="grid sm:grid-cols-2 gap-3">
                  {PATTERNS_GUIDE.map((p) => (
                    <div key={p.name} className={`rounded-xl border p-3 ${p.color}`}>
                      <p className="font-bold text-sm mb-1">{p.emoji} {p.name}</p>
                      <p className="text-xs leading-relaxed mb-1.5 opacity-90">{p.simple}</p>
                      <p className="text-xs font-semibold opacity-70">When to use: {p.when}</p>
                      <p className="text-xs opacity-60 mt-0.5">Examples: {p.example}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Filters */}
          <div className="flex flex-wrap gap-2 mb-4">
            <span className="text-xs text-gray-400 self-center">Difficulty:</span>
            {DIFFICULTIES.map((d) => (
              <button key={d} onClick={() => setDiffFilter(d)}
                className={`text-sm px-3 py-1 rounded-xl border font-medium transition-colors ${
                  diffFilter === d ? 'bg-purple-600 text-white border-purple-600' : 'bg-gray-800 text-gray-400 border-gray-700 hover:border-purple-500 hover:text-gray-200'
                }`}>
                {d}
              </button>
            ))}
          </div>
          <div className="flex flex-wrap gap-2 mb-5">
            <span className="text-xs text-gray-400 self-center">Pattern:</span>
            {allPatterns.map((p) => (
              <button key={p} onClick={() => setTopicFilter(p)}
                className={`text-sm px-3 py-1 rounded-xl border font-medium transition-colors ${
                  topicFilter === p ? 'bg-purple-900/40 text-purple-300 border-purple-600/50' : 'bg-gray-800 text-gray-400 border-gray-700 hover:border-purple-500 hover:text-gray-200'
                }`}>
                {p}
              </button>
            ))}
          </div>

          {learnList.length === 0 && (
            <div className="text-center py-16 text-gray-400">No questions match the selected filters.</div>
          )}

          {/* Learning Path list */}
          <div className="space-y-3">
            {learnList.map((q, idx) => {
              const isOpen = expanded[q.id]
              const isDone = done.has(String(q.id))
              const pg = PATTERNS_GUIDE.find((p) => p.name === q.pattern)
              return (
                <div key={q.id} className={`card overflow-hidden transition-all ${isDone ? 'border-emerald-800/50 bg-emerald-900/10' : ''}`}>
                  {/* Card header row */}
                  <div className="flex items-start gap-3 p-4">
                    {/* Learn order number */}
                    <div className={`w-9 h-9 rounded-xl flex items-center justify-center text-sm font-bold shrink-0 ${
                      isDone ? 'bg-emerald-500 text-white' : 'bg-purple-900/50 text-purple-300'
                    }`}>
                      {isDone ? <CheckCircle size={18} /> : `#${q.learnOrder}`}
                    </div>

                    <div className="flex-1 min-w-0">
                      {/* Title + badges */}
                      <div className="flex items-center gap-2 flex-wrap mb-1">
                        <span className={`text-xs font-semibold px-2 py-0.5 rounded-full border ${diffClass(q.difficulty)}`}>{q.difficulty}</span>
                        {pg && (
                          <span className={`text-xs font-medium px-2 py-0.5 rounded-full border ${pg.color}`}>
                            {pg.emoji} {q.pattern}
                          </span>
                        )}
                        {q.leetcodeNumber && <span className="text-xs text-gray-400">LC #{q.leetcodeNumber}</span>}
                      </div>
                      <h3 className={`font-semibold text-sm leading-snug ${isDone ? 'line-through text-gray-500' : 'text-gray-100'}`}>
                        {q.title}
                      </h3>
                      {/* Oracle frequency badge */}
                      <p className="text-xs text-gray-400 mt-0.5 flex items-center gap-1">
                        <Zap size={10} className="text-purple-400" />
                        Asked in {q.round} · {q.recentDate} · {freqLabel(q.frequencyScore).label}
                      </p>
                    </div>

                    {/* Expand/collapse */}
                    <button onClick={() => toggle(q.id)} className="shrink-0 text-gray-400 hover:text-gray-200 p-1">
                      {isOpen ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
                    </button>
                  </div>

                  {/* Expanded content */}
                  {isOpen && (
                    <div className="border-t border-[#1C2A3A] px-4 pb-4 pt-3 space-y-4 animate-fade-in">
                      {/* Prerequisite banner */}
                      {q.prereqs && (
                          <div className="flex items-start gap-2 bg-blue-900/30 border border-blue-700/40 rounded-xl px-3 py-2.5">
                          <Info size={13} className="text-blue-400 shrink-0 mt-0.5" />
                          <p className="text-xs text-blue-300"><span className="font-semibold">Before attempting this, make sure you know:</span> {q.prereqs}</p>
                        </div>
                      )}

                      {/* Step-by-step approach */}
                      {q.steps.length > 0 && (
                        <div>
                          <h4 className="text-xs font-bold text-gray-400 uppercase tracking-wide mb-2 flex items-center gap-1">
                            <Map size={11} className="text-purple-500" />
                            Step-by-Step Approach (Plain English)
                          </h4>
                          <ol className="space-y-2">
                            {q.steps.map((step, si) => (
                              <li key={si} className="flex items-start gap-2.5 text-sm text-gray-300 leading-relaxed">
                                <span className="w-5 h-5 rounded-full bg-purple-900/50 text-purple-300 text-xs flex items-center justify-center shrink-0 mt-0.5 font-bold">{si + 1}</span>
                                {step}
                              </li>
                            ))}
                          </ol>
                        </div>
                      )}

                      {/* Java tip */}
                      {q.javaNote && (
                          <div className="bg-amber-900/20 border border-amber-700/40 rounded-xl px-3 py-2.5">
                          <p className="text-xs font-bold text-amber-400 mb-1">Java-Specific Tip</p>
                          <p className="text-xs text-amber-200 leading-relaxed">{q.javaNote}</p>
                        </div>
                      )}

                      {/* Complexity */}
                      <div className="flex gap-4 text-xs text-gray-500">
                        <span><span className="font-semibold text-gray-400">Time:</span> {q.timeComplexity}</span>
                        <span><span className="font-semibold text-gray-400">Space:</span> {q.spaceComplexity}</span>
                      </div>

                      {/* Sources */}
                      {q.sourceLinks?.length > 0 && (
                        <div className="flex flex-wrap gap-2 text-xs">
                          <span className="font-semibold text-gray-400">Resources:</span>
                          {q.sourceLinks.map((s) => (
                            <a key={s.name} href={s.url} target="_blank" rel="noreferrer" className="text-purple-400 hover:underline">{s.name}</a>
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
                      {isDone ? 'Solved ✓' : 'Mark solved'}
                    </button>
                    {q.leetcodeLink && (
                      <a href={q.leetcodeLink} target="_blank" rel="noreferrer"
                        className="flex items-center gap-1 text-xs font-semibold text-purple-400 hover:text-purple-300 bg-purple-900/30 hover:bg-purple-900/50 px-3 py-1.5 rounded-lg transition-colors ml-auto">
                        <ExternalLink size={11} />Practice on LeetCode
                      </a>
                    )}
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      )}

      {/* ════════════════════════════════════════════
          FREQUENCY MODE (original grid view)
      ════════════════════════════════════════════ */}
      {viewMode === 'frequency' && (
        <div>
          {/* Filters */}
          <div className="flex flex-wrap gap-2 mb-4">
            {DIFFICULTIES.map((d) => (
              <button key={d} onClick={() => setDiffFilter(d)}
                className={`text-sm px-3.5 py-1.5 rounded-xl border font-medium transition-colors ${
                  diffFilter === d ? 'bg-purple-600 text-white border-purple-600' : 'bg-gray-800 text-gray-400 border-gray-700 hover:border-purple-500 hover:text-gray-200'
                }`}>
                {d}
              </button>
            ))}
            <div className="w-px bg-gray-700 mx-1" />
            {ALL_TOPICS.map((t) => (
              <button key={t} onClick={() => setFreqTopic(t)}
                className={`text-sm px-3.5 py-1.5 rounded-xl border font-medium transition-colors ${
                  freqTopic === t ? 'bg-purple-900/40 text-purple-300 border-purple-600/50' : 'bg-gray-800 text-gray-400 border-gray-700 hover:border-purple-500 hover:text-gray-200'
                }`}>
                {t}
              </button>
            ))}
          </div>

          {freqList.length === 0 && (
            <div className="text-center py-16 text-gray-400">No questions match the selected filters.</div>
          )}

          <div className="grid sm:grid-cols-2 xl:grid-cols-3 gap-4">
            {freqList.map((q) => {
              const freq = freqLabel(q.frequencyScore)
              const isOpen = expanded[q.id]
              const isDone = done.has(String(q.id))
              return (
                <div key={q.id} className={`card flex flex-col transition-all ${isDone ? 'border-emerald-800/50 bg-emerald-900/10' : ''}`}>
                  <div className="p-4 flex-1 flex flex-col gap-3">
                    <div className="flex items-start justify-between gap-2">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 flex-wrap mb-1">
                          <span className={`text-xs font-semibold px-2 py-0.5 rounded-full border ${diffClass(q.difficulty)}`}>{q.difficulty}</span>
                          {q.leetcodeNumber && <span className="text-xs text-gray-400">#{q.leetcodeNumber}</span>}
                        </div>
                        <h3 className="font-semibold text-gray-100 text-sm leading-snug">{q.title}</h3>
                      </div>
                    </div>
                    <div>
                      <div className="flex items-center justify-between mb-1">
                        <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${freq.color}`}>{freq.label}</span>
                        <span className="text-xs text-gray-400">{q.frequencyScore}%</span>
                      </div>
                      <div className="h-1.5 bg-gray-800 rounded-full overflow-hidden">
                        <div className="h-full rounded-full bg-gradient-to-r from-purple-400 to-purple-600 transition-all" style={{ width: `${q.frequencyScore}%` }} />
                      </div>
                    </div>
                    <div className="flex items-center gap-3 text-xs text-gray-500 flex-wrap">
                      <span className="flex items-center gap-1"><Clock size={11} />{q.round}</span>
                      <span className="flex items-center gap-1"><Zap size={11} />{q.recentDate}</span>
                    </div>
                    <div className="flex flex-wrap gap-1.5">
                      {q.topics.map((t) => (
                        <span key={t} className="flex items-center gap-1 text-xs bg-purple-900/30 text-purple-300 border border-purple-700/40 px-2 py-0.5 rounded-full">
                          <Tag size={9} />{t}
                        </span>
                      ))}
                    </div>
                    {q.javaNote && (
                      <div className="bg-amber-900/20 border border-amber-700/40 rounded-lg px-3 py-2 text-xs text-amber-200 leading-relaxed">{q.javaNote}</div>
                    )}
                    {isOpen && (
                      <div className="border-t border-[#1C2A3A] pt-3 space-y-2 text-xs text-gray-400">
                        <p><span className="font-semibold text-gray-300">Problem:</span> {q.description}</p>
                        <p><span className="font-semibold text-gray-300">Approach:</span> {q.approach}</p>
                        <div className="flex gap-4">
                          <span><span className="font-semibold">Time:</span> {q.timeComplexity}</span>
                          <span><span className="font-semibold">Space:</span> {q.spaceComplexity}</span>
                        </div>
                        {q.sourceLinks?.length > 0 && (
                          <div className="flex flex-wrap gap-2 pt-1">
                            <span className="font-semibold text-gray-300">Sources:</span>
                            {q.sourceLinks.map((s) => (
                              <a key={s.name} href={s.url} target="_blank" rel="noreferrer" className="text-purple-400 hover:underline">{s.name}</a>
                            ))}
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                  <div className="px-4 pb-3 flex items-center gap-2 border-t border-[#1C2A3A] pt-3">
                    <button
                      onClick={() => toggleDone(String(q.id))}
                      className={`flex items-center gap-1 text-xs font-semibold px-3 py-1.5 rounded-lg transition-colors ${
                        isDone ? 'bg-emerald-900/40 text-emerald-300 hover:bg-emerald-800/50' : 'bg-gray-800 text-gray-400 hover:bg-purple-900/30 hover:text-purple-300'
                      }`}
                    >
                      {isDone ? <CheckCircle size={11} /> : <Circle size={11} />}
                      {isDone ? 'Done' : 'Mark done'}
                    </button>
                    {q.leetcodeLink && (
                      <a href={q.leetcodeLink} target="_blank" rel="noreferrer"
                        className="flex items-center gap-1 text-xs font-semibold text-purple-400 hover:text-purple-300 bg-purple-900/30 hover:bg-purple-900/50 px-3 py-1.5 rounded-lg transition-colors">
                        <ExternalLink size={11} />LeetCode
                      </a>
                    )}
                    <button onClick={() => toggle(q.id)} className="flex items-center gap-1 text-xs text-gray-500 hover:text-gray-300 ml-auto">
                      {isOpen ? <><ChevronUp size={14} />Less</> : <><ChevronDown size={14} />Details</>}
                    </button>
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      )}
    </div>
  )
}
