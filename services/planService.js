/**
 * services/planService.js
 * Database operations for the plans table
 */

const supabase = require('../config/supabase');

const findAll = async (activeOnly = true) => {
    let query = supabase.from('plans').select('*').order('price', { ascending: true });
    if (activeOnly) query = query.eq('is_active', true);

    const { data, error } = await query;
    if (error) throw error;
    return data;
};

const findById = async (id) => {
    const { data, error } = await supabase
        .from('plans')
        .select('*')
        .eq('id', id)
        .single();

    if (error && error.code !== 'PGRST116') throw error;
    return data;
};

const create = async ({ name, price, duration, dailyLimit, features = [] }) => {
    const { data, error } = await supabase
        .from('plans')
        .insert({ name, price, duration, daily_limit: dailyLimit, features })
        .select()
        .single();

    if (error) throw error;
    return data;
};

const update = async (id, fields) => {
    // Map camelCase fields to snake_case for Supabase
    const mapped = {};
    if (fields.name !== undefined) mapped.name = fields.name;
    if (fields.price !== undefined) mapped.price = fields.price;
    if (fields.duration !== undefined) mapped.duration = fields.duration;
    if (fields.dailyLimit !== undefined) mapped.daily_limit = fields.dailyLimit;
    if (fields.features !== undefined) mapped.features = fields.features;
    if (fields.isActive !== undefined) mapped.is_active = fields.isActive;

    const { data, error } = await supabase
        .from('plans')
        .update(mapped)
        .eq('id', id)
        .select()
        .single();

    if (error) throw error;
    return data;
};

const deactivate = async (id) => {
    const { data, error } = await supabase
        .from('plans')
        .update({ is_active: false })
        .eq('id', id)
        .select()
        .single();

    if (error) throw error;
    return data;
};

module.exports = { findAll, findById, create, update, deactivate };
