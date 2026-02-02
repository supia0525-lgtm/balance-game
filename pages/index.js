'use client'

import { useEffect, useState, useCallback, useRef } from 'react'
import { supabase } from '../lib/supabase'

export default function BalanceGame() {
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

  const [currentIdx, setCurrentIdx] = useState(0)
  const [counts, setCounts] = useState({ a: 0, b: 0 })
  const [voted, setVoted] = useState(null)
  const [loading, setLoading] = useState(true)
  const [isVoting, setIsVoting] = useState(false)
  const [totalVoters, setTotalVoters] = useState(0)
  
  const currentQ = questions[currentIdx]

  // 로컬 스토리지에서 투표 기록 로드
  const loadUserVotes = useCallback(() => {
    const saved = localStorage.getItem('balance_votes')
    return saved ? JSON.parse(saved) : {}
  }, [])

  // 투표 기록 저장
  const saveUserVote = useCallback((questionId, choice) => {
    const votes = loadUserVotes()
    votes[questionId] = choice
    localStorage.setItem('balance_votes', JSON.stringify(votes))
  }, [loadUserVotes])

  // 데이터 로드 함수
  const loadData = useCallback(async () => {
    try {
      const { data, error } = await supabase
        .from('balance_game')
        .select('*')
        .eq('id', currentQ.id)
        .single()

      if (error) {
        console.error('Error loading data:', error)
        setCounts({ a: 0, b: 0 })
      } else if (data) {
        setCounts({ 
          a: data.option_a_count || 0, 
          b: data.option_b_count || 0 
        })
        setTotalVoters((data.option_a_count || 0) + (data.option_b_count || 0))
      }

      // 사용자의 이전 투표 확인
      const userVotes = loadUserVotes()
      setVoted(userVotes[currentQ.id] || null)

    } catch (error) {
      console.error('Error in loadData:', error)
    } finally {
      setLoading(false)
    }
  }, [currentQ.id, loadUserVotes])

  // 초기 로드
  useEffect(() => {
    setLoading(true)
    loadData()
  }, [currentIdx, loadData])

  // 주기적 업데이트 (2초마다) - 실시간 효과
  useEffect(() => {
    const interval = setInterval(() => {
      loadData()
    }, 2000) // 2초마다 새로고침

    return () => clearInterval(interval)
  }, [loadData])

  // 투표 처리
  const handleVote = async (choice) => {
    if (voted || isVoting) return

    setIsVoting(true)
    
    // 낙관적 업데이트 (즉시 UI 반영)
    setVoted(choice)
    const newCounts = {
      ...counts,
      [choice]: counts[choice] + 1
    }
    setCounts(newCounts)
    setTotalVoters(totalVoters + 1)

    try {
      // RPC 호출로 원자적 업데이트
      const { error } = await supabase.rpc('increment_vote', {
        question_id: currentQ.id,
        vote_option: choice
      })

      if (error) throw error

      // 로컬 저장
      saveUserVote(currentQ.id, choice)

      // 즉시 데이터 다시 로드
      setTimeout(loadData, 500)

    } catch (error) {
      console.error('투표 오류:', error)
      
      // 실패시 롤백
      setVoted(null)
      setCounts(counts)
      setTotalVoters(totalVoters)
      
      alert('투표 중 오류가 발생했습니다. 다시 시도해주세요.')
    } finally {
      setIsVoting(false)
    }
  }

  const total = counts.a + counts.b
  const getPercent = (val) => total === 0 ? 50 : Math.round((val / total) * 100)

  const handleNext = () => {
    if (currentIdx < questions.length - 1) {
      setCurrentIdx(prev => prev + 1)
    }
  }

  const handleReset = () => {
    localStorage.removeItem('balance_votes')
    setCurrentIdx(0)
    setVoted(null)
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-950">
        <div className="text-white text-xl">로딩중...</div>
      </div>
    )
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-gray-950 via-gray-900 to-gray-950 text-white p-4 md:p-6">
      {/* 헤더 */}
      <div className="mb-6 md:mb-8 text-center">
        <h1 className="text-3xl md:text-5xl font-black mb-3 bg-gradient-to-r from-red-400 via-purple-400 to-blue-400 bg-clip-text text-transparent">
          밸런스 게임
        </h1>
        <div className="text-sm font-mono text-gray-500 mb-2">
          QUESTION {currentIdx + 1} / {questions.length}
        </div>
        <div className="text-xs text-gray-600">
          {totalVoters}명이 참여했습니다
        </div>
      </div>
      
      {/* 게임 영역 */}
      <div className="flex flex-col md:flex-row w-full max-w-6xl gap-4 md:gap-6 mb-8">
        {/* 옵션 A */}
        <button 
          onClick={() => handleVote('a')}
          disabled={voted !== null || isVoting}
          className={`relative flex-1 overflow-hidden rounded-2xl md:rounded-3xl border-2 transition-all duration-500 h-[200px] sm:h-[280px] md:h-[400px] ${
            voted === 'a' 
              ? 'border-red-500 shadow-[0_0_30px_rgba(239,68,68,0.3)] scale-[1.02]' 
              : voted === 'b'
              ? 'border-white/5 opacity-60'
              : 'border-white/10 hover:border-white/30 hover:scale-[1.01] active:scale-[0.99]'
          } ${voted || isVoting ? 'cursor-default' : 'cursor-pointer'}`}
        >
          <div className="relative z-10 p-4 sm:p-6 md:p-8 h-full flex flex-col justify-center">
            <div className="text-sm sm:text-base md:text-xl lg:text-2xl font-bold leading-snug break-keep">
              {currentQ.a}
            </div>
          </div>
          
          {/* 배경 바 */}
          <div 
            className="absolute bottom-0 left-0 w-full bg-gradient-to-t from-red-600/30 to-red-600/10 transition-all duration-1000" 
            style={{ height: voted ? `${getPercent(counts.a)}%` : '0%' }} 
          />
          
          {/* 투표 후 퍼센트 표시 */}
          {voted && (
            <div className="absolute top-3 sm:top-4 md:top-6 right-3 sm:right-4 md:right-8 text-2xl sm:text-3xl md:text-5xl font-black text-red-400">
              {getPercent(counts.a)}%
            </div>
          )}
          
          {/* 투표 수 */}
          {voted && (
            <div className="absolute bottom-3 sm:bottom-4 right-3 sm:right-4 text-xs sm:text-sm text-gray-400">
              {counts.a.toLocaleString()}표
            </div>
          )}
        </button>

        {/* VS */}
        <div className="flex items-center justify-center text-xl sm:text-2xl md:text-4xl font-black text-gray-700 italic my-2 md:my-0">
          VS
        </div>

        {/* 옵션 B */}
        <button 
          onClick={() => handleVote('b')}
          disabled={voted !== null || isVoting}
          className={`relative flex-1 overflow-hidden rounded-2xl md:rounded-3xl border-2 transition-all duration-500 h-[200px] sm:h-[280px] md:h-[400px] ${
            voted === 'b' 
              ? 'border-blue-500 shadow-[0_0_30px_rgba(59,130,246,0.3)] scale-[1.02]' 
              : voted === 'a'
              ? 'border-white/5 opacity-60'
              : 'border-white/10 hover:border-white/30 hover:scale-[1.01] active:scale-[0.99]'
          } ${voted || isVoting ? 'cursor-default' : 'cursor-pointer'}`}
        >
          <div className="relative z-10 p-4 sm:p-6 md:p-8 h-full flex flex-col justify-center">
            <div className="text-sm sm:text-base md:text-xl lg:text-2xl font-bold leading-snug break-keep">
              {currentQ.b}
            </div>
          </div>
          
          {/* 배경 바 */}
          <div 
            className="absolute bottom-0 left-0 w-full bg-gradient-to-t from-blue-600/30 to-blue-600/10 transition-all duration-1000" 
            style={{ height: voted ? `${getPercent(counts.b)}%` : '0%' }} 
          />
          
          {/* 투표 후 퍼센트 표시 */}
          {voted && (
            <div className="absolute top-3 sm:top-4 md:top-6 right-3 sm:right-4 md:right-8 text-2xl sm:text-3xl md:text-5xl font-black text-blue-400">
              {getPercent(counts.b)}%
            </div>
          )}
          
          {/* 투표 수 */}
          {voted && (
            <div className="absolute bottom-3 sm:bottom-4 right-3 sm:right-4 text-xs sm:text-sm text-gray-400">
              {counts.b.toLocaleString()}표
            </div>
          )}
        </button>
      </div>

      {/* 다음 버튼 */}
      {voted && currentIdx < questions.length - 1 && (
        <button 
          onClick={handleNext}
          className="px-6 md:px-8 py-3 bg-white text-black rounded-full font-bold hover:bg-gray-200 transition-all hover:scale-105 shadow-lg text-sm md:text-base"
        >
          다음 질문으로 →
        </button>
      )}

      {/* 완료 메시지 */}
      {voted && currentIdx === questions.length - 1 && (
        <div className="text-center">
          <div className="text-xl md:text-2xl font-bold mb-4">
            🎉 모든 질문이 완료되었습니다!
          </div>
          <button 
            onClick={handleReset}
            className="px-6 md:px-8 py-3 bg-gradient-to-r from-red-500 to-blue-500 text-white rounded-full font-bold hover:opacity-90 transition-all hover:scale-105 shadow-lg text-sm md:text-base"
          >
            처음부터 다시하기
          </button>
        </div>
      )}

      {/* 하단 안내 */}
      <div className="mt-8 text-center text-xs md:text-sm text-gray-500">
        2초마다 자동으로 업데이트됩니다
      </div>
    </div>
  )
}
