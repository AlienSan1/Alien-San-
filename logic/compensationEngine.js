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

        // 1. Update personal tracking
        customer.personalProgress = (customer.personalProgress || 0) + quantity;
        customer.totalAccumulated = (customer.totalAccumulated || 0) + quantity;
        customer.history = customer.history || [];

        customer.history.push({
            date: new Date().toISOString(),
            businessId: this.businessId,
            items: saleDetails.items || [],
            quantity: quantity,
            amount: saleDetails.amount || (quantity * this.rules.pricePerUnit)
        });

        // Check for personal reward
        if (customer.personalProgress >= this.rules.personal.threshold) {
            const rewardCount = Math.floor(customer.personalProgress / this.rules.personal.threshold);
            customer.personalProgress %= this.rules.personal.threshold;
            customer.rewardsAvailable = (customer.rewardsAvailable || 0) + rewardCount;

            events.push({
                type: 'PERSONAL_REWARD',
                businessName: this.businessName,
                message: `¡Recompensa en ${this.businessName}! Has ganado ${rewardCount} beneficio(s).`,
                count: rewardCount
            });
        }

        // 2. Update referrer points (Network Logic)
        if (customer.referrerId) {
            // Note: In a real system, we'd fetch the referrer object here
            // This event signals the system to update the referrer's network points
            events.push({
                type: 'NETWORK_CONTRIBUTION',
                referrerId: customer.referrerId,
                contributorId: customer.id,
                contributorName: customer.name,
                points: quantity,
                threshold: this.rules.referral.threshold
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

