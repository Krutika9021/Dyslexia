import React from 'react'
import { Link } from 'react-router-dom'
import {
  Brain,
  User,
  LogOut,
  Moon,
  Sun,
  Trophy,
  Target,
  TrendingUp,
  Zap,
  BookOpen,
  FileText,
  Download,
  BarChart2,
  GraduationCap,
  AlertTriangle,
  ArrowUp,
  ArrowDown,
  Minus,
} from 'lucide-react'

import { useAuth } from '../contexts/AuthContext'
import { useTheme } from '../contexts/ThemeContext'

/* ── Mock data ─────────────────────────────────────────── */

const MOCK_PARENT = {
  name: 'Sarah Johnson',
}

const MOCK_CHILD = {
  name: 'Alex Johnson',
  age: 9,
  grade: 'Grade 3',
  avatar: 'AJ',
}

const MOCK_STATS = {
  gamesPlayed: 24,
  averageScore: 78,
  readingSpeed: 92,
  riskLevel: 'Low',
  dailyStreak: 5,
}

const MOCK_PROGRESS = [
  { id: 1, game: 'Word Recognition',     level: 4, mastery: 82, avgScore: 84 },
  { id: 2, game: 'Letter Sequencing',    level: 3, mastery: 71, avgScore: 73 },
  { id: 3, game: 'Letter Mirror',        level: 2, mastery: 58, avgScore: 61 },
  { id: 4, game: 'Speed Words',          level: 3, mastery: 65, avgScore: 67 },
  { id: 5, game: 'Sound Twins',          level: 4, mastery: 79, avgScore: 80 },
  { id: 6, game: 'Reading Comprehension',level: 3, mastery: 88, avgScore: 90 },
]

const MOCK_TRENDS = [
  { label: 'Weekly Improvement',  value: +6,  suffix: '%' },
  { label: 'Monthly Improvement', value: +18, suffix: '%' },
]

const MOCK_TREND_CARDS = [
  {
    id: 1,
    period: 'Weekly Improvement',
    improvement: +6,
    avgScore: 81,
    gamesCompleted: 7,
    readingSpeed: 96,
  },
  {
    id: 2,
    period: 'Monthly Improvement',
    improvement: +18,
    avgScore: 78,
    gamesCompleted: 24,
    readingSpeed: 92,
  },
]

const MOCK_RECENT = [
  { id: 1, game: 'Word Recognition',        score: 85, total: 100, date: '2024-06-10', difficulty: 'Medium' },
  { id: 2, game: 'Letter Sequencing',        score: 70, total: 100, date: '2024-06-09', difficulty: 'Easy'   },
  { id: 3, game: 'Reading Comprehension',    score: 90, total: 100, date: '2024-06-08', difficulty: 'Hard'   },
  { id: 4, game: 'Speed Words',              score: 65, total: 100, date: '2024-06-07', difficulty: 'Medium' },
  { id: 5, game: 'Sound Twins',              score: 80, total: 100, date: '2024-06-06', difficulty: 'Easy'   },
]

/* ── Helpers ────────────────────────────────────────────── */

const riskColor = (level: string) => {
  if (level === 'Low')    return 'text-green-600'
  if (level === 'Medium') return 'text-yellow-600'
  return 'text-red-600'
}

const riskBg = (level: string) => {
  if (level === 'Low')    return 'bg-green-50 border-green-200 dark:bg-green-900/20 dark:border-green-800'
  if (level === 'Medium') return 'bg-yellow-50 border-yellow-200 dark:bg-yellow-900/20 dark:border-yellow-800'
  return 'bg-red-50 border-red-200 dark:bg-red-900/20 dark:border-red-800'
}

const scoreColor = (pct: number) => {
  if (pct >= 80) return 'text-green-600'
  if (pct >= 60) return 'text-yellow-600'
  return 'text-red-600'
}

const masteryBg = (pct: number) => {
  if (pct >= 80) return 'bg-green-500'
  if (pct >= 60) return 'bg-yellow-500'
  return 'bg-red-400'
}

/* ── Component ──────────────────────────────────────────── */

