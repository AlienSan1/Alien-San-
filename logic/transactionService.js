/**
 * Alien San - Transaction Service
 * Handles recordings and retrieval of sales and historical data.
 */

import { supabase } from './supabaseClient.js';

export class TransactionService {
    async recordTransaction(data) {
        const { error } = await supabase
            .from('transactions')
            .insert({
                user_id: data.userId,
                business_id: data.businessId,
                amount: data.amount,
                points_earned: data.pointsEarned,
                items: data.items, // JSON array of items
                total_quantity: data.totalQuantity
            });

        if (error) {
            console.error('Error recording transaction:', error);
            throw error;
        }
    }

    async getUserHistory(userId) {
        const { data, error } = await supabase
            .from('transactions')
            .select('*')
            .eq('user_id', userId)
            .order('created_at', { ascending: false });

        if (error) {
            console.error('Error fetching user history:', error);
            return [];
        }
        return data;
    }

    async getBusinessHistory(businessId) {
        const { data, error } = await supabase
            .from('transactions')
            .select(`
                *,
                users (name)
            `)
            .eq('business_id', businessId)
            .order('created_at', { ascending: false });

        if (error) {
            console.error('Error fetching business history:', error);
            return [];
        }
        return data;
    }

    async recordRedemption(data) {
        const { error } = await supabase
            .from('redemptions')
            .insert({
                user_id: data.userId,
                business_id: data.businessId,
                reward_type: data.rewardType,
                points_spent: data.pointsSpent
            });

        if (error) {
            console.error('Error recording redemption:', error);
            throw error;
        }
    }
}

export const transactionService = new TransactionService();
