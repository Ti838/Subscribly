/**
 * services/userService.js
 * All database operations for the users table via Supabase
 */

const supabase = require('../config/supabase');

// Find user by email (includes password for auth)
const findByEmail = async (email) => {
    const { data, error } = await supabase
        .from('users')
        .select('*')
        .eq('email', email.toLowerCase())
        .single();

    if (error && error.code !== 'PGRST116') throw error; // PGRST116 = not found
    return data;
};

// Find user by ID (exclude password by default)
const findById = async (id, includePassword = false) => {
    const selectFields = includePassword ? '*' : 'id, name, email, role, api_key, is_active, created_at';

    const { data, error } = await supabase
        .from('users')
        .select(selectFields)
        .eq('id', id)
        .single();

    if (error && error.code !== 'PGRST116') throw error;
    return data;
};

// Find user by API key
const findByApiKey = async (apiKey) => {
    const { data, error } = await supabase
        .from('users')
        .select('id, name, email, role, api_key, is_active')
        .eq('api_key', apiKey)
        .eq('is_active', true)
        .single();

    if (error && error.code !== 'PGRST116') throw error;
    return data;
};

// Create a new user
const create = async ({ name, email, password, role = 'user' }) => {
    const { data, error } = await supabase
        .from('users')
        .insert({ name, email: email.toLowerCase(), password, role })
        .select('id, name, email, role, api_key, created_at')
        .single();

    if (error) throw error;
    return data;
};

// Update user fields
const update = async (id, fields) => {
    const { data, error } = await supabase
        .from('users')
        .update(fields)
        .eq('id', id)
        .select('id, name, email, role, api_key')
        .single();

    if (error) throw error;
    return data;
};

// Get all users with pagination
const findAll = async (page = 1, limit = 10) => {
    const from = (page - 1) * limit;
    const to = from + limit - 1;

    const { data, count, error } = await supabase
        .from('users')
        .select('id, name, email, role, api_key, is_active, created_at', { count: 'exact' })
        .eq('role', 'user')
        .order('created_at', { ascending: false })
        .range(from, to);

    if (error) throw error;
    return { users: data, total: count };
};

// Count total users
const countUsers = async () => {
    const { count, error } = await supabase
        .from('users')
        .select('*', { count: 'exact', head: true })
        .eq('role', 'user');

    if (error) throw error;
    return count;
};

module.exports = { findByEmail, findById, findByApiKey, create, update, findAll, countUsers };