const ParentDashboard: React.FC = () => {
  const { user, signOut } = useAuth()
  const { isDark, toggleTheme } = useTheme()

  const welcomeName = user?.username
    ? `${user.username.charAt(0).toUpperCase()}${user.username.slice(1)}`
    : MOCK_PARENT.name

  return (
    <div className="min-h-screen gradient-bg">

      {/* ── Navbar ── */}
      <nav className="bg-white/90 dark:bg-gray-900/90 backdrop-blur-md border-b border-gray-100 dark:border-gray-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">

            <div className="flex items-center space-x-2">
              <Brain className="w-8 h-8 text-primary-600" />
              <span className="text-xl font-bold text-gray-900 dark:text-white">Dyslyze</span>
            </div>

            <div className="flex items-center space-x-3">
              <span className="text-gray-600 dark:text-gray-300 hidden sm:block text-sm">
                Welcome, {welcomeName}
              </span>

              <button onClick={toggleTheme} className="btn btn-ghost btn-sm">
                {isDark ? <Sun size={18} /> : <Moon size={18} />}
              </button>

              <Link to="/dashboard" className="btn btn-outline btn-sm">
                <User size={16} className="mr-2" />
                Student View
              </Link>

              <button onClick={signOut} className="btn btn-ghost btn-sm">
                <LogOut size={16} className="mr-2" />
                Sign Out
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* ── Page body ── */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">

        {/* ── 1. Parent Profile Header ── */}
        <div className="card p-6 sm:p-8">
          <div className="flex flex-col sm:flex-row items-center sm:items-start gap-6">

            {/* Parent avatar */}
            <div className="w-20 h-20 rounded-full bg-gradient-to-br from-primary-500 to-secondary-500 flex items-center justify-center shrink-0">
              <User className="w-10 h-10 text-white" />
            </div>

            <div className="flex-1 text-center sm:text-left">
              <p className="text-sm text-gray-500 dark:text-gray-400 mb-1">Parent Account</p>
              <h1 className="text-2xl font-bold text-gray-900 dark:text-white">{MOCK_PARENT.name}</h1>

              {/* Child info pill row */}
              <div className="flex flex-wrap justify-center sm:justify-start gap-3 mt-4">
                <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-primary-50 dark:bg-primary-900/20 border border-primary-200 dark:border-primary-800">
                  <div className="w-7 h-7 rounded-full bg-gradient-to-br from-primary-400 to-secondary-400 flex items-center justify-center text-white text-xs font-bold">
                    {MOCK_CHILD.avatar}
                  </div>
                  <span className="text-sm font-semibold text-primary-700 dark:text-primary-300">{MOCK_CHILD.name}</span>
                </div>

                <div className="flex items-center gap-1.5 px-4 py-2 rounded-full bg-gray-100 dark:bg-gray-800 border border-gray-200 dark:border-gray-700">
                  <GraduationCap size={14} className="text-gray-500 dark:text-gray-400" />
                  <span className="text-sm text-gray-700 dark:text-gray-300">{MOCK_CHILD.grade}</span>
                </div>

                <div className="flex items-center gap-1.5 px-4 py-2 rounded-full bg-gray-100 dark:bg-gray-800 border border-gray-200 dark:border-gray-700">
                  <User size={14} className="text-gray-500 dark:text-gray-400" />
                  <span className="text-sm text-gray-700 dark:text-gray-300">Age {MOCK_CHILD.age}</span>
                </div>
              </div>
            </div>

            {/* Risk badge */}
            <div className={`flex items-center gap-2 px-4 py-2 rounded-xl border text-sm font-semibold shrink-0 ${riskBg(MOCK_STATS.riskLevel)}`}>
              <AlertTriangle size={15} className={riskColor(MOCK_STATS.riskLevel)} />
              <span className={riskColor(MOCK_STATS.riskLevel)}>
                {MOCK_STATS.riskLevel} Risk
              </span>
            </div>
          </div>
        </div>

        {/* ── 2. Overview Cards ── */}
        <div>
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Overview</h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">

            <div className="card p-5 text-center card-hover">
              <div className="w-10 h-10 rounded-xl bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center mx-auto mb-3">
                <Trophy className="w-5 h-5 text-blue-600" />
              </div>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">{MOCK_STATS.gamesPlayed}</p>
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">Games Played</p>
            </div>

            <div className="card p-5 text-center card-hover">
              <div className="w-10 h-10 rounded-xl bg-green-100 dark:bg-green-900/30 flex items-center justify-center mx-auto mb-3">
                <Target className="w-5 h-5 text-green-600" />
              </div>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">{MOCK_STATS.averageScore}%</p>
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">Average Score</p>
            </div>

            <div className="card p-5 text-center card-hover">
              <div className="w-10 h-10 rounded-xl bg-purple-100 dark:bg-purple-900/30 flex items-center justify-center mx-auto mb-3">
                <TrendingUp className="w-5 h-5 text-purple-600" />
              </div>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">{MOCK_STATS.readingSpeed}<span className="text-sm font-normal ml-1">wpm</span></p>
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">Reading Speed</p>
            </div>

            <div className="card p-5 text-center card-hover">
              <div className={`w-10 h-10 rounded-xl flex items-center justify-center mx-auto mb-3 ${
                MOCK_STATS.riskLevel === 'Low' ? 'bg-green-100 dark:bg-green-900/30' :
                MOCK_STATS.riskLevel === 'Medium' ? 'bg-yellow-100 dark:bg-yellow-900/30' :
                'bg-red-100 dark:bg-red-900/30'
              }`}>
                <AlertTriangle className={`w-5 h-5 ${riskColor(MOCK_STATS.riskLevel)}`} />
              </div>
              <p className={`text-2xl font-bold ${riskColor(MOCK_STATS.riskLevel)}`}>{MOCK_STATS.riskLevel}</p>
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">Risk Level</p>
            </div>

            <div className="card p-5 text-center card-hover col-span-2 sm:col-span-1">
              <div className="w-10 h-10 rounded-xl bg-orange-100 dark:bg-orange-900/30 flex items-center justify-center mx-auto mb-3">
                <Zap className="w-5 h-5 text-orange-500" />
              </div>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">{MOCK_STATS.dailyStreak}</p>
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">Daily Streak</p>
            </div>

          </div>
        </div>

        {/* ── 3. Quick Actions ── */}
        <div>
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Quick Actions</h2>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">

            <button className="card p-6 text-left card-hover group focus:outline-none focus:ring-2 focus:ring-primary-500">
              <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-primary-500 to-primary-600 flex items-center justify-center mb-4 group-hover:scale-105 transition-transform duration-200">
                <FileText className="w-6 h-6 text-white" />
              </div>
              <p className="font-semibold text-gray-900 dark:text-white">View Child Report</p>
              <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">Full assessment and dyslexia analysis</p>
            </button>

            <button className="card p-6 text-left card-hover group focus:outline-none focus:ring-2 focus:ring-secondary-500">
              <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-secondary-500 to-secondary-600 flex items-center justify-center mb-4 group-hover:scale-105 transition-transform duration-200">
                <BarChart2 className="w-6 h-6 text-white" />
              </div>
              <p className="font-semibold text-gray-900 dark:text-white">View Progress</p>
              <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">Scores, trends, and game history</p>
            </button>

            <button className="card p-6 text-left card-hover group focus:outline-none focus:ring-2 focus:ring-success-500">
              <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-success-500 to-success-600 flex items-center justify-center mb-4 group-hover:scale-105 transition-transform duration-200">
                <Download className="w-6 h-6 text-white" />
              </div>
              <p className="font-semibold text-gray-900 dark:text-white">Download Report</p>
              <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">Export PDF summary for teachers</p>
            </button>

          </div>
        </div>

        {/* ── 4. Learning Progress ── */}
        <div>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Learning Progress</h2>
            <div className="flex gap-3">
              {MOCK_TRENDS.map((t) => (
                <div
                  key={t.label}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-gray-50 dark:bg-gray-800/60 border border-gray-200 dark:border-gray-700"
                >
                  {t.value > 0
                    ? <ArrowUp size={13} className="text-green-500 shrink-0" />
                    : t.value < 0
                    ? <ArrowDown size={13} className="text-red-500 shrink-0" />
                    : <Minus size={13} className="text-gray-400 shrink-0" />
                  }
                  <span className="text-xs font-semibold text-gray-700 dark:text-gray-300">
                    {t.value > 0 ? '+' : ''}{t.value}{t.suffix}
                  </span>
                  <span className="text-xs text-gray-400 dark:text-gray-500 hidden sm:inline">{t.label}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-3 xl:grid-cols-6 gap-3">
            {MOCK_PROGRESS.map((g) => (
              <div key={g.id} className="card p-4 card-hover flex flex-col gap-2">
                {/* Game name */}
                <div className="flex items-start gap-2">
                  <div className="w-7 h-7 rounded-lg bg-primary-100 dark:bg-primary-900/30 flex items-center justify-center shrink-0 mt-0.5">
                    <BookOpen className="w-3.5 h-3.5 text-primary-600" />
                  </div>
                  <p className="text-xs font-semibold text-gray-800 dark:text-gray-200 leading-snug">{g.game}</p>
                </div>

                {/* Level + Mastery row */}
                <div className="flex items-center justify-between">
                  <span className="text-xs text-gray-500 dark:text-gray-400">Level</span>
                  <span className="text-sm font-bold text-gray-900 dark:text-white">{g.level}</span>
                </div>

                {/* Mastery bar */}
                <div>
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-xs text-gray-500 dark:text-gray-400">Mastery</span>
                    <span className={`text-xs font-bold ${scoreColor(g.mastery)}`}>{g.mastery}%</span>
                  </div>
                  <div className="h-1.5 w-full rounded-full bg-gray-100 dark:bg-gray-700 overflow-hidden">
                    <div
                      className={`h-full rounded-full ${masteryBg(g.mastery)}`}
                      style={{ width: `${g.mastery}%` }}
                    />
                  </div>
                </div>

                {/* Avg score */}
                <div className="flex items-center justify-between pt-0.5 border-t border-gray-100 dark:border-gray-700/50">
                  <span className="text-xs text-gray-500 dark:text-gray-400">Avg Score</span>
                  <span className={`text-xs font-semibold ${scoreColor(g.avgScore)}`}>{g.avgScore}%</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* ── 5. Progress Trends ── */}
        <div>
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Progress Trends</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {MOCK_TREND_CARDS.map((t) => (
              <div key={t.id} className="card p-5 card-hover">

                {/* Card header */}
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-lg bg-primary-100 dark:bg-primary-900/30 flex items-center justify-center">
                      <TrendingUp className="w-4 h-4 text-primary-600" />
                    </div>
                    <span className="text-sm font-semibold text-gray-800 dark:text-gray-200">{t.period}</span>
                  </div>
                  <div className={`flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-bold ${
                    t.improvement > 0
                      ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400'
                      : t.improvement < 0
                      ? 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400'
                      : 'bg-gray-100 text-gray-600 dark:bg-gray-700 dark:text-gray-400'
                  }`}>
                    {t.improvement > 0
                      ? <ArrowUp size={11} />
                      : t.improvement < 0
                      ? <ArrowDown size={11} />
                      : <Minus size={11} />}
                    {t.improvement > 0 ? '+' : ''}{t.improvement}%
                  </div>
                </div>

                {/* Stats grid */}
                <div className="grid grid-cols-3 gap-3">
                  <div className="bg-gray-50 dark:bg-gray-800/50 rounded-xl p-3 text-center">
                    <p className={`text-lg font-bold ${scoreColor(t.avgScore)}`}>{t.avgScore}%</p>
                    <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">Avg Score</p>
                  </div>
                  <div className="bg-gray-50 dark:bg-gray-800/50 rounded-xl p-3 text-center">
                    <p className="text-lg font-bold text-gray-900 dark:text-white">{t.gamesCompleted}</p>
                    <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">Games</p>
                  </div>
                  <div className="bg-gray-50 dark:bg-gray-800/50 rounded-xl p-3 text-center">
                    <p className="text-lg font-bold text-gray-900 dark:text-white">{t.readingSpeed}<span className="text-xs font-normal ml-0.5">wpm</span></p>
                    <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">Reading</p>
                  </div>
                </div>

              </div>
            ))}
          </div>
        </div>

        {/* ── 6. Recent Activity ── */}
        <div>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Recent Activity</h2>
            <span className="text-xs text-gray-400 dark:text-gray-500">Last 5 sessions</span>
          </div>

          <div className="card overflow-hidden">
            {/* Table header — hidden on mobile */}
            <div className="hidden sm:grid grid-cols-4 gap-4 px-6 py-3 bg-gray-50 dark:bg-gray-800/50 border-b border-gray-100 dark:border-gray-700 text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide">
              <span>Game</span>
              <span>Difficulty</span>
              <span>Date</span>
              <span className="text-right">Score</span>
            </div>

            <div className="divide-y divide-gray-100 dark:divide-gray-700/50">
              {MOCK_RECENT.map((session) => (
                <div
                  key={session.id}
                  className="flex flex-col sm:grid sm:grid-cols-4 gap-1 sm:gap-4 px-6 py-4 hover:bg-gray-50 dark:hover:bg-gray-800/30 transition-colors duration-150"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg bg-primary-100 dark:bg-primary-900/30 flex items-center justify-center shrink-0">
                      <BookOpen className="w-4 h-4 text-primary-600" />
                    </div>
                    <span className="font-medium text-gray-900 dark:text-white text-sm">{session.game}</span>
                  </div>

                  <div className="flex items-center sm:block pl-11 sm:pl-0">
                    <span className={`inline-block px-2.5 py-0.5 rounded-full text-xs font-medium ${
                      session.difficulty === 'Easy'   ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400' :
                      session.difficulty === 'Medium' ? 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400' :
                      'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400'
                    }`}>
                      {session.difficulty}
                    </span>
                  </div>

                  <div className="flex items-center pl-11 sm:pl-0">
                    <span className="text-sm text-gray-500 dark:text-gray-400">
                      {new Date(session.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                    </span>
                  </div>

                  <div className="flex items-center sm:justify-end pl-11 sm:pl-0">
                    <span className={`text-sm font-semibold ${scoreColor(session.score)}`}>
                      {session.score}%
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

      </div>
    </div>
  )
}

export default ParentDashboard
