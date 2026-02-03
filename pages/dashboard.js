'use client'

import { useEffect, useState } from 'react'
import { supabase } from '../lib/supabase'

const questions = [
  {
    id: 'q1',
    a: "AI가 다 해줘서 새로운 연구를 할 수 없는 미래",
    b: "AI는 없지만 노벨상 받기 쉬운 과거"
  },
  {
    id: 'q2',
    a: "아인슈타인처럼 물리학 하나만 미친듯이 파기",
    b: "르네상스맨처럼 그림, 과학, 음악 다 하기"
  },
  {
    id: 'q3',
    a: "'젊은 베르테르의 슬픔' 읽으면서 눈물 흘리기",
    b: "괴테 책 읽는 친구의 안구운동과 뇌파 측정하기"
  },
  {
    id: 'q4',
    a: "주인공 버프 받고 세계여행하며 레벨업 (고난과 역경 多)",
    b: "평화로운 마을 NPC로 안정적으로 살기"
  },
  {
    id: 'q5',
    a: "내가 사랑하는 문학 하며 매일 라면 먹기",
    b: "내가 죽도록 싫어하는 코딩 하며 스테이크 먹기"
  }
]

export default function Dashboard() {
  const [allCounts, setAllCounts] = useState(
    questions.reduce((acc, q) => ({ ...acc, [q.id]: { a: 0, b: 0 } }), {})
  )
  const [loading, setLoading] = useState(true)
  const [lastUpdated, setLastUpdated] = useState(null)

  const fetchAll = async () => {
    try {
      const { data } = await supabase.from('balance_game').select('*')
      if (data) {
        const map = {}
        data.forEach(row => {
          map[row.id] = { a: row.option_a_count || 0, b: row.option_b_count || 0 }
        })
        setAllCounts(prev => ({ ...prev, ...map }))
        setLastUpdated(new Date())
      }
    } catch (e) {
      console.error(e)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchAll()
    const interval = setInterval(fetchAll, 2000)
    return () => clearInterval(interval)
  }, [])

  const totalVoters = Object.values(allCounts).reduce((sum, c) => sum + c.a + c.b, 0)

  const getPercent = (val, total) => total === 0 ? 50 : Math.round((val / total) * 100)

  // 가장 인기있는 질문 (총 투표수 기준)
  const mostPopularQ = questions.reduce((max, q) => {
    const total = (allCounts[q.id]?.a || 0) + (allCounts[q.id]?.b || 0)
    const maxTotal = (allCounts[max.id]?.a || 0) + (allCounts[max.id]?.b || 0)
    return total > maxTotal ? q : max
  }, questions[0])

  // 가장 치열한 질문 (퍼센트 차이가 가장 작은 질문)
  const closestQ = questions.reduce((min, q) => {
    const total = (allCounts[q.id]?.a || 0) + (allCounts[q.id]?.b || 0)
    const minTotal = (allCounts[min.id]?.a || 0) + (allCounts[min.id]?.b || 0)
    if (total === 0) return min
    if (minTotal === 0) return q
    const diff = Math.abs((allCounts[q.id]?.a || 0) - (allCounts[q.id]?.b || 0))
    const minDiff = Math.abs((allCounts[min.id]?.a || 0) - (allCounts[min.id]?.b || 0))
    return diff < minDiff ? q : min
  }, questions[0])

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-950 flex items-center justify-center">
        <div className="text-white text-xl">로딩중...</div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-950 text-white" style={{ fontFamily: "'Trebuchet MS', sans-serif" }}>

      {/* 배경 그리드 패턴 */}
      <div className="fixed inset-0 opacity-[0.03]" style={{
        backgroundImage: 'linear-gradient(rgba(255,255,255,0.4) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.4) 1px, transparent 1px)',
        backgroundSize: '40px 40px'
      }} />

      <div className="relative z-10 max-w-5xl mx-auto px-4 py-8 md:px-6 md:py-12">

        {/* 헤더 */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl md:text-4xl font-black tracking-tight">
              밸런스 게임
              <span className="text-transparent bg-clip-text" style={{
                backgroundImage: 'linear-gradient(90deg, #f87171, #a78bfa, #60a5fa)'
              }}> DASHBOARD</span>
            </h1>
            <p className="text-gray-500 text-sm mt-1">실시간 투표 결과</p>
          </div>

          {/* LIVE 배지 */}
          <div className="flex items-center gap-2 bg-gray-900 border border-gray-800 rounded-full px-4 py-2">
            <span className="w-2.5 h-2.5 rounded-full bg-red-500" style={{
              animation: 'pulse 1.5s ease-in-out infinite',
              boxShadow: '0 0 6px rgba(239,68,68,0.8)'
            }}></span>
            <span className="text-red-400 font-bold text-sm tracking-widest">LIVE</span>
          </div>
        </div>

        {/* 상단 통계 카드 로운 */}
        <div className="grid grid-cols-3 gap-3 md:gap-4 mb-8">
          {/* 총 참여자 */}
          <div className="bg-gray-900 border border-gray-800 rounded-2xl p-4 md:p-5">
            <p className="text-gray-500 text-xs uppercase tracking-wider mb-1">총 참여자</p>
            <p className="text-2xl md:text-3xl font-black text-white">{totalVoters.toLocaleString()}<span className="text-gray-600 text-base font-normal ml-1">명</span></p>
          </div>
          {/* 질문 수 */}
          <div className="bg-gray-900 border border-gray-800 rounded-2xl p-4 md:p-5">
            <p className="text-gray-500 text-xs uppercase tracking-wider mb-1">질문 수</p>
            <p className="text-2xl md:text-3xl font-black text-white">{questions.length}<span className="text-gray-600 text-base font-normal ml-1">개</span></p>
          </div>
          {/* 업데이트 시간 */}
          <div className="bg-gray-900 border border-gray-800 rounded-2xl p-4 md:p-5">
            <p className="text-gray-500 text-xs uppercase tracking-wider mb-1">업데이트</p>
            <p className="text-sm md:text-base font-bold text-emerald-400">
              {lastUpdated ? lastUpdated.toLocaleTimeString('ko-KR', { hour: '2-digit', minute: '2-digit', second: '2-digit' }) : '-'}
            </p>
          </div>
        </div>

        {/* 하이라이트 카드 행 */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 md:gap-4 mb-8">
          {/* 가장 인기있는 질문 */}
          <div className="rounded-2xl p-4 md:p-5 border" style={{
            background: 'linear-gradient(135deg, rgba(239,68,68,0.1), rgba(147,51,234,0.08))',
            borderColor: 'rgba(239,68,68,0.25)'
          }}>
            <div className="flex items-center gap-2 mb-2">
              <span className="text-lg">🔥</span>
              <span className="text-xs text-red-400 font-bold uppercase tracking-wider">가장 인기있는 질문</span>
            </div>
            <p className="text-sm text-gray-300 font-semibold leading-snug">
              {(() => {
                const c = allCounts[mostPopularQ.id]
                const winner = (c?.a || 0) >= (c?.b || 0) ? mostPopularQ.a : mostPopularQ.b
                return winner
              })()}
            </p>
            <p className="text-xs text-gray-600 mt-1.5">
              {(allCounts[mostPopularQ.id]?.a || 0) + (allCounts[mostPopularQ.id]?.b || 0)}명 참여 · Q{questions.findIndex(q => q.id === mostPopularQ.id) + 1}
            </p>
          </div>

          {/* 가장 치열한 질문 */}
          <div className="rounded-2xl p-4 md:p-5 border" style={{
            background: 'linear-gradient(135deg, rgba(59,130,246,0.1), rgba(16,185,129,0.08))',
            borderColor: 'rgba(59,130,246,0.25)'
          }}>
            <div className="flex items-center gap-2 mb-2">
              <span className="text-lg">⚔️</span>
              <span className="text-xs text-blue-400 font-bold uppercase tracking-wider">가장 치열한 질문</span>
            </div>
            <p className="text-sm text-gray-300 font-semibold leading-snug">
              {(() => {
                const c = allCounts[closestQ.id]
                const pA = getPercent(c?.a || 0, (c?.a || 0) + (c?.b || 0))
                const pB = getPercent(c?.b || 0, (c?.a || 0) + (c?.b || 0))
                return `${pA}% vs ${pB}%`
              })()}
            </p>
            <p className="text-xs text-gray-600 mt-1.5">
              {(allCounts[closestQ.id]?.a || 0) + (allCounts[closestQ.id]?.b || 0)}명 참여 · Q{questions.findIndex(q => q.id === closestQ.id) + 1}
            </p>
          </div>
        </div>

        {/* 질문별 결과 카드 */}
        <div className="flex flex-col gap-3 md:gap-4">
          {questions.map((q, idx) => {
            const counts = allCounts[q.id] || { a: 0, b: 0 }
            const total = counts.a + counts.b
            const pA = getPercent(counts.a, total)
            const pB = getPercent(counts.b, total)
            const winnerIsA = pA >= pB

            return (
              <div key={q.id} className="bg-gray-900 border border-gray-800 rounded-2xl overflow-hidden">
                {/* 질문 번호 헤더 */}
                <div className="flex items-center justify-between px-5 pt-4 pb-2">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-black text-gray-600 bg-gray-800 rounded-lg px-2.5 py-0.5">
                      Q{idx + 1}
                    </span>
                    <span className="text-xs text-gray-600">{total.toLocaleString()}명 참여</span>
                  </div>
                  {/* 승자 배지 */}
                  {total > 0 && (
                    <span className="text-xs font-bold px-2.5 py-0.5 rounded-full" style={{
                      background: winnerIsA ? 'rgba(239,68,68,0.15)' : 'rgba(59,130,246,0.15)',
                      color: winnerIsA ? '#f87171' : '#60a5fa'
                    }}>
                      {winnerIsA ? 'A 승' : 'B 승'} · {winnerIsA ? pA : pB}%
                    </span>
                  )}
                </div>

                {/* 옵션 텍스트 & 퍼센트 */}
                <div className="px-5 pb-3 flex justify-between items-end gap-4">
                  <p className={`text-sm leading-snug flex-1 ${winnerIsA ? 'text-red-400 font-semibold' : 'text-gray-500'}`}>
                    {q.a}
                  </p>
                  <span className="text-xs text-gray-600 whitespace-nowrap">VS</span>
                  <p className={`text-sm leading-snug flex-1 text-right ${!winnerIsA ? 'text-blue-400 font-semibold' : 'text-gray-500'}`}>
                    {q.b}
                  </p>
                </div>

                {/* 퍼센트 숫자 행 */}
                <div className="px-5 pb-2 flex justify-between">
                  <span className={`text-lg font-black ${winnerIsA ? 'text-red-400' : 'text-gray-600'}`}>{pA}%</span>
                  <span className={`text-lg font-black ${!winnerIsA ? 'text-blue-400' : 'text-gray-600'}`}>{pB}%</span>
                </div>

                {/* 분할 바 */}
                <div className="flex h-3 overflow-hidden">
                  <div
                    className="h-full transition-all duration-700 ease-out"
                    style={{
                      width: `${pA}%`,
                      background: 'linear-gradient(90deg, #dc2626, #ef4444)'
                    }}
                  />
                  <div
                    className="h-full transition-all duration-700 ease-out"
                    style={{
                      width: `${pB}%`,
                      background: 'linear-gradient(90deg, #3b82f6, #60a5fa)'
                    }}
                  />
                </div>

                {/* 투표 수 행 */}
                <div className="px-5 py-2.5 flex justify-between">
                  <span className="text-xs text-gray-600">{counts.a.toLocaleString()}票</span>
                  <span className="text-xs text-gray-600">{counts.b.toLocaleString()}票</span>
                </div>
              </div>
            )
          })}
        </div>

        {/* 하단 안내 */}
        <p className="text-center text-gray-700 text-xs mt-8">2초 간격으로 자동 업데이트됩니다</p>
      </div>

      {/* 펄스 키프레임 */}
      <style>{`
        @keyframes pulse {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.4; }
        }
      `}</style>
    </div>
  )
}
