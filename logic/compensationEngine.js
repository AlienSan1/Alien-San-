/**
 * Alien San - Universal SaaS Compensation & Loyalty Engine
 * Mission: Custom brand retention for products or services.
 */

export default class LoyaltyEngine {
    /**
     * @param {Object} businessConfig - Configuration for the specific business
     */
    constructor(businessConfig = {}) {
        this.businessId = businessConfig.id || 'default';
        this.businessName = businessConfig.name || 'Alien Business';

        // Rules Configuration
        this.rules = {
            personal: businessConfig.rules?.personal || { threshold: 10, rewardType: 'PRODUCT_FREE' },
            referral: businessConfig.rules?.referral || { threshold: 25, rewardType: 'PRODUCT_FREE' },
            currency: businessConfig.currency || 'COP',
            pricePerUnit: businessConfig.pricePerUnit || 0
        };
    }

    /**
     * Process a new purchase for a customer
     * @param {Object} customer - The customer making the purchase
     * @param {Object} saleDetails - Details of the sale (items, total, quantity)
     * @returns {Object} - Resulting actions and updated state
     */
    processPurchase(customer, saleDetails) {
        let events = [];
        const quantity = saleDetails.quantity || 1;
        const pointsEarned = saleDetails.pointsEarned || quantity;

        // 1. Update personal tracking
        customer.personal_progress = (customer.personal_progress || 0) + pointsEarned;
        customer.total_accumulated = (customer.total_accumulated || 0) + pointsEarned;

        // Check for personal reward based on points threshold
        const threshold = this.rules.personal.threshold || 10; 
        if (customer.personal_progress >= threshold) {
            const rewardCount = Math.floor(customer.personal_progress / threshold);
            customer.personal_progress %= threshold;
            customer.rewards_available = (customer.rewards_available || 0) + rewardCount;

            events.push({
                type: 'PERSONAL_REWARD',
                businessName: this.businessName,
                message: `¡ALERTA DE PREMIO! Has acumulado suficientes puntos en ${this.businessName}. ¡${rewardCount} premio(s) desbloqueado(s)!`,
                count: rewardCount
            });
        }

        // 2. Network Logic - Contribution to Referrer
        if (customer.referrer_id) {
            events.push({
                type: 'NETWORK_CONTRIBUTION',
                referrer_id: customer.referrer_id,
                contributor_id: customer.id,
                contributor_name: customer.name,
                points: pointsEarned,
                threshold: this.rules.referral.threshold || 25
            });
        }

        return {
            customer: customer,
            events: events
        };
    }

    /**
     * Calculate Merit Score based on loyalty and network activity
     */
    calculateMeritScore(customer) {
        const consumptionWeight = 0.6;
        const referralWeight = 0.4;

        const consumptionScore = (customer.totalAccumulated || 0);
        const networkScore = (customer.referralCount || 0) * 5; // Each referral adds weight

        return (consumptionScore * consumptionWeight) + (networkScore * referralWeight);
    }
}


