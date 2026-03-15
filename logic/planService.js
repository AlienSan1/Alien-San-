/**
 * Alien San - Plan & Subscription Service
 * Manages feature gating and limits based on business tiers.
 */

export const PLAN_CONFIGS = {
    'FREE': {
        name: 'Alien Base',
        limits: {
            products: 10,
            users: 50
        },
        features: {
            custom_theme: false,
            advanced_analytics: false,
            advanced_messaging: false
        }
    },
    'PRO': {
        name: 'Alien Pro',
        limits: {
            products: 100,
            users: 500
        },
        features: {
            custom_theme: true,
            advanced_analytics: true,
            advanced_messaging: true
        }
    },
    'ULTRA': {
        name: 'Alien Ultra',
        limits: {
            products: Infinity,
            users: Infinity
        },
        features: {
            custom_theme: true,
            advanced_analytics: true,
            advanced_messaging: true,
            multi_branch: true
        }
    }
};

const MASTER_EMAILS = ['santiagovv0831@gmail.com'];

class PlanService {
    getPlan(business, userRole = 'PILOT', userEmail = '') {
        if (userRole === 'MASTER' || MASTER_EMAILS.includes(userEmail)) return PLAN_CONFIGS['ULTRA'];
        
        const type = business.plan_type || 'FREE';
        return PLAN_CONFIGS[type] || PLAN_CONFIGS['FREE'];
    }

    isFeatureEnabled(business, featureKey, userRole = 'PILOT', userEmail = '') {
        // Master accounts bypass subscription_active checks for their managed businesses
        const isMaster = userRole === 'MASTER' || MASTER_EMAILS.includes(userEmail);
        if (!isMaster && business.subscription_active === false) return false;
        
        const plan = this.getPlan(business, userRole, userEmail);
        return !!plan.features[featureKey];
    }

    async checkLimit(business, limitKey, currentCount, userRole = 'PILOT', userEmail = '') {
        const plan = this.getPlan(business, userRole, userEmail);
        const limit = plan.limits[limitKey];
        return currentCount < limit;
    }

    getPlanName(business, userRole = 'PILOT', userEmail = '') {
        return this.getPlan(business, userRole, userEmail).name;
    }
}

export const planService = new PlanService();
