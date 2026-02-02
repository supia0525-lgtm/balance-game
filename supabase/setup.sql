-- ============================================
-- 밸런스 게임 데이터베이스 설정
-- 500명 동시 접속 최적화 포함
-- ============================================

-- 1. 테이블 생성
CREATE TABLE IF NOT EXISTS balance_game (
  id TEXT PRIMARY KEY,
  option_a_count INTEGER DEFAULT 0 NOT NULL,
  option_b_count INTEGER DEFAULT 0 NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 2. 초기 데이터 삽입
INSERT INTO balance_game (id, option_a_count, option_b_count) VALUES
  ('q1', 0, 0),
  ('q2', 0, 0),
  ('q3', 0, 0),
  ('q4', 0, 0),
  ('q5', 0, 0)
ON CONFLICT (id) DO NOTHING;

-- 3. 인덱스 생성 (성능 최적화)
CREATE INDEX IF NOT EXISTS idx_balance_game_id ON balance_game(id);
CREATE INDEX IF NOT EXISTS idx_balance_game_updated_at ON balance_game(updated_at);

-- 4. 원자적 증가 함수 (동시성 제어)
CREATE OR REPLACE FUNCTION increment_vote(
  question_id TEXT,
  vote_option TEXT
)
RETURNS void
LANGUAGE plpgsql
AS $$
BEGIN
  IF vote_option = 'a' THEN
    UPDATE balance_game 
    SET 
      option_a_count = option_a_count + 1,
      updated_at = NOW()
    WHERE id = question_id;
  ELSIF vote_option = 'b' THEN
    UPDATE balance_game 
    SET 
      option_b_count = option_b_count + 1,
      updated_at = NOW()
    WHERE id = question_id;
  ELSE
    RAISE EXCEPTION 'Invalid vote option: %', vote_option;
  END IF;
END;
$$;

-- 5. Row Level Security (RLS) 설정
ALTER TABLE balance_game ENABLE ROW LEVEL SECURITY;

-- 모든 사용자 읽기 허용
CREATE POLICY "Anyone can read balance_game"
  ON balance_game
  FOR SELECT
  TO anon, authenticated
  USING (true);

-- 6. 실시간 업데이트 활성화
ALTER PUBLICATION supabase_realtime ADD TABLE balance_game;

-- 7. 통계 조회 함수 (선택사항)
CREATE OR REPLACE FUNCTION get_total_votes()
RETURNS TABLE(
  question_id TEXT,
  total_votes BIGINT,
  option_a_percent NUMERIC,
  option_b_percent NUMERIC
)
LANGUAGE plpgsql
AS $$
BEGIN
  RETURN QUERY
  SELECT 
    id,
    (option_a_count + option_b_count)::BIGINT as total_votes,
    CASE 
      WHEN (option_a_count + option_b_count) > 0 
      THEN ROUND((option_a_count::NUMERIC / (option_a_count + option_b_count)::NUMERIC) * 100, 2)
      ELSE 0
    END as option_a_percent,
    CASE 
      WHEN (option_a_count + option_b_count) > 0 
      THEN ROUND((option_b_count::NUMERIC / (option_a_count + option_b_count)::NUMERIC) * 100, 2)
      ELSE 0
    END as option_b_percent
  FROM balance_game
  ORDER BY id;
END;
$$;

-- 8. 데이터 리셋 함수 (관리자용)
CREATE OR REPLACE FUNCTION reset_all_votes()
RETURNS void
LANGUAGE plpgsql
AS $$
BEGIN
  UPDATE balance_game
  SET 
    option_a_count = 0,
    option_b_count = 0,
    updated_at = NOW();
END;
$$;

-- ============================================
-- 성능 최적화 설정
-- ============================================

-- 트랜잭션 격리 수준 설정 (동시성 향상)
-- Supabase 대시보드 > Database > Settings에서 설정:
-- default_transaction_isolation = 'read committed'

-- 연결 풀 설정 (Supabase에서 자동 관리되지만 참고용)
-- max_connections = 100
-- shared_buffers = 256MB

-- ============================================
-- 사용 방법
-- ============================================

-- 통계 조회:
-- SELECT * FROM get_total_votes();

-- 모든 투표 리셋 (주의!):
-- SELECT reset_all_votes();

-- 특정 질문 투표 증가:
-- SELECT increment_vote('q1', 'a');
