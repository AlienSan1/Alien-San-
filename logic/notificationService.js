/**
 * Alien San - Simulated Notification Service
 * This service simulates the behavior of a real WhatsApp/Email API.
 */

export const notificationService = {
    logs: [],

    /**
     * Simulates sending a message.
     * @param {string} type - 'WELCOME', 'REWARD', 'NETWORK'
     * @param {Object} recipient - { name, phone, email }
     * @param {Object} context - { businessName, amount, points, etc }
     */
    async send(type, recipient, context) {
        const timestamp = new Date().toISOString();
        let message = '';

        switch (type) {
            case 'WELCOME':
                message = `¡Hola ${recipient.name}! 🛸 Bienvenido a ${context.businessName}. Como nuevo Alien, ya puedes sumar puntos para ganar premios increíbles. ¡Tu viaje galáctico comienza hoy!`;
                break;
            case 'REWARD':
                message = `¡Felicidades ${recipient.name}! 🏆 Has alcanzado tu meta en ${context.businessName}. Tienes un PREMIO disponible para reclamar. ¡Pasa pronto por él!`;
                break;
            case 'NETWORK':
                message = `¡Tu Red Alien ha crecido, ${recipient.name}! 🚀 Has ganado puntos extra porque tu referido sumó consumos. ¡Sigue expandiendo tu galaxia!`;
                break;
            default:
                message = `Hola ${recipient.name}, tienes noticias importantes en ${context.businessName}.`;
        }

        const logEntry = {
            id: 'NOT-' + Math.random().toString(36).substr(2, 5).toUpperCase(),
            timestamp,
            type,
            recipientName: recipient.name,
            recipientContact: recipient.phone || recipient.email,
            message
        };

        this.logs.unshift(logEntry);
        
        // Simular efecto visual en consola y posible alerta de UI
        console.log(`%c [NOTIFICACIÓN SIMULADA - ${type}] %c Para: ${recipient.name}`, 'background: #00f2ff; color: black; font-weight: bold;', 'color: #00f2ff;');
        console.log(`Mensaje: ${message}`);
        
        return logEntry;
    },

    getLogs() {
        return this.logs;
    }
};
