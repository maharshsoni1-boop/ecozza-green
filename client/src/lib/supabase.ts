import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://siygxjkayfohrpsuzkfv.supabase.co'
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY || 'sb_publishable_aH0wJgekiHf-8jyiQHr-1g_FTsj-dsC'

export const supabase = createClient(supabaseUrl, supabaseAnonKey)
