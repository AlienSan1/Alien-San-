/**
 * Alien San - Simulated Notification Service
 * This service simulates the behavior of a real WhatsApp/Email API.
 */

export const notificationService = {
    logs: [],

    /**
     * Sends a message (WhatsApp or Email).
     * @param {string} type - 'WELCOME', 'REWARD', 'NETWORK'
     * @param {Object} recipient - { name, phone, email }
     * @param {Object} context - { businessName, amount, points, etc }
     * @param {Object} config - { messaging: { whatsappInstance, whatsappToken, resendKey, mode: 'LIVE'|'SIM' } }
     */
    async send(type, recipient, context, config = {}) {
        const timestamp = new Date().toISOString();
        const mode = config.messaging?.mode || 'SIM';
        let message = '';

        switch (type) {
            case 'WELCOME':
                message = `¡Hola ${recipient.name}! 🛸 Bienvenido a ${context.businessName}. Ya puedes sumar puntos para ganar premios. ¡Tu viaje galáctico comienza hoy!`;
                break;
            case 'REWARD':
                message = `¡Felicidades ${recipient.name}! 🏆 Has alcanzado tu meta en ${context.businessName}. Tienes un PREMIO disponible. ¡Pasa pronto por él!`;
                break;
            case 'NETWORK':
                message = `¡Tu Red Alien ha crecido, ${recipient.name}! 🚀 Has ganado puntos extra por tu referido en ${context.businessName}.`;
                break;
            default:
                message = `Hola ${recipient.name}, tienes noticias en ${context.businessName}.`;
        }

        const logEntry = {
            id: 'NOT-' + Math.random().toString(36).substr(2, 5).toUpperCase(),
            timestamp,
            type,
            recipientName: recipient.name,
            recipientContact: recipient.phone || recipient.email,
            message,
            status: 'PENDING',
            mode
        };

        if (mode === 'LIVE') {
            try {
                // 1. WhatsApp via UltraMsg
                if (recipient.phone && config.messaging?.whatsappInstance && config.messaging?.whatsappToken) {
                    const waUrl = `https://api.ultramsg.com/${config.messaging.whatsappInstance}/messages/chat`;
                    const waRes = await fetch(waUrl, {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
                        body: new URLSearchParams({
                            token: config.messaging.whatsappToken,
                            to: recipient.phone,
                            body: message
                        })
                    });
                    if (waRes.ok) logEntry.status = 'SENT_WHATSAPP';
                }

                // 2. Email via Resend
                if (recipient.email && config.messaging?.resendKey) {
                    const emailRes = await fetch('https://api.resend.com/emails', {
                        method: 'POST',
                        headers: {
                            'Authorization': `Bearer ${config.messaging.resendKey}`,
                            'Content-Type': 'application/json'
                        },
                        body: JSON.stringify({
                            from: 'Alien San <onboarding@resend.dev>',
                            to: [recipient.email],
                            subject: `Notificación de ${context.businessName}`,
                            html: `<strong>${message}</strong>`
                        })
                    });
                    if (emailRes.ok) logEntry.status = logEntry.status === 'SENT_WHATSAPP' ? 'SENT_ALL' : 'SENT_EMAIL';
                }
            } catch (err) {
                console.error("Error sending real notification:", err);
                logEntry.status = 'ERROR';
            }
        } else {
            logEntry.status = 'SIMULATED';
            console.log(`%c [SIMULACIÓN] %c ${message}`, 'background: #00f2ff; color: black;', 'color: #00f2ff;');
        }

        this.logs.unshift(logEntry);
        return logEntry;
    },

    getLogs() {
        return this.logs;
    }
};
