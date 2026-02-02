import { createClient } from '@supabase/supabase-js'

// 여기에 본인의 실제 Supabase 정보를 입력하세요!
const supabaseUrl = 'https://mtgqqqztgswtdirodffg.supabase.co'
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im10Z3FxcXp0Z3N3dGRpcm9kZmZnIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzAwMjUwMTAsImV4cCI6MjA4NTYwMTAxMH0.UmK5trG6s1569svSpvFOSX2vhtdlIiFtJ90Fc1hkdQ4'

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