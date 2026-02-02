import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || ''
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || ''

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    persistSession: false, // 세션 저장 비활성화로 성능 향상
  },
  realtime: {
    params: {
      eventsPerSecond: 10, // 초당 이벤트 제한
    },
  },
  db: {
    schema: 'public',
  },
})
