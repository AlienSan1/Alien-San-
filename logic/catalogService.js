/**
 * Alien San - Catalog Service
 * Manages products and services per business.
 */

import { supabase } from './supabaseClient.js';

export class CatalogService {
    constructor() {
        // Persistent storage handled by Supabase
    }

    async getItems(businessId) {
        const { data, error } = await supabase
            .from('products')
            .select('*')
            .eq('business_id', businessId);
        
        if (error) {
            console.error(`Error obteniendo catálogo para ${businessId}:`, error);
            return [];
        }
        return data;
    }

    async addItem(businessId, item) {
        const { data, error } = await supabase
            .from('products')
            .insert({
                business_id: businessId,
                name: item.name,
                price: item.price,
                points: item.points,
                category: item.category || 'General'
            })
            .select()
            .single();

        if (error) {
            console.error('Error añadiendo item:', error);
            throw error;
        }
        return data;
    }

    async removeItem(businessId, itemId) {
        const { error } = await supabase
            .from('products')
            .delete()
            .eq('id', itemId)
            .eq('business_id', businessId);

        if (error) {
            console.error('Error eliminando item:', error);
            throw error;
        }
    }
}

export const catalogService = new CatalogService();
