const { PermissionsBitField } = require('discord.js');

// Permissions nécessaires pour le bot
const BOT_PERMISSIONS = [
    PermissionsBitField.Flags.SendMessages,
    PermissionsBitField.Flags.UseSlashCommands,
    PermissionsBitField.Flags.EmbedLinks,
    PermissionsBitField.Flags.ReadMessageHistory,
    PermissionsBitField.Flags.ManageChannels,
    PermissionsBitField.Flags.ManageMessages,
    PermissionsBitField.Flags.ViewChannel,
    PermissionsBitField.Flags.MentionEveryone
];

// Permissions pour les propriétaires de slots
const SLOT_OWNER_PERMISSIONS = [
    PermissionsBitField.Flags.ViewChannel,
    PermissionsBitField.Flags.SendMessages,
    PermissionsBitField.Flags.MentionEveryone,
    PermissionsBitField.Flags.ReadMessageHistory
];

// Permissions refusées pour @everyone dans les slots
const EVERYONE_DENIED_PERMISSIONS = [
    PermissionsBitField.Flags.ViewChannel,
    PermissionsBitField.Flags.SendMessages
];

module.exports = {
    BOT_PERMISSIONS,
    SLOT_OWNER_PERMISSIONS,
    EVERYONE_DENIED_PERMISSIONS
}; 