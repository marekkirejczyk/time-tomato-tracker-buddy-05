// This file is automatically generated. Do not edit it directly.
import { createClient } from '@supabase/supabase-js';
import type { Database } from './types';

const SUPABASE_URL = "https://mwussnkobbolbkyegbae.supabase.co";
const SUPABASE_PUBLISHABLE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im13dXNzbmtvYmJvbGJreWVnYmFlIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTEwOTc3NTUsImV4cCI6MjA2NjY3Mzc1NX0.hBMV_1SlUbrsqrENbFWRN5Eah5lbzSK2LBanThlt-gI";

// Import the supabase client like this:
// import { supabase } from "@/integrations/supabase/client";

export const supabase = createClient<Database>(SUPABASE_URL, SUPABASE_PUBLISHABLE_KEY);