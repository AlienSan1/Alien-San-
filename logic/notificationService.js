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
        const templates = config.messaging?.templates || {};
        let message = '';

        // Default templates
        const defaultTemplates = {
            WELCOME: `¡Hola {cliente}! 🛸 Bienvenido a {negocio}. Ya puedes sumar puntos para ganar premios. ¡Tu viaje galáctico comienza hoy!`,
            REWARD: `¡Felicidades {cliente}! 🏆 Has alcanzado tu meta en {negocio}. Tienes un PREMIO disponible. ¡Pasa pronto por él!`,
            NETWORK: `¡Tu Red Alien ha crecido, {cliente}! 🚀 Has ganado puntos extra por tu referido en {negocio}.`,
            DEFAULT: `Hola {cliente}, tienes noticias en {negocio}.`
        };

        let rawMessage = templates[type] || defaultTemplates[type] || defaultTemplates.DEFAULT;

        // Placeholder replacement
        message = rawMessage
            .replace(/{cliente}/g, recipient.name)
            .replace(/{negocio}/g, context.businessName)
            .replace(/{puntos}/g, context.points || '')
            .replace(/{premio}/g, context.rewardName || 'premio');

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
