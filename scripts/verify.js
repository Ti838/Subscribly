require('dotenv').config();
const { createClient } = require('@supabase/supabase-js');
console.log('✅ @supabase/supabase-js loaded OK');
console.log('SUPABASE_URL set:', process.env.SUPABASE_URL !== 'https://your-project-id.supabase.co');
console.log('All good! Update .env with your real Supabase keys to run server.');
