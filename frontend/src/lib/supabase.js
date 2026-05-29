import { createClient } from '@supabase/supabase-js'

const supabaseUrl = "https://fcovujplnowyeeeemtyt.supabase.co"
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImZjb3Z1anBsbm93eWVlZWVtdHl0Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzkyMDk0OTIsImV4cCI6MjA5NDc4NTQ5Mn0.2bXLn0XDZJvF9SPkcEcCr4N6WqgMsTwgdD_Gv3IrziY'

export const supabase = createClient(
  supabaseUrl,
  supabaseKey
)