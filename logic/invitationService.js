import { supabase } from './supabaseClient.js';
import LoyaltyEngine from './compensationEngine.js';

export default class InvitationService {
    constructor() {
        this.engine = new LoyaltyEngine();
    }

    /**
     * Assigns a newcomer to a referrer
     * @param {Object} newUser 
     * @param {string} inviteCode - Optional
     */
    async assignReferrer(newUser, inviteCode = null) {
        if (inviteCode) {
            // Find referrer by ID or Code (assuming inviteCode is the user ID for now)
            const { data: referrer, error } = await supabase
                .from('users')
                .select('id')
                .eq('id', inviteCode)
                .single();
            
            if (referrer && !error) return referrer.id;
        }

        // NO CODE? Meritocratic Spillover (Derrame)
        console.log("Iniciando Derrame Meritocrático para nuevo Alien...");

        const { data: candidates, error } = await supabase
            .from('users')
            .select('*')
            .order('merit_score', { ascending: false })
            .limit(10);

        if (error || !candidates || candidates.length === 0) {
            console.log("No hay candidatos para derrame. Queda huérfano o asignado al sistema.");
            return null;
        }

        // Sort by Merit Score (server side already did some, but we calculate locally if needed)
        const scoredCandidates = candidates.map(user => ({
            id: user.id,
            score: this.engine.calculateMeritScore(user)
        })).sort((a, b) => b.score - a.score);

        // Weighted random selection
        const winner = scoredCandidates[Math.floor(Math.random() * scoredCandidates.length)];

        console.log(`Usuario asignado a: ${winner.id} por mérito.`);
        return winner.id;
    }
}
