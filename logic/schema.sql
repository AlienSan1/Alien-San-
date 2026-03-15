-- Alien San: Database Schema for Loyalty SaaS

-- 1. Table for Businesses (SaaS clients)
CREATE TABLE IF NOT EXISTS businesses (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    type TEXT CHECK (type IN ('PRODUCT', 'SERVICE')),
    currency TEXT DEFAULT 'COP',
    price_per_unit NUMERIC DEFAULT 0,
    theme_primary TEXT,
    theme_bg TEXT,
    rules JSONB DEFAULT '{
        "personal": {"threshold": 10, "rewardType": "REWARD"},
        "referral": {"threshold": 25, "rewardType": "REF_REWARD"}
    }'::jsonb,
    plan_type TEXT DEFAULT 'FREE' CHECK (plan_type IN ('FREE', 'PRO', 'ULTRA')),
    subscription_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2. Table for Users (Aliens - Customers)
CREATE TABLE IF NOT EXISTS users (
    id TEXT PRIMARY KEY, -- ALN-XXXXXX
    name TEXT NOT NULL,
    email TEXT UNIQUE,
    phone TEXT,
    referrer_id TEXT REFERENCES users(id),
    personal_progress INTEGER DEFAULT 0,
    total_accumulated INTEGER DEFAULT 0,
    rewards_available INTEGER DEFAULT 0,
    merit_score NUMERIC DEFAULT 0,
    joined_at TIMESTAMPTZ DEFAULT NOW(),
    business_id TEXT REFERENCES businesses(id),
    role TEXT DEFAULT 'PILOT' CHECK (role IN ('MASTER', 'PILOT'))
);

-- 3. Table for Products/Services
CREATE TABLE IF NOT EXISTS products (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    business_id TEXT REFERENCES businesses(id),
    name TEXT NOT NULL,
    price NUMERIC NOT NULL,
    points INTEGER DEFAULT 1,
    category TEXT DEFAULT 'General',
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 4. Table for Transactions (Purchases)
CREATE TABLE IF NOT EXISTS transactions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id TEXT REFERENCES users(id),
    business_id TEXT REFERENCES businesses(id),
    amount NUMERIC NOT NULL,
    points_earned INTEGER NOT NULL,
    items JSONB NOT NULL, -- Detailed items list with prices [{name, price, qty}]
    total_quantity INTEGER DEFAULT 1,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 5. Table for Redemptions (Rewards Claimed)
CREATE TABLE IF NOT EXISTS redemptions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id TEXT REFERENCES users(id),
    business_id TEXT REFERENCES businesses(id),
    reward_type TEXT NOT NULL,
    points_spent INTEGER DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 6. Initial Demo Data
INSERT INTO businesses (id, name, type, currency, theme_primary, theme_bg)
VALUES 
('REST_001', 'Alien Burgers', 'PRODUCT', 'COP', '#00f2ff', '#0a0a0a'),
('SPA_002', 'Zen Alien Spa', 'SERVICE', 'USD', '#bc13fe', '#050505')
ON CONFLICT (id) DO NOTHING;

-- 7. RLS Configuration (Security)
-- For a demo/MVP, we enable public access. In production, use proper authentication.

ALTER TABLE businesses ENABLE ROW LEVEL SECURITY;
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE products ENABLE ROW LEVEL SECURITY;
ALTER TABLE transactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE redemptions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow public read-write for businesses" ON businesses FOR ALL USING (true);
CREATE POLICY "Allow public read-write for users" ON users FOR ALL USING (true);
CREATE POLICY "Allow public read-write for products" ON products FOR ALL USING (true);
CREATE POLICY "Allow public read-write for transactions" ON transactions FOR ALL USING (true);
CREATE POLICY "Allow public read-write for redemptions" ON redemptions FOR ALL USING (true);
