import { createClient } from '@supabase/supabase-js'

// Check if environment variables exist
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

// Add validation and error logging
if (!supabaseUrl || !supabaseAnonKey) {
  console.error('Missing Supabase environment variables!')
  console.error('VITE_SUPABASE_URL:', supabaseUrl ? 'Set' : 'Missing')
  console.error('VITE_SUPABASE_ANON_KEY:', supabaseAnonKey ? 'Set' : 'Missing')
  
  // For development, you can use dummy values to prevent crashes
  // But you'll need real values for actual functionality
  throw new Error('Supabase environment variables are required. Please check your .env file.')
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey)