/**
 * config/supabase.js
 * Supabase client initialization (replaces MongoDB/Mongoose)
 * 
 * Uses the SERVICE ROLE key for full DB access (server-side only)
 * Never expose this key on the frontend!
 */

const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseServiceKey) {
    console.error('❌ Missing SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY in .env');
    process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseServiceKey, {
    auth: {
        autoRefreshToken: false,
        persistSession: false,
    },
});

console.log('✅ Supabase client initialized');

module.exports = supabase;
