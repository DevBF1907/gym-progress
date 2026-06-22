import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://cpsionkdgenezxehneui.supabase.co';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImNwc2lvbmtkZ2VuZXp4ZWhuZXVpIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODIwNzMzMzcsImV4cCI6MjA5NzY0OTMzN30.oXoFU3G5wUuV30Qvr6W4NuiULY7cxWcHb27z9ME0Dqw';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
