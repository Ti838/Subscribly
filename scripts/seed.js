/**
 * scripts/seed.js
 * Seeds default plans and admin user into Supabase
 * Run: node scripts/seed.js
 */

require('dotenv').config({ path: require('path').join(__dirname, '../.env') });
const bcrypt = require('bcryptjs');
const supabase = require('../config/supabase');

const seed = async () => {
    console.log('🌱 Seeding Supabase database...\n');

    // ─── Seed Plans ───────────────────────────────────────────────────────
    const plans = [
        {
            name: 'Free',
            price: 0,
            duration: 30,
            daily_limit: 50,
            features: ['50 API calls/day', 'Basic support', 'Core endpoints'],
        },
        {
            name: 'Pro',
            price: 29,
            duration: 30,
            daily_limit: 500,
            features: ['500 API calls/day', 'Priority support', 'Advanced endpoints', 'Analytics'],
        },
        {
            name: 'Premium',
            price: 99,
            duration: 30,
            daily_limit: -1, // Unlimited
            features: ['Unlimited API calls', '24/7 support', 'All endpoints', 'Custom integrations'],
        },
    ];

    for (const plan of plans) {
        const { data: existing } = await supabase.from('plans').select('id').eq('name', plan.name).single();

        if (!existing) {
            const { error } = await supabase.from('plans').insert(plan);
            if (error) console.error(`  ❌ Error creating ${plan.name} plan:`, error.message);
            else console.log(`  ✅ Plan created: ${plan.name} ($${plan.price}/mo, limit: ${plan.daily_limit === -1 ? 'Unlimited' : plan.daily_limit})`);
        } else {
            console.log(`  ⏭️  Plan exists: ${plan.name}`);
        }
    }

    // ─── Seed Admin User ──────────────────────────────────────────────────
    const adminEmail = process.env.ADMIN_EMAIL || 'admin@subscribly.com';
    const adminPassword = process.env.ADMIN_PASSWORD || 'Admin@123456';

    const { data: existing } = await supabase.from('users').select('id').eq('email', adminEmail).single();

    if (!existing) {
        const salt = await bcrypt.genSalt(12);
        const hashedPwd = await bcrypt.hash(adminPassword, salt);

        const { error } = await supabase.from('users').insert({
            name: 'System Admin',
            email: adminEmail,
            password: hashedPwd,
            role: 'admin',
        });

        if (error) console.error('  ❌ Error creating admin:', error.message);
        else console.log(`\n  ✅ Admin user created: ${adminEmail}`);
    } else {
        console.log(`\n  ⏭️  Admin already exists: ${adminEmail}`);
    }

    console.log('\n🎉 Seeding complete!\n');
    process.exit(0);
};

seed().catch((err) => {
    console.error('Seed error:', err);
    process.exit(1);
});
