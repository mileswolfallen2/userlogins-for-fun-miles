import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = 'https://your-supabase-url.supabase.co';
const SUPABASE_API_KEY = 'your-supabase-api-key';

export const supabase = createClient(SUPABASE_URL, SUPABASE_API_KEY);