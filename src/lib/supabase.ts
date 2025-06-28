
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = "https://mwussnkobbolbkyegbae.supabase.co";
const supabaseAnonKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im13dXNzbmtvYmJvbGJreWVnYmFlIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTEwOTc3NTUsImV4cCI6MjA2NjY3Mzc1NX0.hBMV_1SlUbrsqrENbFWRN5Eah5lbzSK2LBanThlt-gI";

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
