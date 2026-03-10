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
        // Catálogo para Alien Burgers (Puntos asignados por valor/prioridad)
        this.setupCatalog('REST_001', [
            { id: 'PROD_1', name: 'Alien Classic Burger', price: 18000, points: 10, category: 'Food' },
            { id: 'PROD_2', name: 'Supernova Fries', price: 7000, points: 5, category: 'Sides' },
            { id: 'PROD_3', name: 'Plasma Soda', price: 5000, points: 2, category: 'Drinks' }
        ]);

        // Catálogo para Zen Alien Spa
        this.setupCatalog('SPA_002', [
            { id: 'SERV_1', name: 'Deep Space Massage', price: 60, points: 50, category: 'Massage' },
            { id: 'SERV_2', name: 'Stardust Facial', price: 45, points: 30, category: 'Facial' },
            { id: 'SERV_3', name: 'Zen Manicure', price: 25, points: 15, category: 'Nails' }
        ]);
    }

    setupCatalog(businessId, items) {
        const stored = localStorage.getItem(`catalog_${businessId}`);
        this.catalogs.set(businessId, stored ? JSON.parse(stored) : items);
    }

    addItem(businessId, item) {
        const catalog = this.getItems(businessId);
        item.id = 'ITEM_' + Math.random().toString(36).substr(2, 5).toUpperCase();
        catalog.push(item);
        this.saveCatalog(businessId, catalog);
        return item;
    }

    removeItem(businessId, itemId) {
        const catalog = this.getItems(businessId).filter(i => i.id !== itemId);
        this.saveCatalog(businessId, catalog);
    }

    saveCatalog(businessId, catalog) {
        this.catalogs.set(businessId, catalog);
        localStorage.setItem(`catalog_${businessId}`, JSON.stringify(catalog));
    }

    getItems(businessId) {
        return this.catalogs.get(businessId) || [];
    }
}

module.exports = new CatalogService();
