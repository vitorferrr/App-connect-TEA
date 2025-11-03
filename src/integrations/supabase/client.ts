import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://vhlkzsrizpcnxpxsyhnz.supabase.co';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InZobGt6c3JienBjbnhweHN5aG56Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjIxNzk4NDEsImV4cCI6MjA3Nzc1NTg0MX0.aylPv0PYZP53broUWJpC9tl8AIN2FhZaMIq3ovfWFu8';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);