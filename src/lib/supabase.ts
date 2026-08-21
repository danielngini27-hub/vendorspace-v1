import { createClient } from "@supabase/supabase-js";

const supabaseUrl = "https://asvrhxwyswmcjctbrydj.supabase.co";
const supabaseAnonKey = "sb_publishable_ydh25eVnlCotlO82JpSRpg_4DYC1ivu";

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
