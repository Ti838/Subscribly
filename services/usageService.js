/**
 * services/usageService.js
 * Daily API usage tracking using the usage_logs table
 * One row per user per day — upserted atomically
 */

const supabase = require('../config/supabase');

// Get today's log for a user (creates one if missing)
const getTodayLog = async (userId) => {
    const today = new Date().toISOString().split('T')[0]; // YYYY-MM-DD

    // Try to fetch existing
    const { data: existing, error: fetchError } = await supabase
        .from('usage_logs')
        .select('*')
        .eq('user_id', userId)
        .eq('date', today)
        .single();

    if (existing) return existing;

    // Create new log for today
    const { data, error } = await supabase
        .from('usage_logs')
        .upsert({ user_id: userId, date: today, request_count: 0 }, { onConflict: 'user_id,date' })
        .select()
        .single();

    if (error) throw error;
    return data;
};

// Increment today's request count
const incrementUsage = async (userId) => {
    const today = new Date().toISOString().split('T')[0];

    // Upsert + increment atomically using PostgreSQL RPC
    // Supabase supports this via .rpc() or manual approach:
    const { data: existing } = await supabase
        .from('usage_logs')
        .select('request_count')
        .eq('user_id', userId)
        .eq('date', today)
        .single();

    const newCount = (existing?.request_count || 0) + 1;

    const { data, error } = await supabase
        .from('usage_logs')
        .upsert(
            {
                user_id: userId,
                date: today,
                request_count: newCount,
                last_request_at: new Date().toISOString(),
            },
            { onConflict: 'user_id,date' }
        )
        .select()
        .single();

    if (error) throw error;
    return data;
};

// Get last N days of usage for a user
const getHistory = async (userId, days = 30) => {
    const { data, error } = await supabase
        .from('usage_logs')
        .select('date, request_count, last_request_at')
        .eq('user_id', userId)
        .order('date', { ascending: false })
        .limit(days);

    if (error) throw error;
    return data;
};

// Get total API calls count across all users
const getTotalCalls = async () => {
    const { data, error } = await supabase
        .from('usage_logs')
        .select('request_count');

    if (error) throw error;
    return data.reduce((sum, row) => sum + row.request_count, 0);
};

// Get today's total calls across all users
const getTodayTotalCalls = async () => {
    const today = new Date().toISOString().split('T')[0];
    const { data, error } = await supabase
        .from('usage_logs')
        .select('request_count')
        .eq('date', today);

    if (error) throw error;
    return data.reduce((sum, row) => sum + row.request_count, 0);
};

// Get top N API users for today
const getTopUsers = async (limit = 5) => {
    const today = new Date().toISOString().split('T')[0];

    const { data, error } = await supabase
        .from('usage_logs')
        .select(`
      request_count,
      user:users(id, name, email)
    `)
        .eq('date', today)
        .order('request_count', { ascending: false })
        .limit(limit);

    if (error) throw error;
    return data;
};

module.exports = {
    getTodayLog,
    incrementUsage,
    getHistory,
    getTotalCalls,
    getTodayTotalCalls,
    getTopUsers,
};
