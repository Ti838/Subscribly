/**
 * services/subscriptionService.js
 * Database operations for the subscriptions table
 */

const supabase = require('../config/supabase');

// Get the current active subscription for a user (with plan details)
const getActive = async (userId) => {
    const { data, error } = await supabase
        .from('subscriptions')
        .select(`
      *,
      plan:plans(*)
    `)
        .eq('user_id', userId)
        .eq('status', 'active')
        .gt('expiry_date', new Date().toISOString())
        .order('created_at', { ascending: false })
        .limit(1)
        .single();

    if (error && error.code !== 'PGRST116') throw error;
    return data; // null if no active sub
};

// Create a new subscription
const create = async ({ userId, planId, startDate, expiryDate }) => {
    const { data, error } = await supabase
        .from('subscriptions')
        .insert({
            user_id: userId,
            plan_id: planId,
            start_date: startDate,
            expiry_date: expiryDate,
            status: 'active',
        })
        .select()
        .single();

    if (error) throw error;
    return data;
};

// Cancel all active subscriptions for a user
const cancelAllActive = async (userId) => {
    const { error } = await supabase
        .from('subscriptions')
        .update({ status: 'cancelled' })
        .eq('user_id', userId)
        .eq('status', 'active');

    if (error) throw error;
};

// Cancel a specific subscription
const cancel = async (userId) => {
    const { data, error } = await supabase
        .from('subscriptions')
        .update({ status: 'cancelled' })
        .eq('user_id', userId)
        .eq('status', 'active')
        .select()
        .single();

    if (error) throw error;
    return data;
};

// Mark expired subscriptions
const markExpired = async (subscriptionId) => {
    const { error } = await supabase
        .from('subscriptions')
        .update({ status: 'expired' })
        .eq('id', subscriptionId);

    if (error) throw error;
};

// Get all subscriptions (admin view, paginated)
const findAll = async (page = 1, limit = 10) => {
    const from = (page - 1) * limit;
    const to = from + limit - 1;

    const { data, count, error } = await supabase
        .from('subscriptions')
        .select(`
      *,
      user:users(id, name, email),
      plan:plans(name, price, daily_limit)
    `, { count: 'exact' })
        .order('created_at', { ascending: false })
        .range(from, to);

    if (error) throw error;
    return { subscriptions: data, total: count };
};

// Count active subscriptions
const countActive = async () => {
    const { count, error } = await supabase
        .from('subscriptions')
        .select('*', { count: 'exact', head: true })
        .eq('status', 'active')
        .gt('expiry_date', new Date().toISOString());

    if (error) throw error;
    return count;
};

module.exports = { getActive, create, cancelAllActive, cancel, markExpired, findAll, countActive };
