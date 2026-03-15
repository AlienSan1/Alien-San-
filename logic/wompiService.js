/**
 * Alien San - Wompi Service (Colombia)
 * Replaces Stripe for local payments in Colombia (PSE, Nequi, Cards).
 */

export class WompiService {
    constructor() {
        // Llaves de Sandbox (Prefijo pub_test_)
        this.PUBLIC_KEY = 'pub_test_Q5yS9s9v9w9x9y9z9a9b9c9d9e9f9g9h'; // Placeholder de test
        
        this.PRICES = {
            PRO: 49900,   // $49,900 COP
            ULTRA: 149900 // $149,900 COP
        };
    }

    /**
     * Abre el Widget de Wompi para procesar un pago
     * @param {string} plan - 'PRO' o 'ULTRA'
     * @param {string} email - Email del cliente
     * @param {string} businessId - ID del negocio
     */
    async openCheckout(plan, email, businessId) {
        const amount = this.PRICES[plan];
        const reference = `ALIEN_${businessId}_${Date.now()}`;
        
        console.log(`🇨🇴 Iniciando Wompi para ${plan}: ${amount} COP (Ref: ${reference})`);

        // En un entorno real, cargaríamos el script de Wompi dinámicamente o usaríamos su API
        // Para este prototipo, simularemos la redirección al Widget
        
        const checkoutUrl = `https://checkout.wompi.co/p/?public-key=${this.PUBLIC_KEY}&currency=COP&amount-in-cents=${amount * 100}&reference=${reference}&customer-data:email=${email}`;
        
        alert(`👽 PASARELA COLOMBIANA (Wompi):\n\nVas a pagar $${amount.toLocaleString()} COP por el plan ${plan}.\n\nMétodos disponibles: PSE, Nequi, Bancolombia, Tarjetas.`);
        
        window.open(checkoutUrl, '_blank');
        
        return {
            success: true,
            reference: reference
        };
    }

    /**
     * Verifica el estado de una transacción (Simulado)
     */
    async checkTransactionStatus(reference) {
        console.log(`Verificando referencia Wompi: ${reference}`);
        // En producción: GET https://sandbox.wompi.co/v1/transactions/ID
        return 'APPROVED';
    }
}

export const wompiService = new WompiService();
