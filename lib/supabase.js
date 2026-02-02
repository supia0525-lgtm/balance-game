import { createClient } from '@supabase/supabase-js'

// ⚠️ 아래 두 줄을 본인의 Supabase 정보로 변경하세요!
// Supabase 대시보드 → Settings → API에서 확인
const supabaseUrl = 'YOUR_SUPABASE_URL'  // 예: 'https://abcdefg.supabase.co'
const supabaseAnonKey = 'YOUR_SUPABASE_ANON_KEY'  // 예: 'eyJhbGci...'

// 위 두 값을 제대로 입력했는지 확인
if (supabaseUrl === 'https://mtgqqqztgswtdirodffg.supabase.co' || supabaseAnonKey === 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im10Z3FxcXp0Z3N3dGRpcm9kZmZnIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzAwMjUwMTAsImV4cCI6MjA4NTYwMTAxMH0.UmK5trG6s1569svSpvFOSX2vhtdlIiFtJ90Fc1hkdQ4') {
  console.error('⚠️ Supabase 정보를 입력해주세요! lib/supabase.js 파일을 확인하세요.')
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    persistSession: false,
  },
  realtime: {
    params: {
      eventsPerSecond: 10,
    },
  },
  db: {
    schema: 'public',
  },
})
