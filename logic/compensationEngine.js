/**
 * Alien San - Universal SaaS Compensation & Loyalty Engine
 * Mission: Custom brand retention for products or services.
 */

class LoyaltyEngine {
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
        // Points can be passed directly or calculated from catalog (fallback to 1 per qty)
        const pointsEarned = saleDetails.pointsEarned || quantity;

        // 1. Update personal tracking
        customer.personalProgress = (customer.personalProgress || 0) + pointsEarned;
        customer.totalAccumulatedPoints = (customer.totalAccumulatedPoints || 0) + pointsEarned;
        customer.history = customer.history || [];

        customer.history.push({
            date: new Date().toISOString(),
            businessId: this.businessId,
            items: saleDetails.items || [],
            pointsEarned: pointsEarned,
            amount: saleDetails.amount || 0
        });

        // Check for personal reward based on points threshold
        const threshold = this.rules.personal.threshold || 100; // Default to 100 points
        if (customer.personalProgress >= threshold) {
            const rewardCount = Math.floor(customer.personalProgress / threshold);
            customer.personalProgress %= threshold;
            customer.rewardsAvailable = (customer.rewardsAvailable || 0) + rewardCount;

            events.push({
                type: 'PERSONAL_REWARD',
                businessName: this.businessName,
                message: `¡ALERTA DE PREMIO! Has acumulado suficientes puntos en ${this.businessName}. ¡${rewardCount} premio(s) desbloqueado(s)!`,
                count: rewardCount
            });
        }

        // 2. Update referrer points (Network Logic)
        if (customer.referrerId) {
            events.push({
                type: 'NETWORK_CONTRIBUTION',
                referrerId: customer.referrerId,
                contributorId: customer.id,
                contributorName: customer.name,
                points: pointsEarned,
                threshold: this.rules.referral.threshold || 500
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

module.exports = LoyaltyEngine;

