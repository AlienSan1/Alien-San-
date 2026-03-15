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

class PlanService {
    getPlan(business) {
        const type = business.plan_type || 'FREE';
        return PLAN_CONFIGS[type] || PLAN_CONFIGS['FREE'];
    }

    isFeatureEnabled(business, featureKey) {
        // Se desactiva todo si la suscripción no está activa
        if (business.subscription_active === false) return false;
        
        const plan = this.getPlan(business);
        return !!plan.features[featureKey];
    }

    async checkLimit(business, limitKey, currentCount) {
        const plan = this.getPlan(business);
        const limit = plan.limits[limitKey];
        return currentCount < limit;
    }

    getPlanName(business) {
        return this.getPlan(business).name;
    }
}

export const planService = new PlanService();
