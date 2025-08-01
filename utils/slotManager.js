const { EmbedBuilder } = require('discord.js');

// Stockage des slots (en production, utilisez une base de données)
const slots = new Map();

class SlotManager {
    constructor() {
        this.slots = slots;
    }

    // Créer un nouveau slot
    createSlot(ownerId, channelId, category, duration, pings, pingCount, expiryDate) {
        const slot = {
            ownerId,
            channelId,
            category,
            duration,
            pings,
            pingCount,
            maxPings: pingCount,
            usedPings: 0,
            expiryDate,
            createdAt: new Date(),
            lastPingReset: new Date()
        };

        this.slots.set(channelId, slot);
        return slot;
    }

    // Obtenir un slot par ID de salon
    getSlot(channelId) {
        return this.slots.get(channelId);
    }

    // Vérifier si un utilisateur peut utiliser un ping
    canUsePing(channelId, userId) {
        const slot = this.getSlot(channelId);
        if (!slot) return false;

        // Vérifier si l'utilisateur est le propriétaire
        if (slot.ownerId !== userId) return false;

        // Vérifier si le slot n'a pas expiré
        if (slot.expiryDate && new Date() > slot.expiryDate) return false;

        // Vérifier si les pings ont été réinitialisés (nouveau jour)
        const now = new Date();
        const lastReset = new Date(slot.lastPingReset);
        const isNewDay = now.getDate() !== lastReset.getDate() || 
                        now.getMonth() !== lastReset.getMonth() || 
                        now.getFullYear() !== lastReset.getFullYear();

        if (isNewDay) {
            slot.usedPings = 0;
            slot.lastPingReset = now;
        }

        // Vérifier s'il reste des pings
        return slot.usedPings < slot.maxPings;
    }

    // Utiliser un ping
    usePing(channelId, userId) {
        const slot = this.getSlot(channelId);
        if (!slot || slot.ownerId !== userId) return false;

        if (this.canUsePing(channelId, userId)) {
            slot.usedPings++;
            return true;
        }
        return false;
    }

    // Obtenir le statut des pings
    getPingStatus(channelId) {
        const slot = this.getSlot(channelId);
        if (!slot) return null;

        return {
            used: slot.usedPings,
            max: slot.maxPings,
            remaining: slot.maxPings - slot.usedPings
        };
    }

    // Supprimer un slot
    removeSlot(channelId) {
        return this.slots.delete(channelId);
    }

    // Obtenir tous les slots d'un utilisateur
    getUserSlots(userId) {
        const userSlots = [];
        for (const [channelId, slot] of this.slots) {
            if (slot.ownerId === userId) {
                userSlots.push({ channelId, ...slot });
            }
        }
        return userSlots;
    }

    // Nettoyer les slots expirés
    cleanupExpiredSlots() {
        const now = new Date();
        const expiredSlots = [];

        for (const [channelId, slot] of this.slots) {
            if (slot.expiryDate && now > slot.expiryDate) {
                expiredSlots.push(channelId);
            }
        }

        expiredSlots.forEach(channelId => {
            this.slots.delete(channelId);
        });

        return expiredSlots;
    }
}

module.exports = SlotManager; 