/**
 * Alien San - Invitation & Spillover Service
 */

const LoyaltyEngine = require('./compensationEngine');

class InvitationService {
    constructor(db) {
        this.db = db; // Placeholder for DB connection
        this.engine = new LoyaltyEngine();
    }

    /**
     * Assigns a newcomer to a referrer
     * @param {Object} newUser 
     * @param {string} inviteCode - Optional
     */
    async assignReferrer(newUser, inviteCode = null) {
        if (inviteCode) {
            const referrer = await this.db.findUserByCode(inviteCode);
            if (referrer) return referrer.id;
        }

        // NO CODE? Meritocratic Spillover (Derrame)
        console.log("Iniciando Derrame Meritocrático para nuevo Alien...");

        const candidates = await this.db.getTopActiveUsers(10); // Top 10 users

        // Sort by Merit Score
        const scoredCandidates = candidates.map(user => ({
            id: user.id,
            score: this.engine.calculateMeritScore(user)
        })).sort((a, b) => b.score - a.score);

        // Weighted random selection (higher merit => higher chance)
        // For now, simple random among top 10 as requested
        const winner = scoredCandidates[Math.floor(Math.random() * scoredCandidates.length)];

        console.log(`Usuario asignado a: ${winner.id} por mérito.`);
        return winner.id;
    }
}

module.exports = InvitationService;
