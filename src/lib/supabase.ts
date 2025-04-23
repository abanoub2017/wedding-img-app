// src/lib/supabase.ts
import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://ylpzwyiomszvdkksrrlg.supabase.co'
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InlscHp3eWlvbXN6dmRra3NycmxnIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDQ3NjExNzcsImV4cCI6MjA2MDMzNzE3N30.pfB6yZGXfusRMjFAd5eNbnLhCvKnbxDhQLIKsunbIZA'

export const supabase = createClient(supabaseUrl, supabaseAnonKey)
