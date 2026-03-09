/**
 * Alien San - Business Service
 * Manages multiple business profiles for the SaaS platform.
 */

class BusinessService {
    constructor() {
        this.businesses = new Map();
        this.initDemo();
    }

    initDemo() {
        // Ejemplo de Negocio de Producto (Restaurante)
        this.registerBusiness({
            id: 'REST_001',
            name: 'Alien Burgers',
            type: 'PRODUCT',
            currency: 'COP',
            pricePerUnit: 25000,
            rules: {
                personal: { threshold: 5, rewardType: 'BURGER_FREE' },
                referral: { threshold: 15, rewardType: 'COMBO_FREE' }
            },
            theme: {
                primary: '#00f2ff',
                bg: '#0a0a0a'
            }
        });

        // Ejemplo de Negocio de Servicio (Spa)
        this.registerBusiness({
            id: 'SPA_002',
            name: 'Zen Alien Spa',
            type: 'SERVICE',
            currency: 'USD',
            pricePerUnit: 50,
            rules: {
                personal: { threshold: 3, rewardType: 'REFLEXOLOGY_FREE' },
                referral: { threshold: 10, rewardType: 'MASSAGE_FREE' }
            },
            theme: {
                primary: '#bc13fe',
                bg: '#050505'
            }
        });
    }

    registerBusiness(config) {
        this.businesses.set(config.id, config);
        console.log(`Negocio registrado: ${config.name} (${config.id})`);
    }

    getBusiness(id) {
        return this.businesses.get(id);
    }

    getAllBusinesses() {
        return Array.from(this.businesses.values());
    }
}

module.exports = new BusinessService();
