const SUPABASE_URL =
    "https://obkclsgrgqsnmhiohzln.supabase.co";

const SUPABASE_PUBLISHABLE_KEY =
    "sb_publishable_0nsW_YZ1EAeIxtQxk_7zYQ_mjZb9JyX";


const supabaseClient =
    window.supabase.createClient(
        SUPABASE_URL,
        SUPABASE_PUBLISHABLE_KEY
    );

    console.log("✅ Supabase initialized");