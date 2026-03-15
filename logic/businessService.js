/**
 * Alien San - Business Service
 * Manages multiple business profiles for the SaaS platform.
 */

import { supabase } from './supabaseClient.js';

export class BusinessService {
    constructor() {
        // No longer using internal Map for persistence
    }

    async getBusiness(id) {
        const { data, error } = await supabase
            .from('businesses')
            .select('*')
            .eq('id', id)
            .single();
        
        if (error) {
            console.error(`Error obteniendo negocio ${id}:`, error);
            return null;
        }
        return data;
    }

    async getAllBusinesses() {
        const { data, error } = await supabase
            .from('businesses')
            .select('*');
        
        if (error) {
            console.error('Error obteniendo negocios:', error);
            return [];
        }
        return data;
    }

    async registerBusiness(config) {
        const { data, error } = await supabase
            .from('businesses')
            .upsert({
                id: config.id,
                name: config.name,
                type: config.type,
                currency: config.currency,
                price_per_unit: config.pricePerUnit,
                theme_primary: config.theme?.primary || config.primary,
                theme_bg: config.theme?.bg || config.bg,
                rules: config.rules,
                plan_type: config.plan_type || 'FREE',
                subscription_active: config.subscription_active !== undefined ? config.subscription_active : true
            });

        if (error) {
            console.error(`Error registrando negocio ${config.name}:`, error);
            throw error;
        }
        return data;
    }
}

export const businessService = new BusinessService();
