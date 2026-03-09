/**
 * Alien San - Catalog Service
 * Manages products and services per business.
 */

class CatalogService {
    constructor() {
        this.catalogs = new Map();
        this.initDemo();
    }

    initDemo() {
        // Catálogo para Alien Burgers
        this.setupCatalog('REST_001', [
            { id: 'PROD_1', name: 'Alien Classic Burger', price: 18000, category: 'Food' },
            { id: 'PROD_2', name: 'Supernova Fries', price: 7000, category: 'Sides' },
            { id: 'PROD_3', name: 'Plasma Soda', price: 5000, category: 'Drinks' }
        ]);

        // Catálogo para Zen Alien Spa
        this.setupCatalog('SPA_002', [
            { id: 'SERV_1', name: 'Deep Space Massage', price: 60, category: 'Massage' },
            { id: 'SERV_2', name: 'Stardust Facial', price: 45, category: 'Facial' },
            { id: 'SERV_3', name: 'Zen Manicure', price: 25, category: 'Nails' }
        ]);
    }

    setupCatalog(businessId, items) {
        this.catalogs.set(businessId, items);
    }

    getItems(businessId) {
        return this.catalogs.get(businessId) || [];
    }
}

module.exports = new CatalogService();
